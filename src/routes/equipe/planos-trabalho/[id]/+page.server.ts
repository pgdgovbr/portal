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
      avaliacoes {
        id
        idPeriodoAvaliativo
        dataInicioPeriodoAvaliativo
        dataFimPeriodoAvaliativo
        descricaoExecucao
        ocorrencias
        dataRegistroParticipante
        avaliacaoRegistrosExecucao
        dataAvaliacaoRegistrosExecucao
        avaliacaoJustificativa
        statusRecurso
        recursoTexto
        recursoData
        recursoDecisao
        recursoDecisaoJustificativa
        recursoDecisaoData
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

	// Adapt avaliacoes (flat list from backend) to the shape Svelte expects:
	// contribuicao.registrosExecucao[].avaliacoes[0]
	const avaliacoes = (pt.avaliacoes ?? []) as any[];
	const registrosExecucao = avaliacoes.map((a) => ({
		id: a.id,
		idPeriodoAvaliativo: a.idPeriodoAvaliativo,
		periodoInicio: a.dataInicioPeriodoAvaliativo,
		periodoFim: a.dataFimPeriodoAvaliativo,
		descricaoAtividades: a.descricaoExecucao,
		ocorrencias: a.ocorrencias,
		dataEnvio: a.dataRegistroParticipante,
		status: a.avaliacaoRegistrosExecucao
			? 'AVALIADO'
			: a.dataRegistroParticipante
				? 'AGUARDANDO_AVALIACAO'
				: 'ABERTO',
		avaliacoes: a.avaliacaoRegistrosExecucao
			? [
					{
						id: a.id,
						nota: a.avaliacaoRegistrosExecucao,
						justificativa: a.avaliacaoJustificativa,
						dataAvaliacao: a.dataAvaliacaoRegistrosExecucao,
						recurso:
							a.statusRecurso || a.recursoTexto
								? {
										id: a.id,
										status: a.statusRecurso,
										texto: a.recursoTexto,
										dataAbertura: a.recursoData,
										decisao: a.recursoDecisao,
										decisaoJustificativa: a.recursoDecisaoJustificativa,
										dataDecisao: a.recursoDecisaoData,
									}
								: null,
					},
				]
			: [],
	}));

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
		// Put all registros under the first contribuicao so the flatMap in the
		// Svelte component picks them up (and avoid duplicating per contribuição).
		contribuicoes: (pt.contribuicoes ?? []).map((c: any, idx: number) => ({
			...c,
			registrosExecucao: idx === 0 ? registrosExecucao : [],
		})),
	};

	return { plano };
};
