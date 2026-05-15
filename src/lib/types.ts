export type UserRole = 'servidor' | 'chefe_imediato' | 'gestor_unidade' | 'admin';

export interface User {
	id: string;
	email: string;
	name: string;
	role: UserRole;
}

export type StatusPlano =
	| 'APROVADO'
	| 'EM_EXECUCAO'
	| 'CONCLUIDO'
	| 'AVALIADO'
	| 'CANCELADO';

export type Nota = 1 | 2 | 3 | 4 | 5;

export interface NavItem {
	href: string;
	label: string;
	roles: UserRole[];
}

export const NOTAS: Record<Nota, { label: string; color: string; bg: string }> = {
	1: { label: 'Excepcional', color: '#0C4A1A', bg: '#E2F2E4' },
	2: { label: 'Alto', color: '#168821', bg: '#E2F2E4' },
	3: { label: 'Adequado', color: '#0F3D8C', bg: '#E6EEF8' },
	4: { label: 'Inadequado', color: '#C77400', bg: '#FCF1DC' },
	5: { label: 'Não executado', color: '#B91C1C', bg: '#FBE6E6' }
};

export const STATUS_LABELS: Record<StatusPlano, string> = {
	APROVADO: 'Aprovado',
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
	if (daysLeft < 0) return 'urg-late';
	if (daysLeft <= 7) return 'urg-warn';
	return 'urg-ok';
}

export function urgencyLabel(daysLeft: number): string {
	if (daysLeft < 0) return `Vencido há ${Math.abs(daysLeft)} dias`;
	if (daysLeft === 0) return 'Vence hoje';
	if (daysLeft === 1) return 'Vence amanhã';
	return `${daysLeft} dias`;
}

export function initialsFrom(name: string): string {
	return name
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0].toUpperCase())
		.join('');
}
