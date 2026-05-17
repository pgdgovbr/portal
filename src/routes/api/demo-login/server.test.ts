import { describe, it, expect, vi } from 'vitest';
import { GET } from './+server';

function makeEvent({
	email,
	name,
	role,
	fetchImpl,
}: {
	email?: string;
	name?: string;
	role?: string;
	fetchImpl?: typeof fetch;
}) {
	const params = new URLSearchParams();
	if (email) params.set('email', email);
	if (name) params.set('name', name);
	if (role) params.set('role', role);
	const url = new URL(`http://localhost/api/demo-login?${params}`);
	return {
		url,
		cookies: {
			set: vi.fn(),
		},
		fetch: fetchImpl ?? vi.fn(),
	} as unknown as Parameters<typeof GET>[0];
}

describe('GET /api/demo-login', () => {
	it('400 quando faltam email/role', async () => {
		await expect(GET(makeEvent({}))).rejects.toMatchObject({ status: 400 });
	});

	it('503 se backend lança exception', async () => {
		const fetchImpl = vi.fn(async () => {
			throw new Error('ECONNREFUSED');
		}) as unknown as typeof fetch;
		await expect(
			GET(makeEvent({ email: 'a@x.gov.br', role: 'servidor', fetchImpl }))
		).rejects.toMatchObject({ status: 503 });
	});

	it('repassa 403 quando backend bloqueia em produção', async () => {
		const fetchImpl = vi.fn(async () =>
			new Response('Não disponível em produção', { status: 403 })
		) as unknown as typeof fetch;
		await expect(
			GET(makeEvent({ email: 'a@x.gov.br', role: 'servidor', fetchImpl }))
		).rejects.toMatchObject({ status: 403 });
	});

	it('happy path: seta cookie e redireciona 303 para /app', async () => {
		const fetchImpl = vi.fn(async () =>
			new Response(JSON.stringify({ ok: true, token: 'jwt-fake' }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			})
		) as unknown as typeof fetch;
		const ev = makeEvent({ email: 'a@x.gov.br', name: 'Ana', role: 'servidor', fetchImpl });
		let thrown: unknown;
		try {
			await GET(ev);
		} catch (e) {
			thrown = e;
		}
		expect(thrown).toMatchObject({ status: 303, location: '/app' });
		expect((ev.cookies as unknown as { set: ReturnType<typeof vi.fn> }).set).toHaveBeenCalledWith(
			'access_token',
			'jwt-fake',
			expect.objectContaining({
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
			})
		);
	});

	it('502 se backend retorna 200 sem token', async () => {
		const fetchImpl = vi.fn(async () =>
			new Response(JSON.stringify({ ok: true }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			})
		) as unknown as typeof fetch;
		await expect(
			GET(makeEvent({ email: 'a@x.gov.br', role: 'servidor', fetchImpl }))
		).rejects.toMatchObject({ status: 502 });
	});
});
