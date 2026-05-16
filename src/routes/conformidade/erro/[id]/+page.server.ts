import { gqlFetch } from '$lib/graphql';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const QUERY = `
  query ErroDeSincronizacao($id: ID!) {
    erroDeSincronizacao(id: $id) {
      id
      httpStatus
      mensagem
      criadoEm
      tentativas
      planoTrabalho {
        id
        participante { nome siape }
      }
    }
  }
`;

export const load: PageServerLoad = async ({ params, cookies }) => {
	const token = cookies.get('access_token');
	let data: any;
	try {
		data = await gqlFetch(QUERY, { id: params.id }, token);
	} catch {
		return { erro: null };
	}
	if (!data.erroDeSincronizacao) error(404, 'Erro não encontrado');
	return { erro: data.erroDeSincronizacao };
};
