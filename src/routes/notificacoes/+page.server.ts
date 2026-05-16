import { gqlFetch } from '$lib/graphql';
import type { PageServerLoad } from './$types';

const QUERY = `
  query Notificacoes {
    minhasNotificacoes {
      id
      tipoEvento
      conteudo
      enviada
      enviadaEm
      createdAt
    }
  }
`;

const EVENTO_TITULO: Record<string, string> = {
	AVALIACAO_REALIZADA: 'Avaliação realizada',
	RECURSO_ABERTO: 'Recurso aberto',
	RECURSO_DECIDIDO: 'Recurso decidido',
	PRAZO_REGISTRO_IMINENTE: 'Prazo de registro se aproxima',
	CONVOCACAO_EMITIDA: 'Convocação presencial',
	DESLIGAMENTO_REGISTRADO: 'Desligamento do PGD',
	PGD_SUSPENSO_REVOGADO: 'PGD suspenso/revogado',
	PLANO_APROVADO: 'Plano aprovado',
};

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('access_token');
	try {
		const data = await gqlFetch<{ minhasNotificacoes: any[] }>(QUERY, {}, token);
		const notificacoes = (data.minhasNotificacoes ?? []).map((n) => ({
			id: n.id,
			titulo: EVENTO_TITULO[n.tipoEvento] ?? n.tipoEvento,
			corpo: n.conteudo,
			lida: !!n.enviadaEm,
			criadaEm: n.createdAt,
		}));
		return { notificacoes };
	} catch {
		return { notificacoes: [] };
	}
};
