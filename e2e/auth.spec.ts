/**
 * e2e/auth.spec.ts — Phase 3: Auth & Layout tests
 *
 * Requires both servers to be running:
 *   - SvelteKit dev server: http://localhost:5173
 *   - FastAPI backend:      http://localhost:8000
 *
 * The `setup` project (global-setup.ts) must run first to populate
 * the storageState files in e2e/auth/*.json.
 */

import { test, expect } from '@playwright/test';
import { asServidor, asChefe } from './fixtures';

// ---------------------------------------------------------------------------
// 1. Unauthenticated — no cookie → redirected away from the portal
// ---------------------------------------------------------------------------

test('sem cookie → redireciona para Google OAuth (fora do localhost:5173)', async ({ browser }) => {
	// Create a fresh context with NO storageState so there are no auth cookies.
	const context = await browser.newContext();
	const page = await context.newPage();

	// Navigate to the root; hooks.server.ts issues a 302 to
	// ${PUBLIC_BACKEND_URL}/auth/login/google when `access_token` is absent.
	// Playwright follows redirects automatically, so we just check the final URL.
	await page.goto('http://localhost:5173/', { waitUntil: 'commit' });

	const finalUrl = page.url();

	// The portal should have redirected away from localhost:5173.
	// Acceptable destinations:
	//   • http://localhost:8000/auth/login/google  (local backend)
	//   • https://<production-backend>/auth/login/google
	//   • https://accounts.google.com/...          (Google OAuth)
	expect(
		finalUrl.includes('accounts.google.com') ||
			finalUrl.includes('/auth/login/google') ||
			!finalUrl.startsWith('http://localhost:5173'),
		`Esperava redirecionamento para fora do portal, mas a URL final foi: ${finalUrl}`
	).toBe(true);

	await context.close();
});

// ---------------------------------------------------------------------------
// 2. Servidor — cookie presente → TopNav exibe "Meu Plano", não "Equipe"
// ---------------------------------------------------------------------------

asServidor('cookie de servidor → nav mostra "Meu Plano" e oculta "Equipe"', async ({ page }) => {
	await page.goto('/');

	// Wait for the nav to be fully rendered before asserting its contents.
	const nav = page.locator('nav[aria-label="Navegação principal"]');
	await expect(nav).toBeVisible();

	// "Meu Plano" is in NAV_ITEMS only for the 'servidor' role.
	await expect(nav.getByRole('link', { name: 'Meu Plano' })).toBeVisible();

	// "Equipe" is only shown to 'chefe_imediato' — must NOT appear for servidor.
	await expect(nav.getByRole('link', { name: 'Equipe' })).not.toBeVisible();
});

// ---------------------------------------------------------------------------
// 3. Chefe imediato — cookie presente → TopNav exibe "Equipe", não "Meu Plano"
// ---------------------------------------------------------------------------

asChefe('cookie de chefe → nav mostra "Equipe" e oculta "Meu Plano"', async ({ page }) => {
	await page.goto('/');

	const nav = page.locator('nav[aria-label="Navegação principal"]');
	await expect(nav).toBeVisible();

	// "Equipe" is in NAV_ITEMS only for the 'chefe_imediato' role.
	await expect(nav.getByRole('link', { name: 'Equipe' })).toBeVisible();

	// "Meu Plano" is only shown to 'servidor' — must NOT appear for chefe.
	await expect(nav.getByRole('link', { name: 'Meu Plano' })).not.toBeVisible();
});
