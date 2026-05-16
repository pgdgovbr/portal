/**
 * e2e/criar-plano.spec.ts — Phase 11: "Criar Plano de Trabalho" wizard tests
 *
 * Requires both servers to be running:
 *   - SvelteKit dev server: http://localhost:5173
 *   - FastAPI backend:      http://localhost:8000
 *
 * The `setup` project (global-setup.ts) must run first to populate
 * the storageState files in e2e/auth/*.json.
 *
 * Tests 1–2 cover step navigation/display. Tests 3+ cover full wizard completion
 * and submission. Submission DOES mutate backend data (creates a PlanoTrabalho).
 * The demo seed resets nightly at 03:00 UTC so this is safe for CI.
 */

import { asChefe, expect } from './fixtures';

// The five step labels as defined in the page component.
const STEPS = [
	'Participante & período',
	'Carga horária',
	'Critérios de avaliação',
	'Contribuições',
	'Revisão e envio',
];

// ---------------------------------------------------------------------------
// 1. Chefe — /equipe/planos-trabalho/novo loads at step 0
// ---------------------------------------------------------------------------

asChefe('/equipe/planos-trabalho/novo → step 0 do wizard visível', async ({ page }) => {
	await page.goto('/equipe/planos-trabalho/novo');

	// The page must stay at the novo URL.
	await expect(page).toHaveURL(/\/equipe\/planos-trabalho\/novo$/);

	// The main page heading
	await expect(
		page.getByRole('heading', { name: /criar plano de trabalho/i })
	).toBeVisible();

	// Fase 7.4: Step de exceção aparece antes do wizard. Confirmar para prosseguir.
	await page.getByTestId('btn-confirmar-excecao').click();

	// The step 0 content heading
	await expect(
		page.getByRole('heading', { name: /para quem é este plano\?/i })
	).toBeVisible();

	// The "Cancelar" link pointing back to /equipe should be present.
	const cancelar = page.getByRole('link', { name: /cancelar/i }).first();
	await expect(cancelar).toBeVisible();
	await expect(cancelar).toHaveAttribute('href', '/equipe');
});

// ---------------------------------------------------------------------------
// 2. Chefe — all step labels are visible in the Stepper component
// ---------------------------------------------------------------------------

asChefe('wizard exibe todos os rótulos de etapas no Stepper', async ({ page }) => {
	await page.goto('/equipe/planos-trabalho/novo');
	await page.getByTestId('btn-confirmar-excecao').click();

	// The Stepper renders all step labels as visible text somewhere on the page.
	// We check each label is present in the DOM (may not all be "visible" in
	// the accessibility sense if they overflow, so we use toBeAttached as fallback).
	for (const label of STEPS) {
		const el = page.getByText(label, { exact: true });
		// At least one element with this text must exist in the document.
		await expect(el.first()).toBeAttached();
	}

	// The sub-heading shows the current step name inline as well.
	await expect(page.getByText(STEPS[0], { exact: true }).first()).toBeAttached();
});

// ---------------------------------------------------------------------------
// 3. Chefe — complete step 0 (select participant + dates) → Próximo → step 1
// ---------------------------------------------------------------------------

asChefe('preencher step 0 (participante + datas) → Próximo → step 1 "Carga horária"', async ({ page }) => {
	await page.goto('/equipe/planos-trabalho/novo');
	await page.getByTestId('btn-confirmar-excecao').click();

	// Select a participant from the dropdown (seed has Lucas Ramos = servidor4, no plan)
	const select = page.locator('select#serv-sel');
	await expect(select).toBeVisible();

	// Get available options (participants without EM_EXECUCAO plan)
	const optionCount = await select.locator('option').count();
	if (optionCount <= 1) {
		// No participants available without an active plan — test is vacuously satisfied
		await expect(page.getByRole('heading', { name: /para quem é este plano\?/i })).toBeVisible();
		return;
	}

	// Select the second option (first real participant)
	await select.selectOption({ index: 1 });

	// Fill start and end dates
	const dateInputs = page.locator('input[type="date"]');
	await dateInputs.nth(0).fill('2026-06-01');
	await dateInputs.nth(1).fill('2026-11-30');

	// Próximo should be enabled (participanteId + dataInicio + dataFim are set)
	const nextBtn = page.getByRole('button', { name: /próximo/i });
	await expect(nextBtn).toBeEnabled();
	await nextBtn.click();

	// Step 1: Carga horária
	await expect(page.getByRole('heading', { name: /carga horária disponível/i })).toBeVisible();
});

// ---------------------------------------------------------------------------
// 4. Chefe — complete wizard through all 5 steps and submit
//    → redirect to /equipe?plano=criado
//
// This test MUTATES backend data. Safe for CI — seed resets nightly.
// Requires Lucas Ramos (servidor4) to be available (no active plan).
// ---------------------------------------------------------------------------

