import { gqlFetch } from '$lib/graphql';
import type { PageServerLoad } from './$types';

const QUERY = `
  query NovoPlanoDados {
    listarParticipantes {
      id
      nome
      siape
      email
      modalidadeExecucao
      planosTrabalho { id status }
    }
  }
`;

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('access_token');
	try {
		const data = await gqlFetch<any>(QUERY, {}, token);
		return { participantes: data.listarParticipantes ?? [] };
	} catch {
		return { participantes: [] };
	}
};
