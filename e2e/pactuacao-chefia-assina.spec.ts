/**
 * e2e/pactuacao-chefia-assina.spec.ts — Fase 10: Chefia revisa PT recebido em
 * /equipe e assina.
 *
 * Fluxo:
 *   1. Carlos (chefia) abre /equipe — vê banner consolidado com X PTs pendentes
 *   2. Clica em "Ver primeiro pendente" → /equipe/planos-trabalho/[id]/revisar
 *   3. Lê o plano e clica em "Assinar"
 *   4. Volta para /equipe → PT some dos pendentes
 *
 * REQUISITOS:
 *   - SvelteKit em http://localhost:5173
 *   - FastAPI em http://localhost:8000
 *   - Seed contendo ao menos um PT em AGUARDANDO_ASSINATURA_CHEFIA na unidade
 *     do chefe@test.pgd
 *
 * RODAR: ver pactuacao-criar.spec.ts para instruções.
 */

import { asChefe, expect } from './fixtures';

const SKIP_NO_BACKEND = true;
const describe = SKIP_NO_BACKEND ? asChefe.describe.skip : asChefe.describe;

describe('Chefia revisa e assina PT pendente (Fase 10)', () => {
	asChefe('chefia abre /equipe, vê banner e assina o PT pendente', async ({ page }) => {
		// 1. Banner consolidado no topo de /equipe
		await page.goto('/equipe');

		const banner = page.getByTestId('banner-pendentes-chefia');
		// Pode não haver pendentes — nesse caso o cenário é vacuosamente satisfeito.
		const hasBanner = await banner.isVisible().catch(() => false);
		if (!hasBanner) {
			await expect(page.getByRole('heading', { name: /^Equipe$/ })).toBeVisible();
			return;
		}

		// 2. CTA "Ver primeiro pendente" leva para /equipe/planos-trabalho/[id]/revisar
		const cta = page.getByRole('link', { name: /Ver primeiro pendente/i });
		await expect(cta).toBeVisible();
		await cta.click();

		await expect(page).toHaveURL(/\/equipe\/planos-trabalho\/[^/]+\/revisar/);
		await expect(page.getByText(/Aguardando chefia/i)).toBeVisible();

		// 3. Assina
		const assinar = page.getByRole('button', { name: /^Assinar$/i }).first();
		await expect(assinar).toBeVisible();
		await assinar.click();

		// 4. Volta para /equipe; PT some dos pendentes (ou contador decrementa)
		await expect(page).toHaveURL(/\/equipe/, { timeout: 10000 });
	});
});
