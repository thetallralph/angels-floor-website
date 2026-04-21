<script lang="ts">
	import type { Snippet } from 'svelte';
	import { useCms } from '$lib/cms/context';

	type Props = {
		key: string;
		tag?: string;
		class?: string;
		children: Snippet;
		[x: string]: unknown;
	};

	let { key, tag = 'span', class: className, children, ...rest }: Props = $props();
	const cms = useCms();
	const value = $derived(cms.text[key]);
</script>

<svelte:element this={tag} data-cms={key} data-cms-type="text" class={className} {...rest}>
	{#if value}{value}{:else}{@render children()}{/if}
</svelte:element>
