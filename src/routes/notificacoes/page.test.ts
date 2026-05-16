import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import NotificacoesPage from './+page.svelte';

const mockNotif = {
	id: '1',
	titulo: 'Nova avaliação',
	corpo: 'Você recebeu uma avaliação',
	lida: false,
	criadaEm: '2026-05-01T10:00:00'
};

describe('Notificacoes (+page.svelte)', () => {
	describe('com notificações', () => {
		it('renderiza o título da notificação', () => {
			const data = { notificacoes: [mockNotif], user: null };
			render(NotificacoesPage, { props: { data } });

			expect(screen.getByText('Nova avaliação')).toBeInTheDocument();
		});

		it('renderiza o corpo da notificação', () => {
			const data = { notificacoes: [mockNotif], user: null };
			render(NotificacoesPage, { props: { data } });

			expect(screen.getByText('Você recebeu uma avaliação')).toBeInTheDocument();
		});

		it('mostra indicador "Não lida" para notificação não lida', () => {
			const data = { notificacoes: [mockNotif], user: null };
			render(NotificacoesPage, { props: { data } });

			expect(screen.getByLabelText('Não lida')).toBeInTheDocument();
		});

		it('mostra botão "Marcar todas como lidas" quando há não lidas', () => {
			const data = { notificacoes: [mockNotif], user: null };
			render(NotificacoesPage, { props: { data } });

			expect(
				screen.getByRole('button', { name: /Marcar todas como lidas/i })
			).toBeInTheDocument();
		});
	});

	describe('lista vazia', () => {
		it('renderiza estado vazio "Nenhuma notificação"', () => {
			const data = { notificacoes: [], user: null };
			render(NotificacoesPage, { props: { data } });

			expect(
				screen.getByRole('heading', { name: 'Nenhuma notificação' })
			).toBeInTheDocument();
		});

		it('renderiza mensagem "Você está em dia com tudo."', () => {
			const data = { notificacoes: [], user: null };
			render(NotificacoesPage, { props: { data } });

			expect(screen.getByText('Você está em dia com tudo.')).toBeInTheDocument();
		});

		it('não exibe botão "Marcar todas como lidas" se lista vazia', () => {
			const data = { notificacoes: [], user: null };
			render(NotificacoesPage, { props: { data } });

			expect(
				screen.queryByRole('button', { name: /Marcar todas como lidas/i })
			).not.toBeInTheDocument();
		});

		it('renderiza sem erros com lista vazia', () => {
			const data = { notificacoes: [], user: null };
			expect(() => render(NotificacoesPage, { props: { data } })).not.toThrow();
		});
	});

	describe('estrutura da página', () => {
		it('renderiza o título "Notificações"', () => {
			const data = { notificacoes: [], user: null };
			render(NotificacoesPage, { props: { data } });

			expect(screen.getByRole('heading', { name: 'Notificações' })).toBeInTheDocument();
		});
	});
});
