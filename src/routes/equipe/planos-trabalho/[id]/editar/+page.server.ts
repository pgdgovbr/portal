import { gqlFetch } from '$lib/graphql';
import { error, redirect } from '@sveltejs/kit';
import { STATUS_PLANO_INT, type StatusPlano } from '$lib/types';
import { auditEventsToTimeline, type AuditLogEntry } from '$lib/audit-to-timeline';
import type { PageServerLoad } from './$types';

const QUERY = `
  query PlanoChefiaEditar($id: ID!) {
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
    listarParticipantes {
      id
      nome
      matriculaSiape
      email
    }
  }
`;

// Chefia pode editar quando o PT já está no lado dela.
const STATUS_EDITAVEIS_CHEFIA: StatusPlano[] = [
	'RASCUNHO_CHEFIA',
	'AGUARDANDO_ASSINATURA_CHEFIA'
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

interface RawParticipante {
	id: string;
	nome: string;
	matriculaSiape: string;
	email: string;
}

interface QueryResponse {
	planoTrabalho: BackendPlano | null;
	historicoPlanoTrabalho: AuditLogEntry[];
	listarParticipantes: RawParticipante[];
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

	if (!data.planoTrabalho) error(404, 'Plano não encontrado');

	const pt = data.planoTrabalho;
	const statusStr = STATUS_PLANO_INT[pt.status] ?? null;
	if (!statusStr || !STATUS_EDITAVEIS_CHEFIA.includes(statusStr)) {
		// Chefia só pode editar quando o PT está no lado dela.
		redirect(302, '/equipe');
	}

	const participantes = data.listarParticipantes ?? [];
	const participante = participantes.find((p) => p.id === pt.participanteId) ?? null;

	// O usuário não pode ser o próprio participante (essa rota é só chefia).
	const userEmail = (user as { email?: string }).email;
	if (participante && userEmail && participante.email === userEmail) {
		error(403, 'Você não pode editar seu próprio plano por esta rota');
	}

	const timeline = auditEventsToTimeline(data.historicoPlanoTrabalho ?? [], {
		participanteEmail: participante?.email ?? '',
		chefiaEmail: userEmail
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
		criadoPorRole: pt.criadoPorRole
	};

	return { plano, historico: timeline, participanteNome: participante?.nome ?? 'Servidor' };
};
