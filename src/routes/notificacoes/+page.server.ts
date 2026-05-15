import { gqlFetch } from '$lib/graphql';
import type { PageServerLoad } from './$types';

const QUERY = `
  query Notificacoes {
    minhasNotificacoes(limit: 50) {
      id
      titulo
      corpo
      lida
      criadaEm
    }
  }
`;

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('access_token');
	try {
		const data = await gqlFetch<{ minhasNotificacoes: unknown[] }>(QUERY, {}, token);
		return { notificacoes: data.minhasNotificacoes ?? [] };
	} catch {
		return { notificacoes: [] };
	}
};
