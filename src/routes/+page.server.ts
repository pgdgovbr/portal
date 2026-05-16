import { gqlFetch } from '$lib/graphql';
import type { PageServerLoad } from './$types';

const DASHBOARD_QUERY = `
  query Dashboard {
    listarPlanosTrabalho {
      id
      status
      dataInicio
      dataFim
      modalidade
      totalHorasDisponiveis
      unidadeAutorizadoraNome
      participante {
        id
        nome
        siape
      }
      contribuicoes {
        id
        descricao
        percentualContribuicao
        registrosExecucao {
          id
          status
          dataEnvio
          avaliacoes {
            nota
            justificativa
            dataAvaliacao
          }
        }
      }
    }
    minhasNotificacoes(limit: 5) {
      id
      titulo
      lida
      criadaEm
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
			const data = await gqlFetch<{
				listarPlanosTrabalho: unknown[];
				minhasNotificacoes: unknown[];
			}>(DASHBOARD_QUERY, {}, token);

			return {
				planosTrabalho: data.listarPlanosTrabalho ?? [],
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
