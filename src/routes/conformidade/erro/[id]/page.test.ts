import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ErroPage from './+page.svelte';

const mockErro = {
	id: '42',
	httpStatus: 500,
	mensagem: 'Timeout',
	criadoEm: '2026-05-01T10:00:00',
	tentativas: 3,
	planoTrabalho: {
		id: '1',
		participante: { nome: 'Ana', siape: '123' },
	},
};

describe('Erro de Sincronização [id] (+page.svelte)', () => {
	it('renders with mockErro → shows error message and HTTP status', () => {
		const data = { user: null, erro: mockErro };
		render(ErroPage, { props: { data } });

		expect(screen.getByText('Timeout')).toBeInTheDocument();
		expect(screen.getByText('500')).toBeInTheDocument();
	});

	it('shows participante name from planoTrabalho', () => {
		const data = { user: null, erro: mockErro };
		render(ErroPage, { props: { data } });

		expect(screen.getByText('Ana')).toBeInTheDocument();
	});

	it('shows tentativas count', () => {
		const data = { user: null, erro: mockErro };
		render(ErroPage, { props: { data } });

		expect(screen.getByText('3')).toBeInTheDocument();
	});

	it('renders without crash when data = { erro: null }', () => {
		const data = { user: null, erro: null };
		expect(() => render(ErroPage, { props: { data } })).not.toThrow();
	});
});
