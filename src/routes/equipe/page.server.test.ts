import { describe, it, expect, vi, afterEach } from 'vitest';
import { load } from './+page.server';

function makeCookies(token?: string) {
	return {
		get: (key: string) => (key === 'access_token' ? token ?? undefined : undefined),
	};
}

function makeLoadEvent(token?: string) {
	return {
		cookies: makeCookies(token),
	} as unknown as Parameters<typeof load>[0];
}

const mockP = { id: '1', nome: 'João Silva', siape: '123456', email: 'joao@gov.br' };

describe('+page.server (equipe) — load', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('com participantes → retorna { participantes: [mockP] }', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () =>
				new Response(
					JSON.stringify({ data: { listarParticipantes: [mockP] }, errors: null }),
					{ status: 200, headers: { 'Content-Type': 'application/json' } }
				)
			)
		);

		const result = await load(makeLoadEvent('fake-token'));
		expect(result).toEqual({ participantes: [mockP] });
	});

	it('lista vazia → retorna { participantes: [] }', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () =>
				new Response(
					JSON.stringify({ data: { listarParticipantes: [] }, errors: null }),
					{ status: 200, headers: { 'Content-Type': 'application/json' } }
				)
			)
		);

		const result = await load(makeLoadEvent('fake-token'));
		expect(result).toEqual({ participantes: [] });
	});

	it('gqlFetch lança erro → retorna { participantes: [] } (catch fallback)', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () =>
				new Response('Internal Server Error', { status: 500 })
			)
		);

		const result = await load(makeLoadEvent('fake-token'));
		expect(result).toEqual({ participantes: [] });
	});

	it('sem token → gqlFetch chamado com undefined; retorna resultado do servidor', async () => {
		const fetchMock = vi.fn(async () =>
			new Response(
				JSON.stringify({ data: { listarParticipantes: [mockP] }, errors: null }),
				{ status: 200, headers: { 'Content-Type': 'application/json' } }
			)
		);
		vi.stubGlobal('fetch', fetchMock);

		const result = await load(makeLoadEvent(undefined));

		// fetch should have been called (gqlFetch did not crash)
		expect(fetchMock).toHaveBeenCalledOnce();

		// No Cookie header should have been set (no token)
		const callArgs = fetchMock.mock.calls[0] as unknown[];
		const headers = (callArgs[1] as RequestInit).headers as Record<string, string>;
		expect(headers['Cookie']).toBeUndefined();

		expect(result).toEqual({ participantes: [mockP] });
	});
});
