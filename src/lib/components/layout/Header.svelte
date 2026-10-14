<script lang="ts">
  import { page } from '$app/state';
  import { Menu, X, Phone, ArrowRight } from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { LOCALES, getLocale, href, switchLocaleHref, t } from '$lib/i18n';

  let mobileMenuOpen = $state(false);

  const navItems = $derived([
    { href: href('/'), label: t('Accueil', 'Home') },
    { href: href('/produits'), label: t('Produits', 'Products') },
    { href: href('/formations'), label: t('Formations', 'Training') },
    { href: href('/points-de-vente'), label: t('Points de vente', 'Where to buy') },
    { href: href('/grossistes'), label: t('Grossistes', 'Wholesale') },
    { href: href('/a-propos'), label: t('À Propos', 'About') },
    { href: href('/contact'), label: 'Contact' }
  ]);

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

  const currentPath = $derived(page.url.pathname);
</script>

{#snippet languageSwitcher()}
  <div class="flex items-center rounded-full border border-gray-200 p-0.5 text-xs font-bold" aria-label={t('Langue', 'Language')}>
    {#each LOCALES as l (l)}
      <a
        href={switchLocaleHref(page.url.pathname + page.url.search, l)}
        hreflang={l}
        lang={l}
        aria-current={getLocale() === l ? 'true' : undefined}
        class="px-2.5 py-1 rounded-full uppercase transition-all duration-300 {getLocale() === l ? 'bg-primary-green text-white' : 'text-gray-600 hover:text-primary-green'}"
        onclick={closeMobileMenu}
      >
        {l}
      </a>
    {/each}
  </div>
{/snippet}

<header class="relative w-full bg-white border-b border-gray-200 z-50">
  <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-20">
      <!-- Logo and Phone -->
      <div class="flex items-center gap-4 lg:gap-6">
        <a href={href('/')} class="flex items-center" onclick={closeMobileMenu}>
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
        {#each navItems.slice(1) as item (item.href)}
          <a
            href={item.href}
            class="text-base font-bold transition-colors duration-200 {currentPath === item.href ? 'text-primary-green' : 'text-gray-700 hover:text-primary-green'}"
          >
            {item.label}
          </a>
        {/each}
        {@render languageSwitcher()}
      </div>
      
      <!-- Mobile menu button -->
      <div class="lg:hidden flex items-center gap-3">
        {@render languageSwitcher()}
        <button
          type="button"
          class="p-2 text-gray-700 hover:text-primary-green transition-colors duration-200"
          aria-controls="mobile-menu"
          aria-expanded={mobileMenuOpen}
          onclick={toggleMobileMenu}
        >
          <span class="sr-only">{t('Ouvrir le menu principal', 'Open main menu')}</span>
          {#if mobileMenuOpen}
            <X class="block h-4 w-4" />
          {:else}
            <Menu class="block h-4 w-4" />
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
    onclick={closeMobileMenu}
    onkeydown={(e) => e.key === 'Escape' && closeMobileMenu()}
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
        aria-label={t('Fermer le menu', 'Close menu')}
        onclick={closeMobileMenu}
      >
        <X class="h-4 w-4" />
      </button>
    </div>
    
    <!-- Menu Content -->
    <nav class="px-4 py-6 h-[calc(100vh-100px)] overflow-y-auto">
      <div class="space-y-2">
        {#each navItems as item, index (item.href)}
          <a
            href={item.href}
            class="group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 {currentPath === item.href ? 'bg-primary-green text-white shadow-lg' : 'hover:bg-neutral-sand'}"
            onclick={closeMobileMenu}
            style="animation: slideInRight {0.1 + index * 0.05}s ease-out"
          >
            <div class="font-bold text-base">{item.label}</div>
            <ArrowRight class="w-5 h-5 {currentPath === item.href ? 'text-white' : 'text-neutral-charcoal'} transition-transform group-hover:translate-x-1" />
          </a>
        {/each}
      </div>
      
      <!-- Contact Section -->
      <div class="mt-8 p-6 bg-primary-green/10 rounded-2xl">
        <h3 class="font-bold text-lg text-neutral-charcoal mb-4">{t('Contactez-nous', 'Contact us')}</h3>
        <a href="tel:+22901961219171" class="flex items-center gap-3 text-neutral-charcoal hover:text-primary-green transition-colors mb-4">
          <div class="w-10 h-10 bg-primary-green/10 rounded-full flex items-center justify-center">
            <Phone class="w-5 h-5 text-primary-green" />
          </div>
          <div>
            <div class="font-semibold">{t('Appelez-nous', 'Call us')}</div>
            <div class="text-sm text-neutral-slate">+229 01 96 12 19 71</div>
          </div>
        </a>
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