import { describe, it, expect, vi, afterEach } from 'vitest';
import { load } from './+page.server';

function makeEvent({
	user = null,
	next,
	fetchImpl,
}: {
	user?: unknown;
	next?: string;
	fetchImpl?: typeof fetch;
} = {}) {
	const url = new URL(`http://localhost/login${next ? `?next=${next}` : ''}`);
	return {
		parent: vi.fn().mockResolvedValue({ user }),
		url,
		fetch: fetchImpl ?? vi.fn(),
	} as unknown as Parameters<typeof load>[0];
}

describe('+page.server (login) — load', () => {
	afterEach(() => vi.unstubAllGlobals());

	it('usuário logado: redireciona para /app', async () => {
		await expect(
			load(
				makeEvent({
					user: { id: 1, role: 'servidor', name: 'X', email: 'x@y.gov.br' },
				})
			)
		).rejects.toMatchObject({ status: 302, location: '/app' });
	});

	it('usuário anônimo + DEMO_MODE on: carrega personas do backend', async () => {
		const fetchImpl = vi.fn(async () =>
			new Response(
				JSON.stringify([
					{
						email: 'a@x.gov.br',
						name: 'Marta',
						role: 'servidor',
						role_label: 'Servidora',
						ctx: 'Sem plano',
						grupo: 'recomendados',
					},
				]),
				{ status: 200, headers: { 'Content-Type': 'application/json' } }
			)
		) as unknown as typeof fetch;

		const result = (await load(makeEvent({ fetchImpl }))) as {
			next: string;
			personas: unknown[];
		};
		expect(result.next).toBe('/app');
		expect(result.personas).toHaveLength(1);
	});

	it('backend offline: personas vazio (não quebra)', async () => {
		const fetchImpl = vi.fn(async () => {
			throw new Error('ECONNREFUSED');
		}) as unknown as typeof fetch;

		const result = (await load(makeEvent({ fetchImpl }))) as { personas: unknown[] };
		expect(result.personas).toEqual([]);
	});

	it('preserva ?next= para usar após login', async () => {
		const fetchImpl = vi.fn(async () =>
			new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } })
		) as unknown as typeof fetch;

		const result = (await load(makeEvent({ next: '/meu-plano', fetchImpl }))) as {
			next: string;
		};
		expect(result.next).toBe('/meu-plano');
	});
});
