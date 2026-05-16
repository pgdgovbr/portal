import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import InstitucionalPage from './+page.svelte';

describe('Admin Institucional (+page.svelte)', () => {
	it('renderiza sem erros', () => {
		expect(() => render(InstitucionalPage)).not.toThrow();
	});

	it('renderiza o título "Gestão Institucional"', () => {
		render(InstitucionalPage);

		expect(screen.getByRole('heading', { name: 'Gestão Institucional' })).toBeInTheDocument();
	});

	it('renderiza tab "Unidades Autorizadoras"', () => {
		render(InstitucionalPage);

		expect(screen.getByRole('tab', { name: 'Unidades Autorizadoras' })).toBeInTheDocument();
	});

	it('renderiza tab "Unidades Instituidoras"', () => {
		render(InstitucionalPage);

		expect(screen.getByRole('tab', { name: 'Unidades Instituidoras' })).toBeInTheDocument();
	});

	it('renderiza tab "Atos Normativos"', () => {
		render(InstitucionalPage);

		expect(screen.getByRole('tab', { name: 'Atos Normativos' })).toBeInTheDocument();
	});

	it('renderiza tab "Parâmetros de Envio"', () => {
		render(InstitucionalPage);

		expect(screen.getByRole('tab', { name: 'Parâmetros de Envio' })).toBeInTheDocument();
	});

	it('renderiza a navegação por tabs', () => {
		render(InstitucionalPage);

		const nav = screen.getByRole('navigation', { name: /Seções de gestão institucional/i });
		expect(nav).toBeInTheDocument();
	});

	it('aba padrão "Unidades Autorizadoras" mostra o conteúdo correspondente', () => {
		render(InstitucionalPage);

		expect(
			screen.getByRole('heading', { name: 'Unidades Autorizadoras' })
		).toBeInTheDocument();
	});
});
