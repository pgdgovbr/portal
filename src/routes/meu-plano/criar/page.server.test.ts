import { describe, it, expect, vi, afterEach } from 'vitest';
import { load } from './+page.server';

const mockPlanoEntrega = {
	id: 'pe-1',
	idPlanoEntregas: 'PE-CGTI-2026',
	codUnidadeAutorizadora: 10,
	codUnidadeExecutora: 100,
	status: 3,
	dataInicio: '2026-01-01',
	dataTermino: '2026-12-31',
};

function makeEvent(user: unknown, token: string | undefined = 'fake-token') {
	return {
		cookies: { get: vi.fn().mockReturnValue(token) },
		parent: vi.fn().mockResolvedValue({ user }),
	} as unknown as Parameters<typeof load>[0];
}

function stubFetch(payload: Record<string, unknown>) {
	vi.stubGlobal(
		'fetch',
		vi.fn(async () =>
			new Response(JSON.stringify({ data: payload, errors: null }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			})
		)
	);
}

describe('meu-plano/criar +page.server — load', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('sem usuário → redirect 302 para /', async () => {
		const event = makeEvent(null);
		await expect(load(event)).rejects.toMatchObject({ status: 302 });
	});

	it('com usuário → retorna user e planosEntregas da listagem', async () => {
		stubFetch({ listarPlanosEntregas: [mockPlanoEntrega] });
		const user = { id: 1, role: 'servidor', name: 'Ana Silva', email: 'ana@gov.br' };
		const result = (await load(makeEvent(user))) as {
			user: typeof user;
			planosEntregas: unknown[];
		};
		expect(result.user).toEqual(user);
		expect(result.planosEntregas).toHaveLength(1);
		expect((result.planosEntregas[0] as { id: string }).id).toBe('pe-1');
	});

	it('lista vazia de planos de entrega → retorna planosEntregas: []', async () => {
		stubFetch({ listarPlanosEntregas: [] });
		const user = { id: 2, role: 'servidor', name: 'X', email: 'x@y' };
		const result = (await load(makeEvent(user))) as {
			planosEntregas: unknown[];
		};
		expect(result.planosEntregas).toEqual([]);
	});

	it('gqlFetch falha → mantém planosEntregas: [] sem quebrar a tela', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => new Response('boom', { status: 500 }))
		);
		const user = { id: 3, role: 'servidor', name: 'Y', email: 'y@z' };
		const result = (await load(makeEvent(user))) as {
			user: typeof user;
			planosEntregas: unknown[];
		};
		expect(result.user).toEqual(user);
		expect(result.planosEntregas).toEqual([]);
	});
});
