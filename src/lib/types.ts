export type UserRole = 'servidor' | 'chefe_imediato' | 'gestor_unidade' | 'admin';

export interface User {
	id: string;
	email: string;
	name: string;
	role: UserRole;
}

export type StatusPlano =
	| 'RASCUNHO_PARTICIPANTE'
	| 'RASCUNHO_CHEFIA'
	| 'AGUARDANDO_ASSINATURA_CHEFIA'
	| 'AGUARDANDO_ASSINATURA_PARTICIPANTE'
	| 'EM_EXECUCAO'
	| 'CONCLUIDO'
	| 'AVALIADO'
	| 'CANCELADO';

export type OwnershipSide = 'participante' | 'chefia' | null;

/**
 * Mapeamento dos status inteiros do backend (campo `status` em PlanoTrabalho)
 * para os identificadores de string usados no frontend.
 *
 * Valores 1-4 batem com a API PGD Central; 5-7 são internos do PGD Libre.
 */
export const STATUS_PLANO_INT: Record<number, StatusPlano> = {
	1: 'CANCELADO',
	2: 'AGUARDANDO_ASSINATURA_CHEFIA', // antes "APROVADO" — agora semântico
	3: 'EM_EXECUCAO',
	4: 'CONCLUIDO',
	5: 'RASCUNHO_PARTICIPANTE',
	6: 'RASCUNHO_CHEFIA',
	7: 'AGUARDANDO_ASSINATURA_PARTICIPANTE'
};

/**
 * Retorna qual lado está com a "bola" da pactuação naquele momento.
 * - participante: servidor edita ou precisa assinar
 * - chefia: chefia edita ou precisa assinar
 * - null: PT já pactuado (EM_EXECUCAO / CONCLUIDO / etc.) ou terminal (CANCELADO)
 */
export function ownershipOfStatus(status: StatusPlano): OwnershipSide {
	switch (status) {
		case 'RASCUNHO_PARTICIPANTE':
		case 'AGUARDANDO_ASSINATURA_PARTICIPANTE':
			return 'participante';
		case 'RASCUNHO_CHEFIA':
		case 'AGUARDANDO_ASSINATURA_CHEFIA':
			return 'chefia';
		default:
			return null;
	}
}

export type Nota = 1 | 2 | 3 | 4 | 5;

export interface NavItem {
	href: string;
	label: string;
	roles: UserRole[];
}

export const NOTAS: Record<Nota, { label: string; color: string; bg: string }> = {
	1: { label: 'Excepcional', color: '#0C4A1A', bg: '#E2F2E4' },
	2: { label: 'Alto desempenho', color: '#168821', bg: '#E2F2E4' },
	3: { label: 'Adequado', color: '#0F3D8C', bg: '#E6EEF8' },
	4: { label: 'Insuficiente', color: '#C77400', bg: '#FCF1DC' },
	5: { label: 'Insatisfatório', color: '#B91C1C', bg: '#FBE6E6' }
};

export const STATUS_LABELS: Record<StatusPlano, string> = {
	RASCUNHO_PARTICIPANTE: 'Rascunho · servidor',
	RASCUNHO_CHEFIA: 'Rascunho · chefia',
	AGUARDANDO_ASSINATURA_CHEFIA: 'Aguardando chefia',
	AGUARDANDO_ASSINATURA_PARTICIPANTE: 'Aguardando servidor',
	EM_EXECUCAO: 'Em execução',
	CONCLUIDO: 'Concluído',
	AVALIADO: 'Avaliado',
	CANCELADO: 'Cancelado'
};

export const ROLE_LABELS: Record<UserRole, string> = {
	servidor: 'Servidor',
	chefe_imediato: 'Chefia',
	gestor_unidade: 'Gestor',
	admin: 'Admin'
};

export function urgencyClass(daysLeft: number): string {
	if (daysLeft <= 0) return 'urg-late';
	if (daysLeft <= 7) return 'urg-warn';
	return 'urg-ok';
}

export function urgencyLabel(daysLeft: number): string {
	if (daysLeft < 0) return `Vencido há ${Math.abs(daysLeft)} ${Math.abs(daysLeft) === 1 ? 'dia' : 'dias'}`;
	if (daysLeft === 0) return 'Vence hoje';
	return `${daysLeft} ${daysLeft === 1 ? 'dia' : 'dias'}`;
}

export function initialsFrom(name: string): string {
	const words = name.trim().split(/\s+/).filter(Boolean);
	if (words.length === 0) return '??';
	if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
	return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}
