<script lang="ts">
  import { onMount } from 'svelte';
  import { t, href } from '$lib/i18n';
  
  const jokes = $derived([
    {
      setup: t("Pourquoi cette page est-elle introuvable?", "Why can't this page be found?"),
      punchline: t("Elle est partie apprendre la recette secrète de nos biscuits!", "It's gone off to learn the secret recipe for our biscuits!")
    },
    {
      setup: t("Qu'est-ce qu'une erreur 404 chez Angel's Floor?", "What's a 404 error at Angel's Floor?"),
      punchline: t("C'est quand même le fonio ne peut pas vous aider!", "It's when even fonio can't help you!")
    },
    {
      setup: t("Cette page est comme notre baobab...", "This page is like our baobab..."),
      punchline: t("Il faut du temps pour qu'elle mûrisse!", "It needs time to ripen!")
    }
  ]);
  
  let currentJoke = $state(0);
  let showPunchline = $state(false);
  
  function nextJoke() {
    showPunchline = false;
    currentJoke = (currentJoke + 1) % jokes.length;
    setTimeout(() => {
      showPunchline = true;
    }, 1000);
  }
  
  onMount(() => {
    setTimeout(() => {
      showPunchline = true;
    }, 1000);
  });
</script>

<svelte:head>
  <title>{t('404 - Page en Construction', '404 - Page Under Construction')} | Angel's Floor</title>
</svelte:head>

<div class="min-h-screen bg-primary-green relative overflow-hidden">
  <!-- Pattern Background -->
  <div class="absolute inset-0 opacity-5">
    <div class="absolute inset-0" style="
      background-image: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 35px,
        white 35px,
        white 70px
      );
    "></div>
  </div>
  
  <!-- Floating Ingredients -->
  <div class="absolute inset-0">
    <img 
      src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&h=200&fit=crop" 
      alt="Fonio"
      class="absolute w-24 h-24 rounded-full opacity-10 animate-float"
      style="top: 10%; left: 10%; animation-delay: 0s;"
    />
    <img 
      src="https://images.unsplash.com/photo-1609251541848-72c45e5bad78?w=200&h=200&fit=crop" 
      alt="Baobab"
      class="absolute w-32 h-32 rounded-full opacity-10 animate-float"
      style="top: 60%; right: 15%; animation-delay: 2s;"
    />
    <img 
      src="https://images.unsplash.com/photo-1549888834-3ec93abae044?w=200&h=200&fit=crop" 
      alt="Biscuits"
      class="absolute w-28 h-28 rounded-full opacity-10 animate-float"
      style="bottom: 20%; left: 20%; animation-delay: 4s;"
    />
  </div>

  <!-- Main Content -->
  <div class="relative z-10 min-h-screen flex items-center justify-center px-4">
    <div class="text-center max-w-3xl mx-auto">
      <!-- Animated 404 -->
      <div class="mb-12">
        <div class="relative inline-block">
          <h1 class="text-[150px] md:text-[250px] font-bold text-white/10 leading-none">
            404
          </h1>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="bg-white rounded-3xl p-8 shadow-2xl transform -rotate-3 hover:rotate-3 transition-transform duration-300">
              <p class="text-2xl font-bold text-primary-green">{t('Oups!', 'Oops!')}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Joke Section -->
      <div class="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-8 min-h-[150px]">
        <p class="text-xl text-white mb-4">{jokes[currentJoke].setup}</p>
        {#if showPunchline}
          <p class="text-2xl font-bold text-accent-gold animate-bounce-in">
            {jokes[currentJoke].punchline}
          </p>
        {/if}
        <button 
          onclick={nextJoke}
          class="mt-6 text-white/80 hover:text-white underline text-sm transition-colors"
        >
          {t('Une autre blague? →', 'Another joke? →')}
        </button>
      </div>
      
      <!-- Construction Notice -->
      <div class="bg-white rounded-3xl p-8 shadow-2xl mb-8">
        <div class="flex items-center justify-center mb-4">
          <svg class="w-16 h-16 text-accent-sunset" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-primary-green mb-4">
          {t('Page en Préparation', 'Page in the Making')}
        </h2>
        <p class="text-neutral-charcoal mb-6">
          {t(
            "Comme nos meilleurs produits, cette page demande du temps et de l'attention. Nos développeurs y travaillent avec le même soin que nos productrices mettent dans la préparation du fonio!",
            'Like our finest products, this page needs time and care. Our developers are working on it with the same attention our women producers put into preparing fonio!'
          )}
        </p>
        <div class="flex items-center justify-center space-x-2 text-sm text-neutral-slate">
          <div class="w-2 h-2 bg-primary-green rounded-full animate-pulse"></div>
          <span>{t('En cours de développement', 'In development')}</span>
        </div>
      </div>
      
      <!-- Navigation Options -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
        <a 
          href={href('/')}
          class="bg-white text-primary-green px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          {t("Page d'Accueil", 'Home Page')}
        </a>
        <a 
          href={href('/produits')}
          class="bg-accent-gold text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          {t('Nos Produits', 'Our Products')}
        </a>
      </div>
    </div>
  </div>
</div>

<style>
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-20px) rotate(5deg); }
    75% { transform: translateY(20px) rotate(-5deg); }
  }
  
  @keyframes bounce-in {
    0% { 
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      transform: scale(1.05);
    }
    100% { 
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-float {
    animation: float 8s ease-in-out infinite;
  }
  
  .animate-bounce-in {
    animation: bounce-in 0.6s ease-out;
  }
</style>