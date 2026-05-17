import { describe, it, expect, vi, afterEach } from 'vitest';
import { load } from './+page.server';

// status 5 = RASCUNHO_PARTICIPANTE
// status 7 = AGUARDANDO_ASSINATURA_PARTICIPANTE
// status 3 = EM_EXECUCAO
// status 2 = AGUARDANDO_ASSINATURA_CHEFIA

function makeBackendPlano(overrides: Record<string, unknown> = {}) {
	return {
		id: '42',
		idPlanoTrabalho: 'PT-2026-08',
		participanteId: '7',
		status: 5,
		dataInicio: '2026-08-01',
		dataTermino: '2027-01-31',
		cargaHorariaDisponivel: 30,
		criteriosAvaliacao: 'Cumprimento de prazos',
		trabalhoNoturno: false,
		planoEntregasId: null,
		contribuicoes: [],
		avaliacoes: [],
		dataAssinaturaParticipante: null,
		dataAssinaturaChefia: null,
		criadoPorRole: 'servidor',
		clonadoDeId: null,
		...overrides,
	};
}

function makeAuditEvent(overrides: Record<string, unknown> = {}) {
	return {
		id: 1,
		tableName: 'plano_trabalho',
		recordId: '42',
		action: 'CREATE',
		userId: 7,
		userEmail: 'lucas@example.gov.br',
		oldValues: null,
		newValues: { status: 5 },
		createdAt: '2026-07-30T10:00:00Z',
		...overrides,
	};
}

function stubGqlResponse(payload: Record<string, unknown>) {
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

function makeEvent(opts: { user?: unknown; id?: string; token?: string } = {}) {
	const user =
		opts.user === undefined
			? { id: 7, email: 'lucas@example.gov.br', name: 'Lucas', role: 'servidor' }
			: opts.user;
	return {
		params: { id: opts.id ?? '42' },
		cookies: { get: vi.fn().mockReturnValue(opts.token ?? 'fake-token') },
		parent: vi.fn().mockResolvedValue({ user }),
	} as unknown as Parameters<typeof load>[0];
}

describe('meu-plano/[id]/editar +page.server — load', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('status RASCUNHO_PARTICIPANTE + dono → retorna plano + historico', async () => {
		stubGqlResponse({
			planoTrabalho: makeBackendPlano({ status: 5 }),
			meusPlanosTrabalho: [makeBackendPlano({ status: 5 })],
			historicoPlanoTrabalho: [makeAuditEvent()],
		});

		const result = (await load(makeEvent())) as {
			plano: { id: string; status: string };
			historico: unknown[];
		};

		expect(result.plano).toBeTruthy();
		expect(result.plano.id).toBe('42');
		expect(result.plano.status).toBe('RASCUNHO_PARTICIPANTE');
		expect(result.historico).toHaveLength(1);
	});

	it('status AGUARDANDO_ASSINATURA_PARTICIPANTE + dono → retorna plano', async () => {
		stubGqlResponse({
			planoTrabalho: makeBackendPlano({ status: 7 }),
			meusPlanosTrabalho: [makeBackendPlano({ status: 7 })],
			historicoPlanoTrabalho: [],
		});

		const result = (await load(makeEvent())) as { plano: { status: string } };
		expect(result.plano.status).toBe('AGUARDANDO_ASSINATURA_PARTICIPANTE');
	});

	it('status EM_EXECUCAO → redirect 302 para /meu-plano (não pode editar)', async () => {
		stubGqlResponse({
			planoTrabalho: makeBackendPlano({ status: 3 }),
			meusPlanosTrabalho: [makeBackendPlano({ status: 3 })],
			historicoPlanoTrabalho: [],
		});

		await expect(load(makeEvent())).rejects.toMatchObject({
			status: 302,
			location: '/meu-plano',
		});
	});

	it('status AGUARDANDO_ASSINATURA_CHEFIA → redirect 302 (com outro lado)', async () => {
		stubGqlResponse({
			planoTrabalho: makeBackendPlano({ status: 2 }),
			meusPlanosTrabalho: [makeBackendPlano({ status: 2 })],
			historicoPlanoTrabalho: [],
		});

		await expect(load(makeEvent())).rejects.toMatchObject({
			status: 302,
			location: '/meu-plano',
		});
	});

	it('plano não pertence ao usuário → error 403', async () => {
		stubGqlResponse({
			planoTrabalho: makeBackendPlano({ status: 5, id: '42' }),
			meusPlanosTrabalho: [], // nenhum plano do user
			historicoPlanoTrabalho: [],
		});

		await expect(load(makeEvent())).rejects.toMatchObject({ status: 403 });
	});

	it('plano não existe → error 404', async () => {
		stubGqlResponse({
			planoTrabalho: null,
			meusPlanosTrabalho: [],
			historicoPlanoTrabalho: [],
		});

		await expect(load(makeEvent())).rejects.toMatchObject({ status: 404 });
	});

	it('sem usuário → redirect 302 para /', async () => {
		stubGqlResponse({
			planoTrabalho: null,
			meusPlanosTrabalho: [],
			historicoPlanoTrabalho: [],
		});

		await expect(load(makeEvent({ user: null }))).rejects.toMatchObject({
			status: 302,
			location: '/login',
		});
	});
});
