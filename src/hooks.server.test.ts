import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handle } from './hooks.server';

// SvelteKit redirect() throws a special object with a `status` property.
// We detect a redirect by catching the thrown value and checking its status.

function makeCookies(token?: string) {
	return {
		get: (key: string) => (key === 'access_token' ? token ?? null : null),
		set: vi.fn(),
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

	it('sem access_token e path / → renderiza landing pública (sem redirect)', async () => {
		const event = makeEvent('/', undefined);
		const result = await handle({ event, resolve });
		expect(resolve).toHaveBeenCalledWith(event);
		expect(result).toBeDefined();
	});

	it('sem access_token e path /login → renderiza login (sem redirect)', async () => {
		const event = makeEvent('/login', undefined);
		const result = await handle({ event, resolve });
		expect(resolve).toHaveBeenCalledWith(event);
		expect(result).toBeDefined();
	});

	it('sem access_token e path /api/demo-login → permite (sem redirect)', async () => {
		const event = makeEvent('/api/demo-login?email=foo@x.gov.br', undefined);
		const result = await handle({ event, resolve });
		expect(resolve).toHaveBeenCalledWith(event);
		expect(result).toBeDefined();
	});

	it('sem access_token e path /meu-plano → redireciona para /login com ?next=', async () => {
		const event = makeEvent('/meu-plano', undefined);
		let thrown: unknown;
		try {
			await handle({ event, resolve });
		} catch (e) {
			thrown = e;
		}
		expect(thrown).toMatchObject({ status: 302 });
		expect((thrown as { location: string }).location).toContain('/login');
		expect((thrown as { location: string }).location).toContain(encodeURIComponent('/meu-plano'));
		expect(resolve).not.toHaveBeenCalled();
	});

	it('sem access_token e path /app → redireciona para /login com ?next=/app', async () => {
		const event = makeEvent('/app', undefined);
		let thrown: unknown;
		try {
			await handle({ event, resolve });
		} catch (e) {
			thrown = e;
		}
		expect(thrown).toMatchObject({ status: 302 });
		expect((thrown as { location: string }).location).toContain('/login');
		expect(resolve).not.toHaveBeenCalled();
	});

	it('sem access_token mas path começa com /auth → chama resolve (sem redirect)', async () => {
		const event = makeEvent('/auth/callback', undefined);
		const result = await handle({ event, resolve });
		expect(resolve).toHaveBeenCalledWith(event);
		expect(result).toBeDefined();
	});

	it('com access_token → chama resolve (sem redirect)', async () => {
		const event = makeEvent('/app', 'valid-token-abc');
		const result = await handle({ event, resolve });
		expect(resolve).toHaveBeenCalledWith(event);
		expect(result).toBeDefined();
	});

	it('?token na URL → seta cookie e redireciona para /app', async () => {
		const event = makeEvent('/?token=jwt-from-backend');
		let thrown: unknown;
		try {
			await handle({ event, resolve });
		} catch (e) {
			thrown = e;
		}
		expect(thrown).toMatchObject({ status: 302 });
		expect((thrown as { location: string }).location).toBe('/app');
		expect((event.cookies as unknown as ReturnType<typeof makeCookies>).set).toHaveBeenCalledWith(
			'access_token',
			'jwt-from-backend',
			expect.objectContaining({ httpOnly: true, path: '/' })
		);
		expect(resolve).not.toHaveBeenCalled();
	});
});
