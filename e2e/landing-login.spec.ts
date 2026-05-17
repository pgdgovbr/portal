import { test, expect } from '@playwright/test';
import { asServidor } from './fixtures';

const BACKEND = 'http://localhost:8000';

// ─── Landing pública ─────────────────────────────────────────────────────

test.describe('Landing pública /', () => {
	// Garante contexto limpo: sem cookies de testes anteriores
	test.use({ storageState: { cookies: [], origins: [] } });

	test('renderiza sem auth com PGD Livre no hero', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('heading', { level: 1 })).toContainText(
			/Gestão de desempenho conforme a norma/
		);
		// Marca aparece no TopNav
		await expect(page.getByText('PGD Livre').first()).toBeVisible();
	});

	test('CTA "Acessar demonstração" leva para /login', async ({ page }) => {
		await page.goto('/');
		const cta = page.getByRole('link', { name: /acessar demonstração/i }).first();
		await cta.click();
		await expect(page).toHaveURL(/\/login$/);
	});

	test('link Documentação aponta para docs públicas', async ({ page }) => {
		await page.goto('/');
		const doc = page.getByRole('link', { name: /documentação/i }).first();
		await expect(doc).toHaveAttribute('href', 'https://pgdgovbr.github.io/docs/');
	});

	test('rota protegida sem token redireciona para /login com next=', async ({ page }) => {
		const response = await page.goto('/meu-plano');
		await expect(page).toHaveURL(/\/login\?next=%2Fmeu-plano/);
		expect(response?.status()).toBe(200);
	});
});

// ─── Tela /login ─────────────────────────────────────────────────────────

test.describe('Login /login', () => {
	test.use({ storageState: { cookies: [], origins: [] } });

	test('exibe banner de demonstração e personas recomendadas', async ({ page }) => {
		await page.goto('/login');
		await expect(page.getByText(/Instância de demonstração/i)).toBeVisible();
		await expect(page.getByText(/Comece por aqui/i)).toBeVisible();
		// Pelo menos uma persona recomendada
		await expect(page.getByText('Marta Silva')).toBeVisible();
	});

	test('details "Mais personas" expande as demais', async ({ page }) => {
		await page.goto('/login');
		await expect(page.getByText(/Mais personas/i)).toBeVisible();
	});

	test('clicar em persona Marta faz login e vai para /app', async ({ page }) => {
		await page.goto('/login');
		const martaCard = page.getByRole('link', { name: /Marta Silva/ });
		await martaCard.click();
		await expect(page).toHaveURL(/\/app$/);
	});

	test('link "Voltar à página inicial" volta para /', async ({ page }) => {
		await page.goto('/login');
		await page
			.getByRole('link', { name: 'Voltar à página inicial', exact: true })
			.click();
		await expect(page).toHaveURL(/\/$/);
	});
});

// ─── Auth API endpoints ──────────────────────────────────────────────────

test.describe('Endpoints /api/* auth', () => {
	test.use({ storageState: { cookies: [], origins: [] } });

	test('GET /api/demo-login sem params retorna 400', async ({ request }) => {
		const res = await request.get('/api/demo-login', { maxRedirects: 0 });
		expect(res.status()).toBe(400);
	});

	test('GET /api/demo-login com params válidos seta cookie e redireciona', async ({ request }) => {
		const res = await request.get(
			'/api/demo-login?email=servidor7%40pgd-demo.gov.br&name=Marta+Silva&role=servidor',
			{ maxRedirects: 0 }
		);
		expect(res.status()).toBe(303);
		expect(res.headers()['location']).toBe('/app');
		const cookie = res.headers()['set-cookie'];
		expect(cookie).toContain('access_token=');
		expect(cookie).toContain('HttpOnly');
	});

	test('POST /api/logout limpa cookie e redireciona para /', async ({ request }) => {
		const res = await request.post('/api/logout', { maxRedirects: 0 });
		expect(res.status()).toBe(303);
		expect(res.headers()['location']).toBe('/');
		const cookie = res.headers()['set-cookie'];
		expect(cookie).toContain('access_token=');
		expect(cookie).toContain('Max-Age=0');
	});
});

// ─── Fluxo logado: TopNav, Sair ──────────────────────────────────────────

asServidor.describe('Servidor já autenticado', () => {
	asServidor('TopNav.logo aponta para /app', async ({ page }) => {
		await page.goto('/app');
		const logo = page.getByRole('link', { name: /PGD Livre — início/i });
		await expect(logo).toHaveAttribute('href', '/app');
	});

	asServidor('Logout: clicar em "Sair" volta para landing', async ({ page }) => {
		await page.goto('/app');
		// O botão Sair está dentro de um menu hover-revealed
		await page.locator('.tn-user-wrap').hover();
		await page.getByRole('button', { name: /sair/i }).click();
		await expect(page).toHaveURL(/\/$/);
	});

	asServidor('/ logado redireciona para /app', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveURL(/\/app$/);
	});
});
