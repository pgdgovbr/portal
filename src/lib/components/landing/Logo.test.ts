import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Logo from './Logo.svelte';

describe('Logo (Variante B — 3 barras)', () => {
	it('renderiza "PGD Livre" por padrão', () => {
		render(Logo);
		expect(screen.getByText('PGD Livre')).toBeInTheDocument();
	});

	it('aceita prop name customizado', () => {
		render(Logo, { props: { name: 'Outra Marca' } });
		expect(screen.getByText('Outra Marca')).toBeInTheDocument();
	});

	it('renderiza 3 retângulos SVG (3 barras)', () => {
		const { container } = render(Logo);
		const rects = container.querySelectorAll('svg rect');
		expect(rects).toHaveLength(3);
	});

	it('size sm usa SVG 28px', () => {
		const { container } = render(Logo, { props: { size: 'sm' } });
		const svg = container.querySelector('svg');
		expect(svg?.getAttribute('width')).toBe('28');
	});

	it('size xl usa SVG 68px', () => {
		const { container } = render(Logo, { props: { size: 'xl' } });
		const svg = container.querySelector('svg');
		expect(svg?.getAttribute('width')).toBe('68');
	});

	it('onDark=true aplica classe on-dark', () => {
		const { container } = render(Logo, { props: { onDark: true } });
		expect(container.querySelector('.lp-mark.on-dark')).toBeInTheDocument();
	});
});
