import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import PersonaCard from './PersonaCard.svelte';

const ana = {
	email: 'servidor1@pgd-demo.gov.br',
	name: 'Ana Silva',
	role: 'servidor',
	role_label: 'Servidora',
	ctx: 'Plano em execução',
	grupo: 'recomendados',
};

describe('PersonaCard', () => {
	it('exibe nome, role_label e contexto', () => {
		render(PersonaCard, { props: { persona: ana } });
		expect(screen.getByText('Ana Silva')).toBeInTheDocument();
		expect(screen.getByText('Servidora')).toBeInTheDocument();
		expect(screen.getByText('Plano em execução')).toBeInTheDocument();
	});

	it('exibe iniciais "AS" (2 primeiros nomes maiúsculos)', () => {
		render(PersonaCard, { props: { persona: ana } });
		expect(screen.getByText('AS')).toBeInTheDocument();
	});

	it('href aponta para /api/demo-login com query params codificados', () => {
		const { container } = render(PersonaCard, { props: { persona: ana } });
		const link = container.querySelector('a');
		const href = link?.getAttribute('href') ?? '';
		expect(href).toContain('/api/demo-login');
		expect(href).toContain('email=servidor1%40pgd-demo.gov.br');
		expect(href).toContain('name=Ana%20Silva');
		expect(href).toContain('role=servidor');
	});

	it('recommended=true aplica classe .recommended', () => {
		const { container } = render(PersonaCard, {
			props: { persona: ana, recommended: true },
		});
		expect(container.querySelector('a.persona-card.recommended')).toBeInTheDocument();
	});

	it('recommended=false (default) não aplica classe', () => {
		const { container } = render(PersonaCard, { props: { persona: ana } });
		expect(container.querySelector('a.persona-card:not(.recommended)')).toBeInTheDocument();
	});
});
