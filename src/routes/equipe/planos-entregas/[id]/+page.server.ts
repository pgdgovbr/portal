import { gqlFetch } from '$lib/graphql';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const QUERY = `
  query PlanoEntregas($id: ID!) {
    planoEntregas(id: $id) {
      id
      titulo
      status
      dataInicio
      dataFim
      unidadeNome
      entregas {
        id
        titulo
        responsavel { id nome }
        prazo
        status
        progresso
        contribuicoes { id }
      }
      timeline {
        label
        date
        current
        future
        note
      }
    }
  }
`;

export const load: PageServerLoad = async ({ params, cookies }) => {
	const token = cookies.get('access_token');
	let data: any;
	try {
		data = await gqlFetch<any>(QUERY, { id: params.id }, token);
	} catch {
		return { plano: null };
	}
	if (!data.planoEntregas) error(404, 'Plano de entregas não encontrado');
	return { plano: data.planoEntregas };
};
