<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  
  let floatingItems = [
    { id: 1, emoji: '🥣', delay: 0 },
    { id: 2, emoji: '🌾', delay: 1 },
    { id: 3, emoji: '🥜', delay: 2 },
    { id: 4, emoji: '🍪', delay: 3 },
    { id: 5, emoji: '🥄', delay: 4 }
  ];
  
  let messages = [
    "Cette page est partie chercher du fonio dans l'Atacora...",
    "Oups! Cette page est en train de fermenter comme notre baobab...",
    "404 - Page introuvable! Elle doit être cachée dans notre stock de biscuits...",
    "Cette page est en pause goûter, revenez plus tard!",
    "Nos productrices travaillent encore sur cette page..."
  ];
  
  let currentMessage = 0;
  
  onMount(() => {
    const interval = setInterval(() => {
      currentMessage = (currentMessage + 1) % messages.length;
    }, 3000);
    
    return () => clearInterval(interval);
  });
</script>

<svelte:head>
  <title>404 - Page Introuvable | Angel's Floor</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-neutral-sand via-white to-accent-gold/10 relative overflow-hidden">
  <!-- Floating Food Elements -->
  <div class="absolute inset-0">
    {#each floatingItems as item}
      <div 
        class="absolute text-6xl animate-float opacity-20"
        style="
          left: {20 + item.id * 15}%;
          top: {10 + item.id * 10}%;
          animation-delay: {item.delay}s;
        "
      >
        {item.emoji}
      </div>
    {/each}
  </div>

  <!-- Main Content -->
  <div class="relative z-10 min-h-screen flex items-center justify-center px-4">
    <div class="text-center max-w-2xl mx-auto">
      <!-- Big 404 -->
      <div class="relative inline-block mb-8">
        <h1 class="text-9xl md:text-[200px] font-bold text-primary-green opacity-10">404</h1>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-6xl md:text-8xl">🍽️</div>
        </div>
      </div>
      
      <!-- Dynamic Message -->
      <div class="mb-8 h-20">
        <p class="text-2xl md:text-3xl font-bold text-primary-green transition-all duration-500">
          {messages[currentMessage]}
        </p>
      </div>
      
      <!-- Fun Recipe Card -->
      <div class="bg-white rounded-3xl p-8 shadow-xl max-w-md mx-auto mb-8">
        <h2 class="text-xl font-bold text-primary-green mb-4">
          Recette de la Page Introuvable:
        </h2>
        <ul class="text-left text-neutral-charcoal space-y-2">
          <li>• 404g de confusion</li>
          <li>• Une pincée d'erreur de navigation</li>
          <li>• 3 cuillères de "où suis-je?"</li>
          <li>• Un zeste de surprise</li>
          <li>• Beaucoup de patience</li>
        </ul>
        <p class="text-sm text-neutral-slate mt-4 italic">
          Mélangez le tout et vous obtenez... cette page!
        </p>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a 
          href="/" 
          class="bg-primary-green text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-primary-green-vibrant transform hover:scale-105 transition-all duration-300"
        >
          Retour à l'Accueil
        </a>
        <a 
          href="/produits" 
          class="bg-accent-gold text-primary-green px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          Voir Nos Produits
        </a>
      </div>
      
      <!-- Additional Fun Message -->
      <div class="mt-12 text-neutral-charcoal">
        <p class="text-lg mb-2">Pendant que vous êtes ici...</p>
        <p class="text-sm">
          Saviez-vous que notre fonio peut être préparé en moins de temps 
          qu'il n'en faut pour retrouver cette page? 😄
        </p>
      </div>
      
      <!-- Status Code Display -->
      {#if $page.status}
        <div class="mt-8 text-sm text-neutral-slate">
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
  
  <!-- Bottom Wave Decoration -->
  <div class="absolute bottom-0 left-0 right-0">
    <svg viewBox="0 0 1440 120" class="w-full h-24 fill-primary-green/10">
      <path d="M0,64 C240,96 480,32 720,48 C960,64 1200,96 1440,64 L1440,120 L0,120 Z"></path>
    </svg>
  </div>
</div>

<style>
  @keyframes float {
    0%, 100% { 
      transform: translateY(0px) rotate(0deg); 
    }
    50% { 
      transform: translateY(-30px) rotate(10deg); 
    }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
</style>