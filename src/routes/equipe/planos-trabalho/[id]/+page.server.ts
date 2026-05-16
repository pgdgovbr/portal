import { gqlFetch } from '$lib/graphql';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const QUERY = `
  query PlanoDetalhe($id: ID!) {
    planoTrabalho(id: $id) {
      id
      status
      dataInicio
      dataFim
      totalHorasDisponiveis
      modalidade
      unidadeAutorizadoraNome
      criteriosAvaliacao
      participante {
        id
        nome
        siape
        email
      }
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
          ocorrencias
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

export const load: PageServerLoad = async ({ params, cookies }) => {
	const token = cookies.get('access_token');

	let data: { planoTrabalho: unknown };
	try {
		data = await gqlFetch<{ planoTrabalho: unknown }>(QUERY, { id: params.id }, token);
	} catch {
		error(500, 'Erro ao carregar plano');
	}
	if (!data.planoTrabalho) error(404, 'Plano não encontrado');
	return { plano: data.planoTrabalho };
};
