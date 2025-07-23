<script lang="ts">
  import { ShoppingCart, Eye } from 'lucide-svelte';
  import type { Product } from '$lib/stores/app.js';
  
  export let product: Product;
  export let onQuickView: (product: Product) => void = () => {};
  
  function formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }
  
  const categoryColors: Record<string, string> = {
    'fonio': 'bg-primary-green',
    'baobab': 'bg-accent-sunset',
    'nere-fagara': 'bg-creative-purple',
    'mangue': 'bg-accent-gold',
    'bisbab': 'bg-primary-green-vibrant'
  };
  
  const placeholderImages: Record<string, string> = {
    'fonio': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop&crop=center',
    'baobab': 'https://images.unsplash.com/photo-1609251541848-72c45e5bad78?w=400&h=400&fit=crop&crop=center',
    'nere-fagara': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop&crop=center',
    'mangue': 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&h=400&fit=crop&crop=center',
    'bisbab': 'https://images.unsplash.com/photo-1549888834-3ec93abae044?w=400&h=400&fit=crop&crop=center'
  };
</script>

<div class="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
  <!-- Product Image -->
  <div class="relative aspect-square overflow-hidden">
    <img 
      src={placeholderImages[product.category] || product.image} 
      alt={product.name} 
      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
    />
    
    <!-- Overlay Actions -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
        <button 
          on:click|preventDefault={() => onQuickView(product)}
          class="bg-white text-primary-green p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
          title="Aperçu rapide"
        >
          <Eye class="w-5 h-5" />
        </button>
        <button 
          class="bg-primary-green text-white p-3 rounded-full shadow-lg hover:bg-primary-green-vibrant hover:scale-110 transition-all duration-200"
          title="Ajouter au panier"
        >
          <ShoppingCart class="w-5 h-5" />
        </button>
      </div>
    </div>
    
    <!-- Stock Badge -->
    {#if !product.inStock}
      <div class="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
        Rupture
      </div>
    {/if}
    
    <!-- Featured Badge -->
    {#if product.featured}
      <div class="absolute top-4 left-4 bg-accent-gold text-white px-3 py-1 rounded-full text-sm font-semibold">
        Vedette
      </div>
    {/if}
  </div>
  
  <!-- Product Info -->
  <div class="p-6">
    <!-- Category -->
    <div class="mb-2">
      <span class="inline-block {categoryColors[product.category] || 'bg-neutral-light'} text-white text-xs font-semibold px-3 py-1 rounded-full">
        {#if product.category === 'fonio'}Fonio
        {:else if product.category === 'baobab'}Baobab
        {:else if product.category === 'nere-fagara'}Néré & Fagara
        {:else if product.category === 'mangue'}Mangue
        {:else if product.category === 'bisbab'}Biscuits
        {:else}{product.category}
        {/if}
      </span>
    </div>
    
    <!-- Product Name -->
    <h3 class="text-lg font-bold text-primary-green mb-2 line-clamp-2 group-hover:text-primary-green-vibrant transition-colors">
      {product.name}
    </h3>
    
    <!-- Description -->
    <p class="text-sm text-neutral-slate mb-4 line-clamp-2">
      {product.description}
    </p>
    
    <!-- Price and Action -->
    <div class="flex items-center justify-between">
      <span class="text-2xl font-bold text-primary-green">
        {formatPrice(product.price)}
      </span>
      
      {#if product.inStock}
        <button 
          class="bg-primary-green text-white px-4 py-2 rounded-full font-semibold text-sm hover:bg-primary-green-vibrant transform hover:scale-105 transition-all duration-200"
        >
          Commander
        </button>
      {:else}
        <button 
          class="bg-neutral-light text-neutral-slate px-4 py-2 rounded-full font-semibold text-sm cursor-not-allowed"
          disabled
        >
          Indisponible
        </button>
      {/if}
    </div>
    
    <!-- Benefits Preview (shown on hover) -->
    {#if product.benefits && product.benefits.length > 0}
      <div class="mt-4 pt-4 border-t border-neutral-light opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ul class="space-y-1">
          {#each product.benefits.slice(0, 3) as benefit}
            <li class="text-xs text-neutral-charcoal flex items-start">
              <span class="text-primary-green mr-1">•</span>
              {benefit}
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>