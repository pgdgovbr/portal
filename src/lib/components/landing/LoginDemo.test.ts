import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import LoginDemo from './LoginDemo.svelte';

const personas = [
	{ email: 'a@x.gov.br', name: 'Marta Silva', role: 'servidor', role_label: 'Servidora', ctx: 'Sem plano', grupo: 'recomendados' },
	{ email: 'b@x.gov.br', name: 'Carlos Souza', role: 'chefe_imediato', role_label: 'Chefia', ctx: 'Recurso pendente', grupo: 'recomendados' },
	{ email: 'c@x.gov.br', name: 'Lucas Ramos', role: 'servidor', role_label: 'Servidor', ctx: 'Rascunho', grupo: 'servidor' },
	{ email: 'd@x.gov.br', name: 'Beatriz Lima', role: 'chefe_imediato', role_label: 'Chefia', ctx: 'Assinar', grupo: 'chefia' },
	{ email: 'e@x.gov.br', name: 'Roberto Admin', role: 'admin', role_label: 'Admin', ctx: 'Sync errors', grupo: 'outros' },
];

describe('LoginDemo', () => {
	it('exibe banner de aviso de instância de demonstração', () => {
		render(LoginDemo, { props: { personas } });
		expect(screen.getByText(/Instância de demonstração/i)).toBeInTheDocument();
		expect(screen.getByText(/Gov.br/)).toBeInTheDocument();
	});

	it('exibe título "Escolha uma persona"', () => {
		render(LoginDemo, { props: { personas } });
		expect(screen.getByText('Escolha uma persona')).toBeInTheDocument();
	});

	it('renderiza 2 personas recomendadas marcadas com classe', () => {
		const { container } = render(LoginDemo, { props: { personas } });
		const recomendadas = container.querySelectorAll('a.persona-card.recommended');
		expect(recomendadas).toHaveLength(2);
	});

	it('exibe "Comece por aqui" quando há recomendadas', () => {
		render(LoginDemo, { props: { personas } });
		expect(screen.getByText(/Comece por aqui/i)).toBeInTheDocument();
	});

	it('details "Mais personas" mostra contagem das demais', () => {
		render(LoginDemo, { props: { personas } });
		// 3 não-recomendadas (Lucas, Beatriz, Roberto)
		expect(screen.getByText(/Mais personas \(3\)/)).toBeInTheDocument();
	});

	it('sem nenhuma recomendada não exibe "Comece por aqui"', () => {
		const onlyOthers = personas.filter((p) => p.grupo !== 'recomendados');
		render(LoginDemo, { props: { personas: onlyOthers } });
		expect(screen.queryByText(/Comece por aqui/i)).not.toBeInTheDocument();
	});
});
