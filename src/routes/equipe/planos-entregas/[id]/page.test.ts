import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import PlanoEntregasPage from './+page.svelte';

const mockData = {
	user: null,
	plano: {
		id: '1',
		titulo: 'Entregas 2026',
		status: 'EM_ELABORACAO',
		dataInicio: '2026-01-01',
		dataFim: '2026-12-31',
		unidadeNome: 'SEGES',
		entregas: [],
		timeline: []
	}
};

describe('Plano de Entregas [id] (+page.svelte)', () => {
	it('renderiza sem erros', () => {
		expect(() => render(PlanoEntregasPage, { props: { data: mockData } })).not.toThrow();
	});

	it('mostra o título do plano', () => {
		render(PlanoEntregasPage, { props: { data: mockData } });

		expect(screen.getByRole('heading', { name: 'Entregas 2026' })).toBeInTheDocument();
	});

	it('com entregas vazias, renderiza estado vazio', () => {
		render(PlanoEntregasPage, { props: { data: mockData } });

		expect(screen.getByText('Nenhuma entrega encontrada.')).toBeInTheDocument();
	});
});
