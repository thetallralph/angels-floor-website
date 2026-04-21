<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import ProductCard from '$lib/components/ui/ProductCard.svelte';
  import ScrollReveal from '$lib/components/ui/ScrollReveal.svelte';
  import { ChevronDown, Filter } from 'lucide-svelte';
  
  export let data: PageData;
  
  let activeCategory = 'fonio';
  let mobileMenuOpen = false;
  
  $: ({ categories, productsByCategory } = data);
  
  function scrollToCategory(categoryId: string) {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      // Different offset for mobile (fixed menu) vs desktop
      const offset = window.innerWidth < 1024 ? 140 : 100;
      const top = element.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
  
  // Close menu when clicking outside
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (mobileMenuOpen && !target.closest('.lg\\:hidden')) {
      mobileMenuOpen = false;
    }
  }
  
  $: if (typeof window !== 'undefined') {
    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
  }
  
  onMount(() => {
    // Observe category sections for active state
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const categoryId = entry.target.id.replace('category-', '');
            activeCategory = categoryId;
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
      }
    );
    
    // Observe all category sections
    Object.keys(productsByCategory).forEach((category) => {
      const element = document.getElementById(`category-${category}`);
      if (element) {
        observer.observe(element);
      }
    });
    
    return () => {
      observer.disconnect();
    };
  });
  
  const categoryInfo: Record<string, string> = {
    'fonio': 'Gamme Fonio',
    'baobab': 'Pulpe de Baobab',
    'nere-fagara': 'Néré & Fagara',
    'mangue': 'Produits Mangue',
    'bisbab': 'Biscuits Baobab'
  };
</script>

<svelte:head>
  <title>Nos Produits - Angel's Floor</title>
  <meta name="description" content="Découvrez notre gamme complète de produits béninois naturels : fonio précuit, pulpe de baobab, biscuits enrichis et plus encore." />
</svelte:head>

<!-- Hero Section -->
<section class="relative bg-gradient-to-br from-primary-green to-primary-green-vibrant py-12 overflow-hidden">
  <div class="absolute inset-0">
    <div class="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl"></div>
  </div>
  
  <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
    <ScrollReveal animation="fade-down">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">Nos Produits</h1>
      <p class="text-lg text-white/90 max-w-2xl mx-auto">
        Une sélection de produits béninois naturels, transformés avec soin par nos productrices
      </p>
    </ScrollReveal>
  </div>
</section>

<!-- Products Section with Sidebar -->
<section class="bg-white min-h-screen">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="flex flex-col lg:flex-row gap-12">
      <!-- Mobile Category Navigation - Fixed/Sticky -->
      <div class="lg:hidden">
        <!-- Fixed Header Bar -->
        <div class="fixed top-0 left-0 right-0 z-30 bg-white border-b border-neutral-light shadow-md">
          <button
            on:click={() => mobileMenuOpen = !mobileMenuOpen}
            class="w-full px-4 py-3 flex items-center justify-between hover:bg-neutral-sand transition-colors"
          >
            <div class="flex items-center gap-2">
              <Filter class="w-5 h-5 text-primary-green" />
              <span class="font-semibold text-neutral-charcoal">
                {categories.find(c => c.id === activeCategory)?.name || 'Catégories'}
              </span>
            </div>
            <ChevronDown class="w-5 h-5 text-neutral-charcoal transition-transform duration-200 {mobileMenuOpen ? 'rotate-180' : ''}" />
          </button>
          
          <!-- Dropdown Menu -->
          {#if mobileMenuOpen}
            <div class="absolute top-full left-0 right-0 bg-white border-b border-neutral-light shadow-xl max-h-[70vh] overflow-y-auto">
              <nav class="py-2">
                {#each categories.filter(c => c.id !== 'all') as category}
                  <button
                    on:click={() => {
                      scrollToCategory(category.id);
                      mobileMenuOpen = false;
                    }}
                    class="w-full text-left px-4 py-3 flex items-center justify-between transition-colors
                      {activeCategory === category.id 
                        ? 'bg-primary-green text-white' 
                        : 'hover:bg-neutral-sand text-neutral-charcoal'}"
                  >
                    <span class="font-medium">{category.name}</span>
                    <span class="text-sm {activeCategory === category.id ? 'text-white/80' : 'text-neutral-slate'}">
                      {category.count}
                    </span>
                  </button>
                {/each}
              </nav>
            </div>
          {/if}
        </div>
      </div>
      
      <!-- Desktop Left Navigation Panel -->
      <aside class="hidden lg:block lg:w-64 lg:sticky lg:top-24 lg:h-fit">
        <ScrollReveal animation="fade-right">
        <div>
          <h2 class="text-sm font-semibold uppercase tracking-wider text-neutral-slate mb-4">Catégories</h2>
          <nav class="space-y-1">
            {#each categories.filter(c => c.id !== 'all') as category}
              <button
                on:click={() => scrollToCategory(category.id)}
                class="w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between
                  {activeCategory === category.id 
                    ? 'bg-neutral-sand text-primary-green font-medium' 
                    : 'hover:bg-neutral-sand text-neutral-charcoal'}"
              >
                <span>{category.name}</span>
                <span class="text-sm text-neutral-slate">
                  {category.count}
                </span>
              </button>
            {/each}
          </nav>
          
          <!-- Contact Info -->
          <div class="mt-12">
            <h3 class="text-sm font-semibold uppercase tracking-wider text-neutral-slate mb-4">Pour commander</h3>
            <div class="space-y-3 text-sm">
              <a href="tel:+22901961219771" class="flex items-center gap-2 text-neutral-charcoal hover:text-primary-green transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +229 01 96 12 19 71
              </a>
              <a href="mailto:contact@angelsfloor.bj" class="flex items-center gap-2 text-neutral-charcoal hover:text-primary-green transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                contact@angelsfloor.bj
              </a>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </aside>
      
      <!-- Products Content -->
      <div class="flex-1 pt-14 lg:pt-0">
        {#each Object.entries(productsByCategory) as [category, categoryProducts]}
          <div id="category-{category}" class="mb-16 scroll-mt-36 lg:scroll-mt-24">
            <!-- Simple Category Header -->
            <ScrollReveal animation="fade-up">
              <div class="mb-8 pb-4 border-b border-neutral-light">
                <h2 class="text-2xl font-semibold text-neutral-charcoal">{categoryInfo[category]}</h2>
                <p class="text-sm text-neutral-slate mt-1">{categoryProducts.length} produit{categoryProducts.length > 1 ? 's' : ''}</p>
              </div>
            </ScrollReveal>
            
            <!-- Products Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              {#each categoryProducts as product, i}
                <ScrollReveal animation="fade-up" delay={i * 100}>
                  <ProductCard {product} />
                </ScrollReveal>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
  
  aside {
    will-change: transform;
  }
</style>