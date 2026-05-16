import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import MeuPlanoPage from './+page.svelte';

const makePlanoEmExecucao = (overrides: Record<string, unknown> = {}) => ({
	id: 'p1',
	status: 'EM_EXECUCAO',
	unidadeAutorizadoraNome: 'CGTI',
	dataInicio: '2026-01-01',
	dataFim: '2026-12-31',
	totalHorasDisponiveis: 40,
	modalidade: 'TELETRABALHO_INTEGRAL',
	contribuicoes: [],
	...overrides
});

describe('Meu Plano (+page.svelte)', () => {
	describe('lista vazia', () => {
		it('renderiza sem erros quando planosTrabalho está vazio', () => {
			const data = { user: null, planosTrabalho: [] };
			expect(() => render(MeuPlanoPage, { props: { data } })).not.toThrow();
		});

		it('exibe estado vazio quando não há plano ativo', () => {
			const data = { user: null, planosTrabalho: [] };
			render(MeuPlanoPage, { props: { data } });

			expect(screen.getByText('Nenhum plano de trabalho ativo')).toBeInTheDocument();
		});
	});

	describe('com plano EM_EXECUCAO', () => {
		it('renderiza sem erros', () => {
			const data = { user: null, planosTrabalho: [makePlanoEmExecucao()] };
			expect(() => render(MeuPlanoPage, { props: { data } })).not.toThrow();
		});

		it('mostra o nome da unidade autorizadora do plano', () => {
			const data = { user: null, planosTrabalho: [makePlanoEmExecucao()] };
			render(MeuPlanoPage, { props: { data } });

			// Aparece como eyebrow e como título
			const ocorrencias = screen.getAllByText('CGTI');
			expect(ocorrencias.length).toBeGreaterThan(0);
		});

		it('renderiza ação "Registrar execução"', () => {
			const data = { user: null, planosTrabalho: [makePlanoEmExecucao()] };
			render(MeuPlanoPage, { props: { data } });

			const links = screen.getAllByRole('link', { name: /Registrar execução/i });
			expect(links.length).toBeGreaterThan(0);
			expect(links[0]).toHaveAttribute('href', '/meu-plano/registrar');
		});
	});
});
