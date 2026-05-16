import { describe, it, expect, vi, afterEach } from 'vitest';
import { load, actions } from './+page.server';

const mockPlanoEntrega = {
	id: 'pe-1',
	idPlanoEntregas: 'PE-CGTI-2026',
	codUnidadeAutorizadora: 10,
	codUnidadeExecutora: 100,
	status: 3,
	dataInicio: '2026-01-01',
	dataTermino: '2026-12-31',
};

const mockParticipante = {
	id: 'part-uuid-1',
	email: 'ana@gov.br',
	nome: 'Ana Silva',
	matriculaSiape: '1234567',
	origemUnidade: 'SIAPE',
	codUnidadeAutorizadora: 10,
	codUnidadeLotacao: 100,
	codUnidadeInstituidora: 1,
};

function makeLoadEvent(user: unknown, token: string | undefined = 'fake-token') {
	return {
		cookies: { get: vi.fn().mockReturnValue(token) },
		parent: vi.fn().mockResolvedValue({ user }),
	} as unknown as Parameters<typeof load>[0];
}

function makeActionEvent(
	formData: FormData,
	tokenArg: string | null = 'fake-token'
) {
	// Explicit `null` → cookies.get devolve undefined (sem token); 'fake-token' (default) → cookie presente.
	const token = tokenArg ?? undefined;
	return {
		cookies: { get: vi.fn().mockReturnValue(token) },
		request: { formData: vi.fn().mockResolvedValue(formData) },
	} as unknown as Parameters<typeof actions.salvarRascunho>[0];
}

function stubFetchSequence(payloads: Array<Record<string, unknown> | { errors: unknown[] }>) {
	let i = 0;
	vi.stubGlobal(
		'fetch',
		vi.fn(async () => {
			const p = payloads[i++] ?? {};
			if ('errors' in p) {
				return new Response(JSON.stringify({ data: null, errors: p.errors }), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				});
			}
			return new Response(JSON.stringify({ data: p, errors: null }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		})
	);
}

function buildContribuicoes(items = [{ tipo: 2, descricao: 'X', percentual: 100 }]) {
	return JSON.stringify(items);
}

function buildFormData(overrides: Record<string, string> = {}) {
	const fd = new FormData();
	const base: Record<string, string> = {
		dataInicio: '2026-08-01',
		dataFim: '2027-01-31',
		cargaHoras: '40',
		planoEntregasId: '',
		criterios: JSON.stringify(['Critério A']),
		contribuicoes: buildContribuicoes(),
		planoCriadoId: '',
		contribuicoesCriadas: '0',
		...overrides,
	};
	for (const [k, v] of Object.entries(base)) fd.set(k, v);
	return fd;
}

describe('meu-plano/criar +page.server — load', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('sem usuário → redirect 302 para /', async () => {
		const event = makeLoadEvent(null);
		await expect(load(event)).rejects.toMatchObject({ status: 302 });
	});

	it('com usuário → retorna user, planosEntregas e participante (match por email)', async () => {
		stubFetchSequence([
			{
				listarPlanosEntregas: [mockPlanoEntrega],
				listarParticipantes: [mockParticipante],
			},
		]);
		const user = { id: 1, role: 'servidor', name: 'Ana Silva', email: 'ana@gov.br' };
		const result = (await load(makeLoadEvent(user))) as {
			user: typeof user;
			planosEntregas: unknown[];
			participante: { id: string } | null;
		};
		expect(result.user).toEqual(user);
		expect(result.planosEntregas).toHaveLength(1);
		expect(result.participante?.id).toBe('part-uuid-1');
	});

	it('usuário sem participante correspondente → participante: null', async () => {
		stubFetchSequence([
			{
				listarPlanosEntregas: [],
				listarParticipantes: [{ ...mockParticipante, email: 'outro@gov.br' }],
			},
		]);
		const user = { id: 1, role: 'servidor', name: 'X', email: 'naoexiste@gov.br' };
		const result = (await load(makeLoadEvent(user))) as { participante: unknown };
		expect(result.participante).toBeNull();
	});

	it('gqlFetch falha → participante: null e planosEntregas: []', async () => {
		vi.stubGlobal('fetch', vi.fn(async () => new Response('boom', { status: 500 })));
		const user = { id: 3, role: 'servidor', name: 'Y', email: 'y@z' };
		const result = (await load(makeLoadEvent(user))) as {
			planosEntregas: unknown[];
			participante: unknown;
		};
		expect(result.planosEntregas).toEqual([]);
		expect(result.participante).toBeNull();
	});
});

