<script lang="ts">
  import { ArrowLeft, Share2, Gift, Heart, ShoppingBag, Check } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { products } from '$lib/data/products.js';
  import ProductCard from '$lib/components/ui/ProductCard.svelte';
  
  export let data: PageData;
  
  const { product } = data;
  
  let selectedImage = 0;
  let showShareMenu = false;
  
  function formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }
  
  const placeholderImages: Record<string, string[]> = {
    'fonio': [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1563865436874-9aef32095fad?w=800&h=800&fit=crop'
    ],
    'baobab': [
      'https://images.unsplash.com/photo-1609251541848-72c45e5bad78?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1632857414-b5a7c3c26289?w=800&h=800&fit=crop'
    ],
    'nere-fagara': [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1599140849279-d978f01585c9?w=800&h=800&fit=crop'
    ],
    'mangue': [
      'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&h=800&fit=crop'
    ],
    'bisbab': [
      'https://images.unsplash.com/photo-1549888834-3ec93abae044?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=800&fit=crop'
    ]
  };
  
  const productImages = product.images?.length ? product.images : placeholderImages[product.category] || [product.image];
  
  // Get similar products (same category or similar ingredients)
  const similarProducts = products
    .filter(p => {
      // Same category
      if (p.category === product.category && p.id !== product.id) return true;
      // Or products with baobab if current product has baobab
      if (product.category === 'baobab' && p.category === 'bisbab') return true;
      if (product.category === 'bisbab' && p.category === 'baobab') return true;
      return false;
    })
    .slice(0, 3);
    
  function shareProduct(platform: string) {
    const url = window.location.href;
    const text = `Découvrez ${product.name} de Angel's Floor - ${product.description}`;
    
    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Lien copié!');
        break;
    }
    showShareMenu = false;
  }
</script>

<svelte:head>
  <title>{product.name} - Angel's Floor</title>
  <meta name="description" content={product.detailedDescription || product.description} />
</svelte:head>

