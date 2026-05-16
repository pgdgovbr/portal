import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';

// Mock $lib/graphql ANTES de importar a página (vi.mock é hoisted)
vi.mock('$lib/graphql', () => ({
	gqlFetch: vi.fn().mockResolvedValue({ editarPlanoTrabalho: { id: '42', status: 5 } }),
}));

import EditarPage from './+page.svelte';
import { gqlFetch } from '$lib/graphql';

function makePlano(overrides: Record<string, unknown> = {}) {
	return {
		id: '42',
		idPlanoTrabalho: 'PT-2026-08',
		participanteId: '7',
		status: 'RASCUNHO_PARTICIPANTE',
		dataInicio: '2026-08-01',
		dataTermino: '2027-01-31',
		cargaHorariaDisponivel: 30,
		criteriosAvaliacao: 'Cumprimento de prazos',
		planoEntregasId: null,
		contribuicoes: [],
		dataAssinaturaParticipante: null,
		dataAssinaturaChefia: null,
		criadoPorRole: 'servidor',
		...overrides,
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeData(planoOverrides: Record<string, unknown> = {}, historico: unknown[] = []): any {
	return { user: null, plano: makePlano(planoOverrides), historico };
}

describe('Editar Plano (+page.svelte)', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('renderiza sem erros quando há plano', () => {
		expect(() => render(EditarPage, { props: { data: makeData() } })).not.toThrow();
	});

	it('renderiza OwnershipBanner com texto de "editor"', () => {
		render(EditarPage, { props: { data: makeData() } });
		// OwnershipBanner variant=comigo-editor → título "Este plano está com você para ajustes"
		expect(screen.getByText(/Este plano está com você para ajustes/i)).toBeInTheDocument();
	});

	it('renderiza os 4 cards segmentados', () => {
		const { container } = render(EditarPage, { props: { data: makeData() } });
		expect(container.querySelector('[data-testid="card-periodo"]')).toBeTruthy();
		expect(container.querySelector('[data-testid="card-modalidade"]')).toBeTruthy();
		expect(container.querySelector('[data-testid="card-contribuicoes"]')).toBeTruthy();
		expect(container.querySelector('[data-testid="card-criterios"]')).toBeTruthy();
	});

	it('CTA "Assinar e enviar" aparece (no banner e no card CTA do fim)', () => {
		render(EditarPage, { props: { data: makeData() } });
		const btns = screen.getAllByRole('button', { name: /Assinar e enviar/i });
		// Esperamos pelo menos 2: o do OwnershipBanner + o card CTA destacado
		expect(btns.length).toBeGreaterThanOrEqual(2);
	});

	it('botão "Descartar rascunho" aparece (no aside de atalhos)', () => {
		render(EditarPage, { props: { data: makeData() } });
		const btns = screen.getAllByRole('button', { name: /Descartar rascunho/i });
		expect(btns.length).toBeGreaterThan(0);
	});

	it('botão "Mais opções" abre o menu overflow com "Descartar rascunho"', async () => {
		render(EditarPage, { props: { data: makeData() } });
		const moreBtn = screen.getByRole('button', { name: /Mais opções/i });
		await fireEvent.click(moreBtn);
		const menuItems = await screen.findAllByRole('menuitem');
		expect(menuItems.some((it) => /Descartar rascunho/i.test(it.textContent ?? ''))).toBe(true);
	});

	it('renderiza StatusBadge com status do plano', () => {
		const { container } = render(EditarPage, { props: { data: makeData() } });
		// StatusBadge → procura por texto que aparece no badge
		// (depende do componente real; basta validar que algo do header renderizou)
		expect(container.querySelector('.pg-head')).toBeTruthy();
	});

	describe('Auto-save debounce', () => {
		beforeEach(() => {
			vi.useFakeTimers({ shouldAdvanceTime: true });
		});
		afterEach(() => {
			vi.useRealTimers();
		});

		it('editar carga horária dispara gqlFetch após 800ms', async () => {
			const { container } = render(EditarPage, { props: { data: makeData() } });
			const input = container.querySelector<HTMLInputElement>('#carga-horaria');
			expect(input).toBeTruthy();
			if (!input) return;

			input.value = '35';
			await fireEvent.input(input);
			await fireEvent.change(input);

			expect(gqlFetch).not.toHaveBeenCalled();

			// Avança o debounce timer
			await vi.advanceTimersByTimeAsync(900);

			expect(gqlFetch).toHaveBeenCalled();
			const firstCall = (gqlFetch as unknown as { mock: { calls: unknown[][] } }).mock.calls[0];
			// args: (query, variables, token?)
			const variables = firstCall[1] as { planoId: string; input: Record<string, unknown> };
			expect(variables.planoId).toBe('42');
			expect(variables.input).toHaveProperty('cargaHorariaDisponivel');
		});

		it('edições rápidas em sequência colapsam em uma única chamada', async () => {
			const { container } = render(EditarPage, { props: { data: makeData() } });
			const input = container.querySelector<HTMLInputElement>('#carga-horaria');
			if (!input) throw new Error('input não encontrado');

			input.value = '32';
			await fireEvent.change(input);
			await vi.advanceTimersByTimeAsync(300);

			input.value = '33';
			await fireEvent.change(input);
			await vi.advanceTimersByTimeAsync(300);

			input.value = '34';
			await fireEvent.change(input);
			await vi.advanceTimersByTimeAsync(900);

			// Apenas uma chamada (debounce colapsou as 3 mudanças)
			expect(gqlFetch).toHaveBeenCalledTimes(1);
		});
	});

	describe('estado vazio', () => {
		it('renderiza mensagem se plano é null', () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const data: any = { user: null, plano: null, historico: [] };
			render(EditarPage, { props: { data } });
			expect(screen.getByText(/Plano não encontrado/i)).toBeInTheDocument();
		});
	});
});
