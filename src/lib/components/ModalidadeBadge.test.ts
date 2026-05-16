import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ModalidadeBadge from './ModalidadeBadge.svelte';

describe('ModalidadeBadge', () => {
	it('renderiza "Presencial" para PRESENCIAL', () => {
		render(ModalidadeBadge, { props: { modalidade: 'PRESENCIAL' } });
		expect(screen.getByText(/presencial/i)).toBeInTheDocument();
	});

	it('renderiza "TT Parcial" para TELETRABALHO_PARCIAL', () => {
		render(ModalidadeBadge, { props: { modalidade: 'TELETRABALHO_PARCIAL' } });
		expect(screen.getByText(/parcial/i)).toBeInTheDocument();
	});

	it('renderiza "TT Integral" para TELETRABALHO_INTEGRAL', () => {
		render(ModalidadeBadge, { props: { modalidade: 'TELETRABALHO_INTEGRAL' } });
		expect(screen.getByText(/integral/i)).toBeInTheDocument();
	});

	it('renderiza sem erro para modalidade desconhecida', () => {
		expect(() => render(ModalidadeBadge, { props: { modalidade: 'OUTRO' } })).not.toThrow();
	});
});