<!-- Hero Product Section -->
<section class="min-h-screen bg-white">
  <!-- Back Navigation -->
  <div class="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-neutral-light">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <a href="/produits" class="inline-flex items-center gap-2 text-neutral-charcoal hover:text-primary-green transition-colors">
        <ArrowLeft class="w-5 h-5" />
        <span class="font-medium">Retour aux produits</span>
      </a>
    </div>
  </div>
  
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Main Product Display -->
    <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
      <!-- Image Gallery -->
      <div class="space-y-4">
        <!-- Main Image -->
        <div class="aspect-square rounded-3xl overflow-hidden bg-neutral-sand relative group">
          <img 
            src={productImages[selectedImage]} 
            alt={product.name}
            class="w-full h-full object-cover"
          />
          {#if !product.inStock}
            <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span class="text-white text-2xl font-bold bg-red-500 px-6 py-3 rounded-full">
                Rupture de stock
              </span>
            </div>
          {/if}
        </div>
        
        <!-- Thumbnail Gallery -->
        {#if productImages.length > 1}
          <div class="flex gap-3 overflow-x-auto pb-2">
            {#each productImages as image, index}
              <button 
                on:click={() => selectedImage = index}
                class="flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden ring-2 transition-all
                  {selectedImage === index ? 'ring-primary-green ring-offset-2' : 'ring-transparent'}"
              >
                <img 
                  src={image} 
                  alt="{product.name} - {index + 1}"
                  class="w-full h-full object-cover"
                />
              </button>
            {/each}
          </div>
        {/if}
      </div>
      
      <!-- Product Info -->
      <div class="space-y-8">
        <!-- Title & Price -->
        <div>
          <h1 class="text-4xl lg:text-5xl font-bold text-neutral-charcoal mb-4">
            {product.name}
          </h1>
          <div class="flex items-baseline gap-4">
            <span class="text-3xl font-bold text-primary-green">
              {formatPrice(product.price)}
            </span>
            {#if product.packaging}
              <span class="text-neutral-slate">/ {product.packaging}</span>
            {/if}
          </div>
        </div>
        
        <!-- Description -->
        <div class="prose prose-lg text-neutral-charcoal">
          <p>{product.detailedDescription || product.description}</p>
        </div>
        
        <!-- Key Benefits - Bold Design -->
        {#if product.benefits && product.benefits.length > 0}
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {#each product.benefits.slice(0, 4) as benefit}
              <div class="flex items-start gap-3 p-4 bg-gradient-to-r from-primary-green/5 to-transparent rounded-2xl">
                <Check class="w-6 h-6 text-primary-green flex-shrink-0 mt-0.5" />
                <span class="text-neutral-charcoal font-medium">{benefit}</span>
              </div>
            {/each}
          </div>
        {/if}
        
        <!-- Action Buttons -->
        <div class="space-y-4">
          <!-- Main CTA -->
          <div class="flex gap-3">
            <a 
              href="tel:+22901961219771"
              class="flex-1 bg-primary-green text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary-green-vibrant transition-all transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <ShoppingBag class="w-6 h-6" />
              Commander maintenant
            </a>
            
            <!-- Share Button -->
            <div class="relative">
              <button 
                on:click={() => showShareMenu = !showShareMenu}
                class="p-4 bg-neutral-sand rounded-2xl hover:bg-neutral-light transition-colors"
                title="Partager"
              >
                <Share2 class="w-6 h-6 text-neutral-charcoal" />
              </button>
              
              {#if showShareMenu}
                <div class="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-neutral-light p-2 z-50">
                  <button 
                    on:click={() => shareProduct('whatsapp')}
                    class="w-full text-left px-4 py-2 hover:bg-neutral-sand rounded-lg transition-colors"
                  >
                    WhatsApp
                  </button>
                  <button 
                    on:click={() => shareProduct('facebook')}
                    class="w-full text-left px-4 py-2 hover:bg-neutral-sand rounded-lg transition-colors"
                  >
                    Facebook
                  </button>
                  <button 
                    on:click={() => shareProduct('twitter')}
                    class="w-full text-left px-4 py-2 hover:bg-neutral-sand rounded-lg transition-colors"
                  >
                    Twitter
                  </button>
                  <button 
                    on:click={() => shareProduct('copy')}
                    class="w-full text-left px-4 py-2 hover:bg-neutral-sand rounded-lg transition-colors"
                  >
                    Copier le lien
                  </button>
                </div>
              {/if}
            </div>
          </div>
          
          <!-- Gift Option -->
          <button class="w-full bg-gradient-to-r from-accent-gold to-accent-sunset text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3">
            <Gift class="w-6 h-6" />
            Offrir en cadeau
          </button>
        </div>
        
        <!-- Product Details Grid -->
        {#if product.origin || product.certification}
          <div class="border-t border-neutral-light pt-8 grid grid-cols-2 gap-6">
            {#if product.origin}
              <div>
                <h3 class="text-sm font-semibold text-neutral-slate uppercase tracking-wider mb-2">Origine</h3>
                <p class="text-neutral-charcoal font-medium">{product.origin}</p>
              </div>
            {/if}
            {#if product.certification}
              <div>
                <h3 class="text-sm font-semibold text-neutral-slate uppercase tracking-wider mb-2">Certification</h3>
                <p class="text-neutral-charcoal font-medium">{product.certification}</p>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
    
    <!-- Usage Section - Full Width Bold -->
    {#if product.usage}
      <div class="bg-gradient-to-r from-primary-green to-primary-green-vibrant rounded-3xl p-8 lg:p-12 text-white mb-20">
        <h2 class="text-3xl font-bold mb-6">Comment l'utiliser?</h2>
        <p class="text-lg leading-relaxed max-w-3xl">{product.usage}</p>
      </div>
    {/if}
    
    <!-- Nutritional Information - Minimalist Table -->
    {#if product.nutritionalInfo}
      <div class="mb-20">
        <h2 class="text-3xl font-bold text-neutral-charcoal mb-8">Valeurs Nutritionnelles</h2>
        <div class="bg-neutral-sand rounded-3xl p-8">
          <p class="text-sm text-neutral-slate mb-6">Pour 100g</p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            {#if product.nutritionalInfo.calories}
              <div class="text-center">
                <div class="text-3xl font-bold text-primary-green">{product.nutritionalInfo.calories}</div>
                <div class="text-sm text-neutral-slate mt-1">Calories</div>
              </div>
            {/if}
            {#if product.nutritionalInfo.protein}
              <div class="text-center">
                <div class="text-3xl font-bold text-primary-green">{product.nutritionalInfo.protein}g</div>
                <div class="text-sm text-neutral-slate mt-1">Protéines</div>
              </div>
            {/if}
            {#if product.nutritionalInfo.fiber}
              <div class="text-center">
                <div class="text-3xl font-bold text-primary-green">{product.nutritionalInfo.fiber}g</div>
                <div class="text-sm text-neutral-slate mt-1">Fibres</div>
              </div>
            {/if}
            {#if product.nutritionalInfo.vitaminC}
              <div class="text-center">
                <div class="text-3xl font-bold text-primary-green">{product.nutritionalInfo.vitaminC}mg</div>
                <div class="text-sm text-neutral-slate mt-1">Vitamine C</div>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}
    
    <!-- Similar Products Section -->
    {#if similarProducts.length > 0}
      <div>
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-3xl font-bold text-neutral-charcoal">Vous aimerez aussi</h2>
            <p class="text-neutral-slate mt-2">Des produits similaires ou avec les mêmes ingrédients</p>
          </div>
          <a href="/produits" class="text-primary-green hover:text-primary-green-vibrant font-medium">
            Voir tous →
          </a>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          {#each similarProducts as similarProduct}
            <ProductCard product={similarProduct} />
          {/each}
        </div>
      </div>
    {/if}
  </div>
</section>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
</style>