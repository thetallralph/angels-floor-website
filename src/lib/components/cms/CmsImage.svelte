<script lang="ts">
	interface Props {
		key: string;
		src: string;
		alt?: string;
		class?: string;
		override?: string | null;
	}

	let { key, src, alt = '', class: className = '', override = null }: Props = $props();
</script>

<img
	src={override || src}
	{alt}
	class={className}
	data-cms-key={key}
/>
