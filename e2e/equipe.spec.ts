/**
 * e2e/equipe.spec.ts — Phase 9: "Equipe" page tests for chefe_imediato
 *
 * Requires both servers to be running:
 *   - SvelteKit dev server: http://localhost:5173
 *   - FastAPI backend:      http://localhost:8000
 *
 * The `setup` project (global-setup.ts) must run first to populate
 * the storageState files in e2e/auth/*.json.
 */

import { asChefe, expect } from './fixtures';

// ---------------------------------------------------------------------------
// 1. Chefe — /equipe loads and shows server list or empty state
// ---------------------------------------------------------------------------

asChefe('/equipe carrega e exibe lista de servidores ou estado vazio', async ({ page }) => {
	await page.goto('/equipe');

	// Page heading should be visible
	await expect(page.getByRole('heading', { name: /equipe/i })).toBeVisible();

	// The subtitle shows "N servidores na sua unidade" — always rendered.
	await expect(page.getByText(/servidores na sua unidade/i)).toBeVisible();

	// The "Criar Plano de Trabalho" button should always be present for chefe.
	await expect(
		page.getByRole('link', { name: /criar plano de trabalho/i })
	).toBeVisible();

	// Either the table with at least one row OR the empty-state card must be present.
	const tableRows = page.locator('table.tbl tbody tr');
	const emptyCard = page.getByText(/nenhum participante encontrado/i);

	const rowCount = await tableRows.count();
	if (rowCount === 0) {
		await expect(emptyCard).toBeVisible({ timeout: 3000 });
	} else {
		await expect(tableRows.first()).toBeVisible();
	}
});

// ---------------------------------------------------------------------------
// 2. Chefe — clicking "Ver plano" on a participant navigates to plano detail
//    (conditional: only runs when at least one participant with an active plan exists)
// ---------------------------------------------------------------------------

asChefe('chefe → click "Ver plano" leva para /equipe/planos-trabalho/[id]', async ({ page }) => {
	await page.goto('/equipe');

	// Look for any "Ver plano" link in the table.
	const verPlanoLink = page.getByRole('link', { name: /ver plano/i }).first();
	const linkCount = await page.getByRole('link', { name: /ver plano/i }).count();

	if (linkCount === 0) {
		// No participants with active plans — test is vacuously satisfied.
		// We at least confirm the page loaded correctly.
		await expect(page.getByRole('heading', { name: /equipe/i })).toBeVisible();
		return;
	}

	// Capture the href before clicking so we can assert the URL.
	const href = await verPlanoLink.getAttribute('href');
	await verPlanoLink.click();

	// URL must match /equipe/planos-trabalho/<id>.
	await expect(page).toHaveURL(/\/equipe\/planos-trabalho\/\w+/);

	if (href) {
		await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'));
	}
});
