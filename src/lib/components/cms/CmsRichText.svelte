<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		key: string;
		class?: string;
		override?: string | null;
		children: Snippet;
	}

	let { key, class: className = '', override = null, children }: Props = $props();
</script>

<div class={className} data-cms-key={key}>
	{#if override}
		{@html override}
	{:else}
		{@render children()}
	{/if}
</div>
