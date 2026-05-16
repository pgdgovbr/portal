import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import AvaliacaoPage from './+page.svelte';

const makeRegistro = (notaOverride?: number) => ({
	id: '1',
	status: 'AVALIADO',
	periodoInicio: '2026-01-01',
	periodoFim: '2026-01-31',
	descricaoAtividades: 'lorem',
	ocorrencias: null,
	dataEnvio: '2026-02-01',
	avaliacoes: [
		{
			id: 'a1',
			nota: notaOverride ?? 1,
			justificativa: 'Bom trabalho',
			dataAvaliacao: '2026-02-05',
			avaliador: { nome: 'João' },
			recurso: null
		}
	]
});

describe('Avaliação (+page.svelte)', () => {
	describe('com avaliação existente', () => {
		it('renderiza a nota atribuída', () => {
			const data = { user: null, registro: makeRegistro(3) };
			render(AvaliacaoPage, { props: { data } });

			// A nota aparece como dígito grande e dentro do NotaBadge
			const ocorrencias = screen.getAllByText('3');
			expect(ocorrencias.length).toBeGreaterThan(0);
		});

		it('renderiza a justificativa da avaliação', () => {
			const data = { user: null, registro: makeRegistro(3) };
			render(AvaliacaoPage, { props: { data } });

			expect(screen.getByText(/Bom trabalho/)).toBeInTheDocument();
		});

		it('renderiza a seção Justificativa', () => {
			const data = { user: null, registro: makeRegistro(3) };
			render(AvaliacaoPage, { props: { data } });

			expect(screen.getByRole('heading', { name: 'Justificativa' })).toBeInTheDocument();
		});
	});

	describe('contestar avaliação', () => {
		it('mostra botão Contestar quando nota é 4', () => {
			// Nota 4 dentro de prazo (dataAvaliacao recente: hoje é 2026-05-15, mas mock usa 2026-02-05)
			// Para garantir podeRecursar=true, ajustamos dataAvaliacao para o presente
			const today = new Date().toISOString();
			const registro = makeRegistro(4);
			registro.avaliacoes[0].dataAvaliacao = today;
			const data = { user: null, registro };
			render(AvaliacaoPage, { props: { data } });

			const contestar = screen.getByRole('link', { name: /Contestar avaliação/i });
			expect(contestar).toBeInTheDocument();
		});

		it('mostra botão Contestar quando nota é 5', () => {
			const today = new Date().toISOString();
			const registro = makeRegistro(5);
			registro.avaliacoes[0].dataAvaliacao = today;
			const data = { user: null, registro };
			render(AvaliacaoPage, { props: { data } });

			const contestar = screen.getByRole('link', { name: /Contestar avaliação/i });
			expect(contestar).toBeInTheDocument();
		});

		it('NÃO mostra botão Contestar quando nota é 1', () => {
			const today = new Date().toISOString();
			const registro = makeRegistro(1);
			registro.avaliacoes[0].dataAvaliacao = today;
			const data = { user: null, registro };
			render(AvaliacaoPage, { props: { data } });

			expect(screen.queryByRole('link', { name: /Contestar avaliação/i })).not.toBeInTheDocument();
		});

		it('NÃO mostra botão Contestar quando nota é 2', () => {
			const today = new Date().toISOString();
			const registro = makeRegistro(2);
			registro.avaliacoes[0].dataAvaliacao = today;
			const data = { user: null, registro };
			render(AvaliacaoPage, { props: { data } });

			expect(screen.queryByRole('link', { name: /Contestar avaliação/i })).not.toBeInTheDocument();
		});

		it('NÃO mostra botão Contestar quando nota é 3', () => {
			const today = new Date().toISOString();
			const registro = makeRegistro(3);
			registro.avaliacoes[0].dataAvaliacao = today;
			const data = { user: null, registro };
			render(AvaliacaoPage, { props: { data } });

			expect(screen.queryByRole('link', { name: /Contestar avaliação/i })).not.toBeInTheDocument();
		});
	});

	describe('registro nulo', () => {
		it('renderiza sem erros quando registro é null', () => {
			const data = { user: null, registro: null };
			expect(() => render(AvaliacaoPage, { props: { data } })).not.toThrow();
		});

		it('exibe mensagem de avaliação não encontrada', () => {
			const data = { user: null, registro: null };
			render(AvaliacaoPage, { props: { data } });

			expect(screen.getByText('Avaliação não encontrada.')).toBeInTheDocument();
		});
	});
});
