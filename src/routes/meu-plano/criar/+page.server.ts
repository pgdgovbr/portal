import { gqlFetch } from '$lib/graphql';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const LOAD_QUERY = `
  query CriarMeuPlanoDados {
    listarPlanosEntregas {
      id
      idPlanoEntregas
      codUnidadeAutorizadora
      codUnidadeExecutora
      status
      dataInicio
      dataTermino
    }
    listarParticipantes {
      id
      email
      nome
      matriculaSiape
      origemUnidade
      codUnidadeAutorizadora
      codUnidadeLotacao
      codUnidadeInstituidora
    }
  }
`;

type Participante = {
	id: string;
	email: string;
	nome: string;
	matriculaSiape: string;
	origemUnidade: 'SIAPE' | 'SIORG';
	codUnidadeAutorizadora: number;
	codUnidadeLotacao: number;
	codUnidadeInstituidora: number;
};

type PlanoEntregas = {
	id: string;
	idPlanoEntregas: string;
	codUnidadeAutorizadora: number;
	codUnidadeExecutora: number;
	status: number;
	dataInicio: string;
	dataTermino: string;
};

function findParticipanteByEmail(
	participantes: Participante[],
	email: string | null | undefined
): Participante | null {
	if (!email) return null;
	const target = email.toLowerCase();
	return participantes.find((p) => (p.email ?? '').toLowerCase() === target) ?? null;
}

export const load: PageServerLoad = async ({ cookies, parent }) => {
	const { user } = await parent();
	if (!user) redirect(302, '/login');

	const token = cookies.get('access_token');

	let planosEntregas: PlanoEntregas[] = [];
	let participante: Participante | null = null;
	try {
		const data = await gqlFetch<{
			listarPlanosEntregas: PlanoEntregas[];
			listarParticipantes: Participante[];
		}>(LOAD_QUERY, {}, token);
		planosEntregas = data.listarPlanosEntregas ?? [];
		participante = findParticipanteByEmail(data.listarParticipantes ?? [], user.email);
	} catch {
		planosEntregas = [];
		participante = null;
	}

	return { user, planosEntregas, participante };
};

// --- Form actions -----------------------------------------------------------

const CRIAR_PT_MUTATION = `
  mutation CriarMeuPlano($participanteId: ID!, $input: CriarPlanoTrabalhoInput!) {
    criarPlanoTrabalho(participanteId: $participanteId, input: $input) {
      id
      status
    }
  }
`;

const ADICIONAR_CONTRIBUICAO_MUTATION = `
  mutation AddContrib($pid: ID!, $input: AdicionarContribuicaoInput!) {
    adicionarContribuicao(planoTrabalhoId: $pid, input: $input) { id }
  }
`;

const ENVIAR_PT_MUTATION = `
  mutation EnviarPt($id: ID!) {
    enviarPtParaOutroLado(planoId: $id) { id status }
  }
`;

type ContribuicaoPayload = {
	tipo: number;
	descricao: string;
	percentual: number;
	idPlanoEntregas?: string | null;
};

function parseContribuicoes(raw: string | null): ContribuicaoPayload[] {
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw) as ContribuicaoPayload[];
		if (!Array.isArray(parsed)) return [];
		return parsed;
	} catch {
		return [];
	}
}

function parseCriterios(raw: string | null): string[] {
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw) as string[];
		if (!Array.isArray(parsed)) return [];
		return parsed.filter((c) => typeof c === 'string' && c.trim().length > 0);
	} catch {
		return [];
	}
}

type SubmitUser = { id: number; email: string; name: string };

type SubmitContext = {
	cookies: { get(name: string): string | undefined };
	formData: FormData;
	acao: 'rascunho' | 'enviar';
};

const ME_QUERY = `query Me { me { id email name } }`;

