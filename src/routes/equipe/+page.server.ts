import { gqlFetch } from '$lib/graphql';
import { STATUS_PLANO_INT, type StatusPlano } from '$lib/types';
import type { PageServerLoad } from './$types';

const QUERY = `
  query ListarEquipe {
    listarParticipantes {
      id
      nome
      matriculaSiape
      email
      modalidadeExecucao
    }
    listarPlanosTrabalho {
      id
      participanteId
      status
      dataInicio
      dataTermino
      contribuicoes { id }
    }
  }
`;

/**
 * Deriva a "ação esperada da chefia" para um plano:
 *  - "assinar": chefia precisa revisar/assinar
 *  - "aguardar": bola está com o servidor
 *  - "ver": plano em execução ou já finalizado
 */
export function _derivarAcaoChefia(status: StatusPlano | null): 'assinar' | 'aguardar' | 'ver' {
	if (!status) return 'aguardar';
	if (status === 'AGUARDANDO_ASSINATURA_CHEFIA' || status === 'RASCUNHO_CHEFIA') return 'assinar';
	if (status === 'RASCUNHO_PARTICIPANTE' || status === 'AGUARDANDO_ASSINATURA_PARTICIPANTE')
		return 'aguardar';
	return 'ver';
}

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('access_token');

	try {
		const data = await gqlFetch<{
			listarParticipantes: unknown[];
			listarPlanosTrabalho: unknown[];
		}>(QUERY, {}, token);

		const participantes = (data.listarParticipantes ?? []) as any[];
		const planos = (data.listarPlanosTrabalho ?? []) as any[];

		// Index plans by participanteId
		const planoMap: Record<string, any[]> = {};
		for (const pl of planos) {
			if (!planoMap[pl.participanteId]) planoMap[pl.participanteId] = [];
			const statusStr = STATUS_PLANO_INT[pl.status] ?? null;
			planoMap[pl.participanteId].push({
				...pl,
				status: statusStr ?? String(pl.status),
				dataFim: pl.dataTermino,
				acao: _derivarAcaoChefia(statusStr),
				contribuicoes: (pl.contribuicoes ?? []).map((c: any) => ({
					...c,
					registrosExecucao: [], // not exposed in current schema
				})),
			});
		}

		// Attach planosTrabalho and siape alias to each participant
		const enriched = participantes.map((p: any) => ({
			...p,
			siape: p.matriculaSiape,
			planosTrabalho: planoMap[p.id] ?? [],
		}));

		// Total de PTs aguardando assinatura da chefia (para o banner consolidado)
		const pendentesChefia = enriched.reduce(
			(acc, p) =>
				acc + (p.planosTrabalho?.filter((pl: any) => pl.acao === 'assinar').length ?? 0),
			0
		);

		// Primeiro PT pendente (id) para o CTA "Ver primeiro pendente"
		const primeiroPendenteId: string | null =
			enriched
				.flatMap((p: any) => p.planosTrabalho ?? [])
				.find((pl: any) => pl.acao === 'assinar')?.id ?? null;

		return { participantes: enriched, pendentesChefia, primeiroPendenteId };
	} catch {
		return { participantes: [], pendentesChefia: 0, primeiroPendenteId: null };
	}
};
