import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import NovoPlanoPage from './+page.svelte';

describe('Novo Plano de Trabalho (+page.svelte)', () => {
	it('renderiza sem erros', () => {
		const data = { user: null, participantes: [] };
		expect(() => render(NovoPlanoPage, { props: { data } })).not.toThrow();
	});

	describe('Step de exceção (Fase 7.4)', () => {
		it('por padrão, mostra o card de confirmação de exceção', () => {
			const data = { user: null, participantes: [] };
			render(NovoPlanoPage, { props: { data } });
			expect(screen.getByTestId('step-excecao')).toBeInTheDocument();
			expect(screen.getByText(/Caminho de exceção · confirme antes de seguir/i)).toBeInTheDocument();
		});

		it('explica que o caminho padrão é o servidor criar o próprio PT', () => {
			const data = { user: null, participantes: [] };
			render(NovoPlanoPage, { props: { data } });
			expect(
				screen.getByText(/caminho padrão é o próprio servidor criar o plano de trabalho/i)
			).toBeInTheDocument();
		});

		it('NÃO renderiza o Stepper antes de confirmar exceção', () => {
			const data = { user: null, participantes: [] };
			render(NovoPlanoPage, { props: { data } });
			expect(
				screen.queryByRole('navigation', { name: /Etapas do formulário/i })
			).not.toBeInTheDocument();
		});

		it('botão "Confirmar e continuar" avança para o wizard', async () => {
			const data = { user: null, participantes: [] };
			render(NovoPlanoPage, { props: { data } });

			const btn = screen.getByTestId('btn-confirmar-excecao');
			await fireEvent.click(btn);

			// Agora o stepper aparece
			expect(
				screen.getByRole('navigation', { name: /Etapas do formulário/i })
			).toBeInTheDocument();
		});

		it('link "Voltar para a equipe" aponta para /equipe', () => {
			const data = { user: null, participantes: [] };
			render(NovoPlanoPage, { props: { data } });
			const link = screen.getByRole('link', { name: /Voltar para a equipe/i });
			expect(link).toHaveAttribute('href', '/equipe');
		});
	});

	describe('Wizard após confirmação', () => {
		it('renderiza o Stepper de etapas após confirmar exceção', async () => {
			const data = { user: null, participantes: [] };
			render(NovoPlanoPage, { props: { data } });
			await fireEvent.click(screen.getByTestId('btn-confirmar-excecao'));

			const stepper = screen.getByRole('navigation', { name: /Etapas do formulário/i });
			expect(stepper).toBeInTheDocument();
		});

		it('renderiza botão "Próximo" após confirmar exceção', async () => {
			const data = { user: null, participantes: [] };
			render(NovoPlanoPage, { props: { data } });
			await fireEvent.click(screen.getByTestId('btn-confirmar-excecao'));

			const proxBtn = screen.getByRole('button', { name: /Próximo/i });
			expect(proxBtn).toBeInTheDocument();
		});
	});
});
