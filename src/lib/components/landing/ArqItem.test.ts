import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ArqItem from './ArqItem.svelte';

describe('ArqItem', () => {
	it('renderiza título e descrição', () => {
		render(ArqItem, {
			props: {
				ttl: 'GraphQL desacoplado',
				sub: 'Frontend e mobile do órgão sem reescrita',
			},
		});
		expect(screen.getByText('GraphQL desacoplado')).toBeInTheDocument();
		expect(screen.getByText('Frontend e mobile do órgão sem reescrita')).toBeInTheDocument();
	});

	it('renderiza ícone de check', () => {
		const { container } = render(ArqItem, {
			props: { ttl: 'X', sub: 'Y' },
		});
		expect(container.querySelector('.check svg')).toBeInTheDocument();
	});
});
