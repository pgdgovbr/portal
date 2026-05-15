<script lang="ts">
	import { urgencyClass, urgencyLabel } from '$lib/types';

	interface Props {
		daysLeft: number;
		label?: string;
	}
	let { daysLeft, label }: Props = $props();

	const cls = $derived(urgencyClass(daysLeft));
	const text = $derived(label ?? urgencyLabel(daysLeft));
</script>

<span class="urg {cls}" aria-label="Prazo: {text}">
	<span class="dot" aria-hidden="true"></span>
	{text}
</span>
