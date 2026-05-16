import { gqlFetch } from '$lib/graphql';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const QUERY = `
  query PlanoEntregas($id: ID!) {
    planoEntregas(id: $id) {
      id
      idPlanoEntregas
      status
      dataInicio
      dataTermino
      avaliacao
      dataAvaliacao
      codUnidadeAutorizadora
      codUnidadeInstituidora
      codUnidadeExecutora
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

export const load: PageServerLoad = async ({ params, cookies }) => {
	const token = cookies.get('access_token');
	let data: any;
	try {
		data = await gqlFetch<any>(QUERY, { id: params.id }, token);
	} catch {
		return { plano: null };
	}
	if (!data.planoEntregas) error(404, 'Plano de entregas não encontrado');

	const pe = data.planoEntregas;
	const plano = {
		...pe,
		titulo: pe.idPlanoEntregas ?? 'Plano de Entregas',
		status: STATUS_MAP[pe.status] ?? String(pe.status),
		dataFim: pe.dataTermino,
		unidadeNome: `Unidade ${pe.codUnidadeExecutora}`,
		entregas: [],
		timeline: [],
	};

	return { plano };
};
