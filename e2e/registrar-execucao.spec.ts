/**
 * e2e/registrar-execucao.spec.ts — Phase 6: Multi-step "Registrar execução" wizard tests
 *
 * Requires both servers to be running:
 *   - SvelteKit dev server: http://localhost:5173
 *   - FastAPI backend:      http://localhost:8000
 *
 * The `setup` project (global-setup.ts) must run first to populate
 * the storageState files in e2e/auth/*.json.
 *
 * Tests 1–6 cover step navigation only. Tests 7+ cover form submission.
 * The submission tests DO mutate backend data (registrarExecucao mutation).
 * This is intentional for E2E tests: the demo seed resets nightly at 03:00 UTC.
 */

import { asServidor, expect } from './fixtures';

// ---------------------------------------------------------------------------
// 1. Page loads at step 0 (Período)
// ---------------------------------------------------------------------------

asServidor('/meu-plano/registrar → step 0 "Período" visível ao entrar', async ({ page }) => {
	await page.goto('/meu-plano/registrar');

	// The page title heading
	await expect(page.getByRole('heading', { name: /registrar execução/i })).toBeVisible();

	// The first step card heading is "1. Período"
	await expect(page.getByRole('heading', { name: /1\.\s*período/i })).toBeVisible();

	// Date inputs are present for step 0
	await expect(page.locator('input[type="date"]').first()).toBeVisible();
});

// ---------------------------------------------------------------------------
// 2. Fill dates at step 0 → click Próximo → step 1 (Descrição) visible
// ---------------------------------------------------------------------------

asServidor('preencher datas no step 0 → Próximo → step 1 "Descrição" visível', async ({ page }) => {
	await page.goto('/meu-plano/registrar');

	// Fill "De" date
	const dateInputs = page.locator('input[type="date"]');
	await dateInputs.nth(0).fill('2026-04-01');

	// Fill "Até" date
	await dateInputs.nth(1).fill('2026-04-30');

	// Click Próximo — button is enabled once both dates are filled
	await page.getByRole('button', { name: /próximo/i }).click();

	// Step 1: "Descrição da execução" heading
	await expect(page.getByRole('heading', { name: /2\.\s*descrição da execução/i })).toBeVisible();

	// The textarea for description should be present
	await expect(page.locator('textarea#desc')).toBeVisible();
});

// ---------------------------------------------------------------------------
// 3. Fill 50+ chars at step 1 → click Próximo → step 2 (Ocorrências) visible
// ---------------------------------------------------------------------------

asServidor('preencher descrição 50+ chars → Próximo → step 2 "Ocorrências" visível', async ({ page }) => {
	await page.goto('/meu-plano/registrar');

	// Complete step 0
	const dateInputs = page.locator('input[type="date"]');
	await dateInputs.nth(0).fill('2026-04-01');
	await dateInputs.nth(1).fill('2026-04-30');
	await page.getByRole('button', { name: /próximo/i }).click();

	// Step 1: fill description with 50+ chars
	const descricao =
		'Descrição detalhada das atividades realizadas durante o período de execução do plano de trabalho.';
	await page.locator('textarea#desc').fill(descricao);

	// Próximo should now be enabled (≥50 chars)
	await page.getByRole('button', { name: /próximo/i }).click();

	// Step 2: "Ocorrências no período" heading
	await expect(page.getByRole('heading', { name: /3\.\s*ocorrências/i })).toBeVisible();

	// The ocorrências textarea should be present
	await expect(page.locator('textarea#ocorr')).toBeVisible();
});

// ---------------------------------------------------------------------------
// 4. Click Próximo at step 2 → step 3 (Revisão) visible
// ---------------------------------------------------------------------------

asServidor('click Próximo no step 2 → step 3 "Revisão e envio" visível', async ({ page }) => {
	await page.goto('/meu-plano/registrar');

	// Complete step 0
	const dateInputs = page.locator('input[type="date"]');
	await dateInputs.nth(0).fill('2026-04-01');
	await dateInputs.nth(1).fill('2026-04-30');
	await page.getByRole('button', { name: /próximo/i }).click();

	// Complete step 1
	await page.locator('textarea#desc').fill(
		'Atividades realizadas incluem revisão de documentos, participação em reuniões técnicas e elaboração de relatórios.'
	);
	await page.getByRole('button', { name: /próximo/i }).click();

	// Step 2: advance without filling ocorrências (optional field)
	await page.getByRole('button', { name: /próximo/i }).click();

	// Step 3: "Revisão e envio" — the review plaque for "Período avaliativo" should appear
	await expect(page.getByRole('heading', { name: /4\.\s*revisão e envio/i })).toBeVisible();
	await expect(page.getByText('Período avaliativo')).toBeVisible();
});

// ---------------------------------------------------------------------------
// 5. "Cancelar" at step 0 → redirects to /meu-plano
// ---------------------------------------------------------------------------

asServidor('"Cancelar" no step 0 → redireciona para /meu-plano', async ({ page }) => {
	await page.goto('/meu-plano/registrar');

	// "Cancelar" link is shown at step 0 in place of "Voltar"
	const cancelar = page.getByRole('link', { name: /cancelar/i });
	await expect(cancelar).toBeVisible();
	await cancelar.click();

	await expect(page).toHaveURL(/\/meu-plano$/);
});

