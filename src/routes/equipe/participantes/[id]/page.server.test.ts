import { load } from './+page.server';

const mockParticipante = {
	id: '42',
	nome: 'Maria Souza',
	siape: '654321',
	cpf: '000.000.000-00',
	email: 'maria@gov.br',
	cargo: 'Analista',
	unidadeNome: 'Unidade Y',
	modalidadeExecucao: 'TELETRABALHO',
	chefiaImediata: null,
	planosTrabalho: [],
	afastamentos: []
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

	it('fetch resolve com participante → retorna { participante: mockParticipante }', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () =>
				new Response(
					JSON.stringify({ data: { participante: mockParticipante }, errors: null }),
					{ status: 200, headers: { 'Content-Type': 'application/json' } }
				)
			)
		);

		const result = await load(makeEvent());
		expect(result).toEqual({ participante: mockParticipante });
	});

	it('participante null na resposta → lança error com status 404', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () =>
				new Response(
					JSON.stringify({ data: { participante: null }, errors: null }),
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
