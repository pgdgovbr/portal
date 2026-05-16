import { load } from './+page.server';

const mockP = {
	id: '1',
	nome: 'Maria Silva',
	siape: '1234567',
	email: 'maria@gov.br',
	cpf: '000.000.000-00',
	modalidadeExecucao: 'TELETRABALHO',
	planosTrabalho: [],
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

function makeEvent() {
	return {
		cookies: { get: vi.fn().mockReturnValue('fake-token') },
	} as unknown as Parameters<typeof load>[0];
}

describe('+page.server — load (admin/participantes)', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('with participants → returns { participantes: [mockP] }', async () => {
		makeFetchWith({ listarParticipantes: [mockP] });

		const result = await load(makeEvent());

		expect(result).toEqual({ participantes: [mockP] });
	});

	it('empty list → returns { participantes: [] }', async () => {
		makeFetchWith({ listarParticipantes: [] });

		const result = await load(makeEvent());

		expect(result).toEqual({ participantes: [] });
	});

	it('fetch throws → returns { participantes: [] }', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

		const result = await load(makeEvent());

		expect(result).toEqual({ participantes: [] });
	});
});
