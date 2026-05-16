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

const mockPlano = {
	id: '99',
	status: 'APROVADO',
	dataInicio: '2024-01-01',
	dataFim: '2024-12-31',
	totalHorasDisponiveis: 160,
	modalidade: 'TELETRABALHO_PARCIAL',
	unidadeAutorizadoraNome: 'SEGES',
	criteriosAvaliacao: 'Critério X',
	participante: { id: '1', nome: 'João Silva', siape: '123456', email: 'joao@gov.br' },
	contribuicoes: [],
};

describe('+page.server (planos-trabalho/[id]) — load', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('plano encontrado → retorna { plano: mockPlano }', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () =>
				new Response(
					JSON.stringify({ data: { planoTrabalho: mockPlano }, errors: null }),
					{ status: 200, headers: { 'Content-Type': 'application/json' } }
				)
			)
		);

		const result = await load(makeLoadEvent('99', 'fake-token'));
		expect(result).toEqual({ plano: mockPlano });
	});

	it('planoTrabalho null → lança error 404', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () =>
				new Response(
					JSON.stringify({ data: { planoTrabalho: null }, errors: null }),
					{ status: 200, headers: { 'Content-Type': 'application/json' } }
				)
			)
		);

		await expect(load(makeLoadEvent('999', 'fake-token'))).rejects.toMatchObject({
			status: 404,
		});
	});

	it('gqlFetch lança erro (HTTP 500) → lança error 500', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () =>
				new Response('Internal Server Error', { status: 500 })
			)
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
			vi.fn(async () =>
				new Response('Internal Server Error', { status: 500 })
			)
		);

		await expect(load(makeLoadEvent('99', undefined))).rejects.toMatchObject({
			status: 500,
		});
	});

	it('sem token mas plano acessível → retorna { plano }', async () => {
		const fetchMock = vi.fn(async () =>
			new Response(
				JSON.stringify({ data: { planoTrabalho: mockPlano }, errors: null }),
				{ status: 200, headers: { 'Content-Type': 'application/json' } }
			)
		);
		vi.stubGlobal('fetch', fetchMock);

		const result = await load(makeLoadEvent('99', undefined));

		// No Cookie header should be set (no token)
		const callArgs = fetchMock.mock.calls[0] as unknown[];
		const headers = (callArgs[1] as RequestInit).headers as Record<string, string>;
		expect(headers['Cookie']).toBeUndefined();

		expect(result).toEqual({ plano: mockPlano });
	});
});
