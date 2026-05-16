import { gqlFetch } from '$lib/graphql';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const QUERY = `
  query CriarMeuPlanoDados {
    listarPlanosEntregas {
      id
      idPlanoEntregas
      codUnidadeAutorizadora
      codUnidadeExecutora
      status
      dataInicio
      dataTermino
    }
  }
`;

export const load: PageServerLoad = async ({ cookies, parent }) => {
	const { user } = await parent();
	if (!user) redirect(302, '/');

	const token = cookies.get('access_token');

	let planosEntregas: unknown[] = [];
	try {
		const data = await gqlFetch<{ listarPlanosEntregas: unknown[] }>(QUERY, {}, token);
		planosEntregas = data.listarPlanosEntregas ?? [];
	} catch {
		planosEntregas = [];
	}

	return { user, planosEntregas };
};
