<script lang="ts">
  import { onMount } from 'svelte';
  import { Leaf } from 'lucide-svelte';
  import AnimatedText from '$lib/components/ui/AnimatedText.svelte';
  import ScrollingBanner from '$lib/components/ui/ScrollingBanner.svelte';
  import { appStore } from '$lib/stores/app.js';

  let currentSlide = 0;
  let slideInterval: number;
  let heroVisible = false;
  let currentImageIndex = 0;
  
  const heroImages = [
    'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1519096845289-95806ee03a1a?w=600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=600&h=900&fit=crop'
  ];

  onMount(() => {
    appStore.initialize();
    heroVisible = true;
    
    // Auto-advance slider
    slideInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % 3;
    }, 4000);
    
    // Auto-advance hero images
    const imageInterval = setInterval(() => {
      currentImageIndex = (currentImageIndex + 1) % heroImages.length;
    }, 4000);
    
    return () => {
      if (slideInterval) clearInterval(slideInterval);
      clearInterval(imageInterval);
    };
  });

  function goToSlide(index: number) {
    currentSlide = index;
  }
</script>

<svelte:head>
  <title>Angel's Floor - Accueil</title>
  <meta name="description" content="Découvrez nos produits naturels du Bénin : fonio, baobab, néré et plus encore. Qualité artisanale, impact communautaire." />
</svelte:head>

<!-- Top Call Banner -->
<div class="bg-accent-gold text-primary-green py-3 text-center">
  <div class="flex items-center justify-center space-x-3">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
    <span class="text-sm md:text-base font-semibold">Appelez-nous maintenant : +229 XX XX XX XX</span>
    <span class="hidden md:inline text-sm">| Lun-Ven 8h-18h • Sam 9h-16h</span>
  </div>
</div>

