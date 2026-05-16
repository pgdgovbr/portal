import { gqlFetch } from '$lib/graphql';
import { error, redirect } from '@sveltejs/kit';
import { STATUS_PLANO_INT, type StatusPlano } from '$lib/types';
import {
	calcularDiffDesdeUltimaSubmissao,
	type AuditLogEntry
} from '$lib/audit-to-timeline';
import type { PageServerLoad } from './$types';

const QUERY = `
  query PlanoTrabalhoChefiaRevisar($id: ID!) {
    planoTrabalho(id: $id) {
      id
      idPlanoTrabalho
      participanteId
      status
      dataInicio
      dataTermino
      cargaHorariaDisponivel
      criteriosAvaliacao
      contribuicoes {
        id
        descricao
        percentualContribuicao
        tipoContribuicao
      }
      dataAssinaturaParticipante
      dataAssinaturaChefia
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

interface RawParticipante {
	id: string;
	nome: string;
	matriculaSiape: string;
	email: string;
}

interface RawPt {
	id: string;
	idPlanoTrabalho: string;
	participanteId: string;
	status: number;
	dataInicio: string;
	dataTermino: string;
	cargaHorariaDisponivel: number;
	criteriosAvaliacao: string | null;
	contribuicoes?: Array<{
		id: string;
		descricao: string;
		percentualContribuicao: number;
		tipoContribuicao?: number;
	}>;
	dataAssinaturaParticipante: string | null;
	dataAssinaturaChefia: string | null;
}

export const load: PageServerLoad = async ({ params, cookies, parent }) => {
	const { user } = await parent();
	if (!user) redirect(302, '/');

	const token = cookies.get('access_token');

	let data: {
		planoTrabalho: RawPt | null;
		historicoPlanoTrabalho: AuditLogEntry[];
		listarParticipantes: RawParticipante[];
	};
	try {
		data = await gqlFetch(QUERY, { id: params.id }, token);
	} catch {
		error(500, 'Erro ao carregar plano');
	}

	const pt = data.planoTrabalho;
	if (!pt) error(404, 'Plano não encontrado');

	const status: StatusPlano =
		(STATUS_PLANO_INT[pt.status] as StatusPlano) ?? ('CANCELADO' as StatusPlano);

	// Chefia só revisa quando o PT está aguardando assinatura dela.
	if (status !== 'AGUARDANDO_ASSINATURA_CHEFIA') {
		redirect(302, '/equipe');
	}

	const participantes = data.listarParticipantes ?? [];
	const participante = participantes.find((p) => p.id === pt.participanteId) ?? null;

	// Validação de permissão: o usuário não pode ser o próprio participante
	// (somente uma chefia poderia receber o PT para assinatura).
	// O backend é a fonte de verdade da autorização final — aqui só evitamos
	// um usuário visualizar o "seu próprio" plano via essa rota.
	const userEmail = (user as { email?: string }).email;
	if (participante && userEmail && participante.email === userEmail) {
		error(403, 'Você não pode revisar seu próprio plano nesta rota');
	}

	const historico = data.historicoPlanoTrabalho ?? [];

	// Diff comparando a última submissão do participante (envio para a chefia)
	// com o estado atual do PT (que pode ter sido editado pela própria chefia
	// em fluxo de exceção; nesse caso o diff seria vazio se chefia não alterou).
	const diff = participante
		? calcularDiffDesdeUltimaSubmissao(
				historico,
				{
					dataInicio: pt.dataInicio,
					dataTermino: pt.dataTermino,
					cargaHorariaDisponivel: pt.cargaHorariaDisponivel,
					criteriosAvaliacao: pt.criteriosAvaliacao ?? ''
				},
				{ userEmail: participante.email }
			)
		: [];

	const plano = {
		...pt,
		status,
		participante,
		modalidade: 'TELETRABALHO_PARCIAL',
		unidadeAutorizadoraNome: 'SEGES/MGI'
	};

	return {
		plano,
		historico,
		diff,
		participanteNome: participante?.nome ?? 'Servidor'
	};
};
