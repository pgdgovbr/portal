<script lang="ts">
	export interface Persona {
		email: string;
		name: string;
		role: string;
		role_label: string;
		ctx: string;
		grupo: string;
	}

	interface Props {
		persona: Persona;
		recommended?: boolean;
	}

	let { persona, recommended = false }: Props = $props();

	const palette = [
		{ bg: '#E6EEF8', fg: '#0F3D8C' },
		{ bg: '#E2F2E4', fg: '#168821' },
		{ bg: '#FCF1DC', fg: '#C77400' },
		{ bg: '#EFE8F7', fg: '#5C2D91' },
		{ bg: '#FBE6E6', fg: '#B91C1C' },
		{ bg: '#DCEDF9', fg: '#0E7490' },
	];

	const color = $derived.by(() => {
		let h = 0;
		for (const c of persona.name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
		return palette[h % palette.length];
	});

	const initials = $derived(
		persona.name
			.split(' ')
			.map((w) => w[0])
			.slice(0, 2)
			.join('')
			.toUpperCase()
	);

	const href = $derived(
		`/api/demo-login?email=${encodeURIComponent(persona.email)}&name=${encodeURIComponent(persona.name)}&role=${persona.role}`
	);
</script>

<a {href} class="persona-card" class:recommended data-testid="persona-card">
	<span class="avatar" style="background:{color.bg}; color:{color.fg}">{initials}</span>
	<div class="info">
		<div class="line1">
			<strong>{persona.name}</strong>
			<span class="role-tag" style="color:{color.fg}; background:{color.bg}">
				{persona.role_label}
			</span>
		</div>
		<div class="ctx">{persona.ctx}</div>
	</div>
	<svg
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<path d="M9 6l6 6-6 6" />
	</svg>
</a>

<style>
	.persona-card {
		display: flex;
		gap: 12px;
		align-items: center;
		padding: 14px;
		background: white;
		border: 1px solid rgba(11, 20, 38, 0.08);
		border-radius: 12px;
		text-decoration: none;
		color: inherit;
		transition: all 0.12s ease;
	}
	.persona-card:hover {
		border-color: rgba(11, 20, 38, 0.18);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(11, 20, 38, 0.06);
	}
	.persona-card.recommended {
		border: 1.5px solid var(--c-primary);
		box-shadow: 0 0 0 4px rgba(15, 61, 140, 0.08);
	}
	.avatar {
		width: 42px;
		height: 42px;
		border-radius: 11px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-family: var(--ff-display);
		font-weight: 800;
		font-size: 14px;
		flex: none;
	}
	.info {
		flex: 1;
		min-width: 0;
	}
	.line1 {
		display: flex;
		gap: 8px;
		align-items: center;
		flex-wrap: wrap;
	}
	.line1 strong {
		font-size: 14.5px;
		color: var(--c-ink-editorial);
	}
	.role-tag {
		font-size: 11px;
		font-weight: 600;
		padding: 2px 8px;
		border-radius: 999px;
	}
	.ctx {
		font-size: 12.5px;
		color: var(--c-muted);
		margin-top: 4px;
		line-height: 1.45;
	}
	.persona-card svg {
		color: var(--c-muted);
		flex: none;
	}
</style>
