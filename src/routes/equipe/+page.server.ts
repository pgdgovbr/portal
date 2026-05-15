import { gqlFetch } from '$lib/graphql';
import type { PageServerLoad } from './$types';

const QUERY = `
  query ListarEquipe {
    listarParticipantes {
      id
      nome
      siape
      email
      modalidadeExecucao
      planosTrabalho {
        id
        status
        dataInicio
        dataFim
        contribuicoes {
          id
          registrosExecucao {
            id
            status
            dataEnvio
          }
        }
      }
    }
  }
`;

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('access_token');

	try {
		const data = await gqlFetch<{ listarParticipantes: unknown[] }>(QUERY, {}, token);
		return { participantes: data.listarParticipantes ?? [] };
	} catch {
		return { participantes: [] };
	}
};
