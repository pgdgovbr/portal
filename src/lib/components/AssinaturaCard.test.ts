import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import AssinaturaCard from './AssinaturaCard.svelte';

describe('AssinaturaCard — estado inicial (sem assinatura)', () => {
	it('renderiza kicker "Antes de assinar"', () => {
		render(AssinaturaCard, { props: { ator: 'Carlos' } });
		expect(screen.getByText(/Antes de assinar/i)).toBeInTheDocument();
	});

	it('menciona o ator na descrição', () => {
		render(AssinaturaCard, { props: { ator: 'Carlos Souza' } });
		expect(screen.getByText(/Carlos Souza/)).toBeInTheDocument();
	});

	it('renderiza 3 checkboxes', () => {
		const { container } = render(AssinaturaCard, { props: { ator: 'Carlos' } });
		const checks = container.querySelectorAll('input[type="checkbox"]');
		expect(checks.length).toBe(3);
	});

	it('botão "Assinar e ativar plano" começa desabilitado', () => {
		render(AssinaturaCard, { props: { ator: 'Carlos' } });
		const btn = screen.getByRole('button', { name: /Assinar e ativar plano/i });
		expect(btn).toBeDisabled();
	});

	it('botão "Devolver para ajustes" está sempre habilitado', () => {
		render(AssinaturaCard, { props: { ator: 'Carlos' } });
		const btn = screen.getByRole('button', { name: /Devolver para ajustes/i });
		expect(btn).not.toBeDisabled();
	});

	it('marcando 1 checkbox o botão continua desabilitado', async () => {
		const { container } = render(AssinaturaCard, { props: { ator: 'Carlos' } });
		const checks = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
		await fireEvent.click(checks[0]);
		const btn = screen.getByRole('button', { name: /Assinar e ativar plano/i });
		expect(btn).toBeDisabled();
	});

	it('marcando os 3 checkboxes o botão fica habilitado', async () => {
		const { container } = render(AssinaturaCard, { props: { ator: 'Carlos' } });
		const checks = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
		for (const c of checks) {
			await fireEvent.click(c);
		}
		const btn = screen.getByRole('button', { name: /Assinar e ativar plano/i });
		expect(btn).not.toBeDisabled();
	});

	it('click em "Assinar e ativar plano" (após 3 checks) chama onAssinar', async () => {
		const onAssinar = vi.fn();
		const { container } = render(AssinaturaCard, { props: { ator: 'Carlos', onAssinar } });
		const checks = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
		for (const c of checks) {
			await fireEvent.click(c);
		}
		await fireEvent.click(screen.getByRole('button', { name: /Assinar e ativar plano/i }));
		expect(onAssinar).toHaveBeenCalledTimes(1);
	});

	it('click em "Devolver para ajustes" chama onDevolver', async () => {
		const onDevolver = vi.fn();
		render(AssinaturaCard, { props: { ator: 'Carlos', onDevolver } });
		await fireEvent.click(screen.getByRole('button', { name: /Devolver para ajustes/i }));
		expect(onDevolver).toHaveBeenCalledTimes(1);
	});

	it('rodapé exibe o aviso sobre zerar assinatura do outro lado', () => {
		const { container } = render(AssinaturaCard, { props: { ator: 'Carlos' } });
		// O texto está dividido por <strong>; comparar o textContent normalizado
		const rodape = Array.from(container.querySelectorAll('p')).find((p) =>
			(p.textContent || '').includes('Devolver para ajustes')
		);
		expect(rodape).toBeTruthy();
		const txt = (rodape!.textContent || '').replace(/\s+/g, ' ').trim();
		expect(txt).toBe(
			'Devolver para ajustes zera a assinatura do outro lado — ele(a) precisará reassinar depois.'
		);
	});
});

describe('AssinaturaCard — estado pós-assinatura', () => {
	it('com dataAssinatura mostra "Você assinou esta versão"', () => {
		render(AssinaturaCard, {
			props: { ator: 'Carlos', dataAssinatura: '15/05/2026' }
		});
		expect(screen.getByText(/Você assinou esta versão/i)).toBeInTheDocument();
	});

	it('com dataAssinatura mostra o ator e a data', () => {
		render(AssinaturaCard, {
			props: { ator: 'Carlos', dataAssinatura: '15/05/2026 14:30' }
		});
		expect(screen.getByText(/Carlos/)).toBeInTheDocument();
		expect(screen.getByText(/15\/05\/2026/)).toBeInTheDocument();
	});

	it('com dataAssinatura não renderiza checkboxes', () => {
		const { container } = render(AssinaturaCard, {
			props: { ator: 'Carlos', dataAssinatura: '15/05/2026' }
		});
		const checks = container.querySelectorAll('input[type="checkbox"]');
		expect(checks.length).toBe(0);
	});

	it('com dataAssinatura não renderiza o botão "Assinar e ativar plano"', () => {
		render(AssinaturaCard, {
			props: { ator: 'Carlos', dataAssinatura: '15/05/2026' }
		});
		expect(screen.queryByRole('button', { name: /Assinar e ativar plano/i })).toBeNull();
	});

	it('com dataAssinatura exibe botão "Comprovante"', () => {
		render(AssinaturaCard, {
			props: { ator: 'Carlos', dataAssinatura: '15/05/2026' }
		});
		expect(screen.getByRole('button', { name: /Comprovante/i })).toBeInTheDocument();
	});
});
