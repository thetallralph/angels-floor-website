<script lang="ts">
  import { page } from '$app/stores';
  import { Menu, X, Phone, ArrowRight, Home, ShoppingBag, MapPin, Users, Mail } from 'lucide-svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { fade, fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  
  let mobileMenuOpen = false;
  
  const navItems = [
    { 
      href: '/', 
      label: 'Accueil',
      icon: Home,
      description: 'Retour à la page d\'accueil'
    },
    { 
      href: '/produits', 
      label: 'Produits',
      icon: ShoppingBag,
      description: 'Découvrez nos produits naturels'
    },
    { 
      href: '/points-de-vente', 
      label: 'Points de vente',
      icon: MapPin,
      description: 'Trouvez où acheter nos produits'
    },
    { 
      href: '/grossistes', 
      label: 'Grossistes',
      icon: Users,
      description: 'Devenez partenaire'
    },
    { 
      href: '/a-propos', 
      label: 'À Propos',
      icon: Users,
      description: 'Notre histoire et nos valeurs'
    },
    { 
      href: '/contact', 
      label: 'Contact',
      icon: Mail,
      description: 'Contactez-nous'
    }
  ];
  
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
    // Lock body scroll when menu is open
    if (typeof window !== 'undefined') {
      document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    }
  }
  
  function closeMobileMenu() {
    mobileMenuOpen = false;
    // Restore body scroll
    if (typeof window !== 'undefined') {
      document.body.style.overflow = '';
    }
  }
  
  $: currentPath = $page.url.pathname;
</script>

<header class="relative w-full bg-white border-b border-gray-200 z-50">
  <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-20">
      <!-- Logo and Phone -->
      <div class="flex items-center gap-4 lg:gap-6">
        <a href="/" class="flex items-center" on:click={closeMobileMenu}>
          <img 
            src="/angelsfloor-logo.svg" 
            alt="Angel's Floor" 
            class="h-12 lg:h-14 w-auto"
          />
        </a>
        <a href="tel:+22901961219171" class="hidden sm:flex items-center gap-2 text-gray-700 hover:text-primary-green transition-colors">
          <Phone class="w-4 h-4" />
          <span class="text-sm font-semibold">+229 01 96 12 19 71</span>
        </a>
      </div>
      
      <!-- Desktop Navigation -->
      <div class="hidden lg:flex lg:items-center lg:gap-8">
        {#each navItems.filter(item => item.href !== '/') as item}
          <a
            href={item.href}
            class="text-base font-bold transition-colors duration-200 {currentPath === item.href ? 'text-primary-green' : 'text-gray-700 hover:text-primary-green'}"
          >
            {item.label}
          </a>
        {/each}
        
        <div class="ml-8">
          <Button 
            variant="secondary" 
            size="sm" 
            href="/grossistes"
          >
            Devenir Partenaire
          </Button>
        </div>
      </div>
      
      <!-- Mobile menu button -->
      <div class="lg:hidden">
        <button
          type="button"
          class="p-2 text-gray-700 hover:text-primary-green transition-colors duration-200"
          aria-controls="mobile-menu"
          aria-expanded={mobileMenuOpen}
          on:click={toggleMobileMenu}
        >
          <span class="sr-only">Ouvrir le menu principal</span>
          {#if mobileMenuOpen}
            <X class="block h-6 w-6" />
          {:else}
            <Menu class="block h-6 w-6" />
          {/if}
        </button>
      </div>
    </div>
    
  </nav>
</header>

<!-- Fullscreen Mobile Menu -->
{#if mobileMenuOpen}
  <!-- Backdrop -->
  <div 
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden" 
    on:click={closeMobileMenu}
    on:keydown={(e) => e.key === 'Escape' && closeMobileMenu()}
    role="button"
    tabindex="0"
    transition:fade={{ duration: 300 }}
  ></div>
  
  <!-- Menu Panel -->
  <div 
    class="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 lg:hidden shadow-2xl"
    transition:fly={{ x: 400, duration: 400, easing: quintOut }}
  >
    <!-- Menu Header -->
    <div class="flex items-center justify-between px-6 py-6 bg-primary-green text-white">
      <div>
        <h2 class="text-2xl font-bold">Menu</h2>
        <p class="text-sm text-white/80 mt-1">Angel's Floor</p>
      </div>
      <button
        type="button"
        class="p-2 hover:bg-white/20 rounded-full transition-colors"
        on:click={closeMobileMenu}
      >
        <X class="h-6 w-6" />
      </button>
    </div>
    
    <!-- Menu Content -->
    <nav class="px-4 py-6 h-[calc(100vh-100px)] overflow-y-auto">
      <div class="space-y-2">
        {#each navItems as item, index}
          <a
            href={item.href}
            class="group flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-300 {currentPath === item.href ? 'bg-primary-green text-white shadow-lg' : 'hover:bg-neutral-sand'}"
            on:click={closeMobileMenu}
            style="animation: slideInRight {0.1 + index * 0.05}s ease-out"
          >
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full flex items-center justify-center {currentPath === item.href ? 'bg-white/20' : 'bg-primary-green/10'}">
                <svelte:component this={item.icon} class="w-5 h-5 {currentPath === item.href ? 'text-white' : 'text-primary-green'}" />
              </div>
              <div>
                <div class="font-bold text-lg">{item.label}</div>
                <div class="text-sm {currentPath === item.href ? 'text-white/80' : 'text-neutral-slate'}">
                  {item.description}
                </div>
              </div>
            </div>
            <ArrowRight class="w-5 h-5 {currentPath === item.href ? 'text-white' : 'text-neutral-charcoal'} transition-transform group-hover:translate-x-1" />
          </a>
        {/each}
      </div>
      
      <!-- Contact Section -->
      <div class="mt-8 p-6 bg-accent-gold/10 rounded-2xl">
        <h3 class="font-bold text-lg text-neutral-charcoal mb-4">Contactez-nous</h3>
        <a href="tel:+22901961219171" class="flex items-center gap-3 text-neutral-charcoal hover:text-primary-green transition-colors mb-4">
          <div class="w-10 h-10 bg-primary-green/10 rounded-full flex items-center justify-center">
            <Phone class="w-5 h-5 text-primary-green" />
          </div>
          <div>
            <div class="font-semibold">Appelez-nous</div>
            <div class="text-sm text-neutral-slate">+229 01 96 12 19 71</div>
          </div>
        </a>
        
        <div class="w-full">
          <Button 
            variant="primary" 
            size="lg" 
            href="/grossistes"
          >
            Devenir Partenaire
          </Button>
        </div>
      </div>
    </nav>
  </div>
{/if}

<style>
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>