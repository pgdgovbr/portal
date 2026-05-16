/**
 * e2e/conformidade.spec.ts — Phase 14: "Conformidade" page tests
 *
 * Requires both servers to be running:
 *   - SvelteKit dev server: http://localhost:5173
 *   - FastAPI backend:      http://localhost:8000
 *
 * The `setup` project (global-setup.ts) must run first to populate
 * the storageState files in e2e/auth/*.json.
 */

import { asAdmin, expect } from './fixtures';

// ---------------------------------------------------------------------------
// 1. Admin — /conformidade loads successfully
// ---------------------------------------------------------------------------

asAdmin('/conformidade carrega sem redirecionar', async ({ page }) => {
	await page.goto('/conformidade');

	// The page must stay at /conformidade.
	await expect(page).toHaveURL(/\/conformidade$/);

	// The main heading is always rendered.
	await expect(
		page.getByRole('heading', { name: /painel de conformidade/i })
	).toBeVisible();

	// The "Sincronizar agora" button is always present.
	await expect(page.getByRole('button', { name: /sincronizar agora/i })).toBeVisible();
});

// ---------------------------------------------------------------------------
// 2. Admin — if errors table has items, first row has "Detalhes" link
//    (conditional: stable against empty backend state)
// ---------------------------------------------------------------------------

asAdmin('erros de sincronização → primeira linha tem link "Detalhes"', async ({ page }) => {
	await page.goto('/conformidade');

	// When the backend is unreachable or returns no painel, show "indisponível".
	const indisponivel = page.getByText(/painel de conformidade indisponível/i);
	if (await indisponivel.count() > 0) {
		await expect(indisponivel).toBeVisible({ timeout: 3000 });
		return;
	}

	// Check if the errors section is rendered at all.
	const errosHeading = page.getByRole('heading', { name: /erros de sincronização/i });
	const errosHeadingCount = await errosHeading.count();

	if (errosHeadingCount === 0) {
		// No errors — the "Tudo sincronizado" banner should be shown.
		await expect(page.getByText(/tudo sincronizado/i)).toBeVisible({ timeout: 3000 });
		return;
	}

	// Errors table is present — verify the first row has a "Detalhes" link.
	const detalhesLink = page.getByRole('link', { name: /detalhes/i }).first();
	await expect(detalhesLink).toBeVisible();

	// The link must point to /conformidade/erro/<id>.
	const href = await detalhesLink.getAttribute('href');
	expect(href).toMatch(/\/conformidade\/erro\/.+/);
});
