import { gqlFetch } from '$lib/graphql';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const QUERY = `
  query MeuPlano {
    meusPlanosTrabalho {
      id
      status
      dataInicio
      dataTermino
      cargaHorariaDisponivel
      contribuicoes {
        id
        descricao
        percentualContribuicao
      }
      avaliacoes {
        id
        idPeriodoAvaliativo
        dataInicioPeriodoAvaliativo
        dataFimPeriodoAvaliativo
        descricaoExecucao
        dataRegistroParticipante
        avaliacaoRegistrosExecucao
        dataAvaliacaoRegistrosExecucao
        avaliacaoJustificativa
        statusRecurso
      }
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

export const load: PageServerLoad = async ({ cookies, parent }) => {
	const { user } = await parent();
	if (!user) redirect(302, '/');

	const token = cookies.get('access_token');

	try {
		const data = await gqlFetch<{ meusPlanosTrabalho: any[] }>(QUERY, {}, token);
		const planos = (data.meusPlanosTrabalho ?? []).map((pt) => {
			const avaliacoes = (pt.avaliacoes ?? []) as any[];
			const registrosExecucao = avaliacoes.map((a) => ({
				id: a.id,
				idPeriodoAvaliativo: a.idPeriodoAvaliativo,
				periodoInicio: a.dataInicioPeriodoAvaliativo,
				periodoFim: a.dataFimPeriodoAvaliativo,
				descricaoAtividades: a.descricaoExecucao,
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
								avaliador: null,
							},
						]
					: [],
			}));
			return {
				...pt,
				status: STATUS_MAP[pt.status] ?? String(pt.status),
				dataFim: pt.dataTermino,
				totalHorasDisponiveis: pt.cargaHorariaDisponivel,
				modalidade: 'TELETRABALHO_PARCIAL',
				unidadeAutorizadoraNome: 'SEGES/MGI',
				contribuicoes: (pt.contribuicoes ?? []).map((c: any, idx: number) => ({
					...c,
					registrosExecucao: idx === 0 ? registrosExecucao : [],
				})),
			};
		});
		return { planosTrabalho: planos };
	} catch {
		return { planosTrabalho: [] };
	}
};
