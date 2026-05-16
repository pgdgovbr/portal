import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import EquipePage from './+page.svelte';

const makeParticipante = (overrides: Record<string, unknown> = {}) => ({
	id: '1',
	nome: 'Ana Silva',
	siape: '123456',
	email: 'ana.silva@gov.br',
	modalidadeExecucao: null,
	planosTrabalho: [],
	...overrides
});

const makePlano = (overrides: Record<string, unknown> = {}) => ({
	id: 'pt-1',
	participanteId: '1',
	status: 'AGUARDANDO_ASSINATURA_CHEFIA',
	acao: 'assinar',
	dataInicio: '2026-01-01',
	dataFim: '2026-06-30',
	contribuicoes: [],
	...overrides
});

describe('Equipe (+page.svelte)', () => {
	describe('com participantes', () => {
		it('renderiza o nome do participante na tabela', () => {
			const data = { user: null, participantes: [makeParticipante()] };
			render(EquipePage, { props: { data: data as any } });

			expect(screen.getByText('Ana Silva')).toBeInTheDocument();
		});

		it('renderiza o SIAPE do participante', () => {
			const data = { user: null, participantes: [makeParticipante()] };
			render(EquipePage, { props: { data: data as any } });

			expect(screen.getByText('123456')).toBeInTheDocument();
		});

		it('renderiza o link de perfil do participante', () => {
			const data = { user: null, participantes: [makeParticipante({ id: '42' })] };
			render(EquipePage, { props: { data: data as any } });

			const perfilLink = screen.getByRole('link', { name: 'Perfil' });
			expect(perfilLink).toHaveAttribute('href', '/equipe/participantes/42');
		});

		it('conta corretamente o total de servidores na unidade', () => {
			const data = { user: null, participantes: [makeParticipante()] };
			render(EquipePage, { props: { data: data as any } });

			expect(screen.getByText('1 servidores na sua unidade')).toBeInTheDocument();
		});
	});

	describe('lista vazia', () => {
		it('renderiza sem erros com lista vazia', () => {
			const data = { user: null, participantes: [] };
			expect(() => render(EquipePage, { props: { data: data as any } })).not.toThrow();
		});

		it('exibe mensagem de estado vazio', () => {
			const data = { user: null, participantes: [] };
			render(EquipePage, { props: { data: data as any } });

			expect(screen.getByText('Nenhum participante encontrado.')).toBeInTheDocument();
		});

		it('exibe contagem 0 servidores na unidade', () => {
			const data = { user: null, participantes: [] };
			render(EquipePage, { props: { data: data as any } });

			expect(screen.getByText('0 servidores na sua unidade')).toBeInTheDocument();
		});
	});

	describe('múltiplos participantes', () => {
		const participantes = [
			makeParticipante({ id: '1', nome: 'Ana Silva', siape: '111111' }),
			makeParticipante({ id: '2', nome: 'Bruno Costa', siape: '222222' }),
			makeParticipante({ id: '3', nome: 'Carla Dias', siape: '333333' })
		];

		it('renderiza os nomes de todos os 3 participantes', () => {
			const data = { user: null, participantes };
			render(EquipePage, { props: { data: data as any } });

			expect(screen.getByText('Ana Silva')).toBeInTheDocument();
			expect(screen.getByText('Bruno Costa')).toBeInTheDocument();
			expect(screen.getByText('Carla Dias')).toBeInTheDocument();
		});

		it('exibe contagem correta de 3 servidores', () => {
			const data = { user: null, participantes };
			render(EquipePage, { props: { data: data as any } });

			expect(screen.getByText('3 servidores na sua unidade')).toBeInTheDocument();
		});

		it('renderiza 3 links de perfil individuais', () => {
			const data = { user: null, participantes };
			render(EquipePage, { props: { data: data as any } });

			const perfilLinks = screen.getAllByRole('link', { name: 'Perfil' });
			expect(perfilLinks).toHaveLength(3);
		});

		it('cada link de perfil aponta para o id correto do participante', () => {
			const data = { user: null, participantes };
			render(EquipePage, { props: { data: data as any } });

			const perfilLinks = screen.getAllByRole('link', { name: 'Perfil' });
			expect(perfilLinks[0]).toHaveAttribute('href', '/equipe/participantes/1');
			expect(perfilLinks[1]).toHaveAttribute('href', '/equipe/participantes/2');
			expect(perfilLinks[2]).toHaveAttribute('href', '/equipe/participantes/3');
		});
	});

	describe('estrutura da página', () => {
		it('renderiza o título "Equipe"', () => {
			const data = { user: null, participantes: [] };
			render(EquipePage, { props: { data: data as any } });

			expect(screen.getByRole('heading', { name: 'Equipe' })).toBeInTheDocument();
		});

		it('renderiza eyebrow "Chefia Imediata"', () => {
			const data = { user: null, participantes: [] };
			render(EquipePage, { props: { data: data as any } });

			expect(screen.getByText('Chefia Imediata')).toBeInTheDocument();
		});

		it('renderiza botão de criar plano de trabalho', () => {
			const data = { user: null, participantes: [] };
			render(EquipePage, { props: { data: data as any } });

			const createLink = screen.getByRole('link', { name: /Criar Plano de Trabalho/i });
			expect(createLink).toHaveAttribute('href', '/equipe/planos-trabalho/novo');
		});

		it('renderiza input de busca', () => {
			const data = { user: null, participantes: [] };
			render(EquipePage, { props: { data: data as any } });

			expect(screen.getByRole('searchbox', { name: /Buscar participante/i })).toBeInTheDocument();
		});
	});

	describe('banner pendentes chefia (Fase 7.1)', () => {
		it('não renderiza o banner quando pendentesChefia = 0', () => {
			const data = {
				user: null,
				participantes: [makeParticipante()],
				pendentesChefia: 0,
				primeiroPendenteId: null
			};
			render(EquipePage, { props: { data: data as any } });
			expect(screen.queryByTestId('banner-pendentes-chefia')).not.toBeInTheDocument();
		});

		it('renderiza banner quando há PTs pendentes da chefia', () => {
			const data = {
				user: null,
				participantes: [makeParticipante({ planosTrabalho: [makePlano()] })],
				pendentesChefia: 1,
				primeiroPendenteId: 'pt-1'
			};
			render(EquipePage, { props: { data: data as any } });
			expect(screen.getByTestId('banner-pendentes-chefia')).toBeInTheDocument();
			expect(screen.getByText(/1 plano de trabalho aguardando/i)).toBeInTheDocument();
		});

		it('CTA do banner aponta para /equipe/planos-trabalho/<id>/revisar', () => {
			const data = {
				user: null,
				participantes: [makeParticipante({ planosTrabalho: [makePlano({ id: 'pt-42' })] })],
				pendentesChefia: 1,
				primeiroPendenteId: 'pt-42'
			};
			render(EquipePage, { props: { data: data as any } });
			const link = screen.getByRole('link', { name: /Ver primeiro pendente/i });
			expect(link).toHaveAttribute('href', '/equipe/planos-trabalho/pt-42/revisar');
		});

		it('plural correto: 3 planos aguardando sua assinatura', () => {
			const data = {
				user: null,
				participantes: [makeParticipante({ planosTrabalho: [makePlano()] })],
				pendentesChefia: 3,
				primeiroPendenteId: 'pt-1'
			};
			render(EquipePage, { props: { data: data as any } });
			expect(screen.getByText(/3 planos de trabalho aguardando sua assinatura/i)).toBeInTheDocument();
		});
	});

	describe('tabela com acao "assinar" (Fase 7.1)', () => {
		it('linha com acao="assinar" recebe destaque e botão "Revisar e assinar"', () => {
			const data = {
				user: null,
				participantes: [
					makeParticipante({
						planosTrabalho: [makePlano({ id: 'pt-x', acao: 'assinar' })]
					})
				],
				pendentesChefia: 1,
				primeiroPendenteId: 'pt-x'
			};
			render(EquipePage, { props: { data: data as any } });

			const row = screen.getByTestId('row-acao-assinar');
			expect(row).toBeInTheDocument();

			const revisar = screen.getByRole('link', { name: /Revisar e assinar/i });
			expect(revisar).toHaveAttribute('href', '/equipe/planos-trabalho/pt-x/revisar');
		});

		it('linha com plano EM_EXECUCAO não recebe destaque de aviso', () => {
			const data = {
				user: null,
				participantes: [
					makeParticipante({
						planosTrabalho: [makePlano({ status: 'EM_EXECUCAO', acao: 'ver' })]
					})
				],
				pendentesChefia: 0,
				primeiroPendenteId: null
			};
			render(EquipePage, { props: { data: data as any } });
			expect(screen.queryByTestId('row-acao-assinar')).not.toBeInTheDocument();
		});
	});
});
