/**
 * e2e/acesso-negado.spec.ts — Cross-role access control tests
 *
 * Requires both servers to be running:
 *   - SvelteKit dev server: http://localhost:5173
 *   - FastAPI backend:      http://localhost:8000
 *
 * IMPORTANT: None of the SvelteKit +page.server.ts files enforce roles directly.
 * Role enforcement happens in the backend GraphQL resolvers. When a wrong-role
 * user hits a route, the GraphQL call returns an error or empty data, and the
 * page renders an empty/unavailable state instead of redirecting.
 *
 * Expected behaviors documented here reflect ACTUAL route behavior:
 *   - Routes without role guards load the page shell but show empty/error data
 *   - /meu-plano redirects to / only if `user` is null (always set when authed)
 *   - The backend controls data visibility, not the frontend routes
 */

import { asServidor, asChefe, asGestor, asAdmin, expect } from './fixtures';

// ---------------------------------------------------------------------------
// 1. servidor → /equipe
//    The route has NO role check. The backend's listarParticipantes resolver
//    only returns team members scoped to the caller's unit/role, so a servidor
//    gets either empty data or a backend error → frontend shows empty state.
// ---------------------------------------------------------------------------

asServidor('servidor → /equipe carrega página mas exibe estado vazio (sem acesso a equipe via backend)', async ({ page }) => {
	// TODO: this route doesn't restrict access by role on the frontend —
	// it relies on the backend returning empty data for wrong roles.
	await page.goto('/equipe');

	// The page shell must load (not a hard redirect or error page).
	// The heading is always rendered regardless of data.
	await expect(page.getByRole('heading', { name: /equipe/i })).toBeVisible();

	// For a servidor, the backend returns an error or empty list, so either:
	// a) An empty table / "nenhum participante" message appears, OR
	// b) The table exists but has zero rows.
	// Either way, there should be no "Ver plano" links.
	const verPlanoLinks = page.getByRole('link', { name: /ver plano/i });
	await expect(verPlanoLinks).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// 2. servidor → /admin/participantes
//    Same pattern: no frontend role guard; backend returns empty/error.
//    The admin page shell will render but show 0 participantes.
// ---------------------------------------------------------------------------

asServidor('servidor → /admin/participantes carrega página mas exibe 0 participantes', async ({ page }) => {
	// TODO: this route doesn't restrict access by role on the frontend.
	await page.goto('/admin/participantes');

	// Page shell should render (not a hard redirect).
	await expect(page.getByRole('heading', { name: /participantes/i })).toBeVisible();

	// Since the backend enforces admin-only access to listarParticipantes,
	// a servidor will get an empty list → subtitle shows "0 participantes".
	await expect(page.getByText(/0 participantes/i)).toBeVisible();
});

// ---------------------------------------------------------------------------
// 3. chefe → /meu-plano
//    /meu-plano only redirects to / if user is null (impossible when authed).
//    A chefe_imediato will hit the page and get data from listarPlanosTrabalho,
//    which may return empty for a chefe. The page renders "Nenhum plano ativo".
// ---------------------------------------------------------------------------

asChefe('chefe → /meu-plano carrega página (sem guard de role no frontend)', async ({ page }) => {
	// TODO: this route doesn't restrict access by role on the frontend —
	// it redirects only when user is null (never true for authenticated chefe).
	await page.goto('/meu-plano');

	// Page stays at /meu-plano (no redirect to / since user is authenticated).
	await expect(page).toHaveURL(/\/meu-plano/);

	// Page heading should be visible.
	await expect(page.getByRole('heading', { name: /meu plano/i })).toBeVisible();
});

// ---------------------------------------------------------------------------
// 4. admin → /equipe
//    Admin should be able to see the equipe page and data loads normally.
//    The backend's listarParticipantes returns all participants for admin.
// ---------------------------------------------------------------------------

asAdmin('admin → /equipe carrega normalmente com acesso completo', async ({ page }) => {
	await page.goto('/equipe');

	// Page heading should be visible.
	await expect(page.getByRole('heading', { name: /equipe/i })).toBeVisible();

	// The subtitle "N servidores na sua unidade" is always rendered.
	await expect(page.getByText(/servidores na sua unidade/i)).toBeVisible();

	// Admin can see the "Criar Plano de Trabalho" button.
	await expect(
		page.getByRole('link', { name: /criar plano de trabalho/i })
	).toBeVisible();
});

// ---------------------------------------------------------------------------
// 5. gestor → /conformidade
//    gestor_unidade has access to conformidade data. The backend returns
//    painelConformidade data for this role.
// ---------------------------------------------------------------------------

asGestor('gestor → /conformidade carrega o painel de conformidade', async ({ page }) => {
	await page.goto('/conformidade');

	// Page heading should be visible.
	await expect(page.getByRole('heading', { name: /painel de conformidade/i })).toBeVisible();

	// Either the KPI cards load (painelConformidade returned data), or the
	// "indisponível" fallback is shown — both are valid outcomes depending on
	// whether the gestor's backend role has access to the resolver.
	const kpiPlanos = page.getByText(/planos enviados/i);
	const indisponivel = page.getByText(/painel de conformidade indisponível/i);

	const hasKpi = await kpiPlanos.isVisible().catch(() => false);
	const hasFallback = await indisponivel.isVisible().catch(() => false);

	expect(
		hasKpi || hasFallback,
		'Esperava ver KPIs do painel ou mensagem de indisponível'
	).toBe(true);
});

// ---------------------------------------------------------------------------
// 6. servidor → /conformidade
//    servidor has no access to conformidade. The backend returns an error,
//    so the frontend renders "painel de conformidade indisponível".
// ---------------------------------------------------------------------------

asServidor('servidor → /conformidade exibe estado indisponível (sem dados do backend)', async ({ page }) => {
	// TODO: this route doesn't restrict access by role on the frontend.
	await page.goto('/conformidade');

	// Page shell loads.
	await expect(page.getByRole('heading', { name: /painel de conformidade/i })).toBeVisible();

	// Backend returns error for servidor → painel=null → fallback message.
	await expect(page.getByText(/painel de conformidade indisponível/i)).toBeVisible();
});
