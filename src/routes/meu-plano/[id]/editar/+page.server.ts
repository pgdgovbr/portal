import { gqlFetch } from '$lib/graphql';
import { error, redirect } from '@sveltejs/kit';
import { STATUS_PLANO_INT, type StatusPlano } from '$lib/types';
import { auditEventsToTimeline, type AuditLogEntry } from '$lib/audit-to-timeline';
import type { PageServerLoad } from './$types';

const QUERY = `
  query PlanoEditar($id: ID!) {
    planoTrabalho(id: $id) {
      id
      idPlanoTrabalho
      participanteId
      status
      dataInicio
      dataTermino
      cargaHorariaDisponivel
      criteriosAvaliacao
      planoEntregasId
      contribuicoes {
        id
        descricao
        percentualContribuicao
      }
      dataAssinaturaParticipante
      dataAssinaturaChefia
      criadoPorRole
    }
    meusPlanosTrabalho {
      id
    }
    historicoPlanoTrabalho(planoId: $id) {
      id
      tableName
      recordId
      action
      userId
      userEmail
      oldValues
      newValues
      createdAt
    }
  }
`;

const STATUS_EDITAVEIS: StatusPlano[] = [
	'RASCUNHO_PARTICIPANTE',
	'AGUARDANDO_ASSINATURA_PARTICIPANTE',
];

interface BackendPlano {
	id: string;
	idPlanoTrabalho: string;
	participanteId: string;
	status: number;
	dataInicio: string;
	dataTermino: string;
	cargaHorariaDisponivel: number;
	criteriosAvaliacao: string;
	planoEntregasId: string | null;
	contribuicoes: Array<{
		id: string;
		descricao: string;
		percentualContribuicao: number;
	}>;
	dataAssinaturaParticipante: string | null;
	dataAssinaturaChefia: string | null;
	criadoPorRole: string;
}

interface QueryResponse {
	planoTrabalho: BackendPlano | null;
	meusPlanosTrabalho: Array<{ id: string }>;
	historicoPlanoTrabalho: AuditLogEntry[];
}

export const load: PageServerLoad = async ({ params, cookies, parent }) => {
	const { user } = await parent();
	if (!user) redirect(302, '/');

	const token = cookies.get('access_token');

	let data: QueryResponse;
	try {
		data = await gqlFetch<QueryResponse>(QUERY, { id: params.id }, token);
	} catch {
		error(500, 'Erro ao carregar plano de trabalho');
	}

	// Null-checks fora do try (error() é re-pego em try/catch)
	if (!data.planoTrabalho) error(404, 'Plano não encontrado');

	const pt = data.planoTrabalho;

	// Ownership: meusPlanosTrabalho é filtrado pelo backend para o user atual.
	// Se o id não aparece lá, o user não é dono.
	const meusIds = new Set((data.meusPlanosTrabalho ?? []).map((p) => p.id));
	if (!meusIds.has(pt.id)) {
		error(403, 'Você não tem permissão para editar este plano');
	}

	const statusStr = STATUS_PLANO_INT[pt.status] ?? null;
	if (!statusStr || !STATUS_EDITAVEIS.includes(statusStr)) {
		// Status não permite edição (EM_EXECUCAO, AGUARDANDO_ASSINATURA_CHEFIA, etc.)
		redirect(302, '/meu-plano');
	}

	const timeline = auditEventsToTimeline(data.historicoPlanoTrabalho ?? [], {
		participanteEmail: user.email,
	});

	const plano = {
		id: pt.id,
		idPlanoTrabalho: pt.idPlanoTrabalho,
		participanteId: pt.participanteId,
		status: statusStr,
		dataInicio: pt.dataInicio,
		dataTermino: pt.dataTermino,
		cargaHorariaDisponivel: pt.cargaHorariaDisponivel,
		criteriosAvaliacao: pt.criteriosAvaliacao,
		planoEntregasId: pt.planoEntregasId,
		contribuicoes: pt.contribuicoes ?? [],
		dataAssinaturaParticipante: pt.dataAssinaturaParticipante,
		dataAssinaturaChefia: pt.dataAssinaturaChefia,
		criadoPorRole: pt.criadoPorRole,
	};

	return { plano, historico: timeline };
};
