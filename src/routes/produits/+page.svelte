<script lang="ts">
  import { onMount } from 'svelte';
  import { Filter, Grid, List, X } from 'lucide-svelte';
  import ProductCard from '$lib/components/ui/ProductCard.svelte';
  import { products, categories } from '$lib/data/products.js';
  import type { Product } from '$lib/stores/app.js';
  
  let selectedCategory = 'all';
  let priceRange = { min: 0, max: 10000 };
  let sortBy = 'featured';
  let viewMode = 'grid';
  let showFilters = false;
  let selectedProduct: Product | null = null;
  let showQuickView = false;
  
  $: filteredProducts = products
    .filter(product => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      // Price filter
      if (product.price < priceRange.min || product.price > priceRange.max) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  
  function handleQuickView(product: Product) {
    selectedProduct = product;
    showQuickView = true;
  }
  
  function closeQuickView() {
    showQuickView = false;
    selectedProduct = null;
  }
  
  function formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }
</script>

<svelte:head>
  <title>Nos Produits - Angel's Floor</title>
  <meta name="description" content="Découvrez notre gamme complète de produits béninois naturels : fonio précuit, pulpe de baobab, biscuits enrichis et plus encore." />
</svelte:head>

<!-- Hero Section -->
<section class="relative bg-gradient-to-br from-primary-green to-primary-green-vibrant py-16 overflow-hidden">
  <div class="absolute inset-0">
    <div class="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl"></div>
  </div>
  
  <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
    <h1 class="text-4xl md:text-6xl font-bold mb-4">Nos Produits</h1>
    <p class="text-xl text-white/90 max-w-2xl mx-auto">
      Une sélection de produits béninois naturels, transformés avec soin par nos productrices
    </p>
  </div>
</section>

