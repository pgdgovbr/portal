import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { load } from './+layout.server';

function makeCookies(token?: string) {
	return {
		get: (key: string) => (key === 'access_token' ? token ?? null : null),
	};
}

function makeLoadEvent(token?: string) {
	return {
		cookies: makeCookies(token),
		url: new URL('http://localhost/'),
	} as unknown as Parameters<typeof load>[0];
}

const mockUser = { id: '42', email: 'user@gov.br', name: 'Maria Silva', role: 'servidor' };

describe('+layout.server — load', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('sem token → retorna { user: null } sem redirect', async () => {
		const result = await load(makeLoadEvent(undefined));
		expect(result).toEqual({ user: null });
	});

	it('com token válido e GraphQL retorna usuário → retorna { user }', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () =>
				new Response(JSON.stringify({ data: { me: mockUser } }), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				})
			)
		);

		const result = await load(makeLoadEvent('valid-token'));
		expect(result).toEqual({ user: mockUser });
	});

	it('com token mas GraphQL retorna 500 → retorna user null (não redireciona)', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () =>
				new Response('Internal Server Error', {
					status: 500,
				})
			)
		);

		const result = await load(makeLoadEvent('valid-token'));
		expect(result).toEqual({ user: null });
	});

	it('com token mas GraphQL retorna { errors: [...] } → retorna user null', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () =>
				new Response(
					JSON.stringify({ data: null, errors: [{ message: 'Unauthorized' }] }),
					{
						status: 200,
						headers: { 'Content-Type': 'application/json' },
					}
				)
			)
		);

		const result = await load(makeLoadEvent('valid-token'));
		expect(result).toEqual({ user: null });
	});
});
