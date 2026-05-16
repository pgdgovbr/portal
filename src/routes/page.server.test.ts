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
		expect(result.aguardandoMinhaAcao).toEqual([]);
	});

	it('servidor role: PT em AGUARDANDO_ASSINATURA_PARTICIPANTE aparece em aguardandoMinhaAcao', async () => {
		const backendPt = {
			id: 'pt-99',
			idPlanoTrabalho: 'PT-2026-99',
			status: 7, // AGUARDANDO_ASSINATURA_PARTICIPANTE
			dataInicio: '2025-01-01',
			dataTermino: '2025-12-31',
			cargaHorariaDisponivel: 200,
			contribuicoes: [],
			avaliacoes: [],
		};
		mockFetchWith({ meusPlanosTrabalho: [backendPt], minhasNotificacoes: [] });

		const result: any = await load(makeEvent({ role: 'servidor', id: '1', nome: 'Maria' }));
		expect(result.aguardandoMinhaAcao).toHaveLength(1);
		expect(result.aguardandoMinhaAcao[0].id).toBe('pt-99');
		expect(result.aguardandoMinhaAcao[0].href).toBe('/meu-plano/pt-99/revisar');
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

		expect(result).toEqual({
			participantes: [mockUserOutput],
			avaliacoesPendentes: [],
			aguardandoMinhaAcao: []
		});
	});

	it('chefe_imediato role: PT em AGUARDANDO_ASSINATURA_CHEFIA aparece em aguardandoMinhaAcao', async () => {
		const pl = {
			id: 'pt-77',
			idPlanoTrabalho: 'PT-2026-77',
			participanteId: '99',
			status: 2, // AGUARDANDO_ASSINATURA_CHEFIA
			dataTermino: '2026-12-31'
		};
		mockFetchWith({
			listarParticipantes: [mockUserInput],
			listarPlanosTrabalho: [pl]
		});

		const result: any = await load(
			makeEvent({ role: 'chefe_imediato', id: '2', nome: 'Carlos' })
		);
		expect(result.aguardandoMinhaAcao).toHaveLength(1);
		expect(result.aguardandoMinhaAcao[0].id).toBe('pt-77');
		expect(result.aguardandoMinhaAcao[0].participanteNome).toBe('João Gestor');
		expect(result.aguardandoMinhaAcao[0].href).toBe('/equipe/planos-trabalho/pt-77/revisar');
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
