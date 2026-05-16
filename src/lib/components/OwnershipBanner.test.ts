import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import OwnershipBanner from './OwnershipBanner.svelte';

describe('OwnershipBanner — variant comigo-editor', () => {
	it('renderiza título "Este plano está com você para ajustes"', () => {
		render(OwnershipBanner, {
			props: { variant: 'comigo-editor', atorOutro: 'Carlos' }
		});
		expect(screen.getByText(/Este plano está com você para ajustes/i)).toBeInTheDocument();
	});

	it('menciona o atorOutro na sublinha', () => {
		render(OwnershipBanner, {
			props: { variant: 'comigo-editor', atorOutro: 'Carlos Souza' }
		});
		expect(screen.getByText(/Carlos Souza/)).toBeInTheDocument();
	});

	it('exibe os botões "Salvar e sair" e "Assinar e enviar"', () => {
		render(OwnershipBanner, {
			props: { variant: 'comigo-editor', atorOutro: 'Carlos' }
		});
		expect(screen.getByRole('button', { name: /Salvar e sair/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /Assinar e enviar/i })).toBeInTheDocument();
	});

	it('click em "Salvar e sair" dispara onSalvarSair', async () => {
		const onSalvarSair = vi.fn();
		render(OwnershipBanner, {
			props: { variant: 'comigo-editor', atorOutro: 'Carlos', onSalvarSair }
		});
		await fireEvent.click(screen.getByRole('button', { name: /Salvar e sair/i }));
		expect(onSalvarSair).toHaveBeenCalledTimes(1);
	});

	it('click em "Assinar e enviar" dispara onEnviar', async () => {
		const onEnviar = vi.fn();
		render(OwnershipBanner, {
			props: { variant: 'comigo-editor', atorOutro: 'Carlos', onEnviar }
		});
		await fireEvent.click(screen.getByRole('button', { name: /Assinar e enviar/i }));
		expect(onEnviar).toHaveBeenCalledTimes(1);
	});
});

describe('OwnershipBanner — variant comigo-revisor', () => {
	it('renderiza título "Aguardando sua assinatura"', () => {
		render(OwnershipBanner, {
			props: { variant: 'comigo-revisor', atorOutro: 'Carlos' }
		});
		expect(screen.getByText(/Aguardando sua assinatura/i)).toBeInTheDocument();
	});

	it('menciona o atorOutro como remetente', () => {
		render(OwnershipBanner, {
			props: { variant: 'comigo-revisor', atorOutro: 'Ana Silva' }
		});
		expect(screen.getByText(/Ana Silva/)).toBeInTheDocument();
	});

	it('quando diasEspera=1 mostra "1 dia"', () => {
		render(OwnershipBanner, {
			props: { variant: 'comigo-revisor', atorOutro: 'Ana', diasEspera: 1 }
		});
		expect(screen.getByText(/há 1 dia\b/)).toBeInTheDocument();
	});

	it('quando diasEspera=3 mostra "3 dias"', () => {
		render(OwnershipBanner, {
			props: { variant: 'comigo-revisor', atorOutro: 'Ana', diasEspera: 3 }
		});
		expect(screen.getByText(/há 3 dias/)).toBeInTheDocument();
	});

	it('por padrão não mostra botão "Ver o que mudou"', () => {
		render(OwnershipBanner, {
			props: { variant: 'comigo-revisor', atorOutro: 'Carlos' }
		});
		expect(screen.queryByRole('button', { name: /Ver o que mudou/i })).toBeNull();
	});

	it('com mostrarDiff=true exibe botão "Ver o que mudou"', () => {
		render(OwnershipBanner, {
			props: { variant: 'comigo-revisor', atorOutro: 'Carlos', mostrarDiff: true }
		});
		expect(screen.getByRole('button', { name: /Ver o que mudou/i })).toBeInTheDocument();
	});

	it('click em "Ver o que mudou" dispara onVerDiff', async () => {
		const onVerDiff = vi.fn();
		render(OwnershipBanner, {
			props: { variant: 'comigo-revisor', atorOutro: 'Carlos', mostrarDiff: true, onVerDiff }
		});
		await fireEvent.click(screen.getByRole('button', { name: /Ver o que mudou/i }));
		expect(onVerDiff).toHaveBeenCalledTimes(1);
	});

	it('click em "Ajustar" dispara onAjustar', async () => {
		const onAjustar = vi.fn();
		render(OwnershipBanner, {
			props: { variant: 'comigo-revisor', atorOutro: 'Carlos', onAjustar }
		});
		await fireEvent.click(screen.getByRole('button', { name: /Ajustar/i }));
		expect(onAjustar).toHaveBeenCalledTimes(1);
	});

	it('click em "Assinar" dispara onAssinar', async () => {
		const onAssinar = vi.fn();
		render(OwnershipBanner, {
			props: { variant: 'comigo-revisor', atorOutro: 'Carlos', onAssinar }
		});
		await fireEvent.click(screen.getByRole('button', { name: /^Assinar$/i }));
		expect(onAssinar).toHaveBeenCalledTimes(1);
	});
});

describe('OwnershipBanner — variant com-outro', () => {
	it('renderiza título com o atorOutro', () => {
		render(OwnershipBanner, {
			props: { variant: 'com-outro', atorOutro: 'Beatriz Lima' }
		});
		expect(screen.getByText(/Plano enviado para Beatriz Lima/i)).toBeInTheDocument();
	});

	it('quando diasEspera=2 mostra "2 dias"', () => {
		render(OwnershipBanner, {
			props: { variant: 'com-outro', atorOutro: 'Beatriz', diasEspera: 2 }
		});
		expect(screen.getByText(/há 2 dias/)).toBeInTheDocument();
	});

	it('exibe botão "Lembrar"', () => {
		render(OwnershipBanner, {
			props: { variant: 'com-outro', atorOutro: 'Beatriz' }
		});
		expect(screen.getByRole('button', { name: /Lembrar/i })).toBeInTheDocument();
	});

	it('click em "Lembrar" dispara onLembrar', async () => {
		const onLembrar = vi.fn();
		render(OwnershipBanner, {
			props: { variant: 'com-outro', atorOutro: 'Beatriz', onLembrar }
		});
		await fireEvent.click(screen.getByRole('button', { name: /Lembrar/i }));
		expect(onLembrar).toHaveBeenCalledTimes(1);
	});
});

describe('OwnershipBanner — accessibility', () => {
	it('tem role="status" para leitores de tela', () => {
		const { container } = render(OwnershipBanner, {
			props: { variant: 'comigo-editor', atorOutro: 'Carlos' }
		});
		const status = container.querySelector('[role="status"]');
		expect(status).not.toBeNull();
	});

	it('tem aria-live="polite"', () => {
		const { container } = render(OwnershipBanner, {
			props: { variant: 'comigo-editor', atorOutro: 'Carlos' }
		});
		const banner = container.querySelector('[aria-live="polite"]');
		expect(banner).not.toBeNull();
	});
});
