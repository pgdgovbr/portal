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
			const data = { user: null, planosTrabalho: [mockPlanoAtivo], notificacoes: [] };
			render(DashboardPage, { props: { data } });

			expect(screen.getByText('Olá, Carlos')).toBeInTheDocument();
		});

		it('mostra texto do plano ativo com nome da unidade', () => {
			userStore.set({ id: '1', email: 'a@b.com', name: 'Carlos Mendes', role: 'servidor' });
			const data = { user: null, planosTrabalho: [mockPlanoAtivo], notificacoes: [] };
			render(DashboardPage, { props: { data } });

			expect(screen.getByText(/Plano ativo.*CGTI/)).toBeInTheDocument();
		});

		it('renderiza a seção "Plano de Trabalho ativo"', () => {
			userStore.set({ id: '1', email: 'a@b.com', name: 'Carlos Mendes', role: 'servidor' });
			const data = { user: null, planosTrabalho: [mockPlanoAtivo], notificacoes: [] };
			render(DashboardPage, { props: { data } });

			expect(screen.getByText('Plano de Trabalho ativo')).toBeInTheDocument();
		});

		it('renderiza link "Ver plano completo" apontando para /meu-plano', () => {
			userStore.set({ id: '1', email: 'a@b.com', name: 'Carlos Mendes', role: 'servidor' });
			const data = { user: null, planosTrabalho: [mockPlanoAtivo], notificacoes: [] };
			render(DashboardPage, { props: { data } });

			const link = screen.getByRole('link', { name: /Ver plano completo/i });
			expect(link).toBeInTheDocument();
			expect(link).toHaveAttribute('href', '/meu-plano');
		});

		it('renderiza seção "Notificações recentes" sem notificações', () => {
			userStore.set({ id: '1', email: 'a@b.com', name: 'Carlos Mendes', role: 'servidor' });
			const data = { user: null, planosTrabalho: [mockPlanoAtivo], notificacoes: [] };
			render(DashboardPage, { props: { data } });

			expect(screen.getByText('Notificações recentes')).toBeInTheDocument();
			expect(screen.getByText('Nenhuma notificação recente.')).toBeInTheDocument();
		});
	});

	describe('servidor sem plano de trabalho', () => {
		it('mostra mensagem que não há plano ativo', () => {
			userStore.set({ id: '2', email: 'b@b.com', name: 'Maria Souza', role: 'servidor' });
			const data = { user: null, planosTrabalho: [], notificacoes: [] };
			render(DashboardPage, { props: { data } });

			expect(screen.getByText('Você não tem plano de trabalho ativo no momento.')).toBeInTheDocument();
		});

		it('mostra banner de alerta sobre plano inexistente', () => {
			userStore.set({ id: '2', email: 'b@b.com', name: 'Maria Souza', role: 'servidor' });
			const data = { user: null, planosTrabalho: [], notificacoes: [] };
			render(DashboardPage, { props: { data } });

			expect(screen.getByText('Você ainda não tem um Plano de Trabalho ativo')).toBeInTheDocument();
		});

		it('não renderiza a seção de "Plano de Trabalho ativo"', () => {
			userStore.set({ id: '2', email: 'b@b.com', name: 'Maria Souza', role: 'servidor' });
			const data = { user: null, planosTrabalho: [], notificacoes: [] };
			render(DashboardPage, { props: { data } });

			expect(screen.queryByText('Plano de Trabalho ativo')).not.toBeInTheDocument();
		});

		it('renderiza a seção de Acesso rápido', () => {
			userStore.set({ id: '2', email: 'b@b.com', name: 'Maria Souza', role: 'servidor' });
			const data = { user: null, planosTrabalho: [], notificacoes: [] };
			render(DashboardPage, { props: { data } });

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
			const data = { user: null, participantes: [mockParticipante], avaliacoesPendentes: [] };
			render(DashboardPage, { props: { data } });

			expect(screen.getByText('Início · Chefia Imediata')).toBeInTheDocument();
		});

		it('exibe contagem de servidores e avaliações pendentes', () => {
			userStore.set({ id: '3', email: 'c@b.com', name: 'Roberto Chefe', role: 'chefe_imediato' });
			const data = { user: null, participantes: [mockParticipante], avaliacoesPendentes: [] };
			render(DashboardPage, { props: { data } });

			expect(screen.getByText(/1 servidores na equipe/)).toBeInTheDocument();
			expect(screen.getByText(/0 avaliações pendentes/)).toBeInTheDocument();
		});

		it('renderiza card de KPI "Servidores na equipe"', () => {
			userStore.set({ id: '3', email: 'c@b.com', name: 'Roberto Chefe', role: 'chefe_imediato' });
			const data = { user: null, participantes: [mockParticipante], avaliacoesPendentes: [] };
			render(DashboardPage, { props: { data } });

			expect(screen.getByText('Servidores na equipe')).toBeInTheDocument();
		});

		it('renderiza link "Ver equipe" apontando para /equipe', () => {
			userStore.set({ id: '3', email: 'c@b.com', name: 'Roberto Chefe', role: 'chefe_imediato' });
			const data = { user: null, participantes: [mockParticipante], avaliacoesPendentes: [] };
			render(DashboardPage, { props: { data } });

			const links = screen.getAllByRole('link', { name: /Ver equipe/i });
			expect(links.length).toBeGreaterThan(0);
			expect(links[0]).toHaveAttribute('href', '/equipe');
		});

		it('exibe mensagem "Nenhuma avaliação pendente" quando lista está vazia', () => {
			userStore.set({ id: '3', email: 'c@b.com', name: 'Roberto Chefe', role: 'chefe_imediato' });
			const data = { user: null, participantes: [mockParticipante], avaliacoesPendentes: [] };
			render(DashboardPage, { props: { data } });

			expect(screen.getByText('Nenhuma avaliação pendente.')).toBeInTheDocument();
		});

		it('não exibe seção de servidor (sem "Olá," saudação do servidor)', () => {
			userStore.set({ id: '3', email: 'c@b.com', name: 'Roberto Chefe', role: 'chefe_imediato' });
			const data = { user: null, participantes: [mockParticipante], avaliacoesPendentes: [] };
			render(DashboardPage, { props: { data } });

			// chefe_imediato uses "Bom dia" not "Olá"
			expect(screen.queryByText(/Olá, Roberto/)).not.toBeInTheDocument();
		});
	});
});
