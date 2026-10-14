<script lang="ts">
	import type { Snippet } from 'svelte';
	import { useCms } from '$lib/cms/context';
	import { getLocale } from '$lib/i18n';

	type Props = {
		key: string;
		class?: string;
		/** English default, declared as `{#snippet en()}…{/snippet}`. The French default is the children. */
		en?: Snippet;
		children: Snippet;
	};

	let { key, class: className, en, children }: Props = $props();
	const cms = useCms();
	const value = $derived(cms.text[key]);
	const english = $derived(getLocale() === 'en' ? en : undefined);
</script>

<div data-cms={key} data-cms-type="richtext" class={className}>
	{#if value}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html value}
	{:else if english}
		{@render english()}
	{:else}
		{@render children()}
	{/if}
</div>
