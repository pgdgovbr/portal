import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import StatusBadge from './StatusBadge.svelte';

describe('StatusBadge — estados originais', () => {
	it('renderiza "Em execução" para status EM_EXECUCAO', () => {
		render(StatusBadge, { props: { status: 'EM_EXECUCAO' } });
		expect(screen.getByText('Em execução')).toBeInTheDocument();
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

describe('StatusBadge — novos estados de pactuação', () => {
	it('renderiza "Rascunho · servidor" para RASCUNHO_PARTICIPANTE', () => {
		render(StatusBadge, { props: { status: 'RASCUNHO_PARTICIPANTE' } });
		expect(screen.getByText(/Rascunho · servidor/i)).toBeInTheDocument();
	});

	it('renderiza "Rascunho · chefia" para RASCUNHO_CHEFIA', () => {
		render(StatusBadge, { props: { status: 'RASCUNHO_CHEFIA' } });
		expect(screen.getByText(/Rascunho · chefia/i)).toBeInTheDocument();
	});

	it('renderiza "Aguardando chefia" para AGUARDANDO_ASSINATURA_CHEFIA', () => {
		render(StatusBadge, { props: { status: 'AGUARDANDO_ASSINATURA_CHEFIA' } });
		expect(screen.getByText(/Aguardando chefia/i)).toBeInTheDocument();
	});

	it('renderiza "Aguardando servidor" para AGUARDANDO_ASSINATURA_PARTICIPANTE', () => {
		render(StatusBadge, { props: { status: 'AGUARDANDO_ASSINATURA_PARTICIPANTE' } });
		expect(screen.getByText(/Aguardando servidor/i)).toBeInTheDocument();
	});
});

describe('StatusBadge — props size e showIcon', () => {
	it('aceita size="sm" sem erro', () => {
		expect(() =>
			render(StatusBadge, { props: { status: 'EM_EXECUCAO', size: 'sm' } })
		).not.toThrow();
	});

	it('aceita size="lg" sem erro', () => {
		expect(() =>
			render(StatusBadge, { props: { status: 'EM_EXECUCAO', size: 'lg' } })
		).not.toThrow();
	});

	it('aceita showIcon=false sem erro', () => {
		expect(() =>
			render(StatusBadge, { props: { status: 'EM_EXECUCAO', showIcon: false } })
		).not.toThrow();
	});

	it('default mantém compatibilidade — só recebe status', () => {
		expect(() => render(StatusBadge, { props: { status: 'EM_EXECUCAO' } })).not.toThrow();
	});
});

describe('StatusBadge — accessibility', () => {
	it('tem role="status" para leitores de tela', () => {
		const { container } = render(StatusBadge, { props: { status: 'EM_EXECUCAO' } });
		expect(container.querySelector('[role="status"]')).toBeTruthy();
	});
});
