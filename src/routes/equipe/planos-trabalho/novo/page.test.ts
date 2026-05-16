import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import NovoPlanoPage from './+page.svelte';

describe('Novo Plano de Trabalho (+page.svelte)', () => {
	it('renderiza sem erros', () => {
		const data = { user: null, participantes: [] };
		expect(() => render(NovoPlanoPage, { props: { data } })).not.toThrow();
	});

	it('renderiza o Stepper de etapas', () => {
		const data = { user: null, participantes: [] };
		render(NovoPlanoPage, { props: { data } });

		// O Stepper renderiza <nav> com aria-label="Etapas do formulário"
		const stepper = screen.getByRole('navigation', { name: /Etapas do formulário/i });
		expect(stepper).toBeInTheDocument();
	});

	it('renderiza botão "Próximo" para avançar entre etapas', () => {
		const data = { user: null, participantes: [] };
		render(NovoPlanoPage, { props: { data } });

		const proxBtn = screen.getByRole('button', { name: /Próximo/i });
		expect(proxBtn).toBeInTheDocument();
	});
});