async function executarSubmit(ctx: SubmitContext) {
	const { cookies, formData, acao } = ctx;
	const token = cookies.get('access_token');
	if (!token) return fail(401, { error: 'Sessão expirada. Faça login novamente.' });

	// Recupera identidade do usuário via me (actions não têm acesso ao `parent()` do load).
	let user: SubmitUser | null = null;
	try {
		const me = await gqlFetch<{ me: SubmitUser }>(ME_QUERY, {}, token);
		user = me.me ?? null;
	} catch (e) {
		return fail(502, { error: `Falha ao validar sessão: ${(e as Error).message}` });
	}
	if (!user) return fail(401, { error: 'Não autenticado.' });

	const dataInicio = String(formData.get('dataInicio') ?? '').trim();
	const dataFim = String(formData.get('dataFim') ?? '').trim();
	const cargaHorasStr = String(formData.get('cargaHoras') ?? '').trim();
	const cargaHoras = Number.parseInt(cargaHorasStr, 10);
	const planoEntregasId =
		String(formData.get('planoEntregasId') ?? '').trim() || null;
	const criterios = parseCriterios(String(formData.get('criterios') ?? ''));
	const contribuicoes = parseContribuicoes(
		String(formData.get('contribuicoes') ?? '')
	);
	const planoCriadoId =
		String(formData.get('planoCriadoId') ?? '').trim() || null;
	const contribuicoesCriadasStr = String(
		formData.get('contribuicoesCriadas') ?? ''
	).trim();
	const contribuicoesCriadas = contribuicoesCriadasStr
		? Number.parseInt(contribuicoesCriadasStr, 10) || 0
		: 0;

	// Validation
	if (!dataInicio || !dataFim) {
		return fail(400, { error: 'Datas de início e fim são obrigatórias.' });
	}
	if (!Number.isFinite(cargaHoras) || cargaHoras <= 0) {
		return fail(400, { error: 'Carga horária inválida.' });
	}
	if (criterios.length === 0) {
		return fail(400, { error: 'Adicione ao menos um critério de avaliação.' });
	}
	if (contribuicoes.length === 0) {
		return fail(400, { error: 'Adicione ao menos uma contribuição.' });
	}
	const totalPct = contribuicoes.reduce((a, c) => a + (c.percentual ?? 0), 0);
	if (totalPct !== 100) {
		return fail(400, {
			error: `Soma dos percentuais deve ser 100% (atual: ${totalPct}%).`,
		});
	}

	// Resolve participante via listarParticipantes filtering by email.
	let participante: Participante | null = null;
	try {
		const data = await gqlFetch<{ listarParticipantes: Participante[] }>(
			`query { listarParticipantes { id email matriculaSiape origemUnidade codUnidadeAutorizadora codUnidadeLotacao } }`,
			{},
			token
		);
		participante = findParticipanteByEmail(data.listarParticipantes ?? [], user.email);
	} catch (e) {
		return fail(502, {
			error: `Não foi possível carregar seu cadastro de participante: ${(e as Error).message}`,
		});
	}
	if (!participante) {
		return fail(400, {
			error:
				'Você ainda não está cadastrado(a) como participante PGD. Procure sua chefia para regularizar.',
		});
	}

	// Step 1 — criar PT (skip se já temos planoCriadoId — retomada de falha anterior)
	let planoId = planoCriadoId;
	if (!planoId) {
		const cpfParticipante = ''; // backend infere via participanteId quando vazio
		const idPlanoTrabalho = `PT-${user.id}-${Date.now()}`;
		const input = {
			idPlanoTrabalho,
			origemUnidade: participante.origemUnidade,
			codUnidadeAutorizadora: participante.codUnidadeAutorizadora,
			codUnidadeExecutora: participante.codUnidadeLotacao,
			codUnidadeLotacaoParticipante: participante.codUnidadeLotacao,
			cpfParticipante,
			matriculaSiape: participante.matriculaSiape,
			dataInicio,
			dataTermino: dataFim,
			cargaHorariaDisponivel: cargaHoras,
			criteriosAvaliacao: criterios.join('\n'),
			planoEntregasId,
		};
		try {
			const payload = await gqlFetch<{ criarPlanoTrabalho: { id: string } }>(
				CRIAR_PT_MUTATION,
				{ participanteId: participante.id, input },
				token
			);
			planoId = payload.criarPlanoTrabalho.id;
		} catch (e) {
			return fail(502, {
				error: `Falha ao criar plano de trabalho: ${(e as Error).message}`,
			});
		}
	}

	// Step 2 — contribuições (retoma do índice salvo)
	for (let i = contribuicoesCriadas; i < contribuicoes.length; i++) {
		const c = contribuicoes[i];
		try {
			await gqlFetch(
				ADICIONAR_CONTRIBUICAO_MUTATION,
				{
					pid: planoId,
					input: {
						idContribuicao: `C-${planoId}-${i}`,
						tipoContribuicao: c.tipo,
						percentualContribuicao: c.percentual,
						descricao: c.descricao,
						idPlanoEntregas: c.idPlanoEntregas ?? null,
					},
				},
				token
			);
		} catch (e) {
			return fail(502, {
				error: `Falha ao adicionar contribuição ${i + 1}/${contribuicoes.length}: ${(e as Error).message}`,
				planoCriadoId: planoId,
				contribuicoesCriadas: i,
			});
		}
	}

	// Step 3 — enviar para chefia (apenas se acao=enviar)
	if (acao === 'enviar') {
		try {
			await gqlFetch(ENVIAR_PT_MUTATION, { id: planoId }, token);
		} catch (e) {
			return fail(502, {
				error: `Plano criado mas falha ao enviar para chefia: ${(e as Error).message}`,
				planoCriadoId: planoId,
				contribuicoesCriadas: contribuicoes.length,
			});
		}
		redirect(303, '/meu-plano?plano=enviado');
	}

	redirect(303, `/meu-plano?plano=rascunho`);
}

export const actions: Actions = {
	salvarRascunho: async (event) => {
		const formData = await event.request.formData();
		return executarSubmit({
			cookies: event.cookies,
			formData,
			acao: 'rascunho',
		});
	},
	assinarEnviar: async (event) => {
		const formData = await event.request.formData();
		return executarSubmit({
			cookies: event.cookies,
			formData,
			acao: 'enviar',
		});
	},
};
