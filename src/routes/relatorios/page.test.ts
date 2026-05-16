import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import RelatoriosPage from './+page.svelte';

describe('Relatórios (+page.svelte)', () => {
	it('renderiza sem erros', () => {
		expect(() => render(RelatoriosPage)).not.toThrow();
	});

	it('renderiza o título "Relatórios"', () => {
		render(RelatoriosPage);

		expect(screen.getByRole('heading', { name: 'Relatórios' })).toBeInTheDocument();
	});

	it('renderiza card "Sem Plano de Trabalho"', () => {
		render(RelatoriosPage);

		expect(screen.getByText('Sem Plano de Trabalho')).toBeInTheDocument();
	});

	it('renderiza card "Avaliações Pendentes"', () => {
		render(RelatoriosPage);

		expect(screen.getByText('Avaliações Pendentes')).toBeInTheDocument();
	});

	it('renderiza card "Progresso por Unidade"', () => {
		render(RelatoriosPage);

		expect(screen.getByText('Progresso por Unidade')).toBeInTheDocument();
	});

	it('renderiza card "Distribuição de Notas"', () => {
		render(RelatoriosPage);

		expect(screen.getByText('Distribuição de Notas')).toBeInTheDocument();
	});

	it('renderiza card "Registros em Atraso"', () => {
		render(RelatoriosPage);

		expect(screen.getByText('Registros em Atraso')).toBeInTheDocument();
	});

	it('renderiza card "Conformidade API"', () => {
		render(RelatoriosPage);

		expect(screen.getByText('Conformidade API')).toBeInTheDocument();
	});

	it('renderiza múltiplos botões "Gerar relatório"', () => {
		render(RelatoriosPage);

		// Each card div has role="button" wrapping a <button>; we expect both to
		// match. Verify we have at least 6 (one per card).
		const botoes = screen.getAllByRole('button', { name: /Gerar relatório/i });
		expect(botoes.length).toBeGreaterThanOrEqual(6);
	});
});
