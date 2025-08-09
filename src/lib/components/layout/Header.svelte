<script lang="ts">
  import { page } from '$app/stores';
  import { Menu, X, ChevronDown } from 'lucide-svelte';
  import Button from '$lib/components/ui/Button.svelte';
  
  let mobileMenuOpen = false;
  let activeDropdown: string | null = null;
  
  const navItems = [
    { 
      href: '/produits', 
      label: 'Produits',
      dropdown: [
        { href: '/produits/fonio', label: 'Gamme Fonio' },
        { href: '/produits/baobab', label: 'Gamme Baobab' },
        { href: '/produits/nere-fagara', label: 'Néré & Fagara' },
        { href: '/produits/bisbab', label: 'Collection Bisbab' }
      ]
    },
    { 
      href: '/grossistes', 
      label: 'Grossistes'
    },
    { 
      href: '/a-propos', 
      label: 'À Propos',
      dropdown: [
        { href: '/a-propos', label: 'Notre Histoire' },
        { href: '/impact', label: 'Impact Social' },
        { href: '/points-de-vente', label: 'Points de Vente' }
      ]
    },
    { 
      href: '/contact', 
      label: 'Contact'
    }
  ];
  
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
  
  function closeMobileMenu() {
    mobileMenuOpen = false;
    activeDropdown = null;
  }
  
  function toggleDropdown(label: string) {
    activeDropdown = activeDropdown === label ? null : label;
  }
  
  function handleMouseEnter(label: string) {
    if (window.innerWidth >= 1024) {
      activeDropdown = label;
    }
  }
  
  function handleMouseLeave() {
    if (window.innerWidth >= 1024) {
      activeDropdown = null;
    }
  }
  
  $: currentPath = $page.url.pathname;
</script>

<header class="relative w-full bg-white border-b border-gray-200 z-50">
  <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-20">
      <!-- Logo -->
      <div class="flex-shrink-0">
        <a href="/" class="flex items-center" on:click={closeMobileMenu}>
          <img 
            src="/angelsfloor-logo.svg" 
            alt="Angel's Floor" 
            class="h-12 lg:h-14 w-auto"
          />
        </a>
      </div>
      
      <!-- Desktop Navigation -->
      <div class="hidden lg:flex lg:items-center lg:gap-8">
        {#each navItems as item}
          <div
            class="relative"
            on:mouseenter={() => item.dropdown && handleMouseEnter(item.label)}
            on:mouseleave={handleMouseLeave}
            role="menuitem"
            tabindex="0"
          >
            <a
              href={item.href}
              class="flex items-center gap-1 text-base font-bold transition-colors duration-200 {currentPath === item.href ? 'text-primary-green' : 'text-gray-700 hover:text-primary-green'}"
            >
              <span>{item.label}</span>
              {#if item.dropdown}
                <ChevronDown class="w-4 h-4 transition-transform {activeDropdown === item.label ? 'rotate-180' : ''}" />
              {/if}
            </a>
            
            {#if item.dropdown && activeDropdown === item.label}
              <div class="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 shadow-lg z-50">
                <div class="py-2">
                  {#each item.dropdown as subItem}
                    <a
                      href={subItem.href}
                      class="block px-4 py-3 text-sm font-semibold text-gray-700 hover:text-primary-green hover:bg-gray-50 transition-colors duration-200"
                      on:click={closeMobileMenu}
                    >
                      {subItem.label}
                    </a>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
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
    
    {#if mobileMenuOpen}
      <div class="lg:hidden border-t border-gray-200" id="mobile-menu">
        <div class="py-4 space-y-1">
          {#each navItems as item}
            {#if item.dropdown}
              <div>
                <button
                  class="w-full flex justify-between items-center px-4 py-3 text-base font-bold text-left transition-colors duration-200 {currentPath === item.href ? 'text-primary-green bg-gray-50' : 'text-gray-700 hover:text-primary-green hover:bg-gray-50'}"
                  on:click={() => toggleDropdown(item.label)}
                >
                  <span>{item.label}</span>
                  <ChevronDown class="w-5 h-5 transition-transform {activeDropdown === item.label ? 'rotate-180' : ''}" />
                </button>
                
                {#if activeDropdown === item.label}
                  <div class="bg-gray-50">
                    {#each item.dropdown as subItem}
                      <a
                        href={subItem.href}
                        class="block pl-8 pr-4 py-3 text-sm font-semibold text-gray-600 hover:text-primary-green transition-colors duration-200"
                        on:click={closeMobileMenu}
                      >
                        {subItem.label}
                      </a>
                    {/each}
                  </div>
                {/if}
              </div>
            {:else}
              <a
                href={item.href}
                class="block px-4 py-3 text-base font-bold transition-colors duration-200 {currentPath === item.href ? 'text-primary-green bg-gray-50' : 'text-gray-700 hover:text-primary-green hover:bg-gray-50'}"
                on:click={closeMobileMenu}
              >
                {item.label}
              </a>
            {/if}
          {/each}
          
          <div class="px-4 pt-4">
            <Button 
              variant="secondary" 
              size="md" 
              href="/grossistes"
            >
              Devenir Partenaire
            </Button>
          </div>
        </div>
      </div>
    {/if}
  </nav>
</header>

{#if mobileMenuOpen}
  <div 
    class="fixed inset-0 bg-black/20 z-40 lg:hidden" 
    on:click={closeMobileMenu}
    on:keydown={(e) => e.key === 'Escape' && closeMobileMenu()}
    role="button"
    tabindex="0"
  ></div>
{/if}