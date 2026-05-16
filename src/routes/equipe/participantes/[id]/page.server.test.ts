import { load } from './+page.server';

// Raw data as backend returns (backend field names only)
const rawParticipante = {
	id: '42',
	nome: 'Maria Souza',
	matriculaSiape: '654321',
	email: 'maria@gov.br',
	modalidadeExecucao: 1,
	situacao: 1,
	tipoVinculo: 'SERVIDOR_EFETIVO',
	codUnidadeAutorizadora: 100,
	codUnidadeLotacao: 200,
	dataAssinaturaTcr: '2024-01-01',
};

// Expected shape after load() transforms
const expectedParticipante = {
	...rawParticipante,
	siape: '654321',
	planosTrabalho: [],
	afastamentos: [],
};

function makeEvent(id = '42', token = 'fake-token') {
	return {
		params: { id },
		cookies: { get: vi.fn().mockReturnValue(token) }
	} as unknown as Parameters<typeof load>[0];
}

describe('+page.server participantes/[id] — load', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('fetch resolve com participante → retorna { participante } com campos transformados', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () =>
				new Response(
					JSON.stringify({ data: { participante: rawParticipante, listarPlanosTrabalho: [] }, errors: null }),
					{ status: 200, headers: { 'Content-Type': 'application/json' } }
				)
			)
		);

		const result = await load(makeEvent());
		expect(result).toEqual({ participante: expectedParticipante });
	});

	it('participante null na resposta → lança error com status 404', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () =>
				new Response(
					JSON.stringify({ data: { participante: null, listarPlanosTrabalho: [] }, errors: null }),
					{ status: 200, headers: { 'Content-Type': 'application/json' } }
				)
			)
		);

		await expect(load(makeEvent())).rejects.toMatchObject({ status: 404 });
	});

	it('fetch lança erro (HTTP 500) → retorna { participante: null } (catch fallback)', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () =>
				new Response('Internal Server Error', { status: 500 })
			)
		);

		const result = await load(makeEvent());
		expect(result).toEqual({ participante: null });
	});
});
