/**
 * e2e/pactuacao-criar.spec.ts — Fase 10: Servidor cria PT via /meu-plano/criar,
 * assina e envia para chefia.
 *
 * Fluxo:
 *   1. Lucas (servidor) abre /meu-plano (estado vazio)
 *   2. Clica em "Criar plano do zero" → /meu-plano/criar (wizard servidor)
 *   3. Preenche os 5 passos
 *   4. Submete → status muda para AGUARDANDO_ASSINATURA_CHEFIA
 *   5. Volta para /meu-plano → vê PT em "com a chefia"
 *
 * REQUISITOS:
 *   - SvelteKit em http://localhost:5173
 *   - FastAPI em http://localhost:8000
 *   - Demo seed contendo Lucas / servidor4@pgd-demo.gov.br SEM PT em execução
 *   - Auth states em e2e/auth/*.json (global-setup.ts gera automaticamente
 *     na primeira execução)
 *
 * RODAR:
 *   1. cd ../infra && (subir backend localmente)
 *   2. cd portal && npm run dev (em outro terminal)
 *   3. npx playwright test e2e/pactuacao-criar.spec.ts
 *
 * Nota: marcado test.describe.skip() porque o e2e depende de backend rodando
 * e seed específico. Remova o .skip para executar — a estrutura está pronta.
 */

import { asServidor, expect } from './fixtures';

// Toggle para destravar os testes quando o backend estiver acessível.
// Mantenha como `true` em CI/dev sem backend; mude para `false` localmente.
const SKIP_NO_BACKEND = true;

const describe = SKIP_NO_BACKEND ? asServidor.describe.skip : asServidor.describe;

describe('Servidor cria, assina e envia PT (Fase 10)', () => {
	asServidor('servidor preenche wizard /meu-plano/criar e envia para chefia', async ({ page }) => {
		// 1. Estado vazio — usuário acessa /meu-plano e vê CTA de criação
		await page.goto('/meu-plano');

		// CTA "Criar plano" leva para /meu-plano/criar
		const criarLink = page.getByRole('link', { name: /criar.*plano|criar do zero/i });
		await expect(criarLink.first()).toBeVisible({ timeout: 10000 });
		await criarLink.first().click();
		await expect(page).toHaveURL(/\/meu-plano\/criar/);

		// 2. Step 0: Período
		const inicio = page.locator('input[type="date"]').nth(0);
		const fim = page.locator('input[type="date"]').nth(1);
		await inicio.fill('2026-07-01');
		await fim.fill('2026-12-31');
		await page.getByRole('button', { name: /próximo/i }).click();

		// 3. Step 1: Carga horária (default ok)
		await page.getByRole('button', { name: /próximo/i }).click();

		// 4. Step 2: Critérios (defaults)
		await page.getByRole('button', { name: /próximo/i }).click();

		// 5. Step 3: Contribuições — adicionar 1 contribuição 100%
		const desc = page.locator('textarea#contrib-desc');
		if (await desc.isVisible()) {
			await desc.fill('Desenvolvimento do módulo X');
			await page.locator('input#contrib-pct').fill('100');
			await page.getByRole('button', { name: /adicionar contribuição/i }).click();
		}
		await page.getByRole('button', { name: /próximo/i, disabled: false }).click();

		// 6. Step 4: Revisão e envio
		await expect(page.getByRole('heading', { name: /revisão|revisar/i })).toBeVisible();

		// Submit
		const submit = page.getByRole('button', { name: /assinar e enviar|enviar para aprovação/i });
		await expect(submit).toBeEnabled();
		await submit.click();

		// 7. Volta para /meu-plano com PT criado
		await expect(page).toHaveURL(/\/meu-plano/, { timeout: 15000 });
		await expect(
			page.getByText(/aguardando.*chefia|com a chefia/i).first()
		).toBeVisible({ timeout: 5000 });
	});
});
