import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import TopNavLanding from './TopNavLanding.svelte';

describe('TopNavLanding', () => {
	it('exibe logo da marca', () => {
		render(TopNavLanding);
		expect(screen.getByText('PGD Livre')).toBeInTheDocument();
	});

	it('tem 4 links de navegação (Norma/IA/Conformidade/Arquitetura)', () => {
		render(TopNavLanding);
		expect(screen.getByRole('link', { name: /^norma$/i })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: /^IA$/i })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: /^conformidade$/i })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: /^arquitetura$/i })).toBeInTheDocument();
	});

	it('CTA Acessar demonstração aponta para /login', () => {
		render(TopNavLanding);
		const cta = screen.getAllByRole('link', { name: /acessar demonstração/i });
		expect(cta[0].getAttribute('href')).toBe('/login');
	});

	it('link Documentação aponta para docs públicas', () => {
		render(TopNavLanding);
		const link = screen.getAllByRole('link', { name: /documentação/i })[0];
		expect(link.getAttribute('href')).toBe('https://pgdgovbr.github.io/docs/');
	});

	it('drawer mobile inicia fechado', () => {
		render(TopNavLanding);
		const burger = screen.getByRole('button', { name: /abrir menu/i });
		expect(burger.getAttribute('aria-expanded')).toBe('false');
		expect(screen.queryByRole('dialog', { name: /menu de navegação/i })).not.toBeInTheDocument();
	});

	it('clique no hamburguer abre o drawer', async () => {
		render(TopNavLanding);
		const burger = screen.getByRole('button', { name: /abrir menu/i });
		await fireEvent.click(burger);
		expect(burger.getAttribute('aria-expanded')).toBe('true');
		expect(screen.getByRole('dialog', { name: /menu de navegação/i })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: /atendimento à norma/i })).toBeInTheDocument();
	});

	it('clique em link do drawer fecha o drawer', async () => {
		render(TopNavLanding);
		await fireEvent.click(screen.getByRole('button', { name: /abrir menu/i }));
		const link = screen.getByRole('link', { name: /atendimento à norma/i });
		await fireEvent.click(link);
		expect(screen.queryByRole('dialog', { name: /menu de navegação/i })).not.toBeInTheDocument();
	});

	it('tecla Escape fecha o drawer', async () => {
		render(TopNavLanding);
		await fireEvent.click(screen.getByRole('button', { name: /abrir menu/i }));
		expect(screen.getByRole('dialog', { name: /menu de navegação/i })).toBeInTheDocument();
		await fireEvent.keyDown(document, { key: 'Escape' });
		expect(screen.queryByRole('dialog', { name: /menu de navegação/i })).not.toBeInTheDocument();
	});
});
