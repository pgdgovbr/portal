import { gqlFetch } from '$lib/graphql';
import { redirect } from '@sveltejs/kit';
import { STATUS_PLANO_INT, type StatusPlano } from '$lib/types';
import type { PageServerLoad } from './$types';

const QUERY = `
  query MeuPlano {
    meusPlanosTrabalho {
      id
      status
      dataInicio
      dataTermino
      cargaHorariaDisponivel
      contribuicoes {
        id
        descricao
        percentualContribuicao
      }
      avaliacoes {
        id
        idPeriodoAvaliativo
        dataInicioPeriodoAvaliativo
        dataFimPeriodoAvaliativo
        descricaoExecucao
        dataRegistroParticipante
        avaliacaoRegistrosExecucao
        dataAvaliacaoRegistrosExecucao
        avaliacaoJustificativa
        statusRecurso
      }
    }
  }
`;

/**
 * Status que indicam o PT está em pactuação (ainda não pactuado / não em execução).
 * Nessas situações, a tela mostra OwnershipBanner em vez do detalhe do plano.
 */
const STATUS_PACTUACAO: ReadonlySet<StatusPlano> = new Set([
	'RASCUNHO_PARTICIPANTE',
	'RASCUNHO_CHEFIA',
	'AGUARDANDO_ASSINATURA_PARTICIPANTE',
	'AGUARDANDO_ASSINATURA_CHEFIA'
]);

/**
 * Status terminais — entram no card "Planos anteriores".
 */
const STATUS_TERMINAL: ReadonlySet<StatusPlano> = new Set([
	'CONCLUIDO',
	'AVALIADO',
	'CANCELADO'
]);

export const load: PageServerLoad = async ({ cookies, parent }) => {
	const { user } = await parent();
	if (!user) redirect(302, '/');

	const token = cookies.get('access_token');

	try {
		const data = await gqlFetch<{ meusPlanosTrabalho: any[] }>(QUERY, {}, token);
		const planos = (data.meusPlanosTrabalho ?? []).map((pt) => {
			const avaliacoes = (pt.avaliacoes ?? []) as any[];
			const registrosExecucao = avaliacoes.map((a) => ({
				id: a.id,
				idPeriodoAvaliativo: a.idPeriodoAvaliativo,
				periodoInicio: a.dataInicioPeriodoAvaliativo,
				periodoFim: a.dataFimPeriodoAvaliativo,
				descricaoAtividades: a.descricaoExecucao,
				dataEnvio: a.dataRegistroParticipante,
				status: a.avaliacaoRegistrosExecucao
					? 'AVALIADO'
					: a.dataRegistroParticipante
						? 'AGUARDANDO_AVALIACAO'
						: 'ABERTO',
				avaliacoes: a.avaliacaoRegistrosExecucao
					? [
							{
								id: a.id,
								nota: a.avaliacaoRegistrosExecucao,
								justificativa: a.avaliacaoJustificativa,
								dataAvaliacao: a.dataAvaliacaoRegistrosExecucao,
								avaliador: null,
							},
						]
					: [],
			}));
			const status = STATUS_PLANO_INT[pt.status] ?? String(pt.status);
			return {
				...pt,
				status,
				dataFim: pt.dataTermino,
				totalHorasDisponiveis: pt.cargaHorariaDisponivel,
				modalidade: 'TELETRABALHO_PARCIAL',
				unidadeAutorizadoraNome: 'SEGES/MGI',
				contribuicoes: (pt.contribuicoes ?? []).map((c: any, idx: number) => ({
					...c,
					registrosExecucao: idx === 0 ? registrosExecucao : [],
				})),
			};
		});

		const planoAtivo = planos.find((p) => p.status === 'EM_EXECUCAO') ?? null;
		const planoEmPactuacao =
			planos.find((p) => STATUS_PACTUACAO.has(p.status as StatusPlano)) ?? null;
		const planosAnteriores = planos.filter((p) =>
			STATUS_TERMINAL.has(p.status as StatusPlano)
		);

		return {
			planosTrabalho: planos,
			planoAtivo,
			planoEmPactuacao,
			planosAnteriores
		};
	} catch {
		return {
			planosTrabalho: [],
			planoAtivo: null,
			planoEmPactuacao: null,
			planosAnteriores: []
		};
	}
};
