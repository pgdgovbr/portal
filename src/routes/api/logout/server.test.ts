import { describe, it, expect, vi } from 'vitest';
import { POST } from './+server';

function makeEvent(token: string | undefined, fetchImpl?: typeof fetch) {
	return {
		cookies: {
			get: vi.fn((key: string) => (key === 'access_token' ? token : undefined)),
			delete: vi.fn(),
		},
		fetch: fetchImpl ?? vi.fn(),
	} as unknown as Parameters<typeof POST>[0];
}

describe('POST /api/logout', () => {
	it('limpa cookie e redireciona 303 para / mesmo sem token', async () => {
		const ev = makeEvent(undefined);
		let thrown: unknown;
		try {
			await POST(ev);
		} catch (e) {
			thrown = e;
		}
		expect(thrown).toMatchObject({ status: 303, location: '/' });
		expect(
			(ev.cookies as unknown as { delete: ReturnType<typeof vi.fn> }).delete
		).toHaveBeenCalledWith('access_token', { path: '/' });
	});

	it('com token: avisa backend (best-effort) e limpa', async () => {
		const fetchImpl = vi.fn(async () => new Response('{"ok":true}', { status: 200 })) as
			unknown as typeof fetch;
		const ev = makeEvent('jwt-abc', fetchImpl);
		await expect(POST(ev)).rejects.toMatchObject({ status: 303, location: '/' });
		expect(fetchImpl).toHaveBeenCalledWith(
			expect.stringContaining('/auth/logout'),
			expect.objectContaining({
				method: 'POST',
				headers: { Cookie: 'access_token=jwt-abc' },
			})
		);
	});

	it('backend offline: ainda limpa cookie e redireciona', async () => {
		const fetchImpl = vi.fn(async () => {
			throw new Error('ECONNREFUSED');
		}) as unknown as typeof fetch;
		const ev = makeEvent('jwt-abc', fetchImpl);
		await expect(POST(ev)).rejects.toMatchObject({ status: 303, location: '/' });
		expect(
			(ev.cookies as unknown as { delete: ReturnType<typeof vi.fn> }).delete
		).toHaveBeenCalledWith('access_token', { path: '/' });
	});
});
