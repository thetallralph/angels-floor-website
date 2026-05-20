<script lang="ts">
	import { ShoppingBag } from 'lucide-svelte';
	import { cartCount } from '$lib/cart/store';
	import CartDrawer from './CartDrawer.svelte';

	let open = false;
	$: count = $cartCount;

	function handleClick() {
		open = true;
	}
</script>

<!-- Floating button: bottom-right, visible only when cart has items
     OR if we explicitly want it always visible. Always-visible is friendlier. -->
<button
	type="button"
	on:click={handleClick}
	class="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-primary-green text-white px-5 py-4 rounded-full shadow-2xl hover:bg-primary-green-vibrant hover:-translate-y-0.5 transition-all duration-300"
	class:hidden={false}
	aria-label="Ouvrir le panier"
>
	<ShoppingBag class="w-5 h-5" />
	<span class="font-semibold">Panier</span>
	{#if count > 0}
		<span class="ml-1 bg-accent-gold text-neutral-obsidian font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center">
			{count}
		</span>
	{/if}
</button>

<CartDrawer bind:open />
