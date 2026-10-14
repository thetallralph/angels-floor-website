<script lang="ts">
	import { X, Plus, Minus, Trash2, MapPin, MessageCircle, ShoppingBag } from 'lucide-svelte';
	import {
		cart,
		cartTotal,
		setQuantity,
		removeItem,
		clearCart,
		buildOrderMessage,
		formatPrice
	} from '$lib/cart/store';
	import { SITE } from '$lib/config';
	import { t, href, getLocale } from '$lib/i18n';

	let { open = $bindable(false) }: { open?: boolean } = $props();

	const items = $derived($cart);
	const total = $derived($cartTotal);

	function close() {
		open = false;
	}

	function inc(slug: string, key: string, current: number) {
		setQuantity(slug, key, current + 1);
	}
	function dec(slug: string, key: string, current: number) {
		setQuantity(slug, key, current - 1);
	}

	function checkoutWhatsApp() {
		const text = buildOrderMessage(items, getLocale());
		const url = `https://wa.me/${SITE.whatsappOrderNumber}?text=${encodeURIComponent(text)}`;
		window.open(url, '_blank');
	}

	function checkoutSalesPoint() {
		close();
		window.location.href = href(SITE.salesPointsPath);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) close();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- Backdrop -->
	<button
		type="button"
		onclick={close}
		class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
		aria-label={t('Fermer le panier', 'Close cart')}
	></button>

	<!-- Drawer -->
	<div
		class="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
		role="dialog"
		aria-modal="true"
		aria-label={t('Panier', 'Cart')}
	>
		<!-- Header -->
		<div class="px-6 py-4 border-b border-neutral-light flex items-center justify-between">
			<div class="flex items-center gap-2">
				<ShoppingBag class="w-5 h-5 text-primary-green" />
				<h2 class="text-lg font-bold text-neutral-obsidian">{t('Mon panier', 'My cart')}</h2>
				{#if items.length > 0}
					<span class="text-sm text-neutral-slate">({items.length} {t(items.length > 1 ? 'articles' : 'article', items.length === 1 ? 'item' : 'items')})</span>
				{/if}
			</div>
			<button
				type="button"
				onclick={close}
				class="p-2 rounded-lg hover:bg-neutral-pearl transition-colors"
				aria-label={t('Fermer', 'Close')}
			>
				<X class="w-5 h-5 text-neutral-slate" />
			</button>
		</div>

		<!-- Items -->
		<div class="flex-1 overflow-y-auto px-6 py-4">
			{#if items.length === 0}
				<div class="flex flex-col items-center justify-center h-full text-center">
					<ShoppingBag class="w-12 h-12 text-neutral-light mb-3" />
					<p class="text-neutral-slate">{t('Votre panier est vide', 'Your cart is empty')}</p>
					<button
						type="button"
						onclick={close}
						class="mt-4 text-sm font-medium text-primary-green hover:underline"
					>
						{t('Continuer les achats', 'Continue shopping')}
					</button>
				</div>
			{:else}
				<ul class="space-y-4">
					{#each items as item (item.productSlug + '::' + item.variantKey)}
						<li class="flex gap-3 pb-4 border-b border-neutral-sand last:border-0">
							{#if item.productImage}
								<a href={href(`/produits/${item.productSlug}`)} class="block flex-shrink-0">
									<img
										src={item.productImage}
										alt={item.productName}
										class="w-20 h-20 rounded-xl object-cover bg-neutral-sand"
									/>
								</a>
							{/if}
							<div class="flex-1 min-w-0">
								<a
									href={href(`/produits/${item.productSlug}`)}
									class="block font-semibold text-sm text-neutral-obsidian hover:text-primary-green truncate"
								>
									{item.productName}
								</a>
								<p class="text-xs text-neutral-slate mt-0.5">{item.variantLabel}</p>
								<p class="text-sm font-bold text-primary-green mt-1">
									{formatPrice(item.unitPrice * item.quantity, getLocale())}
								</p>

								<div class="flex items-center justify-between mt-2">
									<div class="inline-flex items-center gap-1 bg-neutral-pearl rounded-full">
										<button
											type="button"
											onclick={() => dec(item.productSlug, item.variantKey, item.quantity)}
											class="p-1.5 hover:bg-neutral-sand rounded-full transition-colors"
											aria-label={t('Diminuer la quantité', 'Decrease quantity')}
										>
											<Minus class="w-3.5 h-3.5" />
										</button>
										<span class="px-2 text-sm font-semibold min-w-[1.5rem] text-center">{item.quantity}</span>
										<button
											type="button"
											onclick={() => inc(item.productSlug, item.variantKey, item.quantity)}
											class="p-1.5 hover:bg-neutral-sand rounded-full transition-colors"
											aria-label={t('Augmenter la quantité', 'Increase quantity')}
										>
											<Plus class="w-3.5 h-3.5" />
										</button>
									</div>
									<button
										type="button"
										onclick={() => removeItem(item.productSlug, item.variantKey)}
										class="p-1.5 text-neutral-slate hover:text-red-500 transition-colors"
										aria-label={t('Retirer du panier', 'Remove from cart')}
									>
										<Trash2 class="w-4 h-4" />
									</button>
								</div>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<!-- Footer / checkout -->
		{#if items.length > 0}
			<div class="border-t border-neutral-light px-6 py-4 space-y-4 bg-neutral-pearl/40">
				<div class="flex items-center justify-between">
					<span class="text-sm text-neutral-charcoal">Total</span>
					<span class="text-xl font-bold text-primary-green">{formatPrice(total, getLocale())}</span>
				</div>

				<div class="space-y-2">
					<button
						type="button"
						onclick={checkoutWhatsApp}
						class="w-full flex items-center justify-center gap-2 bg-primary-green text-white px-4 py-3 rounded-full font-semibold hover:bg-primary-green-vibrant transition-all"
					>
						<MessageCircle class="w-5 h-5" />
						{t('Commander via WhatsApp', 'Order via WhatsApp')}
					</button>
					<button
						type="button"
						onclick={checkoutSalesPoint}
						class="w-full flex items-center justify-center gap-2 bg-white border-2 border-primary-green text-primary-green px-4 py-3 rounded-full font-semibold hover:bg-primary-green/5 transition-all"
					>
						<MapPin class="w-5 h-5" />
						{t('Acheter en point de vente', 'Buy in store')}
					</button>
				</div>

				<button
					type="button"
					onclick={() => {
						if (confirm(t('Vider le panier ?', 'Empty the cart?'))) clearCart();
					}}
					class="w-full text-xs text-neutral-slate hover:text-red-500 transition-colors"
				>
					{t('Vider le panier', 'Empty cart')}
				</button>
			</div>
		{/if}
	</div>
{/if}
