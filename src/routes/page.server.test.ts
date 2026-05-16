import { load } from './+page.server';

const mockPlan = {
	id: '1',
	status: 'ATIVO',
	dataInicio: '2025-01-01',
	dataFim: '2025-12-31',
	modalidade: 'TELETRABALHO',
	totalHorasDisponiveis: 200,
	unidadeAutorizadoraNome: 'SEGES',
	participante: { id: '42', nome: 'Maria Silva', siape: '1234567' },
	contribuicoes: [],
};

// Backend returns matriculaSiape; load() adds siape alias and planosTrabalho
const mockUserInput = { id: '99', nome: 'João Gestor', matriculaSiape: '7654321' };
const mockUserOutput = { ...mockUserInput, siape: '7654321', planosTrabalho: [] };

function makeCookies(token = 'fake-token') {
	return { get: vi.fn().mockReturnValue(token) };
}

function makeEvent(userOverride?: unknown) {
	return {
		cookies: makeCookies(),
		parent: vi.fn().mockResolvedValue({ user: userOverride }),
	} as unknown as Parameters<typeof load>[0];
}

function mockFetchWith(data: Record<string, unknown>) {
	vi.stubGlobal(
		'fetch',
		vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ data, errors: null }),
		})
	);
}

describe('+page.server — load (dashboard)', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('servidor role: returns planosTrabalho and notificacoes', async () => {
		// Workflow novo usa meusPlanosTrabalho com status int
		const backendPt = {
			id: '1',
			status: 3,
			dataInicio: '2025-01-01',
			dataTermino: '2025-12-31',
			cargaHorariaDisponivel: 200,
			contribuicoes: [],
			avaliacoes: [],
		};
		mockFetchWith({ meusPlanosTrabalho: [backendPt], minhasNotificacoes: [] });

		const result: any = await load(makeEvent({ role: 'servidor', id: '1', nome: 'Maria' }));

		expect(result.planosTrabalho).toHaveLength(1);
		expect(result.planosTrabalho[0].status).toBe('EM_EXECUCAO');
		expect(result.notificacoes).toEqual([]);
	});

	it('servidor role: gqlFetch throws → returns {}', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockRejectedValue(new Error('Network error'))
		);

		const result = await load(makeEvent({ role: 'servidor', id: '1', nome: 'Maria' }));

		expect(result).toEqual({});
	});

	it('chefe_imediato role: returns participantes and avaliacoesPendentes', async () => {
		mockFetchWith({ listarParticipantes: [mockUserInput], listarPlanosTrabalho: [] });

		const result = await load(makeEvent({ role: 'chefe_imediato', id: '2', nome: 'Carlos' }));

		expect(result).toEqual({ participantes: [mockUserOutput], avaliacoesPendentes: [] });
	});

	it('no user (not logged in) → returns {}', async () => {
		const result = await load(makeEvent(null));

		expect(result).toEqual({});
	});

	it('gestor_unidade role (unrecognised) → returns {}', async () => {
		// fetch should not even be called, but stub it to avoid accidental network calls
		vi.stubGlobal('fetch', vi.fn());

		const result = await load(makeEvent({ role: 'gestor_unidade', id: '3', nome: 'Ana' }));

		expect(result).toEqual({});
	});
});
