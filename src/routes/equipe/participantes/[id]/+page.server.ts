import { gqlFetch } from '$lib/graphql';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const QUERY = `
  query PerfilParticipante($id: ID!) {
    participante(id: $id) {
      id
      nome
      matriculaSiape
      email
      modalidadeExecucao
      situacao
      tipoVinculo
      codUnidadeAutorizadora
      codUnidadeLotacao
      dataAssinaturaTcr
    }
    listarPlanosTrabalho {
      id
      participanteId
      status
      dataInicio
      dataTermino
      cargaHorariaDisponivel
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
		return { participante: null };
	}
	if (!data.participante) error(404, 'Participante não encontrado');

	const p = data.participante;
	const planos = (data.listarPlanosTrabalho ?? []) as any[];
	const planosDoParticipante = planos
		.filter((pl: any) => pl.participanteId === p.id)
		.map((pl: any) => ({
			...pl,
			status: STATUS_MAP[pl.status] ?? String(pl.status),
			dataFim: pl.dataTermino,
			totalHorasDisponiveis: pl.cargaHorariaDisponivel,
		}));

	return {
		participante: {
			...p,
			siape: p.matriculaSiape,
			planosTrabalho: planosDoParticipante,
			afastamentos: [],
		},
	};
};
