import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import TopNav from './TopNav.svelte';
import type { User } from '$lib/types';

const servidor: User = { id: '1', email: 'a@b.com', name: 'Carlos Mendes', role: 'servidor' };
const chefeImediato: User = { id: '2', email: 'b@b.com', name: 'Ana Lima', role: 'chefe_imediato' };

describe('TopNav', () => {
	it('role=servidor → renderiza Início e Meu Plano, mas não Equipe', () => {
		render(TopNav, { props: { user: servidor } });
		expect(screen.getByRole('link', { name: 'Início' })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Meu Plano' })).toBeInTheDocument();
		expect(screen.queryByRole('link', { name: 'Equipe' })).not.toBeInTheDocument();
	});

	it('role=chefe_imediato → renderiza Início e Equipe, mas não Meu Plano', () => {
		render(TopNav, { props: { user: chefeImediato } });
		expect(screen.getByRole('link', { name: 'Início' })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Equipe' })).toBeInTheDocument();
		expect(screen.queryByRole('link', { name: 'Meu Plano' })).not.toBeInTheDocument();
	});

	it('renderiza o primeiro nome do usuário na nav', () => {
		render(TopNav, { props: { user: servidor } });
		expect(screen.getByText('Carlos')).toBeInTheDocument();
	});

	it('link ativo (página atual = /) tem aria-current="page"', () => {
		render(TopNav, { props: { user: servidor } });
		const inicioLink = screen.getByRole('link', { name: 'Início' });
		expect(inicioLink).toHaveAttribute('aria-current', 'page');
	});
});
