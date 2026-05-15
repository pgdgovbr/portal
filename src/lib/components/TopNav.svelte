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
		{ href: '/',              label: 'Início',         icon: 'home',       roles: ['servidor', 'chefe_imediato', 'gestor_unidade', 'admin'] },
		{ href: '/meu-plano',     label: 'Meu Plano',      icon: 'clipboard',  roles: ['servidor'] },
		{ href: '/equipe',        label: 'Equipe',         icon: 'users',      roles: ['chefe_imediato'] },
		{ href: '/conformidade',  label: 'Conformidade',   icon: 'check-circle', roles: ['gestor_unidade', 'admin'] },
		{ href: '/relatorios',    label: 'Relatórios',     icon: 'bar-chart',  roles: ['gestor_unidade', 'admin'] },
		{ href: '/admin/participantes', label: 'Participantes', icon: 'users', roles: ['admin'] },
		{ href: '/admin/institucional', label: 'Institucional', icon: 'building', roles: ['admin'] },
	];

	const visibleItems = $derived(NAV_ITEMS.filter((item) => item.roles.includes(user.role)));

	function isActive(href: string): boolean {
		if (href === '/') return $page.url.pathname === '/';
		return $page.url.pathname.startsWith(href);
	}

	const initials = $derived(initialsFrom(user.name));
	const roleLabel = $derived(ROLE_LABELS[user.role]);
</script>

<nav class="tn" aria-label="Navegação principal">
	<a href="/" class="tn-logo" aria-label="PGD Libre — início">
		<span class="tn-logo-mark" aria-hidden="true">P</span>
		<span>PGD Libre</span>
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

		<a href="/perfil" class="tn-user" aria-label="Perfil de {user.name}">
			<span class="av av-sm" aria-hidden="true">{initials}</span>
			<div>
				<div class="name">{user.name.split(' ')[0]}</div>
				<div class="role-label">{roleLabel}</div>
			</div>
		</a>
	</div>
</nav>

<style>
	.tn-nav {
		list-style: none;
		padding: 0;
		margin: 0;
	}
</style>
