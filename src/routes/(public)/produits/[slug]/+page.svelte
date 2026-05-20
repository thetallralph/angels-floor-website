<script lang="ts">
  import {
    ArrowLeft,
    Share2,
    Check,
    ChevronDown,
    ChevronUp,
    Plus,
    MapPin,
    ChefHat,
    Package,
    Apple,
    Scale,
    Utensils,
    Flame,
    Wheat,
    Egg,
    Sprout,
    Droplet,
    BadgeCheck
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import ProductCard from '$lib/components/ui/ProductCard.svelte';
  import { addItem as addCartItem } from '$lib/cart/store';
  import { onMount, onDestroy } from 'svelte';

  export let data: PageData;

  const { product, similarProducts } = data;

  // --- Variant selection ---
  $: variants = product.variants ?? [];
  let selectedVariantIdx = 0;
  $: selectedVariant = variants[selectedVariantIdx];
  function variantLabel(v: { size?: string; flavor?: string; label?: string } | undefined): string {
    if (!v) return '';
    return [v.size, v.flavor, v.label].filter(Boolean).join(' · ');
  }
  function variantKey(v: { size?: string; flavor?: string; label?: string } | undefined, idx: number): string {
    if (!v) return 'default';
    return `${v.size ?? ''}|${v.flavor ?? ''}|${v.label ?? ''}|${idx}`;
  }
  $: currentPrice =
    selectedVariant && typeof selectedVariant.price === 'number' && selectedVariant.price > 0
      ? selectedVariant.price
      : product.price;
  $: currentVariantLabel = selectedVariant ? variantLabel(selectedVariant) : product.packaging || '';

  // --- Add to cart ---
  let addedFlash = false;
  let addedFlashTimeout: ReturnType<typeof setTimeout> | null = null;
  function handleAddToCart() {
    const key = selectedVariant ? variantKey(selectedVariant, selectedVariantIdx) : 'default';
    const label = selectedVariant ? variantLabel(selectedVariant) : product.packaging || 'Unité';
    addCartItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      productImage: productImages[0],
      variantKey: key,
      variantLabel: label,
      unitPrice: currentPrice
    });
    addedFlash = true;
    if (addedFlashTimeout) clearTimeout(addedFlashTimeout);
    addedFlashTimeout = setTimeout(() => (addedFlash = false), 2500);
  }
  
  let selectedImage = 0;
  let showShareMenu = false;

  // Accordion states — only nutrition is collapsible now (préparation & conservation are inline)
  let accordionStates: { [key: string]: boolean } = {
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
    'nere': [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1599140849279-d978f01585c9?w=800&h=800&fit=crop'
    ],
    'mangue': [
      'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&h=800&fit=crop'
    ],
    'papaye': [
      'https://images.unsplash.com/photo-1517422757410-466f8b2dd068?w=800&h=800&fit=crop'
    ],
    'autres': [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=800&fit=crop'
    ]
  };
  
  const productImages = product.images?.length ? product.images : placeholderImages[product.category] || [product.image];
  


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
    <div class="grid lg:grid-cols-[2fr_3fr] gap-8 lg:gap-12 mb-20 items-start" bind:this={productSectionRef}>
      <!-- Image Gallery (sticky on desktop) -->
      <div class="space-y-3 lg:sticky lg:top-24">
        <!-- Main Image -->
        <div class="aspect-square rounded-3xl overflow-hidden bg-neutral-sand relative group">
          <img
            src={productImages[selectedImage]}
            alt={product.name}
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Thumbnail Gallery -->
        {#if productImages.length > 1}
          <div class="flex gap-2 overflow-x-auto pb-1">
            {#each productImages as image, index}
              <button
                on:click={() => selectedImage = index}
                class="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden ring-2 transition-all
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
          {#if product.specialMention}
            <span class="inline-block bg-accent-gold text-neutral-obsidian text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              {product.specialMention}
            </span>
          {/if}
          <h1 class="text-4xl lg:text-5xl font-bold text-neutral-charcoal mb-1">
            {product.name}
          </h1>
          {#if product.subtitle}
            <p class="text-sm font-semibold text-primary-green uppercase tracking-wider mb-3">
              {product.subtitle}
            </p>
          {/if}
          {#if product.tagline}
            <p class="text-lg italic text-neutral-charcoal mb-4">« {product.tagline} »</p>
          {/if}
          <div class="flex items-baseline gap-4">
            {#if currentPrice > 0}
              <span class="text-3xl font-bold text-primary-green">
                {formatPrice(currentPrice)}
              </span>
            {/if}
            {#if currentVariantLabel}
              <span class="text-neutral-slate">/ {currentVariantLabel}</span>
            {/if}
          </div>
        </div>

        <!-- Variant selector -->
        {#if variants.length > 0}
          <div>
            <p class="text-sm font-semibold text-neutral-charcoal mb-2">
              Choisissez un conditionnement
            </p>
            <div class="flex flex-wrap gap-2">
              {#each variants as v, idx}
                <button
                  type="button"
                  on:click={() => (selectedVariantIdx = idx)}
                  class="px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all
                    {selectedVariantIdx === idx
                      ? 'border-primary-green bg-primary-green text-white shadow-md'
                      : 'border-neutral-light text-neutral-charcoal bg-white hover:border-primary-green hover:text-primary-green'}"
                >
                  {variantLabel(v) || '—'}
                  {#if typeof v.price === 'number' && v.price > 0}
                    <span class="opacity-75 ml-1">· {new Intl.NumberFormat('fr-FR').format(v.price)} FCFA</span>
                  {/if}
                </button>
              {/each}
            </div>
          </div>
        {/if}

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

        <!-- Quality claims chips -->
        {#if product.qualityClaims && product.qualityClaims.length > 0}
          <div class="flex flex-wrap gap-2">
            {#each product.qualityClaims as claim}
              <span class="inline-flex items-center gap-1.5 bg-primary-green/10 text-primary-green-vibrant px-3 py-1.5 rounded-full text-sm font-semibold">
                <BadgeCheck class="w-4 h-4" />
                {claim}
              </span>
            {/each}
          </div>
        {/if}
        
        <!-- Action Buttons - Hidden on mobile (shown in floating bar) -->
        <div class="space-y-4 hidden lg:block">
          {#if addedFlash}
            <div class="flex items-center gap-2 bg-primary-green/10 border border-primary-green/30 text-primary-green-vibrant px-4 py-2 rounded-xl text-sm font-semibold">
              <Check class="w-4 h-4" />
              Ajouté au panier !
            </div>
          {/if}
          <!-- Main CTA -->
          <div class="flex gap-3">
            <button
              on:click={handleAddToCart}
              class="flex-1 bg-primary-green text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary-green-vibrant transition-all transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <Plus class="w-6 h-6" />
              Ajouter au panier
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
            <h3 class="flex items-center gap-2 text-sm font-semibold text-neutral-slate uppercase tracking-wider mb-2">
              <MapPin class="w-4 h-4" />
              Origine
            </h3>
            <p class="text-neutral-charcoal font-medium">{product.origin}</p>
          </div>
        {/if}

        <!-- Préparation (always open) -->
        {#if (product.preparation?.recipes?.length ?? 0) > 0 || product.usage}
          <div class="border-t border-neutral-light pt-8 space-y-4">
            <h3 class="flex items-center gap-2 text-sm font-semibold text-neutral-slate uppercase tracking-wider">
              <ChefHat class="w-4 h-4" />
              Préparation
            </h3>

            {#if product.preparation?.ratio}
              <div class="inline-flex items-center gap-2 bg-accent-gold/10 text-neutral-obsidian px-4 py-2 rounded-full text-sm font-semibold">
                <Scale class="w-4 h-4" />
                {product.preparation.ratio}
              </div>
            {/if}

            {#if product.preparation?.recipes && product.preparation.recipes.length > 0}
              <div class="space-y-5">
                {#each product.preparation.recipes as recipe}
                  <div class="space-y-2">
                    <h4 class="flex items-center gap-2 text-base font-bold text-primary-green">
                      <Utensils class="w-4 h-4" />
                      {recipe.name}
                    </h4>
                    {#if recipe.steps?.length}
                      <ol class="space-y-1.5 list-decimal pl-5 text-sm text-neutral-charcoal leading-relaxed">
                        {#each recipe.steps as step}
                          <li>{step}</li>
                        {/each}
                      </ol>
                    {/if}
                  </div>
                {/each}
              </div>
            {:else if product.usage}
              <p class="text-sm text-neutral-charcoal leading-relaxed">{product.usage}</p>
            {/if}
          </div>
        {/if}

        <!-- Conservation (always open) -->
        {#if product.conservation}
          <div class="border-t border-neutral-light pt-8">
            <h3 class="flex items-center gap-2 text-sm font-semibold text-neutral-slate uppercase tracking-wider mb-2">
              <Package class="w-4 h-4" />
              Conservation
            </h3>
            <p class="text-sm text-neutral-charcoal leading-relaxed">{product.conservation}</p>
          </div>
        {/if}
      </div>
    </div>
    
    <!-- Accordion Sections for Product Information -->
    <div class="space-y-4 mb-20">
      <!-- Nutritional Information Accordion -->
      {#if product.nutritionalInfo && (product.nutritionalInfo.energy || product.nutritionalInfo.carbs || product.nutritionalInfo.protein || product.nutritionalInfo.fiber || product.nutritionalInfo.fat || product.nutritionalInfo.minerals?.length || product.nutritionalInfo.vitamins?.length)}
        <div class="border border-neutral-light rounded-2xl overflow-hidden">
          <button
            on:click={() => toggleAccordion('nutritional')}
            class="w-full px-6 py-4 bg-white hover:bg-neutral-sand transition-colors flex items-center justify-between text-left"
          >
            <h3 class="flex items-center gap-2 text-xl font-bold text-neutral-charcoal">
              <Apple class="w-5 h-5 text-primary-green" />
              Composition nutritionnelle
            </h3>
            {#if accordionStates.nutritional}
              <ChevronUp class="w-5 h-5 text-neutral-charcoal" />
            {:else}
              <ChevronDown class="w-5 h-5 text-neutral-charcoal" />
            {/if}
          </button>
          {#if accordionStates.nutritional}
            <div class="px-6 py-6 bg-white border-t border-neutral-light space-y-6">
              <p class="text-sm text-neutral-slate">Pour {product.nutritionalInfo.per || '100g'}</p>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
                {#if product.nutritionalInfo.energy}
                  <div class="flex items-start gap-3">
                    <Flame class="w-6 h-6 text-primary-green flex-shrink-0 mt-1" />
                    <div>
                      <div class="text-2xl font-bold text-primary-green">{product.nutritionalInfo.energy}</div>
                      <div class="text-sm text-neutral-slate">Énergie</div>
                    </div>
                  </div>
                {/if}
                {#if product.nutritionalInfo.carbs}
                  <div class="flex items-start gap-3">
                    <Wheat class="w-6 h-6 text-primary-green flex-shrink-0 mt-1" />
                    <div>
                      <div class="text-2xl font-bold text-primary-green">{product.nutritionalInfo.carbs}</div>
                      <div class="text-sm text-neutral-slate">Glucides</div>
                    </div>
                  </div>
                {/if}
                {#if product.nutritionalInfo.protein}
                  <div class="flex items-start gap-3">
                    <Egg class="w-6 h-6 text-primary-green flex-shrink-0 mt-1" />
                    <div>
                      <div class="text-2xl font-bold text-primary-green">{product.nutritionalInfo.protein}</div>
                      <div class="text-sm text-neutral-slate">Protéines</div>
                    </div>
                  </div>
                {/if}
                {#if product.nutritionalInfo.fiber}
                  <div class="flex items-start gap-3">
                    <Sprout class="w-6 h-6 text-primary-green flex-shrink-0 mt-1" />
                    <div>
                      <div class="text-2xl font-bold text-primary-green">{product.nutritionalInfo.fiber}</div>
                      <div class="text-sm text-neutral-slate">Fibres</div>
                    </div>
                  </div>
                {/if}
                {#if product.nutritionalInfo.fat}
                  <div class="flex items-start gap-3">
                    <Droplet class="w-6 h-6 text-primary-green flex-shrink-0 mt-1" />
                    <div>
                      <div class="text-2xl font-bold text-primary-green">{product.nutritionalInfo.fat}</div>
                      <div class="text-sm text-neutral-slate">Lipides</div>
                    </div>
                  </div>
                {/if}
              </div>

              {#if product.nutritionalInfo.minerals && product.nutritionalInfo.minerals.length > 0}
                <div>
                  <p class="text-sm font-semibold text-neutral-charcoal mb-2">Minéraux</p>
                  <div class="flex flex-wrap gap-2">
                    {#each product.nutritionalInfo.minerals as mineral}
                      <span class="inline-block bg-neutral-sand text-neutral-charcoal px-3 py-1 rounded-full text-sm">{mineral}</span>
                    {/each}
                  </div>
                </div>
              {/if}

              {#if product.nutritionalInfo.vitamins && product.nutritionalInfo.vitamins.length > 0}
                <div>
                  <p class="text-sm font-semibold text-neutral-charcoal mb-2">Vitamines</p>
                  <div class="flex flex-wrap gap-2">
                    {#each product.nutritionalInfo.vitamins as vit}
                      <span class="inline-block bg-neutral-sand text-neutral-charcoal px-3 py-1 rounded-full text-sm">Vitamine {vit}</span>
                    {/each}
                  </div>
                </div>
              {/if}
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
      on:click={handleAddToCart}
      class="flex-1 bg-primary-green text-white px-6 py-3 rounded-full font-bold text-base hover:bg-primary-green-vibrant transition-all flex items-center justify-center gap-2 shadow-lg"
    >
      <Plus class="w-5 h-5" />
      {addedFlash ? 'Ajouté !' : 'Ajouter au panier'}
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

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
</style>