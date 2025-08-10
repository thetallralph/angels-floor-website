<script lang="ts">
  import { ArrowLeft, Share2, ShoppingBag, Check, MapPin, Phone, Clock, X, ChevronDown, ChevronUp } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { products } from '$lib/data/products.js';
  import ProductCard from '$lib/components/ui/ProductCard.svelte';
  import { getNearestSalesPoints, defaultCoordinates, type SalesPoint } from '$lib/data/salesPoints';
  import { onMount, onDestroy } from 'svelte';
  
  export let data: PageData;
  
  const { product } = data;
  
  let selectedImage = 0;
  let showShareMenu = false;
  let showSalesPointsModal = false;
  let userLocation = defaultCoordinates;
  let nearestSalesPoints: SalesPoint[] = [];
  
  // Accordion states
  let accordionStates: { [key: string]: boolean } = {
    usage: false,
    nutritional: false
  };
  
  function toggleAccordion(key: string) {
    accordionStates[key] = !accordionStates[key];
  }
  
  // Mobile floating buttons visibility
  let showMobileButtons = true;
  let productSectionRef: HTMLElement;
  let observer: IntersectionObserver;
  
  onMount(() => {
    // Create intersection observer to detect when product section is out of view
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          // Show buttons when product section is visible
          // Hide when scrolled past (similar products or footer)
          showMobileButtons = entry.isIntersecting;
        });
      },
      {
        // Trigger when even 10% of the section is visible
        threshold: 0.1,
        rootMargin: '-100px 0px 0px 0px' // Account for fixed header
      }
    );
    
    if (productSectionRef) {
      observer.observe(productSectionRef);
    }
  });
  
  onDestroy(() => {
    if (observer && productSectionRef) {
      observer.unobserve(productSectionRef);
      observer.disconnect();
    }
  });
  
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
    
  async function shareProduct() {
    const url = window.location.href;
    const text = `Découvrez ${product.name} de Angel's Floor - ${product.description}`;
    
    // Check if native share API is available (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: text,
          url: url
        });
      } catch {
        // User cancelled or error occurred
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback to share menu for desktop
      showShareMenu = !showShareMenu;
    }
  }
  
  function shareProductVia(platform: string) {
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
  
  function openSalesPointsModal() {
    // Essayer d'obtenir la position de l'utilisateur
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          nearestSalesPoints = getNearestSalesPoints(userLocation.lat, userLocation.lng, 5);
        },
        (_error) => {
          // En cas d'erreur, utiliser les coordonnées par défaut (Cotonou)
          nearestSalesPoints = getNearestSalesPoints(defaultCoordinates.lat, defaultCoordinates.lng, 5);
        }
      );
    } else {
      // Si la géolocalisation n'est pas disponible
      nearestSalesPoints = getNearestSalesPoints(defaultCoordinates.lat, defaultCoordinates.lng, 5);
    }
    showSalesPointsModal = true;
  }
  
  function getTypeColor(type: string) {
    switch(type) {
      case 'boutique': return 'bg-green-500';
      case 'supermarché': return 'bg-amber-500';
      case 'marché': return 'bg-violet-500';
      case 'pharmacie': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }
  
  function getTypeLabel(type: string) {
    switch(type) {
      case 'boutique': return 'Boutique';
      case 'supermarché': return 'Supermarché';
      case 'marché': return 'Marché';
      case 'pharmacie': return 'Pharmacie';
      default: return type;
    }
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
  
  <!-- Add padding bottom on mobile for floating buttons -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 lg:pb-12">
    <!-- Main Product Display -->
    <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-20" bind:this={productSectionRef}>
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
        
        <!-- Key Benefits - Updated Bold Design with Inline Layout -->
        {#if product.benefits && product.benefits.length > 0}
          <div class="flex flex-wrap gap-3">
            {#each product.benefits as benefit}
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-neutral-sand rounded-full">
                <Check class="w-5 h-5 text-primary-green flex-shrink-0" />
                <span class="text-neutral-charcoal font-bold">{benefit}</span>
              </div>
            {/each}
          </div>
        {/if}
        
        <!-- Action Buttons - Hidden on mobile (shown in floating bar) -->
        <div class="space-y-4 hidden lg:block">
          <!-- Main CTA -->
          <div class="flex gap-3">
            <button 
              on:click={openSalesPointsModal}
              class="flex-1 bg-primary-green text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary-green-vibrant transition-all transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <ShoppingBag class="w-6 h-6" />
              Commander maintenant
            </button>
            
            <!-- Share Button - Updated with Native Sharing -->
            <div class="relative">
              <button 
                on:click={shareProduct}
                class="p-4 bg-white border-2 border-primary-green text-primary-green rounded-full hover:bg-primary-green hover:text-white transition-all font-semibold flex items-center gap-2"
                title="Partager"
              >
                <Share2 class="w-6 h-6" />
                <span class="hidden sm:inline">Partager</span>
              </button>
              
              {#if showShareMenu}
                <div class="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-neutral-light p-2 z-50">
                  <button 
                    on:click={() => shareProductVia('whatsapp')}
                    class="w-full text-left px-4 py-2 hover:bg-neutral-sand rounded-lg transition-colors"
                  >
                    WhatsApp
                  </button>
                  <button 
                    on:click={() => shareProductVia('facebook')}
                    class="w-full text-left px-4 py-2 hover:bg-neutral-sand rounded-lg transition-colors"
                  >
                    Facebook
                  </button>
                  <button 
                    on:click={() => shareProductVia('twitter')}
                    class="w-full text-left px-4 py-2 hover:bg-neutral-sand rounded-lg transition-colors"
                  >
                    Twitter
                  </button>
                  <button 
                    on:click={() => shareProductVia('copy')}
                    class="w-full text-left px-4 py-2 hover:bg-neutral-sand rounded-lg transition-colors"
                  >
                    Copier le lien
                  </button>
                </div>
              {/if}
            </div>
          </div>
        </div>
        
        <!-- Product Details Grid - Only Origin -->
        {#if product.origin}
          <div class="border-t border-neutral-light pt-8">
            <div>
              <h3 class="text-sm font-semibold text-neutral-slate uppercase tracking-wider mb-2">Origine</h3>
              <p class="text-neutral-charcoal font-medium">{product.origin}</p>
            </div>
          </div>
        {/if}
      </div>
    </div>
    
    <!-- Accordion Sections for Product Information -->
    <div class="space-y-4 mb-20">
      <!-- Usage Accordion -->
      {#if product.usage}
        <div class="border border-neutral-light rounded-2xl overflow-hidden">
          <button
            on:click={() => toggleAccordion('usage')}
            class="w-full px-6 py-4 bg-white hover:bg-neutral-sand transition-colors flex items-center justify-between text-left"
          >
            <h3 class="text-xl font-bold text-neutral-charcoal">Comment utiliser ce produit?</h3>
            {#if accordionStates.usage}
              <ChevronUp class="w-5 h-5 text-neutral-charcoal" />
            {:else}
              <ChevronDown class="w-5 h-5 text-neutral-charcoal" />
            {/if}
          </button>
          {#if accordionStates.usage}
            <div class="px-6 py-4 bg-white border-t border-neutral-light">
              <p class="text-lg text-neutral-charcoal leading-relaxed">{product.usage}</p>
            </div>
          {/if}
        </div>
      {/if}
      
      <!-- Nutritional Information Accordion -->
      {#if product.nutritionalInfo}
        <div class="border border-neutral-light rounded-2xl overflow-hidden">
          <button
            on:click={() => toggleAccordion('nutritional')}
            class="w-full px-6 py-4 bg-white hover:bg-neutral-sand transition-colors flex items-center justify-between text-left"
          >
            <h3 class="text-xl font-bold text-neutral-charcoal">Valeurs nutritionnelles</h3>
            {#if accordionStates.nutritional}
              <ChevronUp class="w-5 h-5 text-neutral-charcoal" />
            {:else}
              <ChevronDown class="w-5 h-5 text-neutral-charcoal" />
            {/if}
          </button>
          {#if accordionStates.nutritional}
            <div class="px-6 py-4 bg-white border-t border-neutral-light">
              <p class="text-sm text-neutral-slate mb-4">Pour 100g</p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                {#if product.nutritionalInfo.calories}
                  <div>
                    <div class="text-2xl font-bold text-primary-green">{product.nutritionalInfo.calories}</div>
                    <div class="text-sm text-neutral-slate">Calories</div>
                  </div>
                {/if}
                {#if product.nutritionalInfo.protein}
                  <div>
                    <div class="text-2xl font-bold text-primary-green">{product.nutritionalInfo.protein}g</div>
                    <div class="text-sm text-neutral-slate">Protéines</div>
                  </div>
                {/if}
                {#if product.nutritionalInfo.fiber}
                  <div>
                    <div class="text-2xl font-bold text-primary-green">{product.nutritionalInfo.fiber}g</div>
                    <div class="text-sm text-neutral-slate">Fibres</div>
                  </div>
                {/if}
                {#if product.nutritionalInfo.vitaminC}
                  <div>
                    <div class="text-2xl font-bold text-primary-green">{product.nutritionalInfo.vitaminC}mg</div>
                    <div class="text-sm text-neutral-slate">Vitamine C</div>
                  </div>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      {/if}
      
    </div>
    
    <!-- Similar Products Section - Enhanced -->
    {#if similarProducts.length > 0}
      <div class="bg-neutral-sand rounded-3xl p-8 lg:p-12">
        <div class="text-center mb-10">
          <h2 class="text-3xl lg:text-4xl font-bold text-neutral-charcoal mb-4">Vous aimerez aussi</h2>
          <p class="text-lg text-neutral-slate max-w-2xl mx-auto">Découvrez d'autres produits naturels de notre gamme</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          {#each similarProducts as similarProduct}
            <ProductCard product={similarProduct} />
          {/each}
        </div>
        <div class="text-center mt-8">
          <a 
            href="/produits" 
            class="inline-flex items-center gap-2 bg-primary-green text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-green-vibrant transition-all"
          >
            Voir tous les produits
            <ArrowLeft class="w-5 h-5 rotate-180" />
          </a>
        </div>
      </div>
    {/if}
  </div>
</section>

<!-- Mobile Floating Action Bar -->
{#if showMobileButtons}
<div class="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-neutral-light shadow-2xl transition-transform duration-300"
     style="transform: translateY({showMobileButtons ? '0' : '100%'})">
  <div class="flex gap-2 p-3">
    <!-- Share Button -->
    <button 
      on:click={shareProduct}
      class="p-3 bg-white border-2 border-primary-green text-primary-green rounded-full hover:bg-primary-green hover:text-white transition-all font-semibold flex items-center justify-center"
      title="Partager"
    >
      <Share2 class="w-5 h-5" />
    </button>
    
    <!-- Main Order Button -->
    <button 
      on:click={openSalesPointsModal}
      class="flex-1 bg-primary-green text-white px-6 py-3 rounded-full font-bold text-base hover:bg-primary-green-vibrant transition-all flex items-center justify-center gap-2 shadow-lg"
    >
      <ShoppingBag class="w-5 h-5" />
      Commander maintenant
    </button>
  </div>
  
  <!-- Mobile Share Menu -->
  {#if showShareMenu}
    <div class="absolute bottom-full right-3 mb-2 w-48 bg-white rounded-2xl shadow-xl border border-neutral-light p-2">
      <button 
        on:click={() => shareProductVia('whatsapp')}
        class="w-full text-left px-4 py-2 hover:bg-neutral-sand rounded-lg transition-colors"
      >
        WhatsApp
      </button>
      <button 
        on:click={() => shareProductVia('facebook')}
        class="w-full text-left px-4 py-2 hover:bg-neutral-sand rounded-lg transition-colors"
      >
        Facebook
      </button>
      <button 
        on:click={() => shareProductVia('twitter')}
        class="w-full text-left px-4 py-2 hover:bg-neutral-sand rounded-lg transition-colors"
      >
        Twitter
      </button>
      <button 
        on:click={() => shareProductVia('copy')}
        class="w-full text-left px-4 py-2 hover:bg-neutral-sand rounded-lg transition-colors"
      >
        Copier le lien
      </button>
    </div>
  {/if}
</div>
{/if}

<!-- Sales Points Modal -->
{#if showSalesPointsModal}
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div 
      class="fixed inset-0 bg-black/50 backdrop-blur-sm"
      on:click={() => showSalesPointsModal = false}
    ></div>
    
    <!-- Modal Content -->
    <div class="relative min-h-screen flex items-center justify-center p-4">
      <div class="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <!-- Header -->
        <div class="sticky top-0 bg-primary-green text-white p-6 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">Où acheter ce produit?</h2>
            <p class="text-white/80 mt-1">Points de vente les plus proches</p>
          </div>
          <button
            on:click={() => showSalesPointsModal = false}
            class="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <!-- Sales Points List -->
        <div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {#if nearestSalesPoints.length === 0}
            <div class="text-center py-8">
              <MapPin class="w-12 h-12 text-neutral-slate mx-auto mb-4" />
              <p class="text-lg text-neutral-charcoal">Chargement des points de vente...</p>
            </div>
          {:else}
            {#each nearestSalesPoints as point, index}
              <div class="p-4 rounded-2xl border border-gray-200 hover:border-primary-green hover:shadow-lg transition-all">
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <h3 class="font-bold text-lg text-neutral-obsidian">
                      {index + 1}. {point.name}
                    </h3>
                    <p class="text-sm text-neutral-charcoal mt-1 flex items-center">
                      <MapPin class="w-4 h-4 mr-1" />
                      {point.address}, {point.city}
                    </p>
                  </div>
                  <span class="{getTypeColor(point.type)} text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {getTypeLabel(point.type)}
                  </span>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {#if point.phone}
                    <a 
                      href="tel:{point.phone}"
                      class="flex items-center gap-2 text-sm text-neutral-slate hover:text-primary-green transition-colors"
                    >
                      <Phone class="w-4 h-4" />
                      {point.phone}
                    </a>
                  {/if}
                  {#if point.hours}
                    <div class="flex items-center gap-2 text-sm text-neutral-slate">
                      <Clock class="w-4 h-4" />
                      {point.hours}
                    </div>
                  {/if}
                </div>
                
                <!-- Action buttons -->
                <div class="flex gap-2 mt-4">
                  <a 
                    href="tel:{point.phone || '+22901961219771'}"
                    class="flex-1 bg-primary-green text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-green-vibrant transition-colors text-center"
                  >
                    Appeler
                  </a>
                  <a 
                    href="https://maps.google.com/?q={point.coordinates.lat},{point.coordinates.lng}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex-1 bg-neutral-sand text-neutral-charcoal py-2 px-4 rounded-lg font-semibold hover:bg-neutral-light transition-colors text-center"
                  >
                    Itinéraire
                  </a>
                </div>
              </div>
            {/each}
          {/if}
        </div>
        
        <!-- Footer -->
        <div class="sticky bottom-0 bg-neutral-sand p-6 border-t">
          <a 
            href="/points-de-vente"
            class="w-full bg-primary-green text-white py-3 px-6 rounded-full font-bold hover:bg-primary-green-vibrant transition-all flex items-center justify-center gap-2"
          >
            <MapPin class="w-5 h-5" />
            Voir tous les points de vente
          </a>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
</style>