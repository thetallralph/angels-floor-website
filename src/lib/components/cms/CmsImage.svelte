<script lang="ts">
	import { useCms } from '$lib/cms/context';

	type Props = {
		key: string;
		src: string;
		alt: string;
		class?: string;
		[x: string]: unknown;
	};

	let { key, src, alt, class: className, ...rest }: Props = $props();
	const cms = useCms();
	const finalSrc = $derived(cms.image[key] || src);
</script>

<img data-cms={key} data-cms-type="image" src={finalSrc} {alt} class={className} {...rest} />
