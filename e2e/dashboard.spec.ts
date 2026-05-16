/**
 * e2e/dashboard.spec.ts — Phase 3: Dashboard / home page tests
 *
 * Requires both servers to be running:
 *   - SvelteKit dev server: http://localhost:5173
 *   - FastAPI backend:      http://localhost:8000
 *
 * The `setup` project (global-setup.ts) must run first to populate
 * the storageState files in e2e/auth/*.json.
 */

import { asServidor, asChefe, expect } from './fixtures';

// ---------------------------------------------------------------------------
// 1. Servidor — home shows greeting with first name
// ---------------------------------------------------------------------------

asServidor('servidor → home exibe saudação com primeiro nome', async ({ page }) => {
	await page.goto('/');

	// The heading "Olá, <FirstName>" is rendered for the servidor role.
	const heading = page.getByRole('heading', { level: 1 });
	await expect(heading).toBeVisible();

	// The heading text starts with "Olá," (first name follows dynamically).
	await expect(heading).toContainText('Olá,');
});

// ---------------------------------------------------------------------------
// 2. Servidor — home has "Meu Plano de Trabalho" quick-access link
// ---------------------------------------------------------------------------

asServidor('servidor → home contém link "Ver meu plano de trabalho"', async ({ page }) => {
	await page.goto('/');

	// "Acesso rápido" section always renders for 'servidor' regardless of backend state.
	const quickAccess = page.getByRole('link', { name: /ver meu plano de trabalho/i });
	await expect(quickAccess).toBeVisible();
});

// ---------------------------------------------------------------------------
// 3. Chefe imediato — home shows KPI cards with team counts
// ---------------------------------------------------------------------------

asChefe('chefe → home exibe cards KPI da equipe', async ({ page }) => {
	await page.goto('/');

	// The chefe dashboard always renders these KPI labels regardless of data.
	await expect(page.locator('.kpi-label', { hasText: 'Servidores na equipe' }).first()).toBeVisible();
	await expect(page.locator('.kpi-label', { hasText: 'Avaliações pendentes' }).first()).toBeVisible();
	await expect(page.locator('.kpi-label', { hasText: 'Planos em execução' }).first()).toBeVisible();
});

// ---------------------------------------------------------------------------
// 4. Chefe imediato — home has "Ver equipe" navigation link
// ---------------------------------------------------------------------------

asChefe('chefe → home contém link "Ver equipe completa"', async ({ page }) => {
	await page.goto('/');

	const teamLink = page.getByRole('link', { name: /ver equipe completa/i });
	await expect(teamLink).toBeVisible();
	await expect(teamLink).toHaveAttribute('href', '/equipe');
});

// ---------------------------------------------------------------------------
// 5. Servidor with active plan — UrgencyPill visible when plan is active
//    (conditional: passes even when backend has no active plan)
// ---------------------------------------------------------------------------

asServidor('servidor → se plano ativo, pill de urgência presente no card', async ({ page }) => {
	await page.goto('/');

	// If a plan card is rendered, the UrgencyPill should be inside it.
	// We check count >= 0 so the test is stable when backend has no active plan.
	const planoCard = page.locator('section.card').filter({ hasText: 'Plano de Trabalho ativo' });
	const cardCount = await planoCard.count();

	if (cardCount > 0) {
		// The "Dias restantes" plaque always contains an UrgencyPill when a plan exists.
		await expect(page.getByText('Dias restantes')).toBeVisible();
	} else {
		// No active plan — the banner about missing plan should be present instead.
		await expect(
			page.getByText(/você ainda não tem um plano de trabalho ativo/i)
		).toBeVisible({ timeout: 3000 });
	}
});
