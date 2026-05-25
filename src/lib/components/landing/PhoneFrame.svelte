<!--
  PhoneFrame · device bezel + notch + screen com aspect-ratio fixo.
  Reutilizado no hero do desktop (lg, 360px) e mobile (sm, 268px).
  Especificação: portal/_design/from-claude-design-hero-mobile/project/handoff-hero-mobile-first.md
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		size?: 'sm' | 'lg';
		children: Snippet;
	}

	let { size = 'lg', children }: Props = $props();

	const dims = $derived(
		size === 'lg'
			? { width: 360, padding: 10, radius: 36, inner: 28, notchTop: 18, notchW: 96, notchH: 22 }
			: { width: 268, padding: 8, radius: 32, inner: 24, notchTop: 14, notchW: 72, notchH: 18 }
	);
</script>

<div
	class="phone-frame"
	style:max-width="{dims.width}px"
	style:padding="{dims.padding}px"
	style:border-radius="{dims.radius}px"
	aria-hidden="false"
>
	<div
		class="phone-notch"
		style:top="{dims.notchTop}px"
		style:width="{dims.notchW}px"
		style:height="{dims.notchH}px"
		aria-hidden="true"
	></div>
	<div class="phone-screen" style:border-radius="{dims.inner}px">
		{@render children()}
	</div>
</div>

<style>
	.phone-frame {
		width: 100%;
		background: linear-gradient(180deg, #1d2333 0%, #0b1426 100%);
		box-shadow:
			0 40px 80px -30px rgba(11, 20, 38, 0.45),
			0 18px 40px -18px rgba(11, 20, 38, 0.3),
			0 0 0 1px rgba(11, 20, 38, 0.1);
		position: relative;
	}
	.phone-notch {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		background: #0b1426;
		border-radius: 10px;
		z-index: 2;
	}
	.phone-screen {
		overflow: hidden;
		background: white;
		aspect-ratio: 706 / 1506;
	}
	.phone-screen :global(img) {
		display: block;
		width: 100%;
		height: auto;
	}
</style>
