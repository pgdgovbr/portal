import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Icon from './Icon.svelte';

describe('Icon', () => {
	it('renderiza SVG para ícone conhecido', () => {
		const { container } = render(Icon, { props: { name: 'home' } });
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		const path = container.querySelector('path');
		expect(path).toBeInTheDocument();
		expect(path?.getAttribute('d')).toBeTruthy();
	});

	it('renderiza com tamanho padrão 18', () => {
		const { container } = render(Icon, { props: { name: 'check' } });
		const svg = container.querySelector('svg');
		expect(svg?.getAttribute('width')).toBe('18');
		expect(svg?.getAttribute('height')).toBe('18');
	});

	it('renderiza com tamanho customizado', () => {
		const { container } = render(Icon, { props: { name: 'check', size: 24 } });
		const svg = container.querySelector('svg');
		expect(svg?.getAttribute('width')).toBe('24');
		expect(svg?.getAttribute('height')).toBe('24');
	});

	it('renderiza SVG sem path para ícone desconhecido (sem erro)', () => {
		const { container } = render(Icon, { props: { name: 'ícone-inexistente' } });
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		const path = container.querySelector('path');
		expect(path).not.toBeInTheDocument();
	});

	it('tem aria-hidden=true para não poluir acessibilidade', () => {
		const { container } = render(Icon, { props: { name: 'bell' } });
		const svg = container.querySelector('svg');
		expect(svg?.getAttribute('aria-hidden')).toBe('true');
	});
});
