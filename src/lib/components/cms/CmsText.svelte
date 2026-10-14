<script lang="ts">
	import type { Snippet } from 'svelte';
	import { useCms } from '$lib/cms/context';
	import { getLocale } from '$lib/i18n';

	type Props = {
		key: string;
		tag?: string;
		class?: string;
		/** English default. The French default is the children. */
		en?: string;
		children: Snippet;
		[x: string]: unknown;
	};

	let { key, tag = 'span', class: className, en, children, ...rest }: Props = $props();
	const cms = useCms();
	const value = $derived(cms.text[key] || (getLocale() === 'en' ? en : undefined));
</script>

<svelte:element this={tag} data-cms={key} data-cms-type="text" class={className} {...rest}>
	{#if value}{value}{:else}{@render children()}{/if}
</svelte:element>
