import { test, expect } from '@playwright/test';

const MOBILE = { width: 393, height: 852 };
const DESKTOP = { width: 1440, height: 900 };

test.describe('Landing mobile · fluxos', () => {
	test.use({ storageState: { cookies: [], origins: [] }, viewport: MOBILE });

	test('hero renderiza com phone mockup e caption', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		await expect(page.locator('.lp-hero-phone-mobile .phone-frame')).toBeVisible();
		await expect(page.locator('.lp-hero-phone-mobile img')).toBeVisible();
		await expect(
			page.getByText(/tela real · registrar execução com ia/i)
		).toBeVisible();
	});

	test('drawer abre, mostra links, fecha com Esc', async ({ page }) => {
		await page.goto('/');
		const hamburger = page.getByRole('button', { name: /abrir menu/i });
		await expect(hamburger).toBeVisible();
		await hamburger.click();
		await expect(
			page.getByRole('dialog', { name: /menu de navegação/i })
		).toBeVisible();
		await expect(
			page.getByRole('link', { name: 'Atendimento à norma' })
		).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(
			page.getByRole('dialog', { name: /menu de navegação/i })
		).not.toBeVisible();
	});

	test('drawer fecha ao clicar num link interno', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: /abrir menu/i }).click();
		await page
			.getByRole('link', { name: 'Atendimento à norma' })
			.click();
		await expect(
			page.getByRole('dialog', { name: /menu de navegação/i })
		).not.toBeVisible();
		await expect(page).toHaveURL(/#norma$/);
	});

	test('timeline mobile tem 4 etapas (não 6 do desktop)', async ({ page }) => {
		await page.goto('/');
		await page.locator('.ciclo-mobile').scrollIntoViewIfNeeded();
		await expect(page.locator('.ciclo-mobile .etapa')).toHaveCount(4);
	});

	test('conformidade tem 6 selos visíveis em mobile', async ({ page }) => {
		await page.goto('/');
		await page.locator('#conformidade').scrollIntoViewIfNeeded();
		const visiveis = page.locator('.selos-grid > div:visible');
		await expect(visiveis).toHaveCount(6);
	});

	test('roadmap tem 5 cards visíveis em mobile', async ({ page }) => {
		await page.goto('/');
		await page.locator('section[data-section="roadmap"]').scrollIntoViewIfNeeded();
		const visiveis = page.locator('.roadmap-grid > div:visible');
		await expect(visiveis).toHaveCount(5);
	});

	test('CTA final mobile visível e leva a /login', async ({ page }) => {
		await page.goto('/');
		const cta = page.locator('.lp-mobile-cta a[href="/login"]');
		await cta.scrollIntoViewIfNeeded();
		await expect(cta).toBeVisible();
		await cta.click();
		await expect(page).toHaveURL(/\/login$/);
	});

	test('sem overflow horizontal em mobile', async ({ page }) => {
		await page.goto('/');
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - window.innerWidth
		);
		expect(overflow).toBeLessThanOrEqual(1);
	});
});

test.describe('Landing desktop · controle', () => {
	test.use({ storageState: { cookies: [], origins: [] }, viewport: DESKTOP });

	test('CTA mobile-only fica oculto em desktop', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('.lp-mobile-cta')).not.toBeVisible();
	});

	test('hamburger button fica oculto em desktop', async ({ page }) => {
		await page.goto('/');
		await expect(
			page.getByRole('button', { name: /abrir menu/i })
		).not.toBeVisible();
	});

	test('timeline desktop tem 6 etapas', async ({ page }) => {
		await page.goto('/');
		await page.locator('.ciclo-desktop').scrollIntoViewIfNeeded();
		await expect(page.locator('.ciclo-desktop .step')).toHaveCount(6);
	});

	test('todos os 8 selos visíveis em desktop', async ({ page }) => {
		await page.goto('/');
		await page.locator('#conformidade').scrollIntoViewIfNeeded();
		const visiveis = page.locator('.selos-grid > div:visible');
		await expect(visiveis).toHaveCount(8);
	});

	test('roadmap tem 6 cards em desktop', async ({ page }) => {
		await page.goto('/');
		await page.locator('section[data-section="roadmap"]').scrollIntoViewIfNeeded();
		const visiveis = page.locator('.roadmap-grid > div:visible');
		await expect(visiveis).toHaveCount(6);
	});
});
