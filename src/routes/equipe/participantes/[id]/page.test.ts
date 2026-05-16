import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ParticipantePage from './+page.svelte';

const mockData = {
	user: null,
	participante: {
		id: '1',
		nome: 'Ana Silva',
		siape: '123456',
		cpf: '111.222.333-44',
		email: 'ana@gov.br',
		cargo: 'Analista',
		unidadeNome: 'SEGES',
		modalidadeExecucao: 'PRESENCIAL',
		chefiaImediata: null,
		planosTrabalho: [],
		afastamentos: []
	}
};

describe('Participante [id] (+page.svelte)', () => {
	it('renderiza sem erros', () => {
		expect(() => render(ParticipantePage, { props: { data: mockData } })).not.toThrow();
	});

	it('mostra o nome do participante', () => {
		render(ParticipantePage, { props: { data: mockData } });

		const ocorrencias = screen.getAllByText('Ana Silva');
		expect(ocorrencias.length).toBeGreaterThan(0);
	});

	it('mostra o SIAPE do participante', () => {
		render(ParticipantePage, { props: { data: mockData } });

		const ocorrencias = screen.getAllByText(/123456/);
		expect(ocorrencias.length).toBeGreaterThan(0);
	});
});
