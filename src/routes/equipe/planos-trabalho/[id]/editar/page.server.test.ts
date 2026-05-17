import { describe, it, expect, vi, afterEach } from 'vitest';
import { load } from './+page.server';

// status 6 = RASCUNHO_CHEFIA
// status 2 = AGUARDANDO_ASSINATURA_CHEFIA (editável pela chefia)
// status 7 = AGUARDANDO_ASSINATURA_PARTICIPANTE
// status 3 = EM_EXECUCAO

const PARTICIPANTE_ID = 'p-99';

const baseParticipante = {
	id: PARTICIPANTE_ID,
	nome: 'Lucas Pereira',
	matriculaSiape: '2840193',
	email: 'lucas@pgd-demo.gov.br'
};

const mockChefiaUser = {
	id: 42,
	email: 'carlos@pgd-demo.gov.br',
	name: 'Carlos Mendes',
	role: 'chefe_imediato'
};

function makeBackendPlano(overrides: Record<string, unknown> = {}) {
	return {
		id: '42',
		idPlanoTrabalho: 'PT-2026-08',
		participanteId: PARTICIPANTE_ID,
		status: 2,
		dataInicio: '2026-08-01',
		dataTermino: '2027-01-31',
		cargaHorariaDisponivel: 30,
		criteriosAvaliacao: 'Cumprimento de prazos',
		planoEntregasId: null,
		contribuicoes: [],
		dataAssinaturaParticipante: null,
		dataAssinaturaChefia: null,
		criadoPorRole: 'servidor',
		...overrides
	};
}

function stubGqlResponse(payload: Record<string, unknown>) {
	vi.stubGlobal(
		'fetch',
		vi.fn(async () =>
			new Response(JSON.stringify({ data: payload, errors: null }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			})
		)
	);
}

function makeEvent(opts: { user?: unknown; id?: string; token?: string } = {}) {
	const user = opts.user === undefined ? mockChefiaUser : opts.user;
	return {
		params: { id: opts.id ?? '42' },
		cookies: { get: vi.fn().mockReturnValue(opts.token ?? 'fake-token') },
		parent: vi.fn().mockResolvedValue({ user })
	} as unknown as Parameters<typeof load>[0];
}

describe('/equipe/planos-trabalho/[id]/editar +page.server — load', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('status AGUARDANDO_ASSINATURA_CHEFIA + chefia → retorna plano + participanteNome', async () => {
		stubGqlResponse({
			planoTrabalho: makeBackendPlano({ status: 2 }),
			historicoPlanoTrabalho: [],
			listarParticipantes: [baseParticipante]
		});

		const result = (await load(makeEvent())) as any;
		expect(result.plano).toBeTruthy();
		expect(result.plano.status).toBe('AGUARDANDO_ASSINATURA_CHEFIA');
		expect(result.participanteNome).toBe('Lucas Pereira');
	});

	it('status RASCUNHO_CHEFIA + chefia → permite edição', async () => {
		stubGqlResponse({
			planoTrabalho: makeBackendPlano({ status: 6 }),
			historicoPlanoTrabalho: [],
			listarParticipantes: [baseParticipante]
		});

		const result = (await load(makeEvent())) as any;
		expect(result.plano.status).toBe('RASCUNHO_CHEFIA');
	});

	it('status RASCUNHO_PARTICIPANTE → redirect 302 para /equipe', async () => {
		stubGqlResponse({
			planoTrabalho: makeBackendPlano({ status: 5 }),
			historicoPlanoTrabalho: [],
			listarParticipantes: [baseParticipante]
		});

		await expect(load(makeEvent())).rejects.toMatchObject({
			status: 302,
			location: '/equipe'
		});
	});

	it('status AGUARDANDO_ASSINATURA_PARTICIPANTE → redirect 302 (bola está com servidor)', async () => {
		stubGqlResponse({
			planoTrabalho: makeBackendPlano({ status: 7 }),
			historicoPlanoTrabalho: [],
			listarParticipantes: [baseParticipante]
		});

		await expect(load(makeEvent())).rejects.toMatchObject({ status: 302 });
	});

	it('status EM_EXECUCAO → redirect 302', async () => {
		stubGqlResponse({
			planoTrabalho: makeBackendPlano({ status: 3 }),
			historicoPlanoTrabalho: [],
			listarParticipantes: [baseParticipante]
		});

		await expect(load(makeEvent())).rejects.toMatchObject({ status: 302 });
	});

	it('usuário é o próprio participante → error 403', async () => {
		const servidorUser = { ...mockChefiaUser, email: 'lucas@pgd-demo.gov.br' };
		stubGqlResponse({
			planoTrabalho: makeBackendPlano({ status: 2 }),
			historicoPlanoTrabalho: [],
			listarParticipantes: [baseParticipante]
		});

		await expect(load(makeEvent({ user: servidorUser }))).rejects.toMatchObject({ status: 403 });
	});

	it('plano não encontrado → error 404', async () => {
		stubGqlResponse({
			planoTrabalho: null,
			historicoPlanoTrabalho: [],
			listarParticipantes: [baseParticipante]
		});

		await expect(load(makeEvent())).rejects.toMatchObject({ status: 404 });
	});

	it('sem usuário → redirect 302 para /', async () => {
		stubGqlResponse({
			planoTrabalho: null,
			historicoPlanoTrabalho: [],
			listarParticipantes: []
		});

		await expect(load(makeEvent({ user: null }))).rejects.toMatchObject({
			status: 302,
			location: '/login'
		});
	});
});
