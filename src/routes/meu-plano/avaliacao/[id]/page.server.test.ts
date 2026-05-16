import { load } from './+page.server';

// Backend retorna ARE (flat) — o server map para o shape do componente
const mockBackendARE = {
	id: '42',
	idPeriodoAvaliativo: 'ARE-001',
	dataInicioPeriodoAvaliativo: '2025-01-01',
	dataFimPeriodoAvaliativo: '2025-01-31',
	descricaoExecucao: 'Atividade A',
	ocorrencias: null,
	dataRegistroParticipante: '2025-02-01',
	avaliacaoRegistrosExecucao: null,
	dataAvaliacaoRegistrosExecucao: null,
	avaliacaoJustificativa: null,
	statusRecurso: null,
	recursoTexto: null,
	recursoData: null,
	recursoDecisao: null,
	recursoDecisaoJustificativa: null,
	recursoDecisaoData: null,
};

function makeFetchWith(data: Record<string, unknown>) {
	vi.stubGlobal(
		'fetch',
		vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ data, errors: null }),
		})
	);
}

function makeEvent(id = '42') {
	return {
		params: { id },
		cookies: { get: vi.fn().mockReturnValue('fake-token') },
	} as unknown as Parameters<typeof load>[0];
}

describe('+page.server — load (avaliacao [id])', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('fetch resolves with registro → returns shape mapeado para componente', async () => {
		makeFetchWith({ registroExecucao: mockBackendARE });

		const result: any = await load(makeEvent());

		expect(result.registro).toBeTruthy();
		expect(result.registro.id).toBe('42');
		expect(result.registro.periodoInicio).toBe('2025-01-01');
		expect(result.registro.descricaoAtividades).toBe('Atividade A');
		expect(result.registro.dataEnvio).toBe('2025-02-01');
	});

	it('fetch throws → returns { registro: null }', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

		const result = await load(makeEvent());

		expect(result).toEqual({ registro: null });
	});

	it('registroExecucao is null in response → returns { registro: null }', async () => {
		makeFetchWith({ registroExecucao: null });

		const result = await load(makeEvent());

		expect(result).toEqual({ registro: null });
	});
});
