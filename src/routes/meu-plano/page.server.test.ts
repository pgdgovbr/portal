import { describe, it, expect, vi, afterEach } from 'vitest';
import { load } from './+page.server';

const mockBackendPt = {
	id: '1',
	status: 3,
	dataInicio: '2024-01-01',
	dataTermino: '2024-12-31',
	cargaHorariaDisponivel: 160,
	contribuicoes: [],
	avaliacoes: [],
};

function makeEvent(user: unknown, token = 'fake-token') {
	return {
		cookies: {
			get: vi.fn().mockReturnValue(token),
		},
		parent: vi.fn().mockResolvedValue({ user }),
	} as unknown as Parameters<typeof load>[0];
}

function stubFetch(meusPlanosTrabalho: unknown[]) {
	vi.stubGlobal(
		'fetch',
		vi.fn(async () =>
			new Response(JSON.stringify({ data: { meusPlanosTrabalho }, errors: null }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			})
		)
	);
}

describe('meu-plano +page.server — load', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('com usuário e planos → retorna lista com plano enriquecido (status string, contribs)', async () => {
		stubFetch([mockBackendPt]);
		const result = (await load(makeEvent({ role: 'servidor' }))) as {
			planosTrabalho: { id: string; status: string }[];
		};
		expect(result.planosTrabalho).toHaveLength(1);
		expect(result.planosTrabalho[0].id).toBe('1');
		expect(result.planosTrabalho[0].status).toBe('EM_EXECUCAO');
	});

	it('com usuário e lista vazia → retorna { planosTrabalho: [] }', async () => {
		stubFetch([]);
		const result = (await load(makeEvent({ role: 'servidor' }))) as {
			planosTrabalho: unknown[];
		};
		expect(result.planosTrabalho).toEqual([]);
	});

	it('gqlFetch lança erro → retorna { planosTrabalho: [] } (catch fallback)', async () => {
		vi.stubGlobal('fetch', vi.fn(async () => new Response('Server Error', { status: 500 })));
		const result = (await load(makeEvent({ role: 'servidor' }))) as {
			planosTrabalho: unknown[];
		};
		expect(result.planosTrabalho).toEqual([]);
	});

	it('sem usuário → lança redirect 302 para /', async () => {
		const event = makeEvent(null);
		await expect(load(event)).rejects.toMatchObject({ status: 302 });
	});
});
