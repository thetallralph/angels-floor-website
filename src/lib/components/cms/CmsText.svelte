<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		key: string;
		tag?: string;
		class?: string;
		override?: string | null;
		children: Snippet;
	}

	let { key, tag = 'span', class: className = '', override = null, children }: Props = $props();
</script>

{#if tag === 'h1'}
	<h1 class={className} data-cms-key={key}>{#if override}{override}{:else}{@render children()}{/if}</h1>
{:else if tag === 'h2'}
	<h2 class={className} data-cms-key={key}>{#if override}{override}{:else}{@render children()}{/if}</h2>
{:else if tag === 'h3'}
	<h3 class={className} data-cms-key={key}>{#if override}{override}{:else}{@render children()}{/if}</h3>
{:else if tag === 'p'}
	<p class={className} data-cms-key={key}>{#if override}{override}{:else}{@render children()}{/if}</p>
{:else}
	<span class={className} data-cms-key={key}>{#if override}{override}{:else}{@render children()}{/if}</span>
{/if}
