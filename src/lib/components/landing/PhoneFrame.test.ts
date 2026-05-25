import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import PhoneFrame from './PhoneFrame.svelte';

function makeSnippet(html: string) {
	return createRawSnippet(() => ({
		render: () => html
	}));
}

describe('PhoneFrame', () => {
	it('renderiza tamanho lg por padrão (360px)', () => {
		const { container } = render(PhoneFrame, {
			props: { children: makeSnippet('<img src="/x.png" alt="x" />') }
		});
		const frame = container.querySelector('.phone-frame') as HTMLElement;
		expect(frame.style.maxWidth).toBe('360px');
		expect(frame.style.padding).toBe('10px');
	});

	it('renderiza tamanho sm (268px) quando size="sm"', () => {
		const { container } = render(PhoneFrame, {
			props: { size: 'sm', children: makeSnippet('<img src="/x.png" alt="x" />') }
		});
		const frame = container.querySelector('.phone-frame') as HTMLElement;
		expect(frame.style.maxWidth).toBe('268px');
		expect(frame.style.padding).toBe('8px');
	});

	it('tem notch com aria-hidden', () => {
		const { container } = render(PhoneFrame, {
			props: { children: makeSnippet('<img src="/x.png" alt="x" />') }
		});
		const notch = container.querySelector('.phone-notch');
		expect(notch?.getAttribute('aria-hidden')).toBe('true');
	});

	it('renderiza children dentro do screen', () => {
		const { container } = render(PhoneFrame, {
			props: { children: makeSnippet('<img src="/test.png" alt="conteúdo" />') }
		});
		const screen = container.querySelector('.phone-screen');
		expect(screen?.innerHTML).toContain('test.png');
	});
});
