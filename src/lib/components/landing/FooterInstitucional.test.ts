import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import FooterInstitucional from './FooterInstitucional.svelte';

describe('FooterInstitucional', () => {
	it('exibe logo da marca em modo dark', () => {
		const { container } = render(FooterInstitucional);
		expect(container.querySelector('.lp-mark.on-dark')).toBeInTheDocument();
	});

	it('exibe créditos institucionais SGD/SEGES/MGI', () => {
		render(FooterInstitucional);
		expect(screen.getByText(/SGD/i)).toBeInTheDocument();
		expect(screen.getByText(/SEGES/i)).toBeInTheDocument();
		expect(screen.getByText(/Ministério da Gestão/i)).toBeInTheDocument();
	});

	it('exibe licenças AGPL-3.0 e CC-BY-4.0', () => {
		render(FooterInstitucional);
		expect(screen.getByText(/AGPL-3.0/)).toBeInTheDocument();
		expect(screen.getByText(/CC-BY-4.0/)).toBeInTheDocument();
	});

	it('tem 3 colunas de links (Plataforma, Conceitos do PGD, Jornadas da demonstração)', () => {
		render(FooterInstitucional);
		expect(screen.getByRole('heading', { name: /plataforma/i })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: /conceitos do pgd/i })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: /jornadas da demonstração/i })).toBeInTheDocument();
	});

	it('links externos apontam para pgdgovbr.github.io/docs', () => {
		render(FooterInstitucional);
		const docsLink = screen.getByRole('link', { name: /^documentação$/i });
		expect(docsLink.getAttribute('href')).toContain('pgdgovbr.github.io/docs');
	});
});
