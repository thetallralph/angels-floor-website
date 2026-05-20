<script lang="ts">
  import { Plus, Check, X } from 'lucide-svelte';
  import { addItem as addCartItem } from '$lib/cart/store';
  import type { Product, ProductVariant } from '$lib/stores/app.js';

  export let product: Product;

  const placeholderImages: Record<string, string> = {
    'fonio': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop&crop=center',
    'baobab': 'https://images.unsplash.com/photo-1609251541848-72c45e5bad78?w=400&h=400&fit=crop&crop=center',
    'nere': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop&crop=center',
    'mangue': 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&h=400&fit=crop&crop=center',
    'papaye': 'https://images.unsplash.com/photo-1517422757410-466f8b2dd068?w=400&h=400&fit=crop&crop=center',
    'autres': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&crop=center'
  };

  $: variants = product.variants ?? [];
  $: hasVariants = variants.length > 0;

  let pickerOpen = false;
  let selectedVariantIdx = 0;
  let addedFlash = false;
  let addedFlashTimeout: ReturnType<typeof setTimeout> | null = null;

  $: selectedVariant = variants[selectedVariantIdx];
  $: currentPrice =
    hasVariants && typeof selectedVariant?.price === 'number'
      ? selectedVariant.price
      : product.price;

  function formatPrice(amount: number): string {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  }

  function variantShortLabel(v: ProductVariant | undefined): string {
    if (!v) return '';
    return [v.size, v.flavor, v.label].filter(Boolean).join(' · ');
  }

  function variantKey(v: ProductVariant | undefined, idx: number): string {
    if (!v) return 'default';
    return `${v.size ?? ''}|${v.flavor ?? ''}|${v.label ?? ''}|${idx}`;
  }

  function openPicker(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    pickerOpen = true;
  }

  function cancelPicker(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    pickerOpen = false;
  }

  function handleAddClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (hasVariants && !pickerOpen) {
      openPicker(e);
      return;
    }
    confirmAdd();
  }

  function confirmAdd() {
    const v = selectedVariant;
    const label = v
      ? variantShortLabel(v) || '—'
      : product.packaging || 'Unité';
    const key = hasVariants ? variantKey(v, selectedVariantIdx) : 'default';
    const price = hasVariants && typeof v?.price === 'number' ? v.price : product.price;

    addCartItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      productImage: product.image || placeholderImages[product.category],
      variantKey: key,
      variantLabel: label,
      unitPrice: price
    });

    pickerOpen = false;
    addedFlash = true;
    if (addedFlashTimeout) clearTimeout(addedFlashTimeout);
    addedFlashTimeout = setTimeout(() => (addedFlash = false), 2000);
  }
</script>

<div class="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col group">
  <!-- Image (clickable) -->
  <a href="/produits/{product.slug}" class="block relative aspect-square overflow-hidden">
    <img
      src={product.image || placeholderImages[product.category]}
      alt={product.name}
      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
  </a>

  <!-- Info -->
  <div class="p-5 flex-1 flex flex-col">
    <a href="/produits/{product.slug}" class="block">
      <h3 class="text-xl font-bold text-neutral-charcoal mb-2 group-hover:text-primary-green transition-colors line-clamp-2 min-h-[3.5rem]">
        {product.name}
      </h3>
    </a>

    {#if product.description}
      <p class="text-sm text-neutral-slate mb-4 line-clamp-2">
        {product.description}
      </p>
    {/if}

    <div class="mt-auto">
      {#if pickerOpen}
        <!-- Variant picker -->
        <p class="text-xs font-semibold text-neutral-charcoal mb-2">Choisissez un format</p>
        <div class="flex flex-wrap gap-1.5 mb-3">
          {#each variants as v, idx}
            <button
              type="button"
              on:click|preventDefault|stopPropagation={() => (selectedVariantIdx = idx)}
              class="px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all
                {selectedVariantIdx === idx
                  ? 'border-primary-green bg-primary-green text-white'
                  : 'border-neutral-light text-neutral-charcoal bg-white hover:border-primary-green hover:text-primary-green'}"
            >
              {variantShortLabel(v) || '—'}
            </button>
          {/each}
        </div>
        <div class="flex gap-2">
          <button
            type="button"
            on:click={confirmAdd}
            class="flex-1 flex items-center justify-center gap-1.5 bg-primary-green text-white px-3 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-green-vibrant transition-all"
          >
            <Check class="w-4 h-4" />
            Ajouter ({formatPrice(currentPrice)})
          </button>
          <button
            type="button"
            on:click={cancelPicker}
            class="p-2.5 text-neutral-slate hover:text-red-500 rounded-full transition-colors"
            aria-label="Annuler"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      {:else}
        <!-- Price + Add button -->
        <div class="mb-3">
          {#if hasVariants}
            <p class="text-xs text-neutral-slate">À partir de</p>
          {/if}
          <span class="text-lg font-semibold text-primary-green">
            {formatPrice(currentPrice)}
          </span>
        </div>
        <button
          type="button"
          on:click={handleAddClick}
          class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all
            {addedFlash
              ? 'bg-primary-green/10 text-primary-green border-2 border-primary-green/30'
              : 'bg-primary-green text-white hover:bg-primary-green-vibrant'}"
        >
          {#if addedFlash}
            <Check class="w-4 h-4" />
            Ajouté au panier
          {:else}
            <Plus class="w-4 h-4" />
            {hasVariants ? 'Choisir un format' : 'Ajouter au panier'}
          {/if}
        </button>
      {/if}
    </div>
  </div>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
