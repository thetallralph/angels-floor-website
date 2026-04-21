<script lang="ts">
	import type { Snippet } from 'svelte';
	import { useCms } from '$lib/cms/context';

	type Props = {
		key: string;
		defaults: string[];
		class?: string;
		children: Snippet<[string[]]>;
	};

	let { key, defaults, class: className, children }: Props = $props();
	const cms = useCms();
	const images = $derived(cms.gallery[key]?.length ? cms.gallery[key] : defaults);
</script>

<div data-cms={key} data-cms-type="gallery" class={className}>
	{@render children(images)}
</div>
