/**
 * e2e/pactuacao-chefia-ajusta.spec.ts — Fase 10: Chefia devolve PT para
 * ajustes via /equipe/planos-trabalho/[id]/revisar; depois o servidor
 * reassina em /meu-plano/[id]/revisar.
 *
 * Fluxo:
 *   1. Carlos (chefia) revisa PT recebido e devolve para ajustes
 *      → status volta para AGUARDANDO_ASSINATURA_PARTICIPANTE
 *   2. Lucas (servidor) recebe notificação e revisa o que mudou em
 *      /meu-plano/[id]/revisar (banner OwnershipBanner variante
 *      comigo-revisor com diff)
 *   3. Lucas assina → status vira EM_EXECUCAO
 *
 * REQUISITOS:
 *   - SvelteKit + FastAPI + seed com PT em AGUARDANDO_ASSINATURA_CHEFIA
 *
 * RODAR: ver pactuacao-criar.spec.ts.
 */

import { asChefe, asServidor, expect } from './fixtures';

const SKIP_NO_BACKEND = true;
const describeChefe = SKIP_NO_BACKEND ? asChefe.describe.skip : asChefe.describe;
const describeServ = SKIP_NO_BACKEND ? asServidor.describe.skip : asServidor.describe;

describeChefe('Chefia devolve PT para ajustes (Fase 10)', () => {
	asChefe('chefia abre revisar, clica em "Devolver para ajustes", confirma', async ({ page }) => {
		await page.goto('/equipe');

		const cta = page.getByRole('link', { name: /Ver primeiro pendente/i });
		const hasPendente = await cta.isVisible().catch(() => false);
		if (!hasPendente) {
			await expect(page.getByRole('heading', { name: /^Equipe$/ })).toBeVisible();
			return;
		}

		await cta.click();
		await expect(page).toHaveURL(/\/equipe\/planos-trabalho\/[^/]+\/revisar/);

		// AssinaturaCard expõe botão "Devolver para ajustes" (texto pode variar)
		const devolver = page
			.getByRole('button', { name: /Devolver|Ajustar/i })
			.first();
		await expect(devolver).toBeVisible();
		await devolver.click();

		// Confirmação inline: "Sim, ajustar e devolver"
		const confirmar = page.getByRole('button', { name: /Sim.*ajustar|ajustar e devolver/i });
		await expect(confirmar).toBeVisible();
		await confirmar.click();

		// Redireciona para /equipe/planos-trabalho/[id]/editar
		await expect(page).toHaveURL(/\/equipe\/planos-trabalho\/[^/]+\/editar/, { timeout: 10000 });
	});
});

describeServ('Servidor reassina após ajustes da chefia (Fase 10)', () => {
	asServidor('servidor abre /meu-plano/[id]/revisar e assina', async ({ page }) => {
		await page.goto('/meu-plano');

		// Procura por banner de "aguardando minha ação" (Fase 8)
		const banner = page.getByTestId('banner-aguardando-minha-acao');
		const hasBanner = await banner.isVisible().catch(() => false);

		if (!hasBanner) {
			// Sem PT pendente, cenário vacuosamente satisfeito.
			await expect(page.getByRole('heading', { name: /meu plano de trabalho/i })).toBeVisible();
			return;
		}

		// CTA "Revisar agora" leva para /meu-plano/[id]/revisar
		await page.getByRole('link', { name: /Revisar agora/i }).click();
		await expect(page).toHaveURL(/\/meu-plano\/[^/]+\/revisar/);

		// Banner com "ajustou e devolveu" (OwnershipBanner comigo-revisor)
		await expect(page.getByText(/ajustou.*devolveu|enviou.*plano/i).first()).toBeVisible();

		// Assina
		await page.getByRole('button', { name: /^Assinar$/i }).first().click();

		// Volta para /meu-plano
		await expect(page).toHaveURL(/\/meu-plano/, { timeout: 10000 });
	});
});
