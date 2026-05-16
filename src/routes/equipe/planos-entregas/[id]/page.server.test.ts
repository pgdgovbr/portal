import { load } from './+page.server';

const mockPlano = {
	id: '42',
	titulo: 'Plano Teste',
	status: 'ATIVO',
	dataInicio: '2025-01-01',
	dataFim: '2025-12-31',
	unidadeNome: 'Unidade X',
	entregas: [],
	timeline: []
};

function makeEvent(id = '42', token = 'fake-token') {
	return {
		params: { id },
		cookies: { get: vi.fn().mockReturnValue(token) }
	} as unknown as Parameters<typeof load>[0];
}

describe('+page.server planos-entregas/[id] — load', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('fetch resolve com planoEntregas → retorna { plano: mockPlano }', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () =>
				new Response(
					JSON.stringify({ data: { planoEntregas: mockPlano }, errors: null }),
					{ status: 200, headers: { 'Content-Type': 'application/json' } }
				)
			)
		);

		const result = await load(makeEvent());
		expect(result).toEqual({ plano: mockPlano });
	});

	it('planoEntregas null na resposta → lança error com status 404', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () =>
				new Response(
					JSON.stringify({ data: { planoEntregas: null }, errors: null }),
					{ status: 200, headers: { 'Content-Type': 'application/json' } }
				)
			)
		);

		await expect(load(makeEvent())).rejects.toMatchObject({ status: 404 });
	});

	it('fetch lança erro (HTTP 500) → retorna { plano: null } (catch fallback)', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () =>
				new Response('Internal Server Error', { status: 500 })
			)
		);

		const result = await load(makeEvent());
		expect(result).toEqual({ plano: null });
	});
});
