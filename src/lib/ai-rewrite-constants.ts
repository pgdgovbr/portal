/**
 * Constantes da feature "Reescrever com IA" — exibidas no UI (system prompt
 * collapsible, lista de templates, instrução default editável).
 *
 * O backend (`pgd-libre/src/services/ai_rewrite.py`) é a fonte real do system
 * prompt; o que está aqui serve apenas para exibir no `<details>` colapsável
 * do painel. Se mudar lá, atualizar aqui também.
 */

export type TemplateId = 'entrega' | 'cronologico' | 'contribuicao' | 'star';

export interface AITemplate {
	id: TemplateId;
	nome: string;
	icon: 'check' | 'calendar' | 'file' | 'star';
	desc: string;
}

export const AI_SYSTEM_PROMPT = `Você é um assistente especializado em comunicação institucional do serviço público federal brasileiro. Sua tarefa é REESCREVER o "Registro de Execução" mensal de um servidor participante do Programa de Gestão e Desempenho (PGD), seguindo o template indicado.

Regras invioláveis:
1. NÃO invente fatos, datas, números, sistemas ou nomes não citados pelo usuário.
2. NÃO altere o sentido das entregas relatadas.
3. Use linguagem formal, em português brasileiro, voz ativa, 1ª pessoa do singular.
4. Preserve referências a contribuições do Plano de Trabalho quando o usuário mencionar.
5. Quando o registro original for vago, NÃO complete com suposições — sinalize a lacuna entre colchetes: [precisa de detalhe].
6. Mantenha verbos no pretérito perfeito (entreguei, conduzi, documentei).
7. Se o template exigir métrica e ela não estiver no texto, deixe [quantificar] no lugar.

Saída: SOMENTE o texto reescrito, sem comentários, sem introdução, sem instruções adicionais.`;

export const AI_USER_PROMPT_DEFAULT = `Reescreva o texto acima usando o template selecionado.

Destaque entregas concretas e evite generalidades. Vincule cada item, quando possível, a uma contribuição do meu plano. Se algum trecho estiver vago, sinalize com [precisa de detalhe] em vez de inventar.`;

export const AI_TEMPLATES: AITemplate[] = [
	{
		id: 'entrega',
		nome: 'Por entrega',
		icon: 'check',
		desc: 'Lista cada entrega/atividade com data, resultado mensurável e contribuição vinculada.',
	},
	{
		id: 'cronologico',
		nome: 'Cronológico',
		icon: 'calendar',
		desc: 'Narrativa semanal/diária. Útil quando há muita reunião e o ritmo importa.',
	},
	{
		id: 'contribuicao',
		nome: 'Por contribuição do plano',
		icon: 'file',
		desc: 'Agrupa por contribuição do Plano de Trabalho. Facilita a avaliação da chefia.',
	},
	{
		id: 'star',
		nome: 'STAR',
		icon: 'star',
		desc: 'Situação · Tarefa · Ação · Resultado. Formal, ideal em ano de avaliação de desempenho.',
	},
];

/** Mínimo de caracteres no textarea de "descrição" para o botão habilitar. */
export const AI_REWRITE_MIN_CHARS = 80;
