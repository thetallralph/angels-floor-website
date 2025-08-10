<script lang="ts">
  import { ArrowRight } from 'lucide-svelte';
  import type { Product } from '$lib/stores/app.js';
  
  export let product: Product;
  
  function formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }
  
  const placeholderImages: Record<string, string> = {
    'fonio': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop&crop=center',
    'baobab': 'https://images.unsplash.com/photo-1609251541848-72c45e5bad78?w=400&h=400&fit=crop&crop=center',
    'nere-fagara': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop&crop=center',
    'mangue': 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&h=400&fit=crop&crop=center',
    'bisbab': 'https://images.unsplash.com/photo-1549888834-3ec93abae044?w=400&h=400&fit=crop&crop=center'
  };
</script>

<a href="/produits/{product.slug}" class="block group">
  <div class="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full">
    <!-- Product Image -->
    <div class="relative aspect-square overflow-hidden">
      <img 
        src={placeholderImages[product.category] || product.image} 
        alt={product.name} 
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      
      <!-- Stock Badge -->
      {#if !product.inStock}
        <div class="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Rupture
        </div>
      {/if}
    </div>
    
    <!-- Product Info -->
    <div class="p-5">
      <!-- Product Name - Bigger -->
      <h3 class="text-xl font-bold text-neutral-charcoal mb-2 group-hover:text-primary-green transition-colors">
        {product.name}
      </h3>
      
      <!-- Description - Added -->
      <p class="text-sm text-neutral-slate mb-3 line-clamp-2">
        {product.description}
      </p>
      
      <!-- Price and Action - Price smaller -->
      <div class="flex items-center justify-between">
        <span class="text-lg font-semibold text-primary-green">
          {formatPrice(product.price)}
        </span>
        
        <ArrowRight class="w-5 h-5 text-neutral-slate group-hover:text-primary-green transition-colors" />
      </div>
    </div>
  </div>
</a>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>