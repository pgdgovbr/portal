import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Stepper from './Stepper.svelte';

describe('Stepper', () => {
	const steps = ['Período', 'Descrição', 'Revisão'];

	it('renderiza os labels de todos os steps', () => {
		render(Stepper, { props: { steps, current: 0 } });
		steps.forEach((s) => expect(screen.getByText(s)).toBeInTheDocument());
	});

	it('step atual tem atributo aria-current=step', () => {
		const { container } = render(Stepper, { props: { steps, current: 1 } });
		const currentItems = container.querySelectorAll('[aria-current="step"]');
		expect(currentItems.length).toBe(1);
	});

	it('steps anteriores ao atual são marcados como done', () => {
		const { container } = render(Stepper, { props: { steps, current: 2 } });
		// step 0 e step 1 devem estar done
		const doneItems = container.querySelectorAll('.step-done, [data-done="true"]');
		// Pelo menos 2 steps done quando current=2
		expect(doneItems.length).toBeGreaterThanOrEqual(2);
	});

	it('current=0 marca o primeiro step como ativo', () => {
		const { container } = render(Stepper, { props: { steps, current: 0 } });
		const current = container.querySelector('[aria-current="step"]');
		expect(current?.textContent).toContain(steps[0]);
	});

	// ── State / highlight tests ────────────────────────────────────────────

	it('apenas um step tem aria-current=step para qualquer valor de current', () => {
		for (let i = 0; i < steps.length; i++) {
			const { container } = render(Stepper, { props: { steps, current: i } });
			const currentItems = container.querySelectorAll('[aria-current="step"]');
			expect(currentItems.length).toBe(1);
		}
	});

	it('steps posteriores ao atual têm data-state=pending', () => {
		const { container } = render(Stepper, { props: { steps, current: 0 } });
		const allSteps = container.querySelectorAll('.step');
		// step 0 = current, step 1 e 2 = pending
		expect(allSteps[1].getAttribute('data-state')).toBe('pending');
		expect(allSteps[2].getAttribute('data-state')).toBe('pending');
	});

	it('step atual tem data-state=current', () => {
		const { container } = render(Stepper, { props: { steps, current: 1 } });
		const allSteps = container.querySelectorAll('.step');
		expect(allSteps[1].getAttribute('data-state')).toBe('current');
	});

	it('steps anteriores ao atual têm data-state=done', () => {
		const { container } = render(Stepper, { props: { steps, current: 2 } });
		const allSteps = container.querySelectorAll('.step');
		expect(allSteps[0].getAttribute('data-state')).toBe('done');
		expect(allSteps[1].getAttribute('data-state')).toBe('done');
	});

	it('step anterior ao atual tem classe step-done', () => {
		const { container } = render(Stepper, { props: { steps, current: 1 } });
		const allSteps = container.querySelectorAll('.step');
		expect(allSteps[0].classList.contains('step-done')).toBe(true);
		expect(allSteps[1].classList.contains('step-done')).toBe(false);
	});

	it('step "done" exibe ícone de check em vez do número', () => {
		const { container } = render(Stepper, { props: { steps, current: 1 } });
		const allSteps = container.querySelectorAll('.step');
		// Step 0 é done — deve ter um <svg> (ícone check) no step-dot
		const dot0 = allSteps[0].querySelector('.step-dot');
		expect(dot0?.querySelector('svg')).not.toBeNull();
		// Step 1 é current — deve ter o número "2" no step-dot, não um svg
		const dot1 = allSteps[1].querySelector('.step-dot');
		expect(dot1?.querySelector('svg')).toBeNull();
		expect(dot1?.textContent?.trim()).toBe('2');
	});

	it('step pendente exibe o número correto', () => {
		const { container } = render(Stepper, { props: { steps, current: 0 } });
		const allSteps = container.querySelectorAll('.step');
		// Step 1 é pending → deve exibir "2"
		const dot1 = allSteps[1].querySelector('.step-dot');
		expect(dot1?.textContent?.trim()).toBe('2');
		// Step 2 é pending → deve exibir "3"
		const dot2 = allSteps[2].querySelector('.step-dot');
		expect(dot2?.textContent?.trim()).toBe('3');
	});

	it('renders corretamente com apenas 1 step', () => {
		const { container } = render(Stepper, { props: { steps: ['Único'], current: 0 } });
		const currentItems = container.querySelectorAll('[aria-current="step"]');
		expect(currentItems.length).toBe(1);
		// Sem conectores quando há apenas 1 step
		const connectors = container.querySelectorAll('.step-connector');
		expect(connectors.length).toBe(0);
	});

	it('renders conectores entre steps (N-1 conectores para N steps)', () => {
		const { container } = render(Stepper, { props: { steps, current: 0 } });
		const connectors = container.querySelectorAll('.step-connector');
		expect(connectors.length).toBe(steps.length - 1);
	});

	it('stepper tem role nav com label de acessibilidade', () => {
		const { container } = render(Stepper, { props: { steps, current: 0 } });
		const nav = container.querySelector('nav.stepper');
		expect(nav).not.toBeNull();
		expect(nav?.getAttribute('aria-label')).toBeTruthy();
	});

	it('current=last step → todos os anteriores são done e último é current', () => {
		const last = steps.length - 1;
		const { container } = render(Stepper, { props: { steps, current: last } });
		const allSteps = container.querySelectorAll('.step');
		// Todos exceto o último devem ser done
		for (let i = 0; i < last; i++) {
			expect(allSteps[i].getAttribute('data-state')).toBe('done');
		}
		expect(allSteps[last].getAttribute('data-state')).toBe('current');
	});
});