describe('meu-plano/criar +page.server — actions', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('salvarRascunho sem token → 401', async () => {
		const event = makeActionEvent(buildFormData(), null);
		const result = (await actions.salvarRascunho(event)) as { status: number };
		expect(result.status).toBe(401);
	});

	it('salvarRascunho com critérios vazios → 400', async () => {
		// me query precisa ser stub para passar da verificação de auth
		stubFetchSequence([{ me: { id: 1, email: 'ana@gov.br', name: 'A' } }]);
		const event = makeActionEvent(buildFormData({ criterios: JSON.stringify([]) }));
		const result = (await actions.salvarRascunho(event)) as {
			status: number;
			data: { error: string };
		};
		expect(result.status).toBe(400);
		expect(result.data.error).toMatch(/critério/i);
	});

	it('salvarRascunho com soma de contribuições != 100 → 400', async () => {
		stubFetchSequence([{ me: { id: 1, email: 'ana@gov.br', name: 'A' } }]);
		const event = makeActionEvent(
			buildFormData({
				contribuicoes: buildContribuicoes([{ tipo: 2, descricao: 'X', percentual: 50 }]),
			})
		);
		const result = (await actions.salvarRascunho(event)) as {
			status: number;
			data: { error: string };
		};
		expect(result.status).toBe(400);
		expect(result.data.error).toMatch(/100%/);
	});

	it('salvarRascunho sem participante vinculado → 400 com mensagem clara', async () => {
		stubFetchSequence([
			{ me: { id: 1, email: 'ana@gov.br', name: 'Ana' } },
			{ listarParticipantes: [{ ...mockParticipante, email: 'outro@gov.br' }] },
		]);
		const event = makeActionEvent(buildFormData());
		const result = (await actions.salvarRascunho(event)) as {
			status: number;
			data: { error: string };
		};
		expect(result.status).toBe(400);
		expect(result.data.error).toMatch(/participante/i);
	});

	it('salvarRascunho fluxo feliz → redirect 303 para /meu-plano?plano=rascunho', async () => {
		stubFetchSequence([
			{ me: { id: 1, email: 'ana@gov.br', name: 'Ana' } },
			{ listarParticipantes: [mockParticipante] },
			{ criarPlanoTrabalho: { id: 'pt-1', status: 1 } },
			{ adicionarContribuicao: { id: 'c-1' } },
		]);
		const event = makeActionEvent(buildFormData());
		await expect(actions.salvarRascunho(event)).rejects.toMatchObject({
			status: 303,
			location: expect.stringContaining('rascunho'),
		});
	});

	it('assinarEnviar fluxo feliz → redirect 303 para /meu-plano?plano=enviado', async () => {
		stubFetchSequence([
			{ me: { id: 1, email: 'ana@gov.br', name: 'Ana' } },
			{ listarParticipantes: [mockParticipante] },
			{ criarPlanoTrabalho: { id: 'pt-1', status: 1 } },
			{ adicionarContribuicao: { id: 'c-1' } },
			{ enviarPtParaOutroLado: { id: 'pt-1', status: 2 } },
		]);
		const event = makeActionEvent(buildFormData());
		await expect(actions.assinarEnviar(event)).rejects.toMatchObject({
			status: 303,
			location: expect.stringContaining('enviado'),
		});
	});

	it('falha ao criar PT → 502 e nenhum planoCriadoId retornado', async () => {
		stubFetchSequence([
			{ me: { id: 1, email: 'ana@gov.br', name: 'Ana' } },
			{ listarParticipantes: [mockParticipante] },
			{ errors: [{ message: 'boom no backend' }] },
		]);
		const event = makeActionEvent(buildFormData());
		const result = (await actions.salvarRascunho(event)) as {
			status: number;
			data: { error: string; planoCriadoId?: string };
		};
		expect(result.status).toBe(502);
		expect(result.data.error).toMatch(/criar plano/i);
		expect(result.data.planoCriadoId).toBeUndefined();
	});

	it('falha numa contribuição → 502 retorna planoCriadoId + contribuicoesCriadas para retomada', async () => {
		stubFetchSequence([
			{ me: { id: 1, email: 'ana@gov.br', name: 'Ana' } },
			{ listarParticipantes: [mockParticipante] },
			{ criarPlanoTrabalho: { id: 'pt-1', status: 1 } },
			{ adicionarContribuicao: { id: 'c-1' } }, // primeira ok
			{ errors: [{ message: 'falhou a segunda' }] }, // segunda falha
		]);
		const fd = buildFormData({
			contribuicoes: buildContribuicoes([
				{ tipo: 2, descricao: 'A', percentual: 50 },
				{ tipo: 2, descricao: 'B', percentual: 50 },
			]),
		});
		const event = makeActionEvent(fd);
		const result = (await actions.salvarRascunho(event)) as {
			status: number;
			data: { error: string; planoCriadoId?: string; contribuicoesCriadas?: number };
		};
		expect(result.status).toBe(502);
		expect(result.data.planoCriadoId).toBe('pt-1');
		expect(result.data.contribuicoesCriadas).toBe(1);
	});

	it('retomada idempotente: planoCriadoId presente → pula criarPlanoTrabalho', async () => {
		// Só duas chamadas esperadas: me, listarParticipantes, adicionarContribuicao (a segunda).
		stubFetchSequence([
			{ me: { id: 1, email: 'ana@gov.br', name: 'Ana' } },
			{ listarParticipantes: [mockParticipante] },
			{ adicionarContribuicao: { id: 'c-2' } },
		]);
		const fd = buildFormData({
			planoCriadoId: 'pt-existente',
			contribuicoesCriadas: '1',
			contribuicoes: buildContribuicoes([
				{ tipo: 2, descricao: 'A', percentual: 50 },
				{ tipo: 2, descricao: 'B', percentual: 50 },
			]),
		});
		const event = makeActionEvent(fd);
		await expect(actions.salvarRascunho(event)).rejects.toMatchObject({ status: 303 });
	});
});
