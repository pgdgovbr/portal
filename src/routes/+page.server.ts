import { gqlFetch } from '$lib/graphql';
import type { PageServerLoad } from './$types';

const DASHBOARD_QUERY = `
  query Dashboard {
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
        avaliacaoRegistrosExecucao
        dataAvaliacaoRegistrosExecucao
        statusRecurso
      }
    }
    minhasNotificacoes {
      id
      tipoEvento
      conteudo
      enviadaEm
      createdAt
    }
  }
`;

const CHEFIA_DASHBOARD_QUERY = `
  query ChefiaHome {
    listarParticipantes {
      id
      nome
      matriculaSiape
      modalidadeExecucao
    }
    listarPlanosTrabalho {
      id
      participanteId
      status
      dataTermino
    }
  }
`;

export const load: PageServerLoad = async ({ cookies, parent }) => {
	const { user } = await parent();
	if (!user) return {};

	const token = cookies.get('access_token');

	try {
		if (user.role === 'servidor') {
			const STATUS_MAP: Record<number, string> = {
				1: 'EM_ELABORACAO', 2: 'AGUARDANDO_APROVACAO',
				3: 'EM_EXECUCAO', 4: 'CONCLUIDO', 5: 'CANCELADO',
			};
			const data = await gqlFetch<{
				meusPlanosTrabalho: any[];
				minhasNotificacoes: unknown[];
			}>(DASHBOARD_QUERY, {}, token);

			const planos = (data.meusPlanosTrabalho ?? []).map((pt: any) => {
				const avaliacoes = (pt.avaliacoes ?? []) as any[];
				const registrosExecucao = avaliacoes.map((a) => ({
					id: a.id,
					status: a.avaliacaoRegistrosExecucao
						? 'AVALIADO'
						: 'ABERTO',
					avaliacoes: a.avaliacaoRegistrosExecucao
						? [
								{
									nota: a.avaliacaoRegistrosExecucao,
									dataAvaliacao: a.dataAvaliacaoRegistrosExecucao,
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
					participante: null,
					contribuicoes: (pt.contribuicoes ?? []).map((c: any, idx: number) => ({
						...c,
						registrosExecucao: idx === 0 ? registrosExecucao : [],
					})),
				};
			});

			return {
				planosTrabalho: planos,
				notificacoes: data.minhasNotificacoes ?? []
			};
		}

		if (user.role === 'chefe_imediato') {
			const STATUS_MAP: Record<number, string> = {
				1: 'EM_ELABORACAO', 2: 'AGUARDANDO_APROVACAO',
				3: 'EM_EXECUCAO', 4: 'CONCLUIDO', 5: 'CANCELADO',
			};
			const data = await gqlFetch<{
				listarParticipantes: unknown[];
				listarPlanosTrabalho: unknown[];
			}>(CHEFIA_DASHBOARD_QUERY, {}, token);

			const participantes = (data.listarParticipantes ?? []) as any[];
			const planos = (data.listarPlanosTrabalho ?? []) as any[];

			const planoMap: Record<string, any[]> = {};
			for (const pl of planos) {
				if (!planoMap[pl.participanteId]) planoMap[pl.participanteId] = [];
				planoMap[pl.participanteId].push({
					...pl,
					status: STATUS_MAP[pl.status] ?? String(pl.status),
					dataFim: pl.dataTermino,
					contribuicoes: [],
				});
			}

			const enriched = participantes.map((p: any) => ({
				...p,
				siape: p.matriculaSiape,
				planosTrabalho: planoMap[p.id] ?? [],
			}));

			return { participantes: enriched, avaliacoesPendentes: [] };
		}

		return {};
	} catch {
		return {};
	}
};
