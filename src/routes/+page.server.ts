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
      siape
      planosTrabalho {
        id
        status
        dataFim
        contribuicoes {
          registrosExecucao {
            id
            status
            dataEnvio
          }
        }
      }
    }
    avaliacoesPendentes: listarRegistrosExecucao(status: "ENVIADO") {
      id
      dataEnvio
      planoTrabalho {
        participante {
          nome
          siape
        }
      }
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
			const data = await gqlFetch<{
				listarParticipantes: unknown[];
				avaliacoesPendentes: unknown[];
			}>(CHEFIA_DASHBOARD_QUERY, {}, token);

			return {
				participantes: data.listarParticipantes ?? [],
				avaliacoesPendentes: data.avaliacoesPendentes ?? []
			};
		}

		return {};
	} catch {
		return {};
	}
};
