<script lang="ts">
	import { page } from '$app/stores';
	import type { UserRole, User } from '$lib/types';
	import { ROLE_LABELS, initialsFrom } from '$lib/types';
	import Icon from './Icon.svelte';

	interface Props {
		user: User;
	}
	let { user }: Props = $props();

	interface NavItem {
		href: string;
		label: string;
		icon: string;
		roles: UserRole[];
	}

	const NAV_ITEMS: NavItem[] = [
		{ href: '/app',           label: 'Início',         icon: 'home',       roles: ['servidor', 'chefe_imediato', 'gestor_unidade', 'admin'] },
		{ href: '/meu-plano',     label: 'Meu Plano',      icon: 'clipboard',  roles: ['servidor'] },
		{ href: '/equipe',        label: 'Equipe',         icon: 'users',      roles: ['chefe_imediato'] },
		{ href: '/conformidade',  label: 'Conformidade',   icon: 'check-circle', roles: ['gestor_unidade', 'admin'] },
		{ href: '/relatorios',    label: 'Relatórios',     icon: 'bar-chart',  roles: ['gestor_unidade', 'admin'] },
		{ href: '/admin/participantes', label: 'Participantes', icon: 'users', roles: ['admin'] },
		{ href: '/admin/institucional', label: 'Institucional', icon: 'building', roles: ['admin'] },
	];

	const visibleItems = $derived(NAV_ITEMS.filter((item) => item.roles.includes(user.role)));

	function isActive(href: string): boolean {
		if (href === '/app') return $page.url.pathname === '/app';
		return $page.url.pathname.startsWith(href);
	}

	const initials = $derived(initialsFrom(user.name));
	const roleLabel = $derived(ROLE_LABELS[user.role]);
</script>

<nav class="tn" aria-label="Navegação principal">
	<a href="/app" class="tn-logo" aria-label="PGD Livre — início">
		<svg width="22" height="22" viewBox="0 0 48 48" fill="none" aria-hidden="true">
			<rect x="6" y="10" width="36" height="6" rx="2" fill="currentColor" />
			<rect x="6" y="21" width="24" height="6" rx="2" fill="var(--c-warning, #C77400)" />
			<rect x="6" y="32" width="30" height="6" rx="2" fill="var(--c-success, #168821)" />
		</svg>
		<span>PGD Livre</span>
	</a>

	<ul class="tn-nav" role="list">
		{#each visibleItems as item}
			<li>
				<a
					href={item.href}
					class:active={isActive(item.href)}
					aria-current={isActive(item.href) ? 'page' : undefined}
				>
					{item.label}
				</a>
			</li>
		{/each}
	</ul>

	<div class="tn-right">
		<a href="/notificacoes" class="tn-iconbtn" aria-label="Notificações">
			<Icon name="bell" size={18} />
		</a>

		<div class="tn-user-wrap">
			<button type="button" class="tn-user tn-user-btn" aria-label="Menu de {user.name}">
				<span class="av av-sm" aria-hidden="true">{initials}</span>
				<div>
					<div class="name">{user.name.split(' ')[0]}</div>
					<div class="role-label">{roleLabel}</div>
				</div>
			</button>
			<div class="tn-user-menu">
				<form method="POST" action="/api/logout" class="logout-form">
					<button type="submit" class="logout-btn">
						<Icon name="log-out" size={14} />
						Sair
					</button>
				</form>
			</div>
		</div>
	</div>
</nav>

<style>
	.tn-nav {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.tn-user-wrap {
		position: relative;
	}
	.tn-user-btn {
		background: transparent;
		border: 0;
		cursor: pointer;
		font: inherit;
		color: inherit;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 4px 8px;
		border-radius: 8px;
	}
	.tn-user-btn:hover {
		background: rgba(11, 20, 38, 0.04);
	}
	.tn-user-menu {
		position: absolute;
		right: 0;
		top: calc(100% + 6px);
		min-width: 160px;
		background: white;
		border: 1px solid rgba(11, 20, 38, 0.1);
		border-radius: 10px;
		box-shadow: 0 8px 24px rgba(11, 20, 38, 0.12);
		padding: 6px;
		opacity: 0;
		visibility: hidden;
		transform: translateY(-4px);
		transition: all 0.15s ease;
		z-index: 50;
	}
	.tn-user-wrap:hover .tn-user-menu,
	.tn-user-wrap:focus-within .tn-user-menu {
		opacity: 1;
		visibility: visible;
		transform: translateY(0);
	}
	.logout-form {
		margin: 0;
	}
	.logout-btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		padding: 8px 12px;
		border: 0;
		background: transparent;
		border-radius: 6px;
		cursor: pointer;
		font: inherit;
		font-size: 13.5px;
		color: var(--c-ink, #0B1426);
		text-align: left;
	}
	.logout-btn:hover {
		background: rgba(11, 20, 38, 0.05);
	}
</style>
