import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import TopNavLanding from './TopNavLanding.svelte';

describe('TopNavLanding', () => {
	it('exibe logo da marca', () => {
		render(TopNavLanding);
		expect(screen.getByText('PGD Livre')).toBeInTheDocument();
	});

	it('tem 4 links de navegação (Norma/IA/Conformidade/Arquitetura)', () => {
		render(TopNavLanding);
		expect(screen.getByRole('link', { name: /norma/i })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: /^IA$/i })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: /conformidade/i })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: /arquitetura/i })).toBeInTheDocument();
	});

	it('CTA Acessar demonstração aponta para /login', () => {
		render(TopNavLanding);
		const cta = screen.getByRole('link', { name: /acessar demonstração/i });
		expect(cta.getAttribute('href')).toBe('/login');
	});

	it('link Documentação aponta para docs públicas', () => {
		render(TopNavLanding);
		const link = screen.getByRole('link', { name: /documentação/i });
		expect(link.getAttribute('href')).toBe('https://pgdgovbr.github.io/docs/');
	});
});
