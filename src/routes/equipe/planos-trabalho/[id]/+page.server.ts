import { gqlFetch } from '$lib/graphql';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const QUERY = `
  query PlanoDetalhe($id: ID!) {
    planoTrabalho(id: $id) {
      id
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
    }
    listarParticipantes {
      id
      nome
      matriculaSiape
      email
    }
  }
`;

const STATUS_MAP: Record<number, string> = {
  1: 'EM_ELABORACAO',
  2: 'AGUARDANDO_APROVACAO',
  3: 'EM_EXECUCAO',
  4: 'CONCLUIDO',
  5: 'CANCELADO',
};

export const load: PageServerLoad = async ({ params, cookies }) => {
	const token = cookies.get('access_token');

	let data: any;
	try {
		data = await gqlFetch<any>(QUERY, { id: params.id }, token);
	} catch {
		error(500, 'Erro ao carregar plano');
	}

	if (!data.planoTrabalho) error(404, 'Plano não encontrado');

	const pt = data.planoTrabalho;
	const participantes = (data.listarParticipantes ?? []) as any[];
	const participante = participantes.find((p: any) => p.id === pt.participanteId) ?? null;

	// Build enriched plano compatible with svelte component expectations
	const plano = {
		...pt,
		status: STATUS_MAP[pt.status] ?? String(pt.status),
		dataFim: pt.dataTermino,
		totalHorasDisponiveis: pt.cargaHorariaDisponivel,
		modalidade: 'TELETRABALHO_PARCIAL',
		unidadeAutorizadoraNome: 'SEGES/MGI',
		participante: participante
			? { ...participante, siape: participante.matriculaSiape }
			: null,
		contribuicoes: (pt.contribuicoes ?? []).map((c: any) => ({
			...c,
			registrosExecucao: [], // not exposed in current schema
		})),
	};

	return { plano };
};
