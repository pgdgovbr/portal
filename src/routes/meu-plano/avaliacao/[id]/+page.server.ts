import { gqlFetch } from '$lib/graphql';
import type { PageServerLoad } from './$types';

const QUERY = `
  query RegistroDetalhe($id: ID!) {
    registroExecucao(id: $id) {
      id
      status
      periodoInicio
      periodoFim
      descricaoAtividades
      ocorrencias
      dataEnvio
      avaliacoes {
        id
        nota
        justificativa
        dataAvaliacao
        avaliador { nome }
        recurso {
          id
          status
          justificativa
          dataAbertura
        }
      }
    }
  }
`;

export const load: PageServerLoad = async ({ params, cookies }) => {
	const token = cookies.get('access_token');
	try {
		const data = await gqlFetch<{ registroExecucao: unknown }>(QUERY, { id: params.id }, token);
		return { registro: data.registroExecucao };
	} catch {
		return { registro: null };
	}
};
