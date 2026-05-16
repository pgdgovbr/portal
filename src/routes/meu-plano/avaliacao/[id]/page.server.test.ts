import { load } from './+page.server';

const mockRegistro = {
	id: '42',
	status: 'ENVIADO',
	periodoInicio: '2025-01-01',
	periodoFim: '2025-01-31',
	descricaoAtividades: 'Atividade A',
	ocorrencias: null,
	dataEnvio: '2025-02-01',
	avaliacoes: [],
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

	it('fetch resolves with registro → returns { registro: mockRegistro }', async () => {
		makeFetchWith({ registroExecucao: mockRegistro });

		const result = await load(makeEvent());

		expect(result).toEqual({ registro: mockRegistro });
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
