import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import RoadmapItem from './RoadmapItem.svelte';

describe('RoadmapItem', () => {
	it('renderiza título e descrição', () => {
		render(RoadmapItem, {
			props: {
				ttl: 'Exportação em CSV',
				desc: 'Para análise externa',
			},
		});
		expect(screen.getByText('Exportação em CSV')).toBeInTheDocument();
		expect(screen.getByText('Para análise externa')).toBeInTheDocument();
	});

	it('tag aparece quando passada', () => {
		render(RoadmapItem, {
			props: { ttl: 'X', desc: 'Y', tag: 'App nativo' },
		});
		expect(screen.getByText('App nativo')).toBeInTheDocument();
	});

	it('sem tag, não renderiza chip', () => {
		const { container } = render(RoadmapItem, {
			props: { ttl: 'X', desc: 'Y' },
		});
		expect(container.querySelector('.lp-chip.accent')).not.toBeInTheDocument();
	});
});
