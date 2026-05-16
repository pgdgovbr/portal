import { gqlFetch } from '$lib/graphql';
import { STATUS_PLANO_INT, type StatusPlano } from '$lib/types';
import type { PageServerLoad } from './$types';

const DASHBOARD_QUERY = `
  query Dashboard {
    meusPlanosTrabalho {
      id
      idPlanoTrabalho
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
      idPlanoTrabalho
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
			const data = await gqlFetch<{
				meusPlanosTrabalho: any[];
				minhasNotificacoes: unknown[];
			}>(DASHBOARD_QUERY, {}, token);

			const planos = (data.meusPlanosTrabalho ?? []).map((pt: any) => {
				const statusStr: StatusPlano =
					(STATUS_PLANO_INT[pt.status] as StatusPlano) ?? ('CANCELADO' as StatusPlano);
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
					status: statusStr,
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

			// PTs aguardando assinatura do servidor — bola está com ele.
			const aguardandoMinhaAcao = planos
				.filter((p: any) => p.status === 'AGUARDANDO_ASSINATURA_PARTICIPANTE')
				.map((p: any) => ({
					id: p.id,
					idPlanoTrabalho: p.idPlanoTrabalho ?? null,
					href: `/meu-plano/${p.id}/revisar`
				}));

			return {
				planosTrabalho: planos,
				notificacoes: data.minhasNotificacoes ?? [],
				aguardandoMinhaAcao
			};
		}

		if (user.role === 'chefe_imediato') {
			const data = await gqlFetch<{
				listarParticipantes: unknown[];
				listarPlanosTrabalho: unknown[];
			}>(CHEFIA_DASHBOARD_QUERY, {}, token);

			const participantes = (data.listarParticipantes ?? []) as any[];
			const planos = (data.listarPlanosTrabalho ?? []) as any[];

			const planoMap: Record<string, any[]> = {};
			for (const pl of planos) {
				if (!planoMap[pl.participanteId]) planoMap[pl.participanteId] = [];
				const statusStr: StatusPlano =
					(STATUS_PLANO_INT[pl.status] as StatusPlano) ?? ('CANCELADO' as StatusPlano);
				planoMap[pl.participanteId].push({
					...pl,
					status: statusStr,
					dataFim: pl.dataTermino,
					contribuicoes: [],
				});
			}

			const enriched = participantes.map((p: any) => ({
				...p,
				siape: p.matriculaSiape,
				planosTrabalho: planoMap[p.id] ?? [],
			}));

			// PTs aguardando assinatura da chefia — bola está com ela.
			const aguardandoMinhaAcao: Array<{
				id: string;
				idPlanoTrabalho: string | null;
				participanteNome: string;
				href: string;
			}> = [];
			for (const p of enriched) {
				for (const pl of p.planosTrabalho as any[]) {
					if (pl.status === 'AGUARDANDO_ASSINATURA_CHEFIA') {
						aguardandoMinhaAcao.push({
							id: pl.id,
							idPlanoTrabalho: pl.idPlanoTrabalho ?? null,
							participanteNome: p.nome,
							href: `/equipe/planos-trabalho/${pl.id}/revisar`
						});
					}
				}
			}

			return { participantes: enriched, avaliacoesPendentes: [], aguardandoMinhaAcao };
		}

		return {};
	} catch {
		return {};
	}
};
