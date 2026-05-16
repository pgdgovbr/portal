import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ParticipantesPage from './+page.svelte';

const mockP = {
	id: '1',
	nome: 'Ana Silva',
	siape: '123456',
	email: 'ana@gov.br',
	cpf: '11122233344',
	modalidadeExecucao: 'PRESENCIAL',
	planosTrabalho: []
};

describe('Admin Participantes (+page.svelte)', () => {
	describe('com participantes', () => {
		it('renderiza o nome do participante', () => {
			const data = { user: null, participantes: [mockP] };
			render(ParticipantesPage, { props: { data } });

			expect(screen.getByText('Ana Silva')).toBeInTheDocument();
		});

		it('renderiza o e-mail do participante', () => {
			const data = { user: null, participantes: [mockP] };
			render(ParticipantesPage, { props: { data } });

			expect(screen.getByText('ana@gov.br')).toBeInTheDocument();
		});

		it('renderiza o SIAPE do participante', () => {
			const data = { user: null, participantes: [mockP] };
			render(ParticipantesPage, { props: { data } });

			expect(screen.getByText('123456')).toBeInTheDocument();
		});

		it('renderiza link "Ver" apontando para o participante', () => {
			const data = { user: null, participantes: [mockP] };
			render(ParticipantesPage, { props: { data } });

			const verLink = screen.getByRole('link', { name: 'Ver' });
			expect(verLink).toHaveAttribute('href', '/equipe/participantes/1');
		});
	});

	describe('lista vazia', () => {
		it('renderiza estado vazio', () => {
			const data = { user: null, participantes: [] };
			render(ParticipantesPage, { props: { data } });

			expect(screen.getByText('Nenhum participante cadastrado.')).toBeInTheDocument();
		});

		it('mostra contagem 0 participantes cadastrados', () => {
			const data = { user: null, participantes: [] };
			render(ParticipantesPage, { props: { data } });

			expect(screen.getByText('0 participantes cadastrados')).toBeInTheDocument();
		});
	});

	describe('estrutura da página', () => {
		it('renderiza sem erros com lista vazia', () => {
			const data = { user: null, participantes: [] };
			expect(() => render(ParticipantesPage, { props: { data } })).not.toThrow();
		});

		it('renderiza título "Participantes"', () => {
			const data = { user: null, participantes: [] };
			render(ParticipantesPage, { props: { data } });

			expect(screen.getByRole('heading', { name: 'Participantes' })).toBeInTheDocument();
		});

		it('renderiza link "Cadastrar participante"', () => {
			const data = { user: null, participantes: [] };
			render(ParticipantesPage, { props: { data } });

			const link = screen.getByRole('link', { name: /Cadastrar participante/i });
			expect(link).toHaveAttribute('href', '/admin/participantes/novo');
		});

		it('renderiza input de busca', () => {
			const data = { user: null, participantes: [] };
			render(ParticipantesPage, { props: { data } });

			expect(screen.getByRole('searchbox', { name: /Buscar participante/i })).toBeInTheDocument();
		});
	});
});
