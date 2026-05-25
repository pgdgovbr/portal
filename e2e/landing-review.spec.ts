/**
 * Landing review · varredura por seção × viewport
 *
 * Para cada combinação (viewport × seção):
 *   - Navega para `/`
 *   - Scrolla até a seção
 *   - Aguarda animações settle
 *   - Tira screenshot full-section
 *   - Asserta zero overflow horizontal
 *   - Asserta imagens carregadas e textos não cortados
 *
 * Os screenshots ficam em e2e/screenshots/landing/{viewport}/{section}.png
 * para revisão visual humana.
 */
import { test, expect } from '@playwright/test';

const VIEWPORTS = [
	{ name: 'mobile', width: 393, height: 852 },
	{ name: 'tablet', width: 720, height: 1024 },
	{ name: 'desktop', width: 1440, height: 900 }
] as const;

const SECTIONS = [
	{ id: 'hero', selector: 'section[data-section="hero"]' },
	{ id: 'statbar', selector: 'section[data-section="statbar"]' },
	{ id: 'norma', selector: 'section[data-section="norma"]' },
	{ id: 'ciclo', selector: 'section[data-section="ciclo"]' },
	{ id: 'ia', selector: 'section[data-section="ia"]' },
	{ id: 'conformidade', selector: 'section[data-section="conformidade"]' },
	{ id: 'arquitetura', selector: 'section[data-section="arquitetura"]' },
	{ id: 'roadmap', selector: 'section[data-section="roadmap"]' },
	{ id: 'mobile-cta', selector: 'section[data-section="mobile-cta"]', mobileOnly: true },
	{ id: 'footer', selector: 'footer.lp-footer' }
] as const;

for (const vp of VIEWPORTS) {
	test.describe(`landing @${vp.name} ${vp.width}×${vp.height}`, () => {
		test.use({
			viewport: { width: vp.width, height: vp.height },
			storageState: { cookies: [], origins: [] }
		});

		for (const section of SECTIONS) {
			if ('mobileOnly' in section && section.mobileOnly && vp.name !== 'mobile') continue;

			test(`${section.id}: renderiza sem overflow`, async ({ page }) => {
				await page.goto('/');
				const loc = page.locator(section.selector);
				await loc.scrollIntoViewIfNeeded();
				await page.waitForTimeout(450);
				await expect(loc).toBeVisible();

				await loc.screenshot({
					path: `e2e/screenshots/landing/${vp.name}/${section.id}.png`,
					animations: 'disabled'
				});

				const overflow = await page.evaluate(
					() => document.documentElement.scrollWidth - window.innerWidth
				);
				expect(overflow, `overflow horizontal em ${vp.name}/${section.id}`).toBeLessThanOrEqual(1);

				const images = await loc.locator('img').all();
				for (const img of images) {
					const natural = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
					expect(natural, `imagem não carregou em ${section.id}`).toBeGreaterThan(0);
				}
			});
		}

		test('headings não estão cortados', async ({ page }) => {
			await page.goto('/');
			const headings = page.locator('h1, h2, h3');
			const count = await headings.count();
			for (let i = 0; i < count; i++) {
				const h = headings.nth(i);
				const isVisible = await h.isVisible();
				if (!isVisible) continue;
				const cropped = await h.evaluate((el) => el.scrollWidth > el.clientWidth + 1);
				if (cropped) {
					const text = await h.textContent();
					throw new Error(`Heading cortado em ${vp.name}: "${text}"`);
				}
			}
		});
	});
}
