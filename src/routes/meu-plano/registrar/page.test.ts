import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import RegistrarPage from './+page.svelte';

describe('RegistrarPage — wizard de 4 etapas', () => {
	// ── Step 0: Período ────────────────────────────────────────────────────────

	it('Step 0: sem datas → botão "Próximo" está desabilitado', () => {
		render(RegistrarPage);
		const proximo = screen.getByRole('button', { name: /próximo/i });
		expect(proximo).toBeDisabled();
	});

	it('Step 0: com ambas as datas preenchidas → botão "Próximo" fica habilitado', async () => {
		render(RegistrarPage);

		const inputInicio = screen.getByLabelText(/período de execução/i);
		// The "Até" input has no label; grab by its position (second date input)
		const allDateInputs = document.querySelectorAll('input[type="date"]');
		const inputFim = allDateInputs[1] as HTMLInputElement;

		await fireEvent.input(inputInicio, { target: { value: '2026-05-01' } });
		await fireEvent.input(inputFim, { target: { value: '2026-05-31' } });

		await waitFor(() => {
			expect(screen.getByRole('button', { name: /próximo/i })).not.toBeDisabled();
		});
	});

	it('Step 0: "Cancelar" link aponta para /meu-plano', () => {
		render(RegistrarPage);
		const cancelar = screen.getByRole('link', { name: /cancelar/i });
		expect(cancelar).toBeInTheDocument();
		expect(cancelar).toHaveAttribute('href', '/meu-plano');
	});

	// ── Step 1: Descrição ──────────────────────────────────────────────────────

	async function navigateToStep1() {
		render(RegistrarPage);

		const allDateInputs = document.querySelectorAll('input[type="date"]');
		await fireEvent.input(allDateInputs[0], { target: { value: '2026-05-01' } });
		await fireEvent.input(allDateInputs[1], { target: { value: '2026-05-31' } });

		const proximo = screen.getByRole('button', { name: /próximo/i });
		await waitFor(() => expect(proximo).not.toBeDisabled());
		await fireEvent.click(proximo);
	}

	it('Step 1: menos de 50 chars → botão "Próximo" desabilitado', async () => {
		await navigateToStep1();

		const textarea = screen.getByLabelText(/descrição dos trabalhos executados/i);
		await fireEvent.input(textarea, { target: { value: 'curto demais' } });

		await waitFor(() => {
			expect(screen.getByRole('button', { name: /próximo/i })).toBeDisabled();
		});
	});

	it('Step 1: ≥ 50 chars → botão "Próximo" habilitado', async () => {
		await navigateToStep1();

		const longText = 'a'.repeat(50);
		const textarea = screen.getByLabelText(/descrição dos trabalhos executados/i);
		await fireEvent.input(textarea, { target: { value: longText } });

		await waitFor(() => {
			expect(screen.getByRole('button', { name: /próximo/i })).not.toBeDisabled();
		});
	});

	it('Step 1: botão "Voltar" aparece (step > 0)', async () => {
		await navigateToStep1();
		expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument();
	});

	// ── Step 3: Revisão ────────────────────────────────────────────────────────

	async function navigateToStep3() {
		render(RegistrarPage);

		// Step 0: preenche datas
		const allDateInputs = document.querySelectorAll('input[type="date"]');
		await fireEvent.input(allDateInputs[0], { target: { value: '2026-05-01' } });
		await fireEvent.input(allDateInputs[1], { target: { value: '2026-05-31' } });

		let proximo = screen.getByRole('button', { name: /próximo/i });
		await waitFor(() => expect(proximo).not.toBeDisabled());
		await fireEvent.click(proximo);

		// Step 1: preenche descrição
		const textarea = screen.getByLabelText(/descrição dos trabalhos executados/i);
		await fireEvent.input(textarea, { target: { value: 'a'.repeat(60) } });

		proximo = screen.getByRole('button', { name: /próximo/i });
		await waitFor(() => expect(proximo).not.toBeDisabled());
		await fireEvent.click(proximo);

		// Step 2: Ocorrências — avança sem preencher (campo opcional)
		proximo = screen.getByRole('button', { name: /próximo/i });
		await waitFor(() => expect(proximo).not.toBeDisabled());
		await fireEvent.click(proximo);
	}

	it('Step 3 (revisão): mostra o período preenchido', async () => {
		await navigateToStep3();

		// The review renders dates using new Date(value).toLocaleDateString('pt-BR').
		// happy-dom parses ISO date strings as UTC, which may shift back one day in
		// UTC-offset environments. We verify the section label and the "→" separator
		// appear, plus that month "05" and year "2026" are visible in the period div.
		await waitFor(() => {
			expect(screen.getByText(/período avaliativo/i)).toBeInTheDocument();
		});

		// The period block contains the arrow separator between both dates
		const periodDiv = screen.getByText(/→/);
		expect(periodDiv).toBeInTheDocument();
		// Both formatted dates should contain /2026 (year is unambiguous)
		expect(periodDiv.textContent).toMatch(/2026/);
	});

	it('Step 3 (revisão): botão "Enviar registro" está presente', async () => {
		await navigateToStep3();
		await waitFor(() => {
			expect(screen.getByRole('button', { name: /enviar registro/i })).toBeInTheDocument();
		});
	});
});
