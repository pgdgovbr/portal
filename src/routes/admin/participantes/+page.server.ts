import { gqlFetch } from '$lib/graphql';
import type { PageServerLoad } from './$types';

const QUERY = `
  query ListarParticipantes {
    listarParticipantes {
      id
      nome
      matriculaSiape
      email
      modalidadeExecucao
      situacao
    }
    listarPlanosTrabalho {
      id
      participanteId
      status
    }
  }
`;

const STATUS_MAP: Record<number, string> = {
  1: 'EM_ELABORACAO',
  2: 'AGUARDANDO_APROVACAO',
  3: 'EM_EXECUCAO',
  4: 'CONCLUIDO',
  5: 'CANCELADO',
};

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('access_token');
	try {
		const data = await gqlFetch<{
			listarParticipantes: unknown[];
			listarPlanosTrabalho: unknown[];
		}>(QUERY, {}, token);

		const participantes = (data.listarParticipantes ?? []) as any[];
		const planos = (data.listarPlanosTrabalho ?? []) as any[];

		const planoMap: Record<string, any[]> = {};
		for (const pl of planos) {
			if (!planoMap[pl.participanteId]) planoMap[pl.participanteId] = [];
			planoMap[pl.participanteId].push({ ...pl, status: STATUS_MAP[pl.status] ?? String(pl.status) });
		}

		const enriched = participantes.map((p: any) => ({
			...p,
			siape: p.matriculaSiape,
			planosTrabalho: planoMap[p.id] ?? [],
		}));

		return { participantes: enriched };
	} catch {
		return { participantes: [] };
	}
};
