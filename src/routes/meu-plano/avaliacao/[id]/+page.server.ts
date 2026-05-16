import { gqlFetch } from '$lib/graphql';
import type { PageServerLoad } from './$types';

const QUERY = `
  query RegistroDetalhe($id: ID!) {
    registroExecucao(id: $id) {
      id
      idPeriodoAvaliativo
      dataInicioPeriodoAvaliativo
      dataFimPeriodoAvaliativo
      descricaoExecucao
      ocorrencias
      dataRegistroParticipante
      avaliacaoRegistrosExecucao
      dataAvaliacaoRegistrosExecucao
      avaliacaoJustificativa
      statusRecurso
      recursoTexto
      recursoData
      recursoDecisao
      recursoDecisaoJustificativa
      recursoDecisaoData
    }
  }
`;

export const load: PageServerLoad = async ({ params, cookies }) => {
	const token = cookies.get('access_token');
	let data: any;
	try {
		data = await gqlFetch<any>(QUERY, { id: params.id }, token);
	} catch {
		return { registro: null };
	}
	const a = data?.registroExecucao;
	if (!a) return { registro: null };

	// Adapt backend shape (flat ARE) to what the Svelte component expects:
	// registro.{periodoInicio, periodoFim, descricaoAtividades, dataEnvio, status}
	// registro.avaliacoes[0].{nota, justificativa, dataAvaliacao, recurso}
	const registro = {
		id: a.id,
		idPeriodoAvaliativo: a.idPeriodoAvaliativo,
		periodoInicio: a.dataInicioPeriodoAvaliativo,
		periodoFim: a.dataFimPeriodoAvaliativo,
		descricaoAtividades: a.descricaoExecucao,
		ocorrencias: a.ocorrencias,
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
						avaliador: null as { nome: string } | null,
						recurso:
							a.statusRecurso || a.recursoTexto
								? {
										id: a.id,
										status: a.statusRecurso,
										justificativa: a.recursoTexto,
										dataAbertura: a.recursoData,
										decisao: a.recursoDecisao,
										decisaoJustificativa: a.recursoDecisaoJustificativa,
										dataDecisao: a.recursoDecisaoData,
									}
								: null,
					},
				]
			: [],
	};

	return { registro };
};
