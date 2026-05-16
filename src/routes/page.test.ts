import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { userStore } from '$lib/stores/user';
import DashboardPage from './+page.svelte';

beforeEach(() => {
	userStore.set(null);
});

const mockPlanoAtivo = {
	id: '1',
	status: 'EM_EXECUCAO',
	unidadeAutorizadoraNome: 'CGTI',
	dataInicio: '2025-01-01',
	dataFim: '2025-12-31',
	contribuicoes: []
};

describe('Dashboard (+page.svelte)', () => {
	describe('servidor com plano ativo (EM_EXECUCAO)', () => {
		it('renderiza o título e subtítulo com nome do usuário', () => {
			userStore.set({ id: '1', email: 'a@b.com', name: 'Carlos Mendes', role: 'servidor' });
			const data = { user: null, planosTrabalho: [mockPlanoAtivo], notificacoes: [], aguardandoMinhaAcao: [] };
			render(DashboardPage, { props: { data: data as any } });

			expect(screen.getByText('Olá, Carlos')).toBeInTheDocument();
		});

		it('mostra texto do plano ativo com nome da unidade', () => {
			userStore.set({ id: '1', email: 'a@b.com', name: 'Carlos Mendes', role: 'servidor' });
			const data = { user: null, planosTrabalho: [mockPlanoAtivo], notificacoes: [], aguardandoMinhaAcao: [] };
			render(DashboardPage, { props: { data: data as any } });

			expect(screen.getByText(/Plano ativo.*CGTI/)).toBeInTheDocument();
		});

		it('renderiza a seção "Plano de Trabalho ativo"', () => {
			userStore.set({ id: '1', email: 'a@b.com', name: 'Carlos Mendes', role: 'servidor' });
			const data = { user: null, planosTrabalho: [mockPlanoAtivo], notificacoes: [], aguardandoMinhaAcao: [] };
			render(DashboardPage, { props: { data: data as any } });

			expect(screen.getByText('Plano de Trabalho ativo')).toBeInTheDocument();
		});

		it('renderiza link "Ver plano completo" apontando para /meu-plano', () => {
			userStore.set({ id: '1', email: 'a@b.com', name: 'Carlos Mendes', role: 'servidor' });
			const data = { user: null, planosTrabalho: [mockPlanoAtivo], notificacoes: [], aguardandoMinhaAcao: [] };
			render(DashboardPage, { props: { data: data as any } });

			const link = screen.getByRole('link', { name: /Ver plano completo/i });
			expect(link).toBeInTheDocument();
			expect(link).toHaveAttribute('href', '/meu-plano');
		});

		it('renderiza seção "Notificações recentes" sem notificações', () => {
			userStore.set({ id: '1', email: 'a@b.com', name: 'Carlos Mendes', role: 'servidor' });
			const data = { user: null, planosTrabalho: [mockPlanoAtivo], notificacoes: [], aguardandoMinhaAcao: [] };
			render(DashboardPage, { props: { data: data as any } });

			expect(screen.getByText('Notificações recentes')).toBeInTheDocument();
			expect(screen.getByText('Nenhuma notificação recente.')).toBeInTheDocument();
		});
	});

	describe('servidor sem plano de trabalho', () => {
		it('mostra mensagem que não há plano ativo', () => {
			userStore.set({ id: '2', email: 'b@b.com', name: 'Maria Souza', role: 'servidor' });
			const data = { user: null, planosTrabalho: [], notificacoes: [], aguardandoMinhaAcao: [] };
			render(DashboardPage, { props: { data: data as any } });

			expect(screen.getByText('Você não tem plano de trabalho ativo no momento.')).toBeInTheDocument();
		});

		it('mostra banner de alerta sobre plano inexistente', () => {
			userStore.set({ id: '2', email: 'b@b.com', name: 'Maria Souza', role: 'servidor' });
			const data = { user: null, planosTrabalho: [], notificacoes: [], aguardandoMinhaAcao: [] };
			render(DashboardPage, { props: { data: data as any } });

			expect(screen.getByText('Você ainda não tem um Plano de Trabalho ativo')).toBeInTheDocument();
		});

		it('não renderiza a seção de "Plano de Trabalho ativo"', () => {
			userStore.set({ id: '2', email: 'b@b.com', name: 'Maria Souza', role: 'servidor' });
			const data = { user: null, planosTrabalho: [], notificacoes: [], aguardandoMinhaAcao: [] };
			render(DashboardPage, { props: { data: data as any } });

			expect(screen.queryByText('Plano de Trabalho ativo')).not.toBeInTheDocument();
		});

		it('renderiza a seção de Acesso rápido', () => {
			userStore.set({ id: '2', email: 'b@b.com', name: 'Maria Souza', role: 'servidor' });
			const data = { user: null, planosTrabalho: [], notificacoes: [], aguardandoMinhaAcao: [] };
			render(DashboardPage, { props: { data: data as any } });

			expect(screen.getByText('Acesso rápido')).toBeInTheDocument();
		});
	});

	describe('chefe_imediato', () => {
		const mockParticipante = {
			id: 'p1',
			nome: 'Ana Lima',
			siape: '654321',
			email: 'ana@gov.br',
			planosTrabalho: []
		};

		it('renderiza eyebrow "Chefia Imediata"', () => {
			userStore.set({ id: '3', email: 'c@b.com', name: 'Roberto Chefe', role: 'chefe_imediato' });
			const data = { user: null, participantes: [mockParticipante], avaliacoesPendentes: [], aguardandoMinhaAcao: [] };
			render(DashboardPage, { props: { data: data as any } });

			expect(screen.getByText('Início · Chefia Imediata')).toBeInTheDocument();
		});

		it('exibe contagem de servidores e avaliações pendentes', () => {
			userStore.set({ id: '3', email: 'c@b.com', name: 'Roberto Chefe', role: 'chefe_imediato' });
			const data = { user: null, participantes: [mockParticipante], avaliacoesPendentes: [], aguardandoMinhaAcao: [] };
			render(DashboardPage, { props: { data: data as any } });

			expect(screen.getByText(/1 servidores na equipe/)).toBeInTheDocument();
			expect(screen.getByText(/0 avaliações pendentes/)).toBeInTheDocument();
		});

		it('renderiza card de KPI "Servidores na equipe"', () => {
			userStore.set({ id: '3', email: 'c@b.com', name: 'Roberto Chefe', role: 'chefe_imediato' });
			const data = { user: null, participantes: [mockParticipante], avaliacoesPendentes: [], aguardandoMinhaAcao: [] };
			render(DashboardPage, { props: { data: data as any } });

			expect(screen.getByText('Servidores na equipe')).toBeInTheDocument();
		});

		it('renderiza link "Ver equipe" apontando para /equipe', () => {
			userStore.set({ id: '3', email: 'c@b.com', name: 'Roberto Chefe', role: 'chefe_imediato' });
			const data = { user: null, participantes: [mockParticipante], avaliacoesPendentes: [], aguardandoMinhaAcao: [] };
			render(DashboardPage, { props: { data: data as any } });

			const links = screen.getAllByRole('link', { name: /Ver equipe/i });
			expect(links.length).toBeGreaterThan(0);
			expect(links[0]).toHaveAttribute('href', '/equipe');
		});

		it('exibe mensagem "Nenhuma avaliação pendente" quando lista está vazia', () => {
			userStore.set({ id: '3', email: 'c@b.com', name: 'Roberto Chefe', role: 'chefe_imediato' });
			const data = { user: null, participantes: [mockParticipante], avaliacoesPendentes: [], aguardandoMinhaAcao: [] };
			render(DashboardPage, { props: { data: data as any } });

			expect(screen.getByText('Nenhuma avaliação pendente.')).toBeInTheDocument();
		});

		it('não exibe seção de servidor (sem "Olá," saudação do servidor)', () => {
			userStore.set({ id: '3', email: 'c@b.com', name: 'Roberto Chefe', role: 'chefe_imediato' });
			const data = { user: null, participantes: [mockParticipante], avaliacoesPendentes: [], aguardandoMinhaAcao: [] };
			render(DashboardPage, { props: { data: data as any } });

			// chefe_imediato uses "Bom dia" not "Olá"
			expect(screen.queryByText(/Olá, Roberto/)).not.toBeInTheDocument();
		});
	});

	describe('Aguardando sua ação (Fase 8)', () => {
		it('servidor com PT em AGUARDANDO_ASSINATURA_PARTICIPANTE: renderiza banner com CTA "Revisar agora"', () => {
			userStore.set({ id: '1', email: 'a@b.com', name: 'Ana Costa', role: 'servidor' });
			const data = {
				user: null,
				planosTrabalho: [],
				notificacoes: [],
				aguardandoMinhaAcao: [{ id: 'pt-9', idPlanoTrabalho: 'PT-9', href: '/meu-plano/pt-9/revisar' }]
			};
			render(DashboardPage, { props: { data: data as any } });

			expect(screen.getByTestId('banner-aguardando-minha-acao')).toBeInTheDocument();
			const cta = screen.getByRole('link', { name: /Revisar agora/i });
			expect(cta).toHaveAttribute('href', '/meu-plano/pt-9/revisar');
		});

		it('servidor sem nenhum PT pendente: NÃO renderiza banner', () => {
			userStore.set({ id: '1', email: 'a@b.com', name: 'Ana Costa', role: 'servidor' });
			const data = { user: null, planosTrabalho: [], notificacoes: [], aguardandoMinhaAcao: [] };
			render(DashboardPage, { props: { data: data as any } });

			expect(screen.queryByTestId('banner-aguardando-minha-acao')).not.toBeInTheDocument();
		});

		it('chefia com PT em AGUARDANDO_ASSINATURA_CHEFIA: renderiza card no topo', () => {
			userStore.set({ id: '3', email: 'c@b.com', name: 'Carlos', role: 'chefe_imediato' });
			const data = {
				user: null,
				participantes: [],
				avaliacoesPendentes: [],
				aguardandoMinhaAcao: [
					{
						id: 'pt-77',
						idPlanoTrabalho: 'PT-77',
						participanteNome: 'Lucas Pereira',
						href: '/equipe/planos-trabalho/pt-77/revisar'
					}
				]
			};
			render(DashboardPage, { props: { data: data as any } });

			expect(screen.getByTestId('card-aguardando-minha-acao')).toBeInTheDocument();
			expect(screen.getByText('Lucas Pereira')).toBeInTheDocument();
			const cta = screen.getByRole('link', { name: /Revisar e assinar/i });
			expect(cta).toHaveAttribute('href', '/equipe/planos-trabalho/pt-77/revisar');
		});

		it('chefia sem PTs pendentes: NÃO renderiza card de ação', () => {
			userStore.set({ id: '3', email: 'c@b.com', name: 'Carlos', role: 'chefe_imediato' });
			const data = {
				user: null,
				participantes: [],
				avaliacoesPendentes: [],
				aguardandoMinhaAcao: []
			};
			render(DashboardPage, { props: { data: data as any } });

			expect(screen.queryByTestId('card-aguardando-minha-acao')).not.toBeInTheDocument();
		});

		it('chefia com mais de 5 PTs pendentes: mostra link "Ver todos"', () => {
			userStore.set({ id: '3', email: 'c@b.com', name: 'Carlos', role: 'chefe_imediato' });
			const aguardandoMinhaAcao = Array.from({ length: 7 }).map((_, i) => ({
				id: `pt-${i}`,
				idPlanoTrabalho: `PT-${i}`,
				participanteNome: `Servidor ${i}`,
				href: `/equipe/planos-trabalho/pt-${i}/revisar`
			}));
			const data = {
				user: null,
				participantes: [],
				avaliacoesPendentes: [],
				aguardandoMinhaAcao
			};
			render(DashboardPage, { props: { data: data as any } });

			expect(screen.getByText(/Ver todos \(7\)/i)).toBeInTheDocument();
		});

		it('servidor com 1 PT pendente: usa singular no título do banner', () => {
			userStore.set({ id: '1', email: 'a@b.com', name: 'Ana', role: 'servidor' });
			const data = {
				user: null,
				planosTrabalho: [],
				notificacoes: [],
				aguardandoMinhaAcao: [{ id: 'pt-1', idPlanoTrabalho: 'PT-1', href: '/meu-plano/pt-1/revisar' }]
			};
			render(DashboardPage, { props: { data: data as any } });
			expect(screen.getByText(/1 plano de trabalho aguardando sua assinatura/)).toBeInTheDocument();
		});

		it('chefia com 3 PTs pendentes: usa plural no título do card', () => {
			userStore.set({ id: '3', email: 'c@b.com', name: 'Carlos', role: 'chefe_imediato' });
			const aguardandoMinhaAcao = Array.from({ length: 3 }).map((_, i) => ({
				id: `pt-${i}`,
				idPlanoTrabalho: null,
				participanteNome: `S${i}`,
				href: `/equipe/planos-trabalho/pt-${i}/revisar`
			}));
			const data = {
				user: null,
				participantes: [],
				avaliacoesPendentes: [],
				aguardandoMinhaAcao
			};
			render(DashboardPage, { props: { data: data as any } });
			expect(screen.getByText(/3 planos de trabalho aguardando sua assinatura/)).toBeInTheDocument();
		});
	});
});
