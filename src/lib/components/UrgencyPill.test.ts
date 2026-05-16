import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import UrgencyPill from './UrgencyPill.svelte';

describe('UrgencyPill', () => {
	it('daysLeft > 7 renderiza com classe urg-ok', () => {
		const { container } = render(UrgencyPill, { props: { daysLeft: 10 } });
		expect(container.querySelector('.urg-ok')).toBeInTheDocument();
	});

	it('daysLeft entre 1 e 7 renderiza com classe urg-warn', () => {
		const { container } = render(UrgencyPill, { props: { daysLeft: 3 } });
		expect(container.querySelector('.urg-warn')).toBeInTheDocument();
	});

	it('daysLeft negativo renderiza com classe urg-late', () => {
		const { container } = render(UrgencyPill, { props: { daysLeft: -1 } });
		expect(container.querySelector('.urg-late')).toBeInTheDocument();
	});

	it('daysLeft zero renderiza com classe urg-late', () => {
		const { container } = render(UrgencyPill, { props: { daysLeft: 0 } });
		expect(container.querySelector('.urg-late')).toBeInTheDocument();
	});

	it('renderiza texto com número de dias para daysLeft positivo', () => {
		render(UrgencyPill, { props: { daysLeft: 5 } });
		expect(screen.getByText(/5/)).toBeInTheDocument();
	});

	it('renderiza texto com "hoje" para daysLeft zero', () => {
		render(UrgencyPill, { props: { daysLeft: 0 } });
		expect(screen.getByText(/hoje/i)).toBeInTheDocument();
	});
});