// ---------------------------------------------------------------------------
// 6. "Voltar" at step 2 → goes back to step 1
// ---------------------------------------------------------------------------

asServidor('"Voltar" no step 2 → retorna ao step 1', async ({ page }) => {
	await page.goto('/meu-plano/registrar');

	// Complete step 0
	const dateInputs = page.locator('input[type="date"]');
	await dateInputs.nth(0).fill('2026-04-01');
	await dateInputs.nth(1).fill('2026-04-30');
	await page.getByRole('button', { name: /próximo/i }).click();

	// Complete step 1
	await page.locator('textarea#desc').fill(
		'Atividades realizadas incluem revisão de documentos, participação em reuniões e elaboração de relatórios técnicos.'
	);
	await page.getByRole('button', { name: /próximo/i }).click();

	// Now at step 2 — click Voltar
	await expect(page.getByRole('heading', { name: /3\.\s*ocorrências/i })).toBeVisible();
	await page.getByRole('button', { name: /voltar/i }).click();

	// Should be back at step 1 (Descrição)
	await expect(page.getByRole('heading', { name: /2\.\s*descrição da execução/i })).toBeVisible();
});

// ---------------------------------------------------------------------------
// 7. Complete all steps and submit → redirect to /meu-plano?registro=enviado
//
// This test MUTATES backend data (creates a registroExecucao).
// The demo seed resets nightly so this is safe for CI against the demo env.
//
// NOTE: The seed persona for servidor (Ana Silva, servidor1@pgd-demo.gov.br)
// has a PT em execução with contribuições. The wizard calls registrarExecucao
// client-side via fetch to the GraphQL endpoint (credentials: 'include').
// On success the page does goto('/meu-plano?registro=enviado').
// ---------------------------------------------------------------------------

asServidor('completa wizard e envia registro → redireciona para /meu-plano?registro=enviado', async ({ page }) => {
	await page.goto('/meu-plano/registrar');

	// Step 0: fill dates
	const dateInputs = page.locator('input[type="date"]');
	await dateInputs.nth(0).fill('2026-03-01');
	await dateInputs.nth(1).fill('2026-03-31');
	await page.getByRole('button', { name: /próximo/i }).click();

	// Step 1: fill description (50+ chars)
	await page.locator('textarea#desc').fill(
		'Atividades realizadas: revisão de documentos técnicos, participação em reuniões de alinhamento e elaboração de relatórios mensais de progresso.'
	);
	await page.getByRole('button', { name: /próximo/i }).click();

	// Step 2: skip ocorrências (optional)
	await page.getByRole('button', { name: /próximo/i }).click();

	// Step 3: verify review screen and click submit
	await expect(page.getByRole('heading', { name: /4\.\s*revisão e envio/i })).toBeVisible();
	await expect(page.getByText('Período avaliativo')).toBeVisible();

	const submitBtn = page.getByRole('button', { name: /enviar registro/i });
	await expect(submitBtn).toBeVisible();
	await expect(submitBtn).toBeEnabled();

	await submitBtn.click();

	// On success, the component calls goto('/meu-plano?registro=enviado').
	// Wait for navigation — timeout extended to 10s for backend round-trip.
	await expect(page).toHaveURL(/\/meu-plano(\?registro=enviado)?/, { timeout: 10000 });
});

// ---------------------------------------------------------------------------
// 8. Submit with GraphQL error → error alert or message is shown
//
// We intercept the GraphQL fetch and return a simulated error response.
// The component shows an alert() on error — we capture it via page.on('dialog').
// ---------------------------------------------------------------------------

asServidor('erro no GraphQL ao enviar → exibe alerta de erro', async ({ page }) => {
	// Intercept all requests to the GraphQL endpoint and return an error.
	await page.route('**/graphql', async (route, request) => {
		// Only intercept mutation requests (registrarExecucao); let queries through.
		const body = request.postDataJSON?.() as { query?: string } | null;
		if (body?.query?.includes('registrarExecucao')) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					data: null,
					errors: [{ message: 'Período sobrepõe registro existente' }]
				})
			});
		} else {
			await route.continue();
		}
	});

	await page.goto('/meu-plano/registrar');

	// Complete all steps
	const dateInputs = page.locator('input[type="date"]');
	await dateInputs.nth(0).fill('2026-04-01');
	await dateInputs.nth(1).fill('2026-04-30');
	await page.getByRole('button', { name: /próximo/i }).click();

	await page.locator('textarea#desc').fill(
		'Atividades diversas incluindo revisão de documentação interna e participação em reuniões técnicas semanais.'
	);
	await page.getByRole('button', { name: /próximo/i }).click();
	await page.getByRole('button', { name: /próximo/i }).click();

	// Capture the alert dialog that the component shows on error
	let alertMessage = '';
	page.on('dialog', async (dialog) => {
		alertMessage = dialog.message();
		await dialog.accept();
	});

	const submitBtn = page.getByRole('button', { name: /enviar registro/i });
	await submitBtn.click();

	// Wait briefly for the dialog to fire
	await page.waitForTimeout(2000);

	// The component does alert('Erro ao enviar registro. Tente novamente.')
	expect(alertMessage).toMatch(/erro ao enviar registro/i);

	// The page should NOT have navigated away (still on registrar)
	await expect(page).toHaveURL(/\/meu-plano\/registrar/);
});
