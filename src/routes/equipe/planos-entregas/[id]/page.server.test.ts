import { load } from './+page.server';

// Raw data as backend returns (backend field names)
const rawPe = {
	id: '42',
	idPlanoEntregas: 'PE-2025-001',
	status: 2, // AGUARDANDO_APROVACAO
	dataInicio: '2025-01-01',
	dataTermino: '2025-12-31',
	avaliacao: null,
	dataAvaliacao: null,
	codUnidadeAutorizadora: 100,
	codUnidadeInstituidora: 200,
	codUnidadeExecutora: 300,
};

// Expected plano shape after load() transforms
const expectedPlano = {
	...rawPe,
	status: 'AGUARDANDO_APROVACAO',
	titulo: 'PE-2025-001',
	dataFim: '2025-12-31',
	unidadeNome: 'Unidade 300',
	entregas: [],
	timeline: [],
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

	it('fetch resolve com planoEntregas → retorna { plano } com campos transformados', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () =>
				new Response(
					JSON.stringify({ data: { planoEntregas: rawPe }, errors: null }),
					{ status: 200, headers: { 'Content-Type': 'application/json' } }
				)
			)
		);

		const result = await load(makeEvent());
		expect(result).toEqual({ plano: expectedPlano });
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
