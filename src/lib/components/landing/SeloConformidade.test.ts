import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import SeloConformidade from './SeloConformidade.svelte';
import { createRawSnippet } from 'svelte';

function iconSnippet() {
	return createRawSnippet(() => ({
		render: () => '<svg data-testid="icon"></svg>',
	}));
}

describe('SeloConformidade', () => {
	it('renderiza título e subtítulo', () => {
		render(SeloConformidade, {
			props: { ttl: 'LGPD', sub: 'Lei 13.709/2018', icon: iconSnippet() },
		});
		expect(screen.getByText('LGPD')).toBeInTheDocument();
		expect(screen.getByText('Lei 13.709/2018')).toBeInTheDocument();
	});

	it('status implementado renderiza com classe verde', () => {
		const { container } = render(SeloConformidade, {
			props: {
				ttl: 'CSP',
				sub: 'Headers',
				status: 'implementado',
				icon: iconSnippet(),
			},
		});
		expect(screen.getByText('Implementado')).toBeInTheDocument();
		expect(container.querySelector('.status.implementado')).toBeInTheDocument();
	});

	it('status "em conformidade" renderiza ocre', () => {
		const { container } = render(SeloConformidade, {
			props: {
				ttl: 'WCAG',
				sub: 'Acessibilidade',
				status: 'em conformidade',
				icon: iconSnippet(),
			},
		});
		expect(screen.getByText('Em conformidade')).toBeInTheDocument();
		expect(container.querySelector('.status:not(.implementado)')).toBeInTheDocument();
	});

	it('sem status não renderiza badge', () => {
		render(SeloConformidade, {
			props: { ttl: 'Foo', sub: 'Bar', icon: iconSnippet() },
		});
		expect(screen.queryByText(/Implementado|Em conformidade/)).not.toBeInTheDocument();
	});
});
