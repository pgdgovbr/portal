import { describe, it, expect, vi, afterEach } from 'vitest';
import { load } from './+page.server';

const PARTICIPANTE_ID = 'p-99';
const USER_ID = 42;

const mockUser = {
	id: USER_ID,
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
		avaliacoes: [],
		dataAssinaturaChefia: '2026-05-14T16:08:00Z',
		dataAssinaturaParticipante: null,
		...over
	};
}

const baseHistorico = [
	{
		id: 1,
		tableName: 'plano_trabalho',
		recordId: 'pt-1',
		action: 'UPDATE',
		userId: USER_ID,
		userEmail: 'lucas@pgd-demo.gov.br',
		oldValues: null,
		newValues: {
			acao: 'enviar_para_outro_lado',
			data_inicio: '2026-08-01',
			data_termino: '2027-01-31',
			carga_horaria_disponivel: 30,
			criterios_avaliacao: 'antigo'
		},
		createdAt: '2026-05-10T09:00:00Z'
	},
	{
		id: 2,
		tableName: 'plano_trabalho',
		recordId: 'pt-1',
		action: 'UPDATE',
		userId: 99,
		userEmail: 'carlos@pgd-demo.gov.br',
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

function stubGraphQL(responder: (query: string) => unknown) {
	vi.stubGlobal(
		'fetch',
		vi.fn(async (_url: string, init: RequestInit) => {
			const body = JSON.parse(init.body as string);
			const data = responder(body.query);
			return new Response(JSON.stringify({ data, errors: null }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			});
		})
	);
}

function makeEvent(
	id = 'pt-1',
	user: unknown = mockUser,
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

describe('/meu-plano/[id]/revisar +page.server — load', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('status AGUARDANDO_ASSINATURA_PARTICIPANTE → retorna plano + diff calculado', async () => {
		stubGraphQL((query) => {
			if (query.includes('PlanoTrabalhoRevisar')) {
				return {
					planoTrabalho: makePt(7), // 7 = AGUARDANDO_ASSINATURA_PARTICIPANTE
					historicoPlanoTrabalho: baseHistorico,
					listarParticipantes: [baseParticipante]
				};
			}
			return {};
		});

		const result: any = await load(makeEvent());
		expect(result.plano).toBeTruthy();
		expect(result.plano.status).toBe('AGUARDANDO_ASSINATURA_PARTICIPANTE');
		expect(result.historico).toHaveLength(2);
		// diff: criterios_avaliacao mudou de 'antigo' para 'novo'
		expect(Array.isArray(result.diff)).toBe(true);
		const campos = result.diff.map((d: { campo: string }) => d.campo);
		expect(campos).toContain('criterios_avaliacao');
	});

	it('sem usuário → redirect 302 para /', async () => {
		const event = makeEvent('pt-1', null);
		await expect(load(event)).rejects.toMatchObject({ status: 302 });
	});

	it('status EM_EXECUCAO → redirect 302 para /meu-plano', async () => {
		stubGraphQL(() => ({
			planoTrabalho: makePt(3),
			historicoPlanoTrabalho: [],
			listarParticipantes: [baseParticipante]
		}));

		await expect(load(makeEvent())).rejects.toMatchObject({ status: 302 });
	});

	it('status RASCUNHO_PARTICIPANTE → redirect 302 para /meu-plano', async () => {
		stubGraphQL(() => ({
			planoTrabalho: makePt(5),
			historicoPlanoTrabalho: [],
			listarParticipantes: [baseParticipante]
		}));

		await expect(load(makeEvent())).rejects.toMatchObject({ status: 302 });
	});

	it('servidor que não é dono do plano → error 403', async () => {
		stubGraphQL(() => ({
			planoTrabalho: makePt(7),
			historicoPlanoTrabalho: baseHistorico,
			listarParticipantes: [
				{ ...baseParticipante, email: 'outro@pgd-demo.gov.br' } // user atual (lucas@) não bate
			]
		}));

		await expect(load(makeEvent())).rejects.toMatchObject({ status: 403 });
	});

	it('plano não encontrado → error 404', async () => {
		stubGraphQL(() => ({
			planoTrabalho: null,
			historicoPlanoTrabalho: [],
			listarParticipantes: [baseParticipante]
		}));

		await expect(load(makeEvent())).rejects.toMatchObject({ status: 404 });
	});

	it('inclui atorChefia e dataAssinaturaChefia para a UI', async () => {
		stubGraphQL(() => ({
			planoTrabalho: makePt(7),
			historicoPlanoTrabalho: baseHistorico,
			listarParticipantes: [
				baseParticipante,
				{
					id: 'p-chefia',
					nome: 'Carlos Mendes',
					matriculaSiape: '1111111',
					email: 'carlos@pgd-demo.gov.br'
				}
			]
		}));

		const result: any = await load(makeEvent());
		expect(result.plano.dataAssinaturaChefia).toBeTruthy();
	});

	it('chefiaNome vem do audit log (último envio para o participante), não de listarParticipantes', async () => {
		// listarParticipantes propositalmente tem outra pessoa que NÃO enviou o PT
		// pra garantir que o helper não está usando heurística de "primeiro participante diferente"
		stubGraphQL(() => ({
			planoTrabalho: makePt(7),
			historicoPlanoTrabalho: baseHistorico, // chefia = carlos@pgd-demo.gov.br
			listarParticipantes: [
				baseParticipante,
				{
					id: 'p-aleatorio',
					nome: 'Pessoa Aleatória',
					matriculaSiape: '0000001',
					email: 'aleatorio@pgd-demo.gov.br'
				},
				{
					id: 'p-chefia',
					nome: 'Carlos Mendes',
					matriculaSiape: '1111111',
					email: 'carlos@pgd-demo.gov.br'
				}
			]
		}));

		const result: any = await load(makeEvent());
		// Como a chefia (carlos@) está em listarParticipantes, resolve para "Carlos Mendes"
		expect(result.chefiaNome).toBe('Carlos Mendes');
	});

	it('chefiaNome cai para o email quando a chefia não está em listarParticipantes', async () => {
		stubGraphQL(() => ({
			planoTrabalho: makePt(7),
			historicoPlanoTrabalho: baseHistorico, // chefia = carlos@pgd-demo.gov.br
			listarParticipantes: [baseParticipante] // só o servidor; chefia não está
		}));

		const result: any = await load(makeEvent());
		expect(result.chefiaNome).toBe('carlos@pgd-demo.gov.br');
	});

	it('chefiaNome fallback genérico quando não há registro de chefia no audit', async () => {
		stubGraphQL(() => ({
			planoTrabalho: makePt(7),
			// só o envio do próprio servidor — sem registro de chefia
			historicoPlanoTrabalho: [baseHistorico[0]],
			listarParticipantes: [baseParticipante]
		}));

		const result: any = await load(makeEvent());
		expect(result.chefiaNome).toBe('Chefia');
	});
});
