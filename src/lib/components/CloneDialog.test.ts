import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import CloneDialog from './CloneDialog.svelte';

const noop = async () => {};

describe('CloneDialog — visibilidade', () => {
	it('quando open=false não renderiza o modal', () => {
		const { container } = render(CloneDialog, {
			props: { planoId: 'PT-2025-001', open: false, onCancel: vi.fn(), onClone: noop }
		});
		expect(container.querySelector('[role="dialog"]')).toBeNull();
	});

	it('quando open=true renderiza o modal', () => {
		const { container } = render(CloneDialog, {
			props: { planoId: 'PT-2025-001', open: true, onCancel: vi.fn(), onClone: noop }
		});
		expect(container.querySelector('[role="dialog"]')).not.toBeNull();
	});

	it('exibe título "Clonar plano de trabalho"', () => {
		render(CloneDialog, {
			props: { planoId: 'PT-2025-001', open: true, onCancel: vi.fn(), onClone: noop }
		});
		expect(screen.getByText(/Clonar plano de trabalho/i)).toBeInTheDocument();
	});

	it('exibe o planoId na descrição', () => {
		render(CloneDialog, {
			props: { planoId: 'PT-MEU-001', open: true, onCancel: vi.fn(), onClone: noop }
		});
		expect(screen.getByText(/PT-MEU-001/)).toBeInTheDocument();
	});
});

describe('CloneDialog — datas e validação', () => {
	it('pré-preenche os dois inputs de data', () => {
		const { container } = render(CloneDialog, {
			props: { planoId: 'PT-1', open: true, onCancel: vi.fn(), onClone: noop }
		});
		const inputs = container.querySelectorAll<HTMLInputElement>('input[type="date"]');
		expect(inputs.length).toBe(2);
		expect(inputs[0].value).not.toBe('');
		expect(inputs[1].value).not.toBe('');
	});

	it('com datas válidas o botão "Clonar e editar" fica habilitado', () => {
		render(CloneDialog, {
			props: { planoId: 'PT-1', open: true, onCancel: vi.fn(), onClone: noop }
		});
		const btn = screen.getByRole('button', { name: /Clonar e editar/i });
		expect(btn).not.toBeDisabled();
	});

	it('quando data de fim <= início, o botão fica desabilitado', async () => {
		const { container } = render(CloneDialog, {
			props: { planoId: 'PT-1', open: true, onCancel: vi.fn(), onClone: noop }
		});
		const inputs = container.querySelectorAll<HTMLInputElement>('input[type="date"]');
		// Inverte: fim = início
		await fireEvent.input(inputs[0], { target: { value: '2026-08-01' } });
		await fireEvent.input(inputs[1], { target: { value: '2026-08-01' } });
		const btn = screen.getByRole('button', { name: /Clonar e editar/i });
		expect(btn).toBeDisabled();
	});

	it('quando fim < início o botão fica desabilitado', async () => {
		const { container } = render(CloneDialog, {
			props: { planoId: 'PT-1', open: true, onCancel: vi.fn(), onClone: noop }
		});
		const inputs = container.querySelectorAll<HTMLInputElement>('input[type="date"]');
		await fireEvent.input(inputs[0], { target: { value: '2026-12-01' } });
		await fireEvent.input(inputs[1], { target: { value: '2026-08-01' } });
		const btn = screen.getByRole('button', { name: /Clonar e editar/i });
		expect(btn).toBeDisabled();
	});

	it('quando algum input está vazio, o botão fica desabilitado', async () => {
		const { container } = render(CloneDialog, {
			props: { planoId: 'PT-1', open: true, onCancel: vi.fn(), onClone: noop }
		});
		const inputs = container.querySelectorAll<HTMLInputElement>('input[type="date"]');
		await fireEvent.input(inputs[0], { target: { value: '' } });
		const btn = screen.getByRole('button', { name: /Clonar e editar/i });
		expect(btn).toBeDisabled();
	});
});

describe('CloneDialog — callbacks', () => {
	it('click em "Cancelar" chama onCancel', async () => {
		const onCancel = vi.fn();
		render(CloneDialog, {
			props: { planoId: 'PT-1', open: true, onCancel, onClone: noop }
		});
		await fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
		expect(onCancel).toHaveBeenCalledTimes(1);
	});

	it('click em "x" (fechar) chama onCancel', async () => {
		const onCancel = vi.fn();
		const { container } = render(CloneDialog, {
			props: { planoId: 'PT-1', open: true, onCancel, onClone: noop }
		});
		const close = container.querySelector('[aria-label="Fechar"]') as HTMLButtonElement;
		expect(close).not.toBeNull();
		await fireEvent.click(close);
		expect(onCancel).toHaveBeenCalledTimes(1);
	});

	it('click em "Clonar e editar" chama onClone com os parâmetros', async () => {
		const onClone = vi.fn().mockResolvedValue(undefined);
		const { container } = render(CloneDialog, {
			props: { planoId: 'PT-XYZ', open: true, onCancel: vi.fn(), onClone }
		});
		const inputs = container.querySelectorAll<HTMLInputElement>('input[type="date"]');
		await fireEvent.input(inputs[0], { target: { value: '2027-01-01' } });
		await fireEvent.input(inputs[1], { target: { value: '2027-06-30' } });
		await fireEvent.click(screen.getByRole('button', { name: /Clonar e editar/i }));
		expect(onClone).toHaveBeenCalledTimes(1);
		const arg = onClone.mock.calls[0][0];
		expect(arg.dataInicio).toBe('2027-01-01');
		expect(arg.dataTermino).toBe('2027-06-30');
		expect(typeof arg.idPlanoTrabalhoNovo).toBe('string');
		expect(arg.idPlanoTrabalhoNovo.length).toBeGreaterThan(0);
	});

	it('tecla Esc no modal chama onCancel', async () => {
		const onCancel = vi.fn();
		const { container } = render(CloneDialog, {
			props: { planoId: 'PT-1', open: true, onCancel, onClone: noop }
		});
		const dialog = container.querySelector('[role="dialog"]') as HTMLElement;
		await fireEvent.keyDown(dialog, { key: 'Escape' });
		expect(onCancel).toHaveBeenCalledTimes(1);
	});
});
