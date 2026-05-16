/**
 * e2e/meu-plano.spec.ts — Phase 3: "Meu Plano de Trabalho" page tests
 *
 * Requires both servers to be running:
 *   - SvelteKit dev server: http://localhost:5173
 *   - FastAPI backend:      http://localhost:8000
 *
 * The `setup` project (global-setup.ts) must run first to populate
 * the storageState files in e2e/auth/*.json.
 */

import { asServidor, expect } from './fixtures';

// ---------------------------------------------------------------------------
// 1. Servidor — /meu-plano loads without redirect
// ---------------------------------------------------------------------------

asServidor('/meu-plano carrega sem redirecionar', async ({ page }) => {
	await page.goto('/meu-plano');

	// The page should stay at /meu-plano (not redirect away).
	await expect(page).toHaveURL(/\/meu-plano$/);

	// The page title is always rendered regardless of backend state.
	await expect(page.getByRole('heading', { name: /meu plano de trabalho/i })).toBeVisible();
});

// ---------------------------------------------------------------------------
// 2. Servidor — "Registrar execução" link is present only when a plan is active
// ---------------------------------------------------------------------------

asServidor('"Registrar execução" link presente quando há plano ativo', async ({ page }) => {
	await page.goto('/meu-plano');

	// The "Registrar execução" button/link only appears when a plan is active
	// (in the page header and in the "Ações" sidebar card). When no plan exists,
	// the empty-state card is shown instead.
	const registrarLinks = page.getByRole('link', { name: /registrar execução/i });
	const count = await registrarLinks.count();

	if (count === 0) {
		// No active plan — the empty-state heading must be visible.
		await expect(
			page.getByRole('heading', { name: /nenhum plano de trabalho ativo/i })
		).toBeVisible({ timeout: 3000 });
	} else {
		// Active plan exists — every "Registrar execução" link must point to /meu-plano/registrar.
		await expect(registrarLinks.first()).toBeVisible();
		for (let i = 0; i < count; i++) {
			await expect(registrarLinks.nth(i)).toHaveAttribute('href', '/meu-plano/registrar');
		}
	}
});
