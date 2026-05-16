import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import NotaSelector from './NotaSelector.svelte';

describe('NotaSelector', () => {
	it('renderiza 5 opções de nota', () => {
		render(NotaSelector, { props: { value: null } });
		// 5 botões/blocos numerados de 1 a 5
		for (let n = 1; n <= 5; n++) {
			expect(screen.getByText(String(n))).toBeInTheDocument();
		}
	});

	it('sem valor selecionado, nenhum bloco tem aria-pressed=true', () => {
		const { container } = render(NotaSelector, { props: { value: null } });
		const pressed = container.querySelectorAll('[aria-pressed="true"]');
		expect(pressed.length).toBe(0);
	});

	it('com value=3, o bloco 3 tem aria-pressed=true', () => {
		const { container } = render(NotaSelector, { props: { value: 3 } });
		const pressed = container.querySelectorAll('[aria-pressed="true"]');
		expect(pressed.length).toBe(1);
	});

	it('clicar num bloco chama onchange com o valor correto', async () => {
		const onchange = vi.fn();
		render(NotaSelector, { props: { value: null, onchange } });
		const btn = screen.getByText('2').closest('button') ?? screen.getByText('2');
		await fireEvent.click(btn);
		expect(onchange).toHaveBeenCalledWith(2);
	});

	it('disabled=true torna os botões não-clicáveis', () => {
		const { container } = render(NotaSelector, { props: { value: null, disabled: true } });
		const buttons = container.querySelectorAll('button');
		buttons.forEach((btn) => {
			expect(btn).toBeDisabled();
		});
	});

	// ── Interaction tests ──────────────────────────────────────────────────

	it('clicar nota 4 marca aria-pressed=true no botão 4', async () => {
		const { container } = render(NotaSelector, { props: { value: null } });
		const btn4 = screen.getByLabelText(/nota 4/i);
		await fireEvent.click(btn4);
		expect(btn4.getAttribute('aria-pressed')).toBe('true');
		// Nenhum outro botão deve estar pressionado
		const pressed = container.querySelectorAll('[aria-pressed="true"]');
		expect(pressed.length).toBe(1);
	});

	it('clicar nota 1 e depois nota 5 → apenas nota 5 fica selecionada', async () => {
		const { container } = render(NotaSelector, { props: { value: null } });
		const btn1 = screen.getByLabelText(/nota 1/i);
		const btn5 = screen.getByLabelText(/nota 5/i);

		await fireEvent.click(btn1);
		expect(btn1.getAttribute('aria-pressed')).toBe('true');
		expect(btn5.getAttribute('aria-pressed')).toBe('false');

		await fireEvent.click(btn5);
		expect(btn1.getAttribute('aria-pressed')).toBe('false');
		expect(btn5.getAttribute('aria-pressed')).toBe('true');

		// Apenas 1 selecionado ao todo
		const pressed = container.querySelectorAll('[aria-pressed="true"]');
		expect(pressed.length).toBe(1);
	});

	it('clicar nota seleciona a CSS class "selected" no botão correto', async () => {
		const { container } = render(NotaSelector, { props: { value: null } });
		const btn3 = screen.getByLabelText(/nota 3/i);

		expect(btn3.classList.contains('selected')).toBe(false);
		await fireEvent.click(btn3);
		expect(btn3.classList.contains('selected')).toBe(true);
	});

	it('clicar dois botões diferentes → apenas o último tem class "selected"', async () => {
		const { container } = render(NotaSelector, { props: { value: null } });
		const btn2 = screen.getByLabelText(/nota 2/i);
		const btn4 = screen.getByLabelText(/nota 4/i);

		await fireEvent.click(btn2);
		expect(btn2.classList.contains('selected')).toBe(true);
		expect(btn4.classList.contains('selected')).toBe(false);

		await fireEvent.click(btn4);
		expect(btn2.classList.contains('selected')).toBe(false);
		expect(btn4.classList.contains('selected')).toBe(true);
	});

	it('onchange é chamado cada vez que um botão diferente é clicado', async () => {
		const onchange = vi.fn();
		render(NotaSelector, { props: { value: null, onchange } });

		await fireEvent.click(screen.getByLabelText(/nota 1/i));
		await fireEvent.click(screen.getByLabelText(/nota 3/i));
		await fireEvent.click(screen.getByLabelText(/nota 5/i));

		expect(onchange).toHaveBeenCalledTimes(3);
		expect(onchange).toHaveBeenNthCalledWith(1, 1);
		expect(onchange).toHaveBeenNthCalledWith(2, 3);
		expect(onchange).toHaveBeenNthCalledWith(3, 5);
	});

	it('disabled=true impede onchange de ser chamado ao clicar', async () => {
		const onchange = vi.fn();
		render(NotaSelector, { props: { value: null, onchange, disabled: true } });

		// Buttons are disabled, so click should have no effect
		const btn1 = screen.getByLabelText(/nota 1/i);
		await fireEvent.click(btn1);

		expect(onchange).not.toHaveBeenCalled();
		expect(btn1.getAttribute('aria-pressed')).toBe('false');
	});

	it('o componente usa role=radiogroup com label de acessibilidade', () => {
		const { container } = render(NotaSelector, { props: { value: null } });
		const radiogroup = container.querySelector('[role="radiogroup"]');
		expect(radiogroup).not.toBeNull();
		expect(radiogroup?.getAttribute('aria-label')).toMatch(/nota/i);
	});

	it('botão com value pré-selecionado recebe a CSS class "selected" desde o início', () => {
		const { container } = render(NotaSelector, { props: { value: 2 } });
		const btn2 = screen.getByLabelText(/nota 2/i);
		expect(btn2.classList.contains('selected')).toBe(true);

		// Os demais não devem estar selecionados
		const selectedBtns = container.querySelectorAll('.nota-btn.selected');
		expect(selectedBtns.length).toBe(1);
	});
});
