/**
 * e2e/ai-rewrite.spec.ts — Reescrever com IA no registro de execução
 *
 * Mocka /api/ai/rewrite-registro via page.route — não precisa de Bedrock
 * real para rodar no CI. Testes cobrem habilitação do botão, fluxo
 * editing→previewing→applied→undo, 429, 503 e Refinar.
 *
 * Backend (FastAPI) e frontend (SvelteKit) devem estar rodando.
 */

import { asServidor, expect } from './fixtures';

const TEXTO_CURTO = 'Texto curto.'; // < 80 chars
const TEXTO_LONGO =
	'Trabalhei na migração SIAPE para PG16. Conduzi sessões de mentoria com novos servidores. ' +
	'Revisei endpoints da integração Gov.br ID. Apoiei a CGRH no SSO unificado.'; // > 80 chars

const REWRITTEN_SAMPLE =
	'ENTREGA 1 · Migração SIAPE → PG16\n' +
	'  Resultado: 3 tabelas migradas.\n\n' +
	'ENTREGA 2 · Mentoria técnica\n' +
	'  Volume: [quantificar]';

async function gotoStep1(page: import('@playwright/test').Page) {
	await page.goto('/meu-plano/registrar');
	const dates = page.locator('input[type="date"]');
	await dates.nth(0).fill('2026-04-01');
	await dates.nth(1).fill('2026-04-30');
	await page.getByRole('button', { name: /próximo/i }).click();
	await expect(page.getByRole('heading', { name: /2\.\s*descrição da execução/i })).toBeVisible();
}

// ---------------------------------------------------------------------------
// 1. Botão desabilitado quando texto < 80 chars
// ---------------------------------------------------------------------------

asServidor('botão "Reescrever com IA" fica desabilitado com texto < 80 chars', async ({ page }) => {
	await gotoStep1(page);
	await page.locator('textarea#desc').fill(TEXTO_CURTO);
	const btn = page.getByTestId('open-ai-rewrite');
	await expect(btn).toBeVisible();
	await expect(btn).toBeDisabled();
});

// ---------------------------------------------------------------------------
// 2. Botão habilita com 80+ chars; clicar abre painel
// ---------------------------------------------------------------------------

asServidor('texto longo habilita botão; clique abre o painel em modo editing', async ({ page }) => {
	await gotoStep1(page);
	await page.locator('textarea#desc').fill(TEXTO_LONGO);
	const btn = page.getByTestId('open-ai-rewrite');
	await expect(btn).toBeEnabled();
	await btn.click();
	await expect(page.getByRole('region', { name: /Reescrever com IA/i })).toBeVisible();
	await expect(page.getByText(/Template de estrutura/i)).toBeVisible();
});

// ---------------------------------------------------------------------------
// 3. Happy path: editing → previewing → applied → chip undo → desfazer volta
// ---------------------------------------------------------------------------

asServidor('happy path: aplica reescrita, vê chip undo, desfaz volta ao original', async ({ page }) => {
	// Mock dos 2 endpoints (rewrite e applied)
	await page.route('**/api/ai/rewrite-registro', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				event_id: '00000000-0000-0000-0000-0000000000aa',
				rewritten_text: REWRITTEN_SAMPLE,
				latency_ms: 1500,
				tokens_in: 100,
				tokens_out: 200,
			}),
		});
	});
	await page.route('**/api/ai/rewrite-registro/*/applied', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({ ok: true }),
		});
	});

	await gotoStep1(page);
	await page.locator('textarea#desc').fill(TEXTO_LONGO);
	await page.getByTestId('open-ai-rewrite').click();
	await page.getByRole('button', { name: /^Reescrever$/i }).click();

	// Previewing: vê texto reescrito
	await expect(page.getByText(/Proposta da IA/i)).toBeVisible();
	await expect(page.getByText(/ENTREGA 1/)).toBeVisible();

	// Aplicar
	await page.getByRole('button', { name: /Aplicar reescrita/i }).click();

	// Textarea agora tem o texto reescrito; chip undo aparece
	const desc = page.locator('textarea#desc');
	await expect(desc).toHaveValue(/ENTREGA 1/);
	await expect(page.getByText(/Reescrito com IA/i)).toBeVisible();

	// Desfazer
	await page.getByTestId('ai-undo').click();
	await expect(desc).toHaveValue(TEXTO_LONGO);
});

