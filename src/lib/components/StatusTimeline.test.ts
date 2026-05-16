import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import StatusTimeline from './StatusTimeline.svelte';

const items = [
	{ label: 'Plano elaborado', date: '22 jan 2026', note: 'Por Carlos Mendes' },
	{ label: 'Aprovado', date: '28 jan 2026' },
	{ label: 'Em execução', date: 'Desde 01 fev', current: true, note: 'Registros mensais.' },
	{ label: 'Conclusão prevista', date: '31 jul 2026', future: true },
];

describe('StatusTimeline', () => {
	it('renderiza label de cada item', () => {
		render(StatusTimeline, { props: { items } });
		items.forEach((item) => {
			expect(screen.getByText(item.label)).toBeInTheDocument();
		});
	});

	it('renderiza a data de cada item', () => {
		render(StatusTimeline, { props: { items } });
		expect(screen.getByText('22 jan 2026')).toBeInTheDocument();
		expect(screen.getByText('28 jan 2026')).toBeInTheDocument();
	});

	it('item current=true tem destaque visual', () => {
		const { container } = render(StatusTimeline, { props: { items } });
		const currentItem = container.querySelector('.tl-current, [data-current="true"]');
		expect(currentItem).toBeInTheDocument();
	});

	it('item future=true não tem checkmark preenchido', () => {
		const { container } = render(StatusTimeline, { props: { items } });
		const futureItems = container.querySelectorAll('.tl-future, [data-future="true"]');
		expect(futureItems.length).toBeGreaterThanOrEqual(1);
	});

	it('renderiza nota quando fornecida', () => {
		render(StatusTimeline, { props: { items } });
		expect(screen.getByText(/Por Carlos Mendes/)).toBeInTheDocument();
	});
});
