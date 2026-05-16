import { load } from './+page.server';

const mockPainel = {
	totalPlanosEnviados: 10,
	totalPlanos: 20,
	ultimaSincronizacao: '2025-05-01T10:00:00Z',
	erros: [],
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

describe('+page.server — load (conformidade)', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('with painel data → returns { painel: mockPainel }', async () => {
		makeFetchWith({ painelConformidade: mockPainel });

		const result = await load(makeEvent());

		expect(result).toEqual({ painel: mockPainel });
	});

	it('fetch throws → returns { painel: null }', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

		const result = await load(makeEvent());

		expect(result).toEqual({ painel: null });
	});
});
