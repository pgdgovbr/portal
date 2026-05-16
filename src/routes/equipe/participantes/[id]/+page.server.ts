import { gqlFetch } from '$lib/graphql';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const QUERY = `
  query PerfilParticipante($id: ID!) {
    participante(id: $id) {
      id
      nome
      siape
      cpf
      email
      cargo
      unidadeNome
      modalidadeExecucao
      chefiaImediata { id nome }
      planosTrabalho {
        id
        status
        dataInicio
        dataFim
        totalHorasDisponiveis
        avaliacoes {
          id
          nota
          periodo
        }
      }
      afastamentos {
        tipo
        dataInicio
        dataFim
        diasUteis
        futuro
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
		return { participante: null };
	}
	if (!data.participante) error(404, 'Participante não encontrado');
	return { participante: data.participante };
};
