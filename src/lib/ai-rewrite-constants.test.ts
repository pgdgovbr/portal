import { describe, it, expect } from 'vitest';
import {
	AI_SYSTEM_PROMPT,
	AI_USER_PROMPT_DEFAULT,
	AI_TEMPLATES,
	type TemplateId,
} from './ai-rewrite-constants';

describe('ai-rewrite-constants', () => {
	it('AI_TEMPLATES tem 4 entradas com ids esperados', () => {
		const ids = AI_TEMPLATES.map((t) => t.id);
		expect(ids).toEqual(['entrega', 'cronologico', 'contribuicao', 'star']);
	});

	it('cada template tem nome, icon, desc não vazios', () => {
		for (const t of AI_TEMPLATES) {
			expect(t.nome.length).toBeGreaterThan(0);
			expect(t.icon.length).toBeGreaterThan(0);
			expect(t.desc.length).toBeGreaterThan(20);
		}
	});

	it('AI_SYSTEM_PROMPT contém regras invioláveis críticas', () => {
		expect(AI_SYSTEM_PROMPT).toContain('NÃO invente fatos');
		expect(AI_SYSTEM_PROMPT).toContain('[precisa de detalhe]');
		expect(AI_SYSTEM_PROMPT).toContain('1ª pessoa do singular');
	});

	it('AI_USER_PROMPT_DEFAULT é texto não-trivial', () => {
		expect(AI_USER_PROMPT_DEFAULT.length).toBeGreaterThan(50);
	});

	it('TemplateId aceita apenas os 4 valores', () => {
		// Type-level check: se algum id sair da union, o build quebra.
		const valid: TemplateId[] = ['entrega', 'cronologico', 'contribuicao', 'star'];
		expect(valid.length).toBe(4);
	});
});
