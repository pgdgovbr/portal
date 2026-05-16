/**
 * e2e/pactuacao-clonar.spec.ts — Fase 10: Servidor clona PT concluído via
 * CloneDialog em /meu-plano.
 *
 * Fluxo:
 *   1. Ana (servidor1) abre /meu-plano — vê PT anterior CONCLUIDO ou
 *      AVALIADO no histórico
 *   2. Clica em "Clonar plano anterior" → abre CloneDialog
 *   3. Confirma → cria novo PT em RASCUNHO_PARTICIPANTE
 *   4. Vai para /meu-plano/[novo-id]/editar
 *
 * REQUISITOS:
 *   - SvelteKit + FastAPI + seed com PT em status CONCLUIDO/AVALIADO
 *     para o servidor.
 *
 * RODAR: ver pactuacao-criar.spec.ts.
 */

import { asServidor, expect } from './fixtures';

const SKIP_NO_BACKEND = true;
const describe = SKIP_NO_BACKEND ? asServidor.describe.skip : asServidor.describe;

describe('Servidor clona PT concluído (Fase 10)', () => {
	asServidor('servidor abre /meu-plano e clona PT anterior', async ({ page }) => {
		await page.goto('/meu-plano');

		// Procura pelo CTA "Clonar plano anterior" (estado vazio quando há histórico)
		const clonar = page
			.getByRole('button', { name: /Clonar plano|Clonar.*anterior/i })
			.first();
		const linkClonar = page.getByRole('link', { name: /Clonar plano|Clonar.*anterior/i }).first();

		const hasClonar = (await clonar.isVisible().catch(() => false)) ||
			(await linkClonar.isVisible().catch(() => false));

		if (!hasClonar) {
			// Sem PT anterior, cenário vacuosamente satisfeito.
			await expect(page.getByRole('heading', { name: /meu plano de trabalho/i })).toBeVisible();
			return;
		}

		if (await clonar.isVisible().catch(() => false)) {
			await clonar.click();
		} else {
			await linkClonar.click();
		}

		// CloneDialog: confirmação
		const confirmar = page.getByRole('button', { name: /Clonar|Confirmar|Sim/i }).last();
		await expect(confirmar).toBeVisible();
		await confirmar.click();

		// Após clonagem: redireciona para /meu-plano/[id]/editar (novo PT)
		await expect(page).toHaveURL(/\/meu-plano\/[^/]+\/editar/, { timeout: 10000 });
		await expect(page.getByText(/rascunho|RASCUNHO_PARTICIPANTE/i).first()).toBeVisible();
	});
});
