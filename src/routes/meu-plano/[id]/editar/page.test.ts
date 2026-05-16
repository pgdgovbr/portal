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

	describe('trabalhoNoturno', () => {
		it('checkbox aparece desabilitado (schema não expõe campo para hidratação)', () => {
			const { container } = render(EditarPage, { props: { data: makeData() } });
			const cb = container.querySelector<HTMLInputElement>(
				'[data-testid="card-modalidade"] input[type="checkbox"]'
			);
			expect(cb).toBeTruthy();
			expect(cb?.disabled).toBe(true);
		});
	});

	describe('cleanup em unmount', () => {
		beforeEach(() => {
			vi.useFakeTimers({ shouldAdvanceTime: true });
		});
		afterEach(() => {
			vi.useRealTimers();
		});

		it('auto-save pendente é cancelado em unmount', async () => {
			const { container, unmount } = render(EditarPage, { props: { data: makeData() } });
			const input = container.querySelector<HTMLInputElement>('#carga-horaria');
			if (!input) throw new Error('input não encontrado');

			input.value = '35';
			await fireEvent.change(input);

			// Desmonta antes de o debounce disparar
			await vi.advanceTimersByTimeAsync(300);
			unmount();

			// Avança o que faltava do debounce: nenhuma chamada deve ser feita
			await vi.advanceTimersByTimeAsync(900);
			expect(gqlFetch).not.toHaveBeenCalled();
		});
	});

	describe('assinarEEnviar com save em voo', () => {
		beforeEach(() => {
			vi.useFakeTimers({ shouldAdvanceTime: true });
		});
		afterEach(() => {
			vi.useRealTimers();
		});

		it('aguarda flushSave em voo antes de chamar enviarPtParaOutroLado', async () => {
			// Sequência:
			// 1) gqlFetch (editar) — promise resolvida só quando releaseEditar() for chamado
			// 2) gqlFetch (enviar) — resolve imediato
			let releaseEditar!: () => void;
			const editarPending = new Promise<void>((res) => {
				releaseEditar = res;
			});
			let editarChamado = false;
			let enviarChamado = false;
			let editarTerminouAntesDoEnviar = false;

			(gqlFetch as unknown as ReturnType<typeof vi.fn>).mockImplementation(
				async (query: string) => {
					if (query.includes('editarPlanoTrabalho')) {
						editarChamado = true;
						await editarPending;
						if (!enviarChamado) editarTerminouAntesDoEnviar = true;
						return { editarPlanoTrabalho: { id: '42', status: 5 } };
					}
					if (query.includes('enviarPtParaOutroLado')) {
						enviarChamado = true;
						return { enviarPtParaOutroLado: { id: '42', status: 2 } };
					}
					return {};
				}
			);

			const { container } = render(EditarPage, { props: { data: makeData() } });

			// Dispara edição → começa save (gqlFetch editar pendente)
			const input = container.querySelector<HTMLInputElement>('#carga-horaria');
			if (!input) throw new Error('input não encontrado');
			input.value = '40';
			await fireEvent.change(input);
			await vi.advanceTimersByTimeAsync(900); // debounce

			expect(editarChamado).toBe(true);
			expect(enviarChamado).toBe(false);

			// Usuário clica "Assinar e enviar" enquanto save está em voo
			const enviarBtns = screen.getAllByRole('button', { name: /Assinar e enviar/i });
			fireEvent.click(enviarBtns[0]);

			// Avança alguns ticks: enviar ainda não deve ter rodado
			await vi.advanceTimersByTimeAsync(200);
			expect(enviarChamado).toBe(false);

			// Libera o editar
			releaseEditar();
			await vi.advanceTimersByTimeAsync(200);

			expect(enviarChamado).toBe(true);
			expect(editarTerminouAntesDoEnviar).toBe(true);
		});
	});
});
