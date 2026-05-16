import { describe, it, expect, vi, afterEach } from 'vitest';
import { load } from './+page.server';

const PARTICIPANTE_ID = 'p-99';
const CHEFIA_USER_ID = 42;

const mockChefiaUser = {
	id: CHEFIA_USER_ID,
	email: 'carlos@pgd-demo.gov.br',
	name: 'Carlos Mendes',
	role: 'chefe_imediato'
};

const mockServidorUser = {
	id: 7,
	email: 'lucas@pgd-demo.gov.br',
	name: 'Lucas Pereira',
	role: 'servidor'
};

const baseParticipante = {
	id: PARTICIPANTE_ID,
	nome: 'Lucas Pereira',
	matriculaSiape: '2840193',
	email: 'lucas@pgd-demo.gov.br'
};

function makePt(status: number, over: Record<string, unknown> = {}) {
	return {
		id: 'pt-1',
		idPlanoTrabalho: 'PT-2026-08',
		participanteId: PARTICIPANTE_ID,
		status,
		dataInicio: '2026-08-01',
		dataTermino: '2027-01-31',
		cargaHorariaDisponivel: 30,
		criteriosAvaliacao: 'novo',
		contribuicoes: [],
		dataAssinaturaParticipante: '2026-05-12T15:00:00Z',
		dataAssinaturaChefia: null,
		...over
	};
}

const baseHistorico = [
	{
		id: 1,
		tableName: 'plano_trabalho',
		recordId: 'pt-1',
		action: 'UPDATE',
		userId: 7,
		userEmail: 'lucas@pgd-demo.gov.br',
		oldValues: null,
		newValues: {
			acao: 'enviar_para_outro_lado',
			data_inicio: '2026-08-01',
			data_termino: '2027-01-31',
			carga_horaria_disponivel: 30,
			criterios_avaliacao: 'novo'
		},
		createdAt: '2026-05-12T15:00:00Z'
	}
];

function stubGraphQL(payload: Record<string, unknown>) {
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

function makeEvent(
	id = 'pt-1',
	user: unknown = mockChefiaUser,
	token: string | null = 'fake-token'
) {
	return {
		params: { id },
		cookies: {
			get: vi.fn().mockReturnValue(token)
		},
		parent: vi.fn().mockResolvedValue({ user })
	} as unknown as Parameters<typeof load>[0];
}

describe('/equipe/planos-trabalho/[id]/revisar +page.server — load', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('status AGUARDANDO_ASSINATURA_CHEFIA + chefia → retorna plano + diff + participante', async () => {
		stubGraphQL({
			planoTrabalho: makePt(2), // 2 = AGUARDANDO_ASSINATURA_CHEFIA
			historicoPlanoTrabalho: baseHistorico,
			listarParticipantes: [baseParticipante]
		});

		const result = (await load(makeEvent())) as any;
		expect(result.plano).toBeTruthy();
		expect(result.plano.status).toBe('AGUARDANDO_ASSINATURA_CHEFIA');
		expect(result.participanteNome).toBe('Lucas Pereira');
		expect(Array.isArray(result.diff)).toBe(true);
	});

	it('sem usuário → redirect 302 para /', async () => {
		await expect(load(makeEvent('pt-1', null))).rejects.toMatchObject({ status: 302 });
	});

	it('status EM_EXECUCAO → redirect 302 para /equipe', async () => {
		stubGraphQL({
			planoTrabalho: makePt(3),
			historicoPlanoTrabalho: [],
			listarParticipantes: [baseParticipante]
		});

		await expect(load(makeEvent())).rejects.toMatchObject({ status: 302, location: '/equipe' });
	});

	it('status AGUARDANDO_ASSINATURA_PARTICIPANTE → redirect 302 (bola está com o servidor)', async () => {
		stubGraphQL({
			planoTrabalho: makePt(7),
			historicoPlanoTrabalho: [],
			listarParticipantes: [baseParticipante]
		});

		await expect(load(makeEvent())).rejects.toMatchObject({ status: 302 });
	});

	it('usuário é o próprio participante → error 403', async () => {
		stubGraphQL({
			planoTrabalho: makePt(2),
			historicoPlanoTrabalho: baseHistorico,
			listarParticipantes: [baseParticipante]
		});

		await expect(load(makeEvent('pt-1', mockServidorUser))).rejects.toMatchObject({ status: 403 });
	});

	it('plano não encontrado → error 404', async () => {
		stubGraphQL({
			planoTrabalho: null,
			historicoPlanoTrabalho: [],
			listarParticipantes: [baseParticipante]
		});

		await expect(load(makeEvent())).rejects.toMatchObject({ status: 404 });
	});

	it('diff calculado a partir da última submissão do participante', async () => {
		const historicoComMudanca = [
			{
				...baseHistorico[0],
				newValues: {
					...baseHistorico[0].newValues,
					criterios_avaliacao: 'antigo'
				}
			}
		];
		stubGraphQL({
			planoTrabalho: makePt(2, { criteriosAvaliacao: 'novo' }),
			historicoPlanoTrabalho: historicoComMudanca,
			listarParticipantes: [baseParticipante]
		});

		const result = (await load(makeEvent())) as any;
		const campos = result.diff.map((d: { campo: string }) => d.campo);
		expect(campos).toContain('criterios_avaliacao');
	});

	it('participanteNome fallback "Servidor" quando participante não encontrado', async () => {
		stubGraphQL({
			planoTrabalho: makePt(2, { participanteId: 'inexistente' }),
			historicoPlanoTrabalho: [],
			listarParticipantes: [baseParticipante]
		});

		const result = (await load(makeEvent())) as any;
		expect(result.participanteNome).toBe('Servidor');
		// Diff vazio porque não conseguimos identificar o participante para filtrar audit
		expect(result.diff).toEqual([]);
	});
});
