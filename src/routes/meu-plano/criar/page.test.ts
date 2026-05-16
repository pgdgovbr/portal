import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import CriarMeuPlanoPage from './+page.svelte';

const baseData = {
	user: { id: 1, role: 'servidor', name: 'Ana Silva', email: 'ana@gov.br' },
	planosEntregas: [
		{
			id: 'pe-1',
			idPlanoEntregas: 'PE-CGTI-2026',
			dataInicio: '2026-01-01',
			dataTermino: '2026-12-31',
			status: 3,
		},
	],
};

describe('Meu Plano · Criar (wizard servidor)', () => {
	beforeEach(() => {
		// Clear cookies between tests so banner tooltip logic is independent
		if (typeof document !== 'undefined') {
			document.cookie = 'pgd_pact_wizard_seen=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
		}
	});

	it('renderiza sem erros', () => {
		expect(() => render(CriarMeuPlanoPage, { props: { data: baseData } })).not.toThrow();
	});

	it('renderiza Stepper com 5 etapas', () => {
		render(CriarMeuPlanoPage, { props: { data: baseData } });
		const stepper = screen.getByRole('navigation', { name: /Etapas do formulário/i });
		expect(stepper).toBeInTheDocument();
		// Confere que os 5 nomes aparecem
		for (const label of ['Período', 'Modalidade', 'Critérios', 'Contribuições', 'Revisão']) {
			expect(screen.getAllByText(new RegExp(label, 'i')).length).toBeGreaterThan(0);
		}
	});

	it('NÃO renderiza seletor de participante (servidor cria para si)', () => {
		render(CriarMeuPlanoPage, { props: { data: baseData } });
		expect(screen.queryByLabelText(/Servidor/i)).not.toBeInTheDocument();
		expect(screen.queryByText(/Selecione um servidor/i)).not.toBeInTheDocument();
	});

	it('botão "Próximo" começa desabilitado no step 0 (sem datas)', () => {
		render(CriarMeuPlanoPage, { props: { data: baseData } });
		const proxBtn = screen.getByRole('button', { name: /Próximo/i }) as HTMLButtonElement;
		expect(proxBtn).toBeInTheDocument();
		expect(proxBtn.disabled).toBe(true);
	});

	it('exibe banner "Dica" sobre tipos de contribuição na primeira visita (sem cookie)', () => {
		render(CriarMeuPlanoPage, { props: { data: baseData } });
		// "Dica" aparece no banner-tooltip (não no card lateral)
		const dicaBanner = screen.getByTestId('wizard-dica-banner');
		expect(dicaBanner).toBeInTheDocument();
		expect(dicaBanner.textContent ?? '').toMatch(/tipo 1/i);
	});

	it('último step exibe CTAs "Salvar rascunho" e "Assinar e enviar"', async () => {
		render(CriarMeuPlanoPage, { props: { data: baseData } });
		// Pula direto via botões de "Editar" do step 4 não existem antes... usamos teste do flag interno
		// Para simplificar, validamos a existência dos botões em qualquer momento: o componente
		// renderiza-os condicionalmente apenas no último step, então invocamos via API exposta
		// (data attribute do wizard) — mas como não temos isso, varremos o markup completo.

		// Estratégia: avançar pelos passos preenchendo. Simulamos com cliques diretos
		// preenchendo os inputs mínimos.
		const inicio = screen.getByLabelText(/Início/i) as HTMLInputElement;
		const fim = screen.getByLabelText(/Fim/i) as HTMLInputElement;
		await fireEvent.input(inicio, { target: { value: '2026-08-01' } });
		await fireEvent.input(fim, { target: { value: '2027-01-31' } });
		await fireEvent.click(screen.getByRole('button', { name: /Próximo/i }));

		// Step 1 já tem carga default 40h
		await fireEvent.click(screen.getByRole('button', { name: /Próximo/i }));

		// Step 2 já tem critérios default
		await fireEvent.click(screen.getByRole('button', { name: /Próximo/i }));

		// Step 3 — adiciona uma contribuição de 100%
		const desc = screen.getByLabelText(/Descrição/i) as HTMLTextAreaElement;
		await fireEvent.input(desc, { target: { value: 'Sustentação do portal' } });
		const pctNum = screen.getByLabelText(/% da carga/i) as HTMLInputElement;
		await fireEvent.input(pctNum, { target: { value: '100' } });
		// Clica em "Adicionar contribuição"
		const addBtn = screen.getByRole('button', { name: /Adicionar contribuição/i });
		await fireEvent.click(addBtn);
		await fireEvent.click(screen.getByRole('button', { name: /Próximo/i }));

		// Step 4 → CTAs
		expect(screen.getByRole('button', { name: /Salvar rascunho/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /Assinar e enviar/i })).toBeInTheDocument();
	});

	it('step 4 (Contribuições) desabilita "Próximo" enquanto soma != 100%', async () => {
		render(CriarMeuPlanoPage, { props: { data: baseData } });
		const inicio = screen.getByLabelText(/Início/i) as HTMLInputElement;
		const fim = screen.getByLabelText(/Fim/i) as HTMLInputElement;
		await fireEvent.input(inicio, { target: { value: '2026-08-01' } });
		await fireEvent.input(fim, { target: { value: '2027-01-31' } });
		await fireEvent.click(screen.getByRole('button', { name: /Próximo/i }));
		await fireEvent.click(screen.getByRole('button', { name: /Próximo/i }));
		await fireEvent.click(screen.getByRole('button', { name: /Próximo/i }));

		// Step 3 sem contribuições → Próximo desabilitado
		const next = screen.getByRole('button', { name: /Próximo/i }) as HTMLButtonElement;
		expect(next.disabled).toBe(true);

		// Adicionar 50% → ainda desabilitado
		const desc = screen.getByLabelText(/Descrição/i) as HTMLTextAreaElement;
		await fireEvent.input(desc, { target: { value: 'Atividade X' } });
		const pctNum = screen.getByLabelText(/% da carga/i) as HTMLInputElement;
		await fireEvent.input(pctNum, { target: { value: '50' } });
		await fireEvent.click(screen.getByRole('button', { name: /Adicionar contribuição/i }));
		expect((screen.getByRole('button', { name: /Próximo/i }) as HTMLButtonElement).disabled).toBe(
			true
		);
	});
});
