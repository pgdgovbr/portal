import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import RecursoPage from './+page.svelte';

describe('Recurso de Avaliação (+page.svelte)', () => {
	it('renderiza um textarea para a justificativa', () => {
		render(RecursoPage);

		const textarea = screen.getByLabelText(/Justificativa para contestação/i);
		expect(textarea).toBeInTheDocument();
		expect(textarea.tagName).toBe('TEXTAREA');
	});

	it('mantém botão de submit desabilitado com menos de 30 caracteres', async () => {
		render(RecursoPage);

		const textarea = screen.getByLabelText(/Justificativa para contestação/i) as HTMLTextAreaElement;
		await fireEvent.input(textarea, { target: { value: 'curto demais' } });

		const submit = screen.getByRole('button', { name: /Enviar contestação/i });
		expect(submit).toBeDisabled();
	});

	it('habilita botão de submit com 30+ caracteres', async () => {
		render(RecursoPage);

		const textarea = screen.getByLabelText(/Justificativa para contestação/i) as HTMLTextAreaElement;
		const trintaCaracteresOuMais = 'Justificativa com pelo menos trinta caracteres detalhados aqui.';
		await fireEvent.input(textarea, { target: { value: trintaCaracteresOuMais } });

		const submit = screen.getByRole('button', { name: /Enviar contestação/i });
		expect(submit).not.toBeDisabled();
	});
});
