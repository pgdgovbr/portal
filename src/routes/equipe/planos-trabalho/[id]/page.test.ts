import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import PlanoTrabalhoPage from './+page.svelte';

const mockPlano = {
	id: '1',
	status: 'EM_EXECUCAO',
	participante: {
		id: '1',
		nome: 'Ana Silva',
		siape: '123',
		email: 'ana@gov.br'
	},
	contribuicoes: [],
	dataInicio: '2026-01-01',
	dataFim: '2026-12-31',
	totalHorasDisponiveis: 160,
	modalidade: 'PRESENCIAL',
	unidadeAutorizadoraNome: 'SEGES',
	criteriosAvaliacao: 'X'
};

describe('Plano de Trabalho [id] (+page.svelte)', () => {
	it('renderiza sem erros', () => {
		const data = { user: null, plano: mockPlano };
		expect(() => render(PlanoTrabalhoPage, { props: { data } })).not.toThrow();
	});

	it('mostra o nome do participante', () => {
		const data = { user: null, plano: mockPlano };
		render(PlanoTrabalhoPage, { props: { data } });

		const ocorrencias = screen.getAllByText('Ana Silva');
		expect(ocorrencias.length).toBeGreaterThan(0);
	});

	it('renderiza badge ou informação de status', () => {
		const data = { user: null, plano: mockPlano };
		render(PlanoTrabalhoPage, { props: { data } });

		// StatusBadge renderiza o label "Em execução" para EM_EXECUCAO
		const statusBadges = screen.getAllByText('Em execução');
		expect(statusBadges.length).toBeGreaterThan(0);
	});
});