<!-- Products Section -->
<section class="py-12 bg-neutral-sand min-h-screen">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Filter Bar -->
    <div class="bg-white rounded-2xl shadow-lg p-4 mb-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- Mobile Filter Toggle -->
        <button 
          on:click={() => showFilters = !showFilters}
          class="md:hidden flex items-center gap-2 text-primary-green font-semibold"
        >
          <Filter class="w-5 h-5" />
          Filtres
        </button>
        
        <!-- Desktop Filters -->
        <div class="hidden md:flex items-center gap-6 flex-1">
          <!-- Category Filter -->
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-neutral-charcoal">Catégorie:</span>
            <select 
              bind:value={selectedCategory}
              class="bg-neutral-sand rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green"
            >
              {#each categories as category}
                <option value={category.id}>{category.name} ({category.count})</option>
              {/each}
            </select>
          </div>
          
          <!-- Price Range -->
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-neutral-charcoal">Prix:</span>
            <input 
              type="range" 
              bind:value={priceRange.max}
              min="0" 
              max="10000" 
              step="500"
              class="w-32"
            />
            <span class="text-sm text-neutral-slate">{formatPrice(priceRange.max)}</span>
          </div>
        </div>
        
        <!-- Sort and View Options -->
        <div class="flex items-center gap-4">
          <!-- Sort -->
          <select 
            bind:value={sortBy}
            class="bg-neutral-sand rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green"
          >
            <option value="featured">Populaires</option>
            <option value="price-low">Prix croissant</option>
            <option value="price-high">Prix décroissant</option>
            <option value="name">Nom A-Z</option>
          </select>
          
          <!-- View Mode -->
          <div class="hidden md:flex items-center gap-2 bg-neutral-sand rounded-lg p-1">
            <button 
              on:click={() => viewMode = 'grid'}
              class="p-2 rounded {viewMode === 'grid' ? 'bg-primary-green text-white' : 'text-neutral-slate hover:text-primary-green'} transition-colors"
            >
              <Grid class="w-4 h-4" />
            </button>
            <button 
              on:click={() => viewMode = 'list'}
              class="p-2 rounded {viewMode === 'list' ? 'bg-primary-green text-white' : 'text-neutral-slate hover:text-primary-green'} transition-colors"
            >
              <List class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile Filters (Collapsible) -->
      {#if showFilters}
        <div class="md:hidden mt-4 pt-4 border-t border-neutral-light space-y-4">
          <!-- Category Filter -->
          <div>
            <label class="text-sm font-semibold text-neutral-charcoal block mb-2">Catégorie</label>
            <select 
              bind:value={selectedCategory}
              class="w-full bg-neutral-sand rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green"
            >
              {#each categories as category}
                <option value={category.id}>{category.name} ({category.count})</option>
              {/each}
            </select>
          </div>
          
          <!-- Price Range -->
          <div>
            <label class="text-sm font-semibold text-neutral-charcoal block mb-2">
              Prix maximum: {formatPrice(priceRange.max)}
            </label>
            <input 
              type="range" 
              bind:value={priceRange.max}
              min="0" 
              max="10000" 
              step="500"
              class="w-full"
            />
          </div>
        </div>
      {/if}
    </div>
    
    <!-- Results Count -->
    <div class="mb-6 text-neutral-charcoal">
      <p class="text-sm">
        {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
      </p>
    </div>
    
    <!-- Products Grid/List -->
    {#if filteredProducts.length > 0}
      <div class="{viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}">
        {#each filteredProducts as product}
          <ProductCard {product} onQuickView={handleQuickView} />
        {/each}
      </div>
    {:else}
      <div class="text-center py-20">
        <div class="w-24 h-24 bg-neutral-light rounded-full flex items-center justify-center mx-auto mb-4">
          <Filter class="w-12 h-12 text-neutral-slate" />
        </div>
        <h3 class="text-xl font-semibold text-neutral-charcoal mb-2">Aucun produit trouvé</h3>
        <p class="text-neutral-slate">Essayez de modifier vos critères de recherche</p>
      </div>
    {/if}
  </div>
</section>

<!-- Quick View Modal -->
{#if showQuickView && selectedProduct}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      <!-- Modal Header -->
      <div class="sticky top-0 bg-white border-b border-neutral-light p-6 flex justify-between items-center">
        <h2 class="text-2xl font-bold text-primary-green">Aperçu rapide</h2>
        <button 
          on:click={closeQuickView}
          class="p-2 hover:bg-neutral-sand rounded-full transition-colors"
        >
          <X class="w-6 h-6 text-neutral-charcoal" />
        </button>
      </div>
      
      <!-- Modal Content -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Product Images -->
          <div>
            <img 
              src={selectedProduct.image || `https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=600&fit=crop&crop=center`} 
              alt={selectedProduct.name}
              class="w-full rounded-2xl"
            />
          </div>
          
          <!-- Product Info -->
          <div>
            <h3 class="text-3xl font-bold text-primary-green mb-4">{selectedProduct.name}</h3>
            <p class="text-xl font-semibold text-accent-sunset mb-6">{formatPrice(selectedProduct.price)}</p>
            
            <p class="text-neutral-charcoal mb-6">{selectedProduct.description}</p>
            
            {#if selectedProduct.benefits && selectedProduct.benefits.length > 0}
              <div class="mb-6">
                <h4 class="font-semibold text-primary-green mb-3">Bénéfices</h4>
                <ul class="space-y-2">
                  {#each selectedProduct.benefits as benefit}
                    <li class="flex items-start text-neutral-charcoal">
                      <span class="text-primary-green mr-2">✓</span>
                      {benefit}
                    </li>
                  {/each}
                </ul>
              </div>
            {/if}
            
            {#if selectedProduct.nutritionalInfo}
              <div class="mb-6">
                <h4 class="font-semibold text-primary-green mb-3">Informations nutritionnelles (pour 100g)</h4>
                <div class="bg-neutral-sand rounded-xl p-4 space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span>Calories</span>
                    <span class="font-semibold">{selectedProduct.nutritionalInfo.calories} kcal</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Protéines</span>
                    <span class="font-semibold">{selectedProduct.nutritionalInfo.protein}g</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Glucides</span>
                    <span class="font-semibold">{selectedProduct.nutritionalInfo.carbs}g</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Fibres</span>
                    <span class="font-semibold">{selectedProduct.nutritionalInfo.fiber}g</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Lipides</span>
                    <span class="font-semibold">{selectedProduct.nutritionalInfo.fat}g</span>
                  </div>
                </div>
              </div>
            {/if}
            
            <button 
              class="w-full bg-primary-green text-white py-4 rounded-full font-bold text-lg hover:bg-primary-green-vibrant transform hover:scale-105 transition-all duration-200"
              disabled={!selectedProduct.inStock}
            >
              {selectedProduct.inStock ? 'Commander maintenant' : 'Produit indisponible'}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}