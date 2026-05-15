import { gqlFetch } from '$lib/graphql';
import type { PageServerLoad } from './$types';

const QUERY = `
  query ListarParticipantes {
    listarParticipantes {
      id
      nome
      siape
      email
      cpf
      modalidadeExecucao
      planosTrabalho {
        id
        status
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
