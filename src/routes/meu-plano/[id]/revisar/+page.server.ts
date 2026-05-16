import { gqlFetch } from '$lib/graphql';
import { error, redirect } from '@sveltejs/kit';
import { STATUS_PLANO_INT, type StatusPlano } from '$lib/types';
import {
	calcularDiffDesdeUltimaSubmissao,
	type AuditLogEntry
} from '$lib/audit-to-timeline';
import type { PageServerLoad } from './$types';

const QUERY = `
  query PlanoTrabalhoRevisar($id: ID!) {
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

	// Só faz sentido revisar quando o PT está com o servidor para assinatura.
	if (status !== 'AGUARDANDO_ASSINATURA_PARTICIPANTE') {
		redirect(302, '/meu-plano');
	}

	const participantes = data.listarParticipantes ?? [];
	const participante = participantes.find((p) => p.id === pt.participanteId) ?? null;

	// Validação de ownership por email — servidor logado tem que ser o dono.
	const userEmail = (user as { email?: string }).email;
	if (!participante || !userEmail || participante.email !== userEmail) {
		error(403, 'Você não tem permissão para revisar este plano');
	}

	const historico = data.historicoPlanoTrabalho ?? [];

	// Diff comparando a última submissão do servidor (envio para a chefia)
	// com o estado atual do plano (que pode ter sido editado pela chefia).
	const diff = calcularDiffDesdeUltimaSubmissao(
		historico,
		{
			dataInicio: pt.dataInicio,
			dataTermino: pt.dataTermino,
			cargaHorariaDisponivel: pt.cargaHorariaDisponivel,
			criteriosAvaliacao: pt.criteriosAvaliacao ?? '',
			trabalhoNoturno: false
		},
		{ userEmail }
	);

	// Tenta achar a chefia (1º participante diferente do servidor — fallback simples)
	const chefia = participantes.find((p) => p.id !== pt.participanteId) ?? null;

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
		chefiaNome: chefia?.nome ?? 'Chefia'
	};
};
