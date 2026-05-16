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

const mockErro = {
	id: '42',
	httpStatus: 500,
	mensagem: 'Timeout',
	criadoEm: '2026-05-01T10:00:00',
	tentativas: 3,
	planoTrabalho: {
		id: '1',
		participante: { nome: 'Ana', siape: '123' },
	},
};

describe('+page.server (conformidade/erro/[id]) — load', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('fetch resolves with erro data → returns { erro: mockErro }', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () =>
				new Response(
					JSON.stringify({ data: { erroDeSincronizacao: mockErro }, errors: null }),
					{ status: 200, headers: { 'Content-Type': 'application/json' } }
				)
			)
		);

		const result = await load(makeLoadEvent('42', 'fake-token'));
		expect(result).toEqual({ erro: mockErro });
	});

	it('erroDeSincronizacao null → throws error with { status: 404 }', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () =>
				new Response(
					JSON.stringify({ data: { erroDeSincronizacao: null }, errors: null }),
					{ status: 200, headers: { 'Content-Type': 'application/json' } }
				)
			)
		);

		await expect(load(makeLoadEvent('999', 'fake-token'))).rejects.toMatchObject({
			status: 404,
		});
	});

	it('fetch throws → returns { erro: null }', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

		const result = await load(makeLoadEvent('42', 'fake-token'));
		expect(result).toEqual({ erro: null });
	});
});