// ---------------------------------------------------------------------------
// 4. Alerta de lacunas aparece quando resposta contém [quantificar]
// ---------------------------------------------------------------------------

asServidor('alerta amarelo aparece quando resposta tem [precisa de detalhe]', async ({ page }) => {
	await page.route('**/api/ai/rewrite-registro', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				event_id: '00000000-0000-0000-0000-0000000000ab',
				rewritten_text:
					'ENTREGA 1\n  Volume: [quantificar]\n  Pendência: [precisa de detalhe]',
				latency_ms: 1200,
				tokens_in: 100,
				tokens_out: 150,
			}),
		});
	});

	await gotoStep1(page);
	await page.locator('textarea#desc').fill(TEXTO_LONGO);
	await page.getByTestId('open-ai-rewrite').click();
	await page.getByRole('button', { name: /^Reescrever$/i }).click();

	await expect(page.getByText(/lacuna/i)).toBeVisible();
});

// ---------------------------------------------------------------------------
// 5. 429 mostra mensagem de rate limit
// ---------------------------------------------------------------------------

asServidor('429 mostra mensagem específica de rate limit', async ({ page }) => {
	await page.route('**/api/ai/rewrite-registro', async (route) => {
		await route.fulfill({
			status: 429,
			headers: { 'retry-after': '300' },
			contentType: 'application/json',
			body: JSON.stringify({ detail: 'limite' }),
		});
	});

	await gotoStep1(page);
	await page.locator('textarea#desc').fill(TEXTO_LONGO);
	await page.getByTestId('open-ai-rewrite').click();
	await page.getByRole('button', { name: /^Reescrever$/i }).click();

	await expect(page.getByText(/reescritas desta hora/i)).toBeVisible();
});

// ---------------------------------------------------------------------------
// 6. 503 mostra mensagem de IA indisponível
// ---------------------------------------------------------------------------

asServidor('503 mostra mensagem de IA indisponível', async ({ page }) => {
	await page.route('**/api/ai/rewrite-registro', async (route) => {
		await route.fulfill({
			status: 503,
			contentType: 'application/json',
			body: JSON.stringify({ detail: 'down' }),
		});
	});

	await gotoStep1(page);
	await page.locator('textarea#desc').fill(TEXTO_LONGO);
	await page.getByTestId('open-ai-rewrite').click();
	await page.getByRole('button', { name: /^Reescrever$/i }).click();

	await expect(
		page.getByText(/temporariamente indispon|IA demorou demais/i),
	).toBeVisible();
});

// ---------------------------------------------------------------------------
// 7. Refinar volta para editing preservando template
// ---------------------------------------------------------------------------

asServidor('clicar Refinar volta ao estado editing', async ({ page }) => {
	await page.route('**/api/ai/rewrite-registro', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				event_id: '00000000-0000-0000-0000-0000000000cc',
				rewritten_text: 'reescrito',
				latency_ms: 1000,
				tokens_in: 100,
				tokens_out: 200,
			}),
		});
	});

	await gotoStep1(page);
	await page.locator('textarea#desc').fill(TEXTO_LONGO);
	await page.getByTestId('open-ai-rewrite').click();
	await page.getByRole('button', { name: /^Reescrever$/i }).click();
	await expect(page.getByText(/Proposta da IA/i)).toBeVisible();

	await page.getByRole('button', { name: /Refinar/i }).click();
	await expect(page.getByText(/Template de estrutura/i)).toBeVisible();
});