<!-- Hero Section with Animated Text -->
<section class="relative overflow-hidden py-16 lg:py-24 bg-primary-green">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      
      <!-- Text Content -->
      <div class="relative z-10">
        <div class="hero-heading" class:visible={heroVisible}>
          <h1 class="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-8 leading-tight">
            <AnimatedText 
              text="Où chaque bouchée est une célébration du Bénin" 
              className="inline" 
              delay={100}
            />
          </h1>
          
          <div class="hero-desc opacity-0 translate-y-8" class:show={heroVisible}>
            <p class="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed max-w-xl">
              Angel's Floor - une expérience culinaire authentique.
              Toujours naturelle, toujours premium. Suivez-nous
              pour découvrir nos saveurs ancestrales!
            </p>
            
            <div class="flex flex-wrap gap-4">
              <button 
                on:click={() => window.location.href='/produits'}
                class="bg-white text-primary-green px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Découvrir Nos Produits
              </button>
              <button 
                on:click={() => window.location.href='/a-propos'}
                class="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary-green transition-all duration-300"
              >
                Notre Histoire
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Vertical Image Carousel -->
      <div class="relative h-[600px] lg:h-[750px] flex items-center justify-center">
        <!-- Yellow background accent -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-[400px] lg:w-[550px] h-[550px] lg:h-[700px] bg-accent-gold/20 rounded-[40px] transform rotate-3"></div>
        </div>
        
        <div class="hero-image-wrap relative w-[380px] lg:w-[500px] h-[570px] lg:h-[720px]" class:loaded={heroVisible}>
          <!-- Image Stack Container -->
          <div class="relative w-full h-full">
            {#each heroImages as image, index}
              {@const offset = index - currentImageIndex}
              {@const isVisible = Math.abs(offset) <= 1}
              {#if isVisible}
                <div 
                  class="absolute inset-0 transition-all duration-700 ease-in-out"
                  style="
                    transform: translateY({offset * 120}px) scale({offset === 0 ? 1 : 0.8}) rotate({offset * 3}deg);
                    opacity: {offset === 0 ? 1 : 0.35};
                    z-index: {offset === 0 ? 10 : 5};
                  "
                >
                  <div class="w-full h-full rounded-[30px] overflow-hidden shadow-2xl">
                    <img 
                      src={image}
                      alt="Produits Angel's Floor"
                      class="w-full h-full object-cover"
                    />
                    <!-- Overlay gradient -->
                    <div class="absolute inset-0 bg-gradient-to-t from-primary-green/40 via-transparent to-transparent"></div>
                  </div>
                </div>
              {/if}
            {/each}
          </div>
          
          <!-- Navigation dots -->
          <div class="absolute -right-16 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
            {#each heroImages as _, index}
              <button
                class="w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 {currentImageIndex === index ? 'bg-white w-3 h-8' : 'bg-white/50'}"
                on:click={() => currentImageIndex = index}
                aria-label="Go to image {index + 1}"
              />
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Background decoration -->
  <div class="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
  <div class="absolute bottom-20 right-20 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl"></div>
</section>

<!-- Scrolling Banner -->
<div class="relative -mt-24 z-30">
  <ScrollingBanner />
</div>

<!-- Stats Section -->
<section class="py-16 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
      <!-- Stat 1 -->
      <div class="text-center">
        <div class="text-4xl md:text-5xl font-bold text-primary-green mb-2">500+</div>
        <p class="text-neutral-charcoal font-semibold">Femmes Productrices</p>
        <p class="text-sm text-neutral-slate mt-1">Autonomisées depuis 2015</p>
      </div>
      
      <!-- Stat 2 -->
      <div class="text-center">
        <div class="text-4xl md:text-5xl font-bold text-accent-sunset mb-2">10</div>
        <p class="text-neutral-charcoal font-semibold">Années d'Excellence</p>
        <p class="text-sm text-neutral-slate mt-1">De savoir-faire artisanal</p>
      </div>
      
      <!-- Stat 3 -->
      <div class="text-center">
        <div class="text-4xl md:text-5xl font-bold text-creative-purple mb-2">15+</div>
        <p class="text-neutral-charcoal font-semibold">Points de Vente</p>
        <p class="text-sm text-neutral-slate mt-1">À travers le Bénin</p>
      </div>
      
      <!-- Stat 4 -->
      <div class="text-center">
        <div class="text-4xl md:text-5xl font-bold text-primary-green mb-2">100%</div>
        <p class="text-neutral-charcoal font-semibold">Produits Naturels</p>
        <p class="text-sm text-neutral-slate mt-1">Certifiés biologiques</p>
      </div>
    </div>
  </div>
</section>

<!-- 10 Years of Excellence Section -->
<section class="py-20 bg-neutral-sand">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <!-- Content -->
      <div>
        <h2 class="text-4xl md:text-5xl font-bold text-primary-green mb-6">
          10 Ans d'Excellence
        </h2>
        <p class="text-xl text-neutral-charcoal mb-8">
          Depuis 2015, Angel's Floor transforme les saveurs ancestrales du Bénin en produits d'exception. 
          Notre voyage a commencé avec 5 femmes productrices dans l'Atacora et s'est développé en un réseau 
          de plus de 500 femmes autonomisées à travers le pays.
        </p>
        <p class="text-lg text-neutral-charcoal mb-8">
          Une décennie d'innovation, de croissance et d'impact social qui a transformé non seulement 
          des produits locaux, mais aussi des vies et des communautés entières.
        </p>
        <button 
          on:click={() => window.location.href='/a-propos'}
          class="bg-primary-green text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-primary-green-vibrant transform hover:scale-105 transition-all duration-300"
        >
          Découvrir Notre Histoire Complète
        </button>
      </div>
      
      <!-- Image -->
      <div class="relative">
        <img 
          src="https://images.unsplash.com/photo-1521790945508-9859a19edb6e?w=800&h=600&fit=crop&crop=center" 
          alt="10 ans d'Angel's Floor" 
          class="rounded-3xl shadow-2xl"
        />
        <!-- Decorative badge -->
        <div class="absolute -top-6 -right-6 bg-accent-gold rounded-full w-32 h-32 flex items-center justify-center shadow-lg">
          <div class="text-center">
            <div class="text-4xl font-bold text-white">10</div>
            <div class="text-sm font-semibold text-white">ANS</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Product Preview Slider (Noka Style) -->
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h2 class="text-4xl md:text-5xl font-bold text-neutral-obsidian mb-4">
        Savourez la Tradition Béninoise
      </h2>
      <p class="text-xl text-neutral-charcoal max-w-3xl mx-auto mb-6">
        Découvrez nos gammes de produits soigneusement sélectionnés, transformés avec amour 
        par nos productrices pour vous offrir le meilleur du terroir béninois.
      </p>
      <div class="flex flex-wrap justify-center gap-4 text-sm">
        <span class="bg-primary-green/10 text-primary-green px-4 py-2 rounded-full font-medium">
          Sans Gluten
        </span>
        <span class="bg-accent-sunset/10 text-accent-sunset px-4 py-2 rounded-full font-medium">
          100% Naturel
        </span>
        <span class="bg-creative-purple/10 text-creative-purple px-4 py-2 rounded-full font-medium">
          Prêt à Consommer
        </span>
        <span class="bg-accent-gold/10 text-accent-gold px-4 py-2 rounded-full font-medium">
          Certifié Bio
        </span>
      </div>
    </div>
    
    <!-- Slider Container -->
    <div class="relative overflow-hidden">
      <div class="flex transition-transform duration-500 ease-in-out py-8" style="transform: translateX(-{currentSlide * 100}%)">
        
        <!-- Slide 1 - Green -->
        <div class="min-w-full flex justify-center">
          <div class="relative">
            <!-- Green shadow -->
            <div class="absolute inset-2 bg-primary-green/10 rounded-3xl"></div>
            <div class="relative bg-primary-green-bright rounded-3xl p-8 max-w-md mx-4">
            <img 
              src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop&crop=center" 
              alt="Fonio" 
              class="w-full h-64 object-cover rounded-2xl mb-6"
            />
            <h3 class="text-2xl font-bold text-white mb-3">Fonio + Moringa</h3>
            <p class="text-white/80 mb-4">Le super duo nutritionnel de l'Atacora</p>
            <button 
              on:click={() => window.location.href='/produits'}
              class="bg-white text-primary-green px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform">
              Découvrir
            </button>
            </div>
          </div>
        </div>

        <!-- Slide 2 - Orange -->
        <div class="min-w-full flex justify-center">
          <div class="relative">
            <!-- Orange shadow -->
            <div class="absolute inset-2 bg-accent-sunset/10 rounded-3xl"></div>
            <div class="relative bg-accent-sunset rounded-3xl p-8 max-w-md mx-4">
            <img 
              src="https://images.unsplash.com/photo-1609251541848-72c45e5bad78?w=600&h=400&fit=crop&crop=center" 
              alt="Baobab" 
              class="w-full h-64 object-cover rounded-2xl mb-6"
            />
            <h3 class="text-2xl font-bold text-white mb-3">Baobab + Gingembre</h3>
            <p class="text-white/80 mb-4">L'alliance vitaminée et énergisante</p>
            <button 
              on:click={() => window.location.href='/produits'}
              class="bg-white text-accent-sunset px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform">
              Découvrir
            </button>
            </div>
          </div>
        </div>

        <!-- Slide 3 - Purple -->
        <div class="min-w-full flex justify-center">
          <div class="relative">
            <!-- Purple shadow -->
            <div class="absolute inset-2 bg-creative-purple/10 rounded-3xl"></div>
            <div class="relative bg-creative-purple rounded-3xl p-8 max-w-md mx-4">
            <img 
              src="https://images.unsplash.com/photo-1549888834-3ec93abae044?w=600&h=400&fit=crop&crop=center" 
              alt="Biscuits" 
              class="w-full h-64 object-cover rounded-2xl mb-6"
            />
            <h3 class="text-2xl font-bold text-white mb-3">Biscuits + Baobab</h3>
            <p class="text-white/80 mb-4">Le plaisir croustillant et nutritif</p>
            <button 
              on:click={() => window.location.href='/produits'}
              class="bg-white text-creative-purple px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform">
              Découvrir
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dots Navigation -->
    <div class="flex justify-center mt-8 space-x-3">
      {#each [0, 1, 2] as index}
        <button 
          class="w-3 h-3 rounded-full transition-all duration-300 {currentSlide === index ? 'bg-primary-green w-8' : 'bg-neutral-light'}"
          on:click={() => goToSlide(index)}
          aria-label="Aller au slide {index + 1}"
        ></button>
      {/each}
    </div>
    
    <!-- Call to Action -->
    <div class="text-center mt-12">
      <p class="text-neutral-charcoal mb-6">
        Ce n'est qu'un aperçu de notre riche collection de produits authentiques du Bénin.
      </p>
      <button 
        on:click={() => window.location.href='/produits'}
        class="bg-primary-green text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-primary-green-vibrant hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
      >
        <span>Voir Tous Nos Produits</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>
    </div>
  </div>
</section>

<!-- Lifestyle Section (Yellow Background - Noka Style) -->
<section class="py-20 bg-yellow-400">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      
      <!-- Text Content -->
      <div>
        <h2 class="text-4xl md:text-5xl font-bold text-black mb-6">
          Votre Allié Nutrition au Quotidien
        </h2>
        <p class="text-xl text-black mb-8">
          Que ce soit pour démarrer votre journée, une pause gourmande ou un repas équilibré, 
          nos produits s'adaptent à votre rythme de vie tout en vous apportant le meilleur du Bénin.
        </p>
        
        <!-- Feature Cards -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white rounded-2xl p-6 text-center">
            <div class="w-20 h-20 mx-auto mb-3 overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=200&h=200" 
                alt="Petit-déjeuner" 
                class="w-full h-full object-cover"
              />
            </div>
            <h4 class="font-bold text-black">Petit-Déjeuner</h4>
            <p class="text-sm text-gray-600">Fonio au lait de coco</p>
          </div>
          <div class="bg-white rounded-2xl p-6 text-center">
            <div class="w-20 h-20 mx-auto mb-3 overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1538220856186-0be0e085984e?auto=format&fit=crop&w=200&h=200" 
                alt="Sport et énergie" 
                class="w-full h-full object-cover"
              />
            </div>
            <h4 class="font-bold text-black">Sport & Énergie</h4>
            <p class="text-sm text-gray-600">Smoothie baobab boost</p>
          </div>
          <div class="bg-white rounded-2xl p-6 text-center">
            <div class="w-20 h-20 mx-auto mb-3 overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=200&h=200" 
                alt="En famille" 
                class="w-full h-full object-cover"
              />
            </div>
            <h4 class="font-bold text-black">En Famille</h4>
            <p class="text-sm text-gray-600">Goûter biscuits maison</p>
          </div>
          <div class="bg-white rounded-2xl p-6 text-center">
            <div class="w-20 h-20 mx-auto mb-3 overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=200&h=200" 
                alt="Au bureau" 
                class="w-full h-full object-cover"
              />
            </div>
            <h4 class="font-bold text-black">Au Bureau</h4>
            <p class="text-sm text-gray-600">Pause nutritive</p>
          </div>
        </div>
      </div>

      <!-- Lifestyle Image -->
      <div class="relative">
        <img 
          src="https://images.unsplash.com/photo-1594736797933-d0ed62e8681a?w=800&h=600&fit=crop&crop=center" 
          alt="Femmes productrices heureuses" 
          class="rounded-3xl shadow-2xl"
        />
        <!-- Floating elements -->
        <div class="absolute -top-8 -right-8 w-24 h-24">
          <img 
            src="https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=200&h=200&fit=crop&crop=center" 
            alt="Produit naturel" 
            class="w-full h-full object-cover rounded-full shadow-lg animate-float"
          />
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Testimonials Section -->
<section class="py-20 bg-neutral-sand">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-bold text-primary-green mb-4">
        Ce Que Disent Nos Clients
      </h2>
      <p class="text-xl text-neutral-charcoal max-w-3xl mx-auto">
        Des milliers de béninois ont adopté nos produits pour une alimentation saine et savoureuse
      </p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Testimonial 1 -->
      <div class="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div class="flex items-center mb-4">
          <!-- Stars -->
          <div class="flex text-accent-gold">
            {#each [1, 2, 3, 4, 5] as _star}
              <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            {/each}
          </div>
          <span class="ml-2 text-sm text-neutral-slate">5.0</span>
        </div>
        <p class="text-neutral-charcoal mb-6 italic">
          "Le fonio précuit d'Angel's Floor a révolutionné mes petits-déjeuners. Rapide, nutritif et délicieux. Je ne peux plus m'en passer!"
        </p>
        <div class="flex items-center">
          <div class="w-12 h-12 bg-primary-green-bright rounded-full flex items-center justify-center text-white font-bold">
            MA
          </div>
          <div class="ml-3">
            <h4 class="font-semibold text-neutral-obsidian">Marie Adjovi</h4>
            <p class="text-sm text-neutral-slate">Cotonou</p>
          </div>
        </div>
      </div>
      
      <!-- Testimonial 2 -->
      <div class="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div class="flex items-center mb-4">
          <!-- Stars -->
          <div class="flex text-accent-gold">
            {#each [1, 2, 3, 4, 5] as _star}
              <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            {/each}
          </div>
          <span class="ml-2 text-sm text-neutral-slate">5.0</span>
        </div>
        <p class="text-neutral-charcoal mb-6 italic">
          "La pulpe de baobab est mon secret pour rester en forme. Un vrai boost d'énergie naturelle. Merci Angel's Floor pour cette qualité exceptionnelle!"
        </p>
        <div class="flex items-center">
          <div class="w-12 h-12 bg-accent-sunset rounded-full flex items-center justify-center text-white font-bold">
            PK
          </div>
          <div class="ml-3">
            <h4 class="font-semibold text-neutral-obsidian">Paul Koudjo</h4>
            <p class="text-sm text-neutral-slate">Porto-Novo</p>
          </div>
        </div>
      </div>
      
      <!-- Testimonial 3 -->
      <div class="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div class="flex items-center mb-4">
          <!-- Stars -->
          <div class="flex text-accent-gold">
            {#each [1, 2, 3, 4, 5] as _star}
              <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            {/each}
          </div>
          <span class="ml-2 text-sm text-neutral-slate">5.0</span>
        </div>
        <p class="text-neutral-charcoal mb-6 italic">
          "Les biscuits enrichis sont parfaits pour mes enfants. Sains, croustillants et savoureux. Enfin une collation dont je n'ai pas à culpabiliser!"
        </p>
        <div class="flex items-center">
          <div class="w-12 h-12 bg-creative-purple rounded-full flex items-center justify-center text-white font-bold">
            SH
          </div>
          <div class="ml-3">
            <h4 class="font-semibold text-neutral-obsidian">Sophie Houessou</h4>
            <p class="text-sm text-neutral-slate">Parakou</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Additional testimonials slider indicator -->
    <div class="flex justify-center mt-12 space-x-2">
      <div class="w-2 h-2 bg-primary-green rounded-full"></div>
      <div class="w-2 h-2 bg-neutral-light rounded-full"></div>
      <div class="w-2 h-2 bg-neutral-light rounded-full"></div>
    </div>
  </div>
</section>

<!-- Brand Philosophy (White Background) -->
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 class="text-4xl font-bold text-neutral-obsidian mb-16">
      Nutrition Authentique. Impact Réel. Saveurs Délicieuses.
    </h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Feature 1 -->
      <div class="text-center">
        <div class="w-20 h-20 bg-primary-green rounded-full flex items-center justify-center mx-auto mb-4">
          <Leaf class="w-10 h-10 text-white" />
        </div>
        <h3 class="font-bold text-lg text-primary-green mb-2">Bio + Naturel</h3>
        <p class="text-neutral-slate">Sans pesticides, sans additifs artificiels</p>
      </div>
      
      <!-- Feature 2 -->
      <div class="text-center">
        <div class="w-20 h-20 bg-accent-sunset rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="font-bold text-lg text-primary-green mb-2">Impact Local</h3>
        <p class="text-neutral-slate">500+ femmes productrices soutenues</p>
      </div>
      
      <!-- Feature 3 -->
      <div class="text-center">
        <div class="w-20 h-20 bg-creative-purple rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <h3 class="font-bold text-lg text-primary-green mb-2">Eco-Responsable</h3>
        <p class="text-neutral-slate">Emballages recyclables et durables</p>
      </div>
    </div>
  </div>
</section>

<!-- Community Impact Preview Section -->
<section class="py-20 bg-primary-green text-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <!-- Content -->
      <div>
        <h2 class="text-4xl md:text-5xl font-bold mb-6">
          Notre Impact Au-Delà du Produit
        </h2>
        <p class="text-xl text-white/90 mb-8">
          Chaque achat Angel's Floor contribue directement à l'autonomisation des femmes 
          béninoises et au développement durable de nos communautés rurales.
        </p>
        
        <!-- Impact Stats Grid -->
        <div class="grid grid-cols-2 gap-6">
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div class="text-3xl font-bold text-accent-gold mb-2">500+</div>
            <p class="text-white/80 text-sm">Femmes productrices autonomisées</p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div class="text-3xl font-bold text-accent-gold mb-2">10</div>
            <p class="text-white/80 text-sm">Villages impactés dans l'Atacora</p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div class="text-3xl font-bold text-accent-gold mb-2">250%</div>
            <p class="text-white/80 text-sm">Augmentation du revenu moyen</p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div class="text-3xl font-bold text-accent-gold mb-2">2000+</div>
            <p class="text-white/80 text-sm">Familles bénéficiaires indirectes</p>
          </div>
        </div>
        
        <button 
          on:click={() => window.location.href='/impact'}
          class="mt-8 bg-white text-primary-green px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          Découvrir Notre Impact Complet
        </button>
      </div>
      
      <!-- Visual -->
      <div class="relative">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-4">
            <img 
              src="https://images.unsplash.com/photo-1594736797933-d0ed62e8681a?w=400&h=300&fit=crop&crop=center" 
              alt="Femme productrice au travail" 
              class="rounded-2xl shadow-xl animate-float"
              style="animation-delay: 0s;"
            />
            <img 
              src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=300&fit=crop&crop=center" 
              alt="Récolte de fonio" 
              class="rounded-2xl shadow-xl animate-float"
              style="animation-delay: -2s;"
            />
          </div>
          <div class="space-y-4 mt-8">
            <img 
              src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400&h=300&fit=crop&crop=center" 
              alt="Formation des productrices" 
              class="rounded-2xl shadow-xl animate-float"
              style="animation-delay: -1s;"
            />
            <img 
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=300&fit=crop&crop=center" 
              alt="Produits finis Angel's Floor" 
              class="rounded-2xl shadow-xl animate-float"
              style="animation-delay: -3s;"
            />
          </div>
        </div>
        
        <!-- Decorative element -->
        <div class="absolute -top-8 -right-8 w-32 h-32 bg-accent-gold/15 rounded-full"></div>
      </div>
    </div>
  </div>
</section>

<!-- Final CTA -->
<section class="py-20 bg-footer-green relative overflow-hidden">
  <div class="absolute inset-0">
    <div class="absolute top-0 left-0 w-96 h-96 bg-accent-gold/10 rounded-full"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-accent-gold/10 rounded-full"></div>
  </div>
  
  <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 class="text-4xl md:text-6xl font-bold text-white mb-8">
      Prêt à Transformer Votre Alimentation ?
    </h2>
    <p class="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
      Rejoignez des milliers de béninois qui ont déjà adopté nos produits naturels 
      pour une alimentation saine et authentique.
    </p>
    
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button 
        on:click={() => window.location.href='/produits'}
        class="bg-accent-gold text-footer-green px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
      >
        Commander Maintenant
      </button>
      <button 
        on:click={() => window.location.href='/grossistes'}
        class="bg-transparent border-2 border-accent-gold text-accent-gold px-8 py-4 rounded-full font-bold text-lg hover:bg-accent-gold hover:text-footer-green transition-all duration-300"
      >
        Devenir Distributeur
      </button>
    </div>
  </div>
  
  <!-- Divider at bottom -->
  <div class="absolute bottom-0 left-0 right-0 h-px bg-white/10"></div>
</section>

<style>
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .hero-heading {
    opacity: 0;
    transform: translateY(30px);
    transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .hero-heading.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .hero-desc {
    transition: all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.6s;
  }
  
  .hero-desc.show {
    opacity: 1;
    transform: translateY(0);
  }
  
  .hero-image-wrap {
    opacity: 0;
    transform: scale(0.95) translateX(30px);
    transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s;
  }
  
  .hero-image-wrap.loaded {
    opacity: 1;
    transform: scale(1) translateX(0);
  }
</style>