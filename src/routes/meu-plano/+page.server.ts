import { gqlFetch } from '$lib/graphql';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const QUERY = `
  query MeuPlano {
    listarPlanosTrabalho {
      id
      status
      dataInicio
      dataFim
      modalidade
      totalHorasDisponiveis
      unidadeAutorizadoraNome
      contribuicoes {
        id
        descricao
        percentualContribuicao
        registrosExecucao {
          id
          status
          dataEnvio
          periodoInicio
          periodoFim
          descricaoAtividades
          avaliacoes {
            id
            nota
            justificativa
            dataAvaliacao
            avaliador { nome }
          }
        }
      }
    }
  }
`;

export const load: PageServerLoad = async ({ cookies, parent }) => {
	const { user } = await parent();
	if (!user) redirect(302, '/');

	const token = cookies.get('access_token');

	try {
		const data = await gqlFetch<{ listarPlanosTrabalho: unknown[] }>(QUERY, {}, token);
		return { planosTrabalho: data.listarPlanosTrabalho ?? [] };
	} catch {
		return { planosTrabalho: [] };
	}
};
