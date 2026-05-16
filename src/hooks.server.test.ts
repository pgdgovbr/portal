import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handle } from './hooks.server';

// SvelteKit redirect() throws a special object with a `status` property.
// We detect a redirect by catching the thrown value and checking its status.

function makeCookies(token?: string) {
	return {
		get: (key: string) => (key === 'access_token' ? token ?? null : null),
	};
}

function makeEvent(path: string, token?: string) {
	return {
		cookies: makeCookies(token),
		url: new URL(`http://localhost${path}`),
		request: new Request(`http://localhost${path}`),
		locals: {},
		params: {},
		route: { id: path },
		platform: undefined,
		isDataRequest: false,
		isSubRequest: false,
	} as unknown as Parameters<typeof handle>[0]['event'];
}

describe('hooks.server — handle', () => {
	const resolve = vi.fn(async (event: unknown) => new Response('ok'));

	beforeEach(() => {
		resolve.mockClear();
	});

	it('sem access_token e path / → redireciona para /auth/login/google', async () => {
		const event = makeEvent('/', undefined);
		await expect(handle({ event, resolve })).rejects.toMatchObject({ status: 302 });
		expect(resolve).not.toHaveBeenCalled();
	});

	it('sem access_token mas path começa com /auth → chama resolve (sem redirect)', async () => {
		const event = makeEvent('/auth/callback', undefined);
		const result = await handle({ event, resolve });
		expect(resolve).toHaveBeenCalledWith(event);
		expect(result).toBeDefined();
	});

	it('com access_token → chama resolve (sem redirect)', async () => {
		const event = makeEvent('/', 'valid-token-abc');
		const result = await handle({ event, resolve });
		expect(resolve).toHaveBeenCalledWith(event);
		expect(result).toBeDefined();
	});
});
