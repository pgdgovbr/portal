import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import StatusBadge from './StatusBadge.svelte';

describe('StatusBadge', () => {
	it('renderiza "Em execução" para status EM_EXECUCAO', () => {
		render(StatusBadge, { props: { status: 'EM_EXECUCAO' } });
		expect(screen.getByText('Em execução')).toBeInTheDocument();
	});

	it('renderiza "Aprovado" para status APROVADO', () => {
		render(StatusBadge, { props: { status: 'APROVADO' } });
		expect(screen.getByText('Aprovado')).toBeInTheDocument();
	});

	it('renderiza "Concluído" para status CONCLUIDO', () => {
		render(StatusBadge, { props: { status: 'CONCLUIDO' } });
		expect(screen.getByText('Concluído')).toBeInTheDocument();
	});

	it('renderiza "Avaliado" para status AVALIADO', () => {
		render(StatusBadge, { props: { status: 'AVALIADO' } });
		expect(screen.getByText('Avaliado')).toBeInTheDocument();
	});

	it('renderiza "Cancelado" para status CANCELADO', () => {
		render(StatusBadge, { props: { status: 'CANCELADO' } });
		expect(screen.getByText('Cancelado')).toBeInTheDocument();
	});

	it('renderiza para status desconhecido sem erro', () => {
		expect(() => render(StatusBadge, { props: { status: 'STATUS_INVALIDO' } })).not.toThrow();
	});
});
