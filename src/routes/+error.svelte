<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { Home, Package } from 'lucide-svelte';
  
  let mounted = false;
  let floatingSeeds: Array<{id: number, x: number, delay: number}> = [];
  
  onMount(() => {
    mounted = true;
    // Generate random floating seeds
    floatingSeeds = Array.from({length: 12}, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5
    }));
  });
</script>

<svelte:head>
  <title>404 - Page Non Trouvée | Angel's Floor</title>
  <meta name="description" content="La page que vous recherchez n'existe pas. Retournez à l'accueil ou découvrez nos produits africains naturels." />
</svelte:head>

<!-- Hero Section with 404 -->
<section class="relative overflow-hidden bg-primary-green min-h-screen flex items-center">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="text-center">
      <!-- Animated 404 Number -->
      <div class="relative mb-8">
        <h1 class="text-[150px] md:text-[200px] lg:text-[250px] font-bold text-white/10 select-none animate-pulse-slow">
          404
        </h1>
        
        <!-- Overlay text -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="transform {mounted ? 'scale-100 opacity-100' : 'scale-50 opacity-0'} transition-all duration-700">
            <span class="text-6xl md:text-7xl lg:text-8xl font-bold text-white">Oops!</span>
          </div>
        </div>
      </div>
      
      <!-- Error Message -->
      <div class="max-w-2xl mx-auto {mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} transition-all duration-700 delay-300">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          Cette Page S'est Égarée
        </h2>
        <p class="text-lg md:text-xl text-white/90 mb-10 leading-relaxed">
          Comme une graine de fonio dans le vent du Sahel, cette page semble s'être envolée. 
          Mais ne vous inquiétez pas, nous avons plein d'autres délices à vous proposer!
        </p>
        
        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center w-full">
          <a 
            href="/"
            class="inline-flex items-center justify-center gap-3 bg-white text-primary-green px-6 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto"
          >
            <Home class="w-5 h-5" />
            <span>Retour à l'Accueil</span>
          </a>
          <a 
            href="/produits"
            class="inline-flex items-center justify-center gap-3 bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-semibold text-base hover:bg-white/10 transition-all duration-300 w-full sm:w-auto"
          >
            <Package class="w-5 h-5" />
            <span>Voir Nos Produits</span>
          </a>
        </div>
        
        <!-- Error Status Display -->
        {#if $page.status}
          <div class="mt-12 text-sm text-white/50">
            Code d'erreur: {$page.status} | 
            {#if $page.error?.message}
              {$page.error.message}
            {:else}
              Page introuvable
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
  
  <!-- Floating Seeds Animation -->
  {#if mounted}
    {#each floatingSeeds as seed}
      <div 
        class="absolute w-2 h-3 bg-accent-gold rounded-full opacity-20"
        style="
          left: {seed.x}%;
          animation: float-up 15s infinite linear;
          animation-delay: {seed.delay}s;
        "
      />
    {/each}
  {/if}
  
  <!-- Background decorations -->
  <div class="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
  <div class="absolute bottom-20 right-20 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl"></div>
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
</section>

<style>
  @keyframes float-up {
    0% {
      transform: translateY(100vh) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 0.2;
    }
    90% {
      opacity: 0.2;
    }
    100% {
      transform: translateY(-100vh) rotate(360deg);
      opacity: 0;
    }
  }
</style>