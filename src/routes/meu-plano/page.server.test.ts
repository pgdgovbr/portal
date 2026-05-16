import { describe, it, expect, vi, afterEach } from 'vitest';
import { load } from './+page.server';

const mockPlan = {
	id: '1',
	status: 'ativo',
	dataInicio: '2024-01-01',
	dataFim: '2024-12-31',
	modalidade: 'teletrabalho',
	totalHorasDisponiveis: 160,
	unidadeAutorizadoraNome: 'Ministério X',
	contribuicoes: [],
};

function makeEvent(user: unknown, token = 'fake-token') {
	return {
		cookies: {
			get: vi.fn().mockReturnValue(token),
		},
		parent: vi.fn().mockResolvedValue({ user }),
	} as unknown as Parameters<typeof load>[0];
}

function stubFetch(planosTrabalho: unknown[]) {
	vi.stubGlobal(
		'fetch',
		vi.fn(async () =>
			new Response(JSON.stringify({ data: { listarPlanosTrabalho: planosTrabalho }, errors: null }), {
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

	it('com usuário e planos → retorna { planosTrabalho: [mockPlan] }', async () => {
		stubFetch([mockPlan]);
		const result = await load(makeEvent({ role: 'servidor' }));
		expect(result).toEqual({ planosTrabalho: [mockPlan] });
	});

	it('com usuário e lista vazia → retorna { planosTrabalho: [] }', async () => {
		stubFetch([]);
		const result = await load(makeEvent({ role: 'servidor' }));
		expect(result).toEqual({ planosTrabalho: [] });
	});

	it('gqlFetch lança erro → retorna { planosTrabalho: [] } (catch fallback)', async () => {
		vi.stubGlobal('fetch', vi.fn(async () => new Response('Server Error', { status: 500 })));
		const result = await load(makeEvent({ role: 'servidor' }));
		expect(result).toEqual({ planosTrabalho: [] });
	});

	it('sem usuário → lança redirect 302 para /', async () => {
		const event = makeEvent(null);
		await expect(load(event)).rejects.toMatchObject({ status: 302 });
	});
});
