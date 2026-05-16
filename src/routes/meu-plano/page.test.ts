import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import MeuPlanoPage from './+page.svelte';

// Helper que monta o shape completo de PageData (planoAtivo / planoEmPactuacao
// derivados da lista). O componente também faz fallback se vierem null.
function makeData(opts: {
	planosTrabalho?: any[];
	planosAnteriores?: any[];
	planoAtivo?: any;
	planoEmPactuacao?: any;
}) {
	const planosTrabalho = opts.planosTrabalho ?? [];
	const planosAnteriores = opts.planosAnteriores ?? [];
	const STATUS_PACTUACAO = new Set([
		'RASCUNHO_PARTICIPANTE',
		'RASCUNHO_CHEFIA',
		'AGUARDANDO_ASSINATURA_PARTICIPANTE',
		'AGUARDANDO_ASSINATURA_CHEFIA'
	]);
	const planoAtivo =
		opts.planoAtivo ?? planosTrabalho.find((p) => p.status === 'EM_EXECUCAO') ?? null;
	const planoEmPactuacao =
		opts.planoEmPactuacao ?? planosTrabalho.find((p) => STATUS_PACTUACAO.has(p.status)) ?? null;
	return {
		user: null,
		planosTrabalho,
		planosAnteriores,
		planoAtivo,
		planoEmPactuacao
	};
}

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

const makePlanoEmPactuacao = (
	status: string,
	overrides: Record<string, unknown> = {}
) => ({
	id: 'pt-123',
	status,
	unidadeAutorizadoraNome: 'CGTI',
	dataInicio: '2026-01-01',
	dataFim: '2026-06-30',
	totalHorasDisponiveis: 40,
	modalidade: 'TELETRABALHO_INTEGRAL',
	contribuicoes: [],
	...overrides
});

const makePlanoAnterior = (overrides: Record<string, unknown> = {}) => ({
	id: 'PT-2025-08',
	status: 'CONCLUIDO',
	dataInicio: '2025-08-01',
	dataFim: '2026-01-31',
	totalHorasDisponiveis: 40,
	modalidade: 'TELETRABALHO_INTEGRAL',
	contribuicoes: [],
	...overrides
});

describe('Meu Plano (+page.svelte)', () => {
	describe('lista vazia (sem PT em pactuação nem ativo)', () => {
		it('renderiza sem erros quando planosTrabalho está vazio', () => {
			const data = makeData({});
			expect(() => render(MeuPlanoPage, { props: { data } })).not.toThrow();
		});

		it('quando planos vazios → renderiza CTA "Criar plano do zero"', () => {
			const data = makeData({});
			render(MeuPlanoPage, { props: { data } });

			const link = screen.getByRole('link', { name: /Criar plano do zero/i });
			expect(link).toBeInTheDocument();
			expect(link).toHaveAttribute('href', '/meu-plano/criar');
		});

		it('quando planos vazios e há planosAnteriores → renderiza opção "Clonar plano anterior"', () => {
			const data = makeData({ planosAnteriores: [makePlanoAnterior()] });
			render(MeuPlanoPage, { props: { data } });

			expect(
				screen.getByRole('button', { name: /Clonar plano anterior/i })
			).toBeInTheDocument();
		});

		it('quando planos vazios e SEM planosAnteriores → NÃO renderiza opção de clonar', () => {
			const data = makeData({});
			render(MeuPlanoPage, { props: { data } });

			expect(
				screen.queryByRole('button', { name: /Clonar plano anterior/i })
			).toBeNull();
		});
	});

	describe('com plano em estado de pactuação', () => {
		it('quando há plano em RASCUNHO_PARTICIPANTE → renderiza OwnershipBanner variant=comigo-editor', () => {
			const data = makeData({
				planosTrabalho: [makePlanoEmPactuacao('RASCUNHO_PARTICIPANTE')]
			});
			render(MeuPlanoPage, { props: { data } });

			expect(
				screen.getByText(/Este plano está com você para ajustes/i)
			).toBeInTheDocument();
		});

		it('quando há plano em AGUARDANDO_ASSINATURA_PARTICIPANTE → renderiza OwnershipBanner variant=comigo-revisor', () => {
			const data = makeData({
				planosTrabalho: [makePlanoEmPactuacao('AGUARDANDO_ASSINATURA_PARTICIPANTE')]
			});
			render(MeuPlanoPage, { props: { data } });

			expect(screen.getByText(/Aguardando sua assinatura/i)).toBeInTheDocument();
		});

		it('quando há plano em AGUARDANDO_ASSINATURA_CHEFIA → renderiza OwnershipBanner variant=com-outro', () => {
			const data = makeData({
				planosTrabalho: [makePlanoEmPactuacao('AGUARDANDO_ASSINATURA_CHEFIA')]
			});
			render(MeuPlanoPage, { props: { data } });

			expect(screen.getByText(/Plano enviado para/i)).toBeInTheDocument();
		});

		it('renderiza link para /meu-plano/[id]/editar quando RASCUNHO_PARTICIPANTE', () => {
			const data = makeData({
				planosTrabalho: [makePlanoEmPactuacao('RASCUNHO_PARTICIPANTE', { id: 'pt-xyz' })]
			});
			render(MeuPlanoPage, { props: { data } });

			const link = screen.getByRole('link', { name: /Continuar edição|Continuar/i });
			expect(link).toHaveAttribute('href', '/meu-plano/pt-xyz/editar');
		});

		it('renderiza link para /meu-plano/[id]/revisar quando AGUARDANDO_ASSINATURA_PARTICIPANTE', () => {
			const data = makeData({
				planosTrabalho: [
					makePlanoEmPactuacao('AGUARDANDO_ASSINATURA_PARTICIPANTE', { id: 'pt-rev' })
				]
			});
			render(MeuPlanoPage, { props: { data } });

			const link = screen.getByRole('link', { name: /Revisar e assinar|Revisar/i });
			expect(link).toHaveAttribute('href', '/meu-plano/pt-rev/revisar');
		});
	});

	describe('com plano EM_EXECUCAO (não regredir)', () => {
		it('preserva tela atual quando há PT em EM_EXECUCAO', () => {
			const data = makeData({ planosTrabalho: [makePlanoEmExecucao()] });
			render(MeuPlanoPage, { props: { data } });

			// elemento característico da tela atual
			const links = screen.getAllByRole('link', { name: /Registrar execução/i });
			expect(links.length).toBeGreaterThan(0);
			expect(links[0]).toHaveAttribute('href', '/meu-plano/registrar');
		});

		it('mostra o nome da unidade autorizadora do plano', () => {
			const data = makeData({ planosTrabalho: [makePlanoEmExecucao()] });
			render(MeuPlanoPage, { props: { data } });

			const ocorrencias = screen.getAllByText('CGTI');
			expect(ocorrencias.length).toBeGreaterThan(0);
		});
	});
});
