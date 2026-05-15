import { gqlFetch } from '$lib/graphql';
import type { PageServerLoad } from './$types';

const QUERY = `
  query Conformidade {
    painelConformidade {
      totalPlanosEnviados
      totalPlanos
      ultimaSincronizacao
      erros {
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
  }
`;

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('access_token');
	try {
		const data = await gqlFetch<{ painelConformidade: unknown }>(QUERY, {}, token);
		return { painel: data.painelConformidade };
	} catch {
		return { painel: null };
	}
};
