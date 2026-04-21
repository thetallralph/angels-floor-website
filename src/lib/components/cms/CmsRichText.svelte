<script lang="ts">
	import type { Snippet } from 'svelte';
	import { useCms } from '$lib/cms/context';

	type Props = {
		key: string;
		class?: string;
		children: Snippet;
	};

	let { key, class: className, children }: Props = $props();
	const cms = useCms();
	const value = $derived(cms.text[key]);
</script>

<div data-cms={key} data-cms-type="richtext" class={className}>
	{#if value}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html value}
	{:else}
		{@render children()}
	{/if}
</div>
