import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ConformidadePage from './+page.svelte';

const mockPainel = {
	totalPlanosEnviados: 45,
	totalPlanos: 50,
	ultimaSincronizacao: '2026-05-01T10:00:00',
	erros: []
};

describe('Conformidade (+page.svelte)', () => {
	describe('com painel', () => {
		it('renderiza contagem de planos enviados', () => {
			const data = { user: null, painel: mockPainel };
			render(ConformidadePage, { props: { data } });

			expect(screen.getByText('45')).toBeInTheDocument();
		});

		it('renderiza total de planos', () => {
			const data = { user: null, painel: mockPainel };
			render(ConformidadePage, { props: { data } });

			expect(screen.getByText(/\/ 50/)).toBeInTheDocument();
		});

		it('renderiza percentual de sincronização', () => {
			const data = { user: null, painel: mockPainel };
			render(ConformidadePage, { props: { data } });

			// 45/50 = 90%
			expect(screen.getByText('90% sincronizados')).toBeInTheDocument();
		});

		it('renderiza KPI "Planos enviados"', () => {
			const data = { user: null, painel: mockPainel };
			render(ConformidadePage, { props: { data } });

			expect(screen.getByText('Planos enviados')).toBeInTheDocument();
		});

		it('renderiza KPI "Erros de sincronização"', () => {
			const data = { user: null, painel: mockPainel };
			render(ConformidadePage, { props: { data } });

			expect(screen.getByText('Erros de sincronização')).toBeInTheDocument();
		});

		it('renderiza KPI "Última sincronização"', () => {
			const data = { user: null, painel: mockPainel };
			render(ConformidadePage, { props: { data } });

			expect(screen.getByText('Última sincronização')).toBeInTheDocument();
		});

		it('renderiza banner de sucesso quando sem erros', () => {
			const data = { user: null, painel: mockPainel };
			render(ConformidadePage, { props: { data } });

			expect(screen.getByText('Tudo sincronizado')).toBeInTheDocument();
		});

		it('renderiza título principal "Painel de Conformidade"', () => {
			const data = { user: null, painel: mockPainel };
			render(ConformidadePage, { props: { data } });

			expect(
				screen.getByRole('heading', { name: 'Painel de Conformidade' })
			).toBeInTheDocument();
		});
	});

	describe('sem painel', () => {
		it('renderiza sem erros com painel = null', () => {
			const data = { user: null, painel: null };
			expect(() => render(ConformidadePage, { props: { data } })).not.toThrow();
		});

		it('exibe mensagem de painel indisponível', () => {
			const data = { user: null, painel: null };
			render(ConformidadePage, { props: { data } });

			expect(
				screen.getByText('Painel de conformidade indisponível.')
			).toBeInTheDocument();
		});
	});
});
