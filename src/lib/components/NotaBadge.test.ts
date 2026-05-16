import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import NotaBadge from './NotaBadge.svelte';

describe('NotaBadge', () => {
	it('nota 1 renderiza "Excepcional"', () => {
		render(NotaBadge, { props: { nota: 1 } });
		expect(screen.getByText(/excepcional/i)).toBeInTheDocument();
	});

	it('nota 2 renderiza "Alto desempenho"', () => {
		render(NotaBadge, { props: { nota: 2 } });
		expect(screen.getByText(/alto desempenho/i)).toBeInTheDocument();
	});

	it('nota 3 renderiza "Adequado"', () => {
		render(NotaBadge, { props: { nota: 3 } });
		expect(screen.getByText(/adequado/i)).toBeInTheDocument();
	});

	it('nota 4 renderiza "Insuficiente"', () => {
		render(NotaBadge, { props: { nota: 4 } });
		expect(screen.getByText(/insuficiente/i)).toBeInTheDocument();
	});

	it('nota 5 renderiza "Insatisfatório"', () => {
		render(NotaBadge, { props: { nota: 5 } });
		expect(screen.getByText(/insatisfatório/i)).toBeInTheDocument();
	});

	it('nota 2 usa background verde', () => {
		const { container } = render(NotaBadge, { props: { nota: 2 } });
		const badge = container.firstElementChild as HTMLElement;
		expect(badge?.style.background || badge?.getAttribute('style')).toMatch(/#168821|E2F2E4/i);
	});
});