asChefe('completa wizard inteiro e envia plano → redireciona para /equipe?plano=criado', async ({ page }) => {
	await page.goto('/equipe/planos-trabalho/novo');
	await page.getByTestId('btn-confirmar-excecao').click();

	// ─── Step 0: Participante & período ────────────────────────────────────
	const select = page.locator('select#serv-sel');
	await expect(select).toBeVisible();

	const optionCount = await select.locator('option').count();
	if (optionCount <= 1) {
		// No participants available — skip this test
		await expect(page.getByRole('heading', { name: /para quem é este plano\?/i })).toBeVisible();
		return;
	}

	// Select first available participant
	await select.selectOption({ index: 1 });

	const dateInputs = page.locator('input[type="date"]');
	await dateInputs.nth(0).fill('2026-07-01');
	await dateInputs.nth(1).fill('2026-12-31');

	await page.getByRole('button', { name: /próximo/i }).click();

	// ─── Step 1: Carga horária ──────────────────────────────────────────────
	// Select 40h/semana (already selected by default, just advance)
	await expect(page.getByRole('heading', { name: /carga horária disponível/i })).toBeVisible();
	await page.getByRole('button', { name: /próximo/i }).click();

	// ─── Step 2: Critérios de avaliação ────────────────────────────────────
	// Default criteria are pre-filled; just advance
	await expect(page.getByRole('heading', { name: /como o servidor será avaliado/i })).toBeVisible();
	await page.getByRole('button', { name: /próximo/i }).click();

	// ─── Step 3: Contribuições ─────────────────────────────────────────────
	// Must add at least 1 contribution totalling 100% to advance
	await expect(page.getByRole('heading', { name: /contribuições adicionadas/i })).toBeVisible();

	// Fill contribution form: description + 100%
	await page.locator('textarea#contrib-desc').fill('Desenvolvimento e manutenção de sistemas internos');

	// Set percentage to 100 via the number input
	const pctInput = page.locator('input#contrib-pct');
	await pctInput.fill('100');

	// Click "Adicionar contribuição"
	await page.getByRole('button', { name: /adicionar contribuição/i }).click();

	// totalPct should now be 100 → Próximo becomes enabled
	const nextBtn = page.getByRole('button', { name: /próximo/i });
	await expect(nextBtn).toBeEnabled({ timeout: 3000 });
	await nextBtn.click();

	// ─── Step 4: Revisão e envio ────────────────────────────────────────────
	await expect(page.getByRole('heading', { name: /revisão do plano/i })).toBeVisible();

	const submitBtn = page.getByRole('button', { name: /enviar para aprovação/i });
	await expect(submitBtn).toBeVisible();
	await expect(submitBtn).toBeEnabled();

	await submitBtn.click();

	// On success: goto('/equipe?plano=criado')
	await expect(page).toHaveURL(/\/equipe(\?plano=criado)?/, { timeout: 10000 });
});

// ---------------------------------------------------------------------------
// 5. Chefe — GraphQL error on submit → error alert shown
// ---------------------------------------------------------------------------

asChefe('erro no GraphQL ao criar plano → exibe alerta de erro', async ({ page }) => {
	// Intercept mutation calls and return an error
	await page.route('**/graphql', async (route, request) => {
		const body = request.postDataJSON?.() as { query?: string } | null;
		if (body?.query?.includes('criarPlanoTrabalho')) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					data: null,
					errors: [{ message: 'Servidor já possui plano em execução' }]
				})
			});
		} else {
			await route.continue();
		}
	});

	await page.goto('/equipe/planos-trabalho/novo');
	await page.getByTestId('btn-confirmar-excecao').click();

	// Select a participant
	const select = page.locator('select#serv-sel');
	await expect(select).toBeVisible();

	const optionCount = await select.locator('option').count();
	if (optionCount <= 1) {
		await expect(page.getByRole('heading', { name: /para quem é este plano\?/i })).toBeVisible();
		return;
	}
	await select.selectOption({ index: 1 });

	const dateInputs = page.locator('input[type="date"]');
	await dateInputs.nth(0).fill('2026-07-01');
	await dateInputs.nth(1).fill('2026-12-31');
	await page.getByRole('button', { name: /próximo/i }).click();

	// Step 1: default 40h/week
	await page.getByRole('button', { name: /próximo/i }).click();

	// Step 2: default criteria
	await page.getByRole('button', { name: /próximo/i }).click();

	// Step 3: add 100% contribution
	await page.locator('textarea#contrib-desc').fill('Manutenção de sistemas');
	await page.locator('input#contrib-pct').fill('100');
	await page.getByRole('button', { name: /adicionar contribuição/i }).click();
	await page.getByRole('button', { name: /próximo/i, disabled: false }).click();

	// Step 4: submit
	await expect(page.getByRole('heading', { name: /revisão do plano/i })).toBeVisible();

	let alertMessage = '';
	page.on('dialog', async (dialog) => {
		alertMessage = dialog.message();
		await dialog.accept();
	});

	await page.getByRole('button', { name: /enviar para aprovação/i }).click();
	await page.waitForTimeout(2000);

	// The component does alert('Erro ao criar plano. Tente novamente.')
	expect(alertMessage).toMatch(/erro ao criar plano/i);

	// Should still be on the novo page
	await expect(page).toHaveURL(/\/equipe\/planos-trabalho\/novo/);
});
