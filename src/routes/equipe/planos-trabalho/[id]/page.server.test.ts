import { describe, it, expect, vi, afterEach } from 'vitest';
import { load } from './+page.server';

function makeCookies(token?: string) {
	return {
		get: (key: string) => (key === 'access_token' ? token ?? undefined : undefined),
	};
}

function makeLoadEvent(id: string, token?: string) {
	return {
		params: { id },
		cookies: makeCookies(token),
	} as unknown as Parameters<typeof load>[0];
}

// Raw data as backend returns (backend field names)
const rawPt = {
	id: '99',
	participanteId: '10',
	status: 3, // EM_EXECUCAO
	dataInicio: '2024-01-01',
	dataTermino: '2024-12-31',
	cargaHorariaDisponivel: 160,
	criteriosAvaliacao: 'Critério X',
	contribuicoes: [],
};
const rawParticipante = { id: '10', nome: 'João Silva', matriculaSiape: '123456', email: 'joao@gov.br' };

// Expected plano shape after load() transforms
const expectedPlano = {
	...rawPt,
	status: 'EM_EXECUCAO',
	dataFim: '2024-12-31',
	totalHorasDisponiveis: 160,
	modalidade: 'TELETRABALHO_PARCIAL',
	unidadeAutorizadoraNome: 'SEGES/MGI',
	contribuicoes: [],
	participante: { ...rawParticipante, siape: '123456' },
};

function mockFetch(ptData: unknown, participantes: unknown[] = [rawParticipante]) {
	return vi.fn(async () =>
		new Response(
			JSON.stringify({ data: { planoTrabalho: ptData, listarParticipantes: participantes }, errors: null }),
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		)
	);
}

describe('+page.server (planos-trabalho/[id]) — load', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('plano encontrado → retorna { plano } com campos transformados', async () => {
		vi.stubGlobal('fetch', mockFetch(rawPt));

		const result = await load(makeLoadEvent('99', 'fake-token'));
		expect(result).toEqual({ plano: expectedPlano });
	});

	it('planoTrabalho null → lança error 404', async () => {
		vi.stubGlobal('fetch', mockFetch(null, []));

		await expect(load(makeLoadEvent('999', 'fake-token'))).rejects.toMatchObject({
			status: 404,
		});
	});

	it('gqlFetch lança erro (HTTP 500) → lança error 500', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => new Response('Internal Server Error', { status: 500 }))
		);

		await expect(load(makeLoadEvent('99', 'fake-token'))).rejects.toMatchObject({
			status: 500,
		});
	});

	it('gqlFetch lança erro (GraphQL errors) → lança error 500', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () =>
				new Response(
					JSON.stringify({ data: null, errors: [{ message: 'Unauthorized' }] }),
					{ status: 200, headers: { 'Content-Type': 'application/json' } }
				)
			)
		);

		await expect(load(makeLoadEvent('99', 'fake-token'))).rejects.toMatchObject({
			status: 500,
		});
	});

	it('sem token → gqlFetch chamado sem Cookie header; lança 500 se falhar', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => new Response('Internal Server Error', { status: 500 }))
		);

		await expect(load(makeLoadEvent('99', undefined))).rejects.toMatchObject({
			status: 500,
		});
	});

	it('sem token mas plano acessível → retorna { plano }', async () => {
		const fetchMock = mockFetch(rawPt);
		vi.stubGlobal('fetch', fetchMock);

		const result = await load(makeLoadEvent('99', undefined));

		const callArgs = fetchMock.mock.calls[0] as unknown[];
		const headers = (callArgs[1] as RequestInit).headers as Record<string, string>;
		expect(headers['Cookie']).toBeUndefined();

		expect(result).toEqual({ plano: expectedPlano });
	});
});
