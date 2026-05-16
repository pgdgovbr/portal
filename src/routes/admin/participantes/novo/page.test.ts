import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import NovoParticipantePage from './+page.svelte';

describe('Admin Participantes Novo (+page.svelte)', () => {
	it('renderiza o formulário sem erros', () => {
		expect(() => render(NovoParticipantePage)).not.toThrow();
	});

	it('renderiza o título "Cadastrar Participante"', () => {
		render(NovoParticipantePage);

		expect(screen.getByRole('heading', { name: 'Cadastrar Participante' })).toBeInTheDocument();
	});

	it('renderiza campo de Nome completo', () => {
		render(NovoParticipantePage);

		expect(screen.getByLabelText(/Nome completo/i)).toBeInTheDocument();
	});

	it('renderiza campo de SIAPE', () => {
		render(NovoParticipantePage);

		expect(screen.getByLabelText(/SIAPE/i)).toBeInTheDocument();
	});

	it('renderiza campo de CPF', () => {
		render(NovoParticipantePage);

		expect(screen.getByLabelText(/CPF/i)).toBeInTheDocument();
	});

	it('renderiza campo de E-mail institucional', () => {
		render(NovoParticipantePage);

		expect(screen.getByLabelText(/E-mail institucional/i)).toBeInTheDocument();
	});

	it('renderiza campo de Modalidade de execução', () => {
		render(NovoParticipantePage);

		expect(screen.getByLabelText(/Modalidade de execução/i)).toBeInTheDocument();
	});

	it('renderiza botão "Cadastrar participante"', () => {
		render(NovoParticipantePage);

		expect(screen.getByRole('button', { name: /Cadastrar participante/i })).toBeInTheDocument();
	});

	it('renderiza link "Cancelar"', () => {
		render(NovoParticipantePage);

		const link = screen.getByRole('link', { name: /Cancelar/i });
		expect(link).toHaveAttribute('href', '/admin/participantes');
	});
});
