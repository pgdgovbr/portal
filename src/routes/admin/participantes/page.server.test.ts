import { load } from './+page.server';

// Raw data as backend returns (backend field names only)
const mockPInput = {
	id: '1',
	nome: 'Maria Silva',
	matriculaSiape: '1234567',
	email: 'maria@gov.br',
	modalidadeExecucao: 1,
	situacao: 1,
};
// Expected output after load() adds siape alias and planosTrabalho
const mockPOutput = { ...mockPInput, siape: '1234567', planosTrabalho: [] };

function makeFetchWith(data: Record<string, unknown>) {
	vi.stubGlobal(
		'fetch',
		vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ data, errors: null }),
		})
	);
}

function makeEvent() {
	return {
		cookies: { get: vi.fn().mockReturnValue('fake-token') },
	} as unknown as Parameters<typeof load>[0];
}

describe('+page.server — load (admin/participantes)', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('with participants → returns { participantes } with siape and planosTrabalho', async () => {
		makeFetchWith({ listarParticipantes: [mockPInput], listarPlanosTrabalho: [] });

		const result = await load(makeEvent());

		expect(result).toEqual({ participantes: [mockPOutput] });
	});

	it('empty list → returns { participantes: [] }', async () => {
		makeFetchWith({ listarParticipantes: [], listarPlanosTrabalho: [] });

		const result = await load(makeEvent());

		expect(result).toEqual({ participantes: [] });
	});

	it('fetch throws → returns { participantes: [] }', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

		const result = await load(makeEvent());

		expect(result).toEqual({ participantes: [] });
	});
});
