<script lang="ts">
  import { onMount } from 'svelte';
  import { ArrowRight, Dumbbell, Briefcase, Sun, Heart, Store, TrendingUp, Package, Users } from 'lucide-svelte';
  import ScrollingBanner from '$lib/components/ui/ScrollingBanner.svelte';
  import ScrollReveal from '$lib/components/ui/ScrollReveal.svelte';
  import ProductCard from '$lib/components/ui/ProductCard.svelte';
  import { CmsText, CmsImage } from '$lib/components/cms';
  import { appStore } from '$lib/stores/app.js';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const displayProducts = $derived(data.featuredProducts);

  let heroVisible = $state(false);
  let currentImageIndex = $state(0);
  // let showAnniversaryBanner = false;
  let impactCounter = $state(0);
  let impactSectionVisible = $state(false);
  
  // function dismissBanner() {
  //   showAnniversaryBanner = false;
  //   if (typeof localStorage !== 'undefined') {
  //     localStorage.setItem('anniversaryBannerDismissed', 'true');
  //   }
  // }
  
  function startCounter() {
    if (impactSectionVisible) return; // Only run once
    impactSectionVisible = true;
    
    const duration = 2000; // 2 seconds
    const targetValue = 100;
    const increment = targetValue / (duration / 16); // 60fps
    
    const animate = () => {
      if (impactCounter < targetValue) {
        impactCounter = Math.min(impactCounter + increment, targetValue);
        requestAnimationFrame(animate);
      } else {
        impactCounter = targetValue;
      }
    };
    
    animate();
  }
  
  import { useCms } from '$lib/cms/context';

  const defaultHeroImages = [
    'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1519096845289-95806ee03a1a?w=600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=600&h=900&fit=crop'
  ];
  const cms = useCms();
  const heroImages = cms.gallery['home.hero.slider']?.length ? cms.gallery['home.hero.slider'] : defaultHeroImages;

  onMount(() => {
    appStore.initialize();
    heroVisible = true;
    
    // Check if banner should be shown - commented out for now
    // if (typeof localStorage !== 'undefined') {
    //   const bannerDismissed = localStorage.getItem('anniversaryBannerDismissed');
    //   showAnniversaryBanner = !bannerDismissed;
    // }
    
    // Auto-advance hero images
    const imageInterval = setInterval(() => {
      currentImageIndex = (currentImageIndex + 1) % heroImages.length;
    }, 6000);
    
    // Set up intersection observer for impact section
    const impactSection = document.querySelector('#impact-section');
    if (impactSection) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startCounter();
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(impactSection);
      
      return () => {
        clearInterval(imageInterval);
        observer.disconnect();
      };
    }
    
    return () => {
      clearInterval(imageInterval);
    };
  });
  
</script>

<svelte:head>
  <title>Angel's Floor - Accueil</title>
  <meta name="description" content="Spécialiste de la transformation artisanale de produits africains naturels : fonio précuit, poudre de baobab, farines enrichies. Produits prêts à consommer, certifiés biologiques." />
</svelte:head>

<!-- Anniversary Banner - Hidden for now -->
<!-- {#if showAnniversaryBanner}
  <div class="fixed top-0 left-0 right-0 z-50" style="background-color: #EACF0F;">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div class="flex items-center justify-between">
        <div class="flex-1 flex items-center justify-center gap-4">
          <span class="text-2xl">🎉</span>
          <div class="text-center">
            <a href="/blog/10-ans-excellence" class="group">
              <span class="font-bold text-neutral-obsidian text-lg">Angel's Floor célèbre 10 ans d'excellence!</span>
              <span class="text-neutral-charcoal ml-2 group-hover:underline">Découvrez notre histoire →</span>
            </a>
          </div>
        </div>
        <button 
          on:click={dismissBanner}
          class="text-neutral-charcoal hover:text-neutral-obsidian p-2"
          aria-label="Fermer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
  <div class="h-14"></div>
{/if} -->

<!-- Hero Section with Animated Text -->
<section class="relative overflow-x-hidden overflow-y-visible py-16 lg:py-24 bg-primary-green">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      
      <!-- Text Content -->
      <div class="relative z-10 text-center lg:text-left flex flex-col items-center lg:items-start">
        <div class="hero-heading" class:visible={heroVisible}>
          <CmsText key="home.hero.title" tag="h1" class="text-5xl md:text-6xl lg:text-6xl font-bold text-white mb-8 leading-tight text-center lg:text-left hero-title">Produits africains transformés avec expertise et tradition</CmsText>

          <div class="hero-desc opacity-0 translate-y-8" class:show={heroVisible}>
            <CmsText key="home.hero.subtitle" tag="p" class="text-lg md:text-xl lg:text-xl text-white/90 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">Spécialistes de la transformation artisanale de produits africains naturels. Du fonio au baobab, nous valorisons les richesses du terroir béninois pour vous offrir des produits prêts à consommer de qualité premium.</CmsText>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full lg:w-auto">
              <a 
                href="/produits"
                class="block sm:inline-block w-full sm:w-auto text-center bg-white text-primary-green px-6 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Découvrir Nos Produits
              </a>
              <a 
                href="/a-propos"
                class="block sm:inline-block w-full sm:w-auto text-center bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-semibold text-base hover:bg-white/10 transition-all duration-300"
              >
                Notre Histoire
              </a>
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
        
        <div data-cms="home.hero.slider" data-cms-type="gallery" class="hero-image-wrap relative w-[380px] lg:w-[500px] h-[570px] lg:h-[720px]" class:loaded={heroVisible}>
          <!-- Image Stack Container -->
          <div class="relative w-full h-full">
            {#each heroImages as image, index}
              {@const offset = index - currentImageIndex}
              {@const isVisible = Math.abs(offset) <= 1}
              {#if isVisible}
                <div 
                  class="absolute inset-0 transition-all duration-1000 ease-in-out"
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
          
          <!-- Navigation dots removed -->
        </div>
      </div>
    </div>
  </div>
  
  <!-- Background decoration -->
  <div class="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
  <div class="absolute bottom-20 right-20 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl"></div>
</section>

<!-- Scrolling Banner -->
<div class="relative -mt-8 z-30 bg-green-700">
  <ScrollingBanner />
</div>


<!-- Stats Section -->
<section class="py-20 -mt-8 pt-24 bg-green-700/10">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
      <!-- Stat 1 -->
      <ScrollReveal animation="fade-up" delay={0}>
      <div class="text-center">
        <CmsText key="home.stats.1.number" tag="div" class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-green mb-3">500+</CmsText>
        <CmsText key="home.stats.1.label" tag="p" class="text-black font-bold text-lg md:text-xl">Femmes Productrices</CmsText>
        <CmsText key="home.stats.1.desc" tag="p" class="text-base text-black mt-2">Autonomisées depuis 2015</CmsText>
      </div>
      </ScrollReveal>

      <!-- Stat 2 -->
      <ScrollReveal animation="fade-up" delay={100}>
      <div class="text-center">
        <CmsText key="home.stats.2.number" tag="div" class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-green mb-3">10</CmsText>
        <CmsText key="home.stats.2.label" tag="p" class="text-black font-bold text-lg md:text-xl">Années d'Excellence</CmsText>
        <CmsText key="home.stats.2.desc" tag="p" class="text-base text-black mt-2">De savoir-faire artisanal</CmsText>
      </div>
      </ScrollReveal>

      <!-- Stat 3 -->
      <ScrollReveal animation="fade-up" delay={200}>
      <div class="text-center">
        <CmsText key="home.stats.3.number" tag="div" class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-green mb-3">15+</CmsText>
        <CmsText key="home.stats.3.label" tag="p" class="text-black font-bold text-lg md:text-xl">Points de Vente</CmsText>
        <CmsText key="home.stats.3.desc" tag="p" class="text-base text-black mt-2">À travers le Bénin</CmsText>
      </div>
      </ScrollReveal>

      <!-- Stat 4 -->
      <ScrollReveal animation="fade-up" delay={300}>
      <div class="text-center">
        <CmsText key="home.stats.4.number" tag="div" class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-green mb-3">100%</CmsText>
        <CmsText key="home.stats.4.label" tag="p" class="text-black font-bold text-lg md:text-xl">Produits Naturels</CmsText>
        <CmsText key="home.stats.4.desc" tag="p" class="text-base text-black mt-2">Certifiés biologiques</CmsText>
      </div>
      </ScrollReveal>
    </div>
  </div>
</section>


<!-- Featured Products Section -->
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <ScrollReveal animation="fade-up">
    <div class="text-center mb-12">
      <CmsText key="home.products.overline" tag="p" class="text-sm font-semibold text-primary-green uppercase tracking-wider mb-3">Nos Produits</CmsText>
      <CmsText key="home.products.title" tag="h2" class="text-4xl md:text-5xl font-bold text-black mb-4">Produits Transformés du Terroir Béninois</CmsText>
      <CmsText key="home.products.description" tag="p" class="text-xl text-neutral-charcoal max-w-3xl mx-auto mb-6">Découvrez nos gammes de produits soigneusement sélectionnés, transformés avec amour par nos productrices pour vous offrir le meilleur du terroir béninois.</CmsText>
      <div class="flex flex-wrap justify-center gap-4 text-sm">
        <span class="border border-neutral-slate text-neutral-slate px-4 py-2 rounded-full font-medium">
          Sans Gluten
        </span>
        <span class="border border-neutral-slate text-neutral-slate px-4 py-2 rounded-full font-medium">
          100% Naturel
        </span>
        <span class="border border-neutral-slate text-neutral-slate px-4 py-2 rounded-full font-medium">
          Prêt à Consommer
        </span>
        <span class="border border-neutral-slate text-neutral-slate px-4 py-2 rounded-full font-medium">
          Certifié Bio
        </span>
      </div>
    </div>
    </ScrollReveal>
    
    <!-- Three Featured Products -->
    {#if displayProducts.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {#each displayProducts as product, i}
          <ScrollReveal animation="fade-up" delay={i * 100}>
            <ProductCard {product} />
          </ScrollReveal>
        {/each}
      </div>
    {:else}
      <div class="text-center py-12 max-w-2xl mx-auto">
        <Package class="w-12 h-12 text-neutral-light mx-auto mb-4" />
        <p class="text-neutral-charcoal">Aucun produit vedette pour le moment.</p>
        <a href="/produits" class="inline-block mt-4 text-primary-green font-semibold hover:underline">
          Voir tous nos produits →
        </a>
      </div>
    {/if}
    
    <!-- Call to Action -->
    <ScrollReveal animation="fade">
    <div class="text-center mt-12">
      <a 
        href="/produits"
        class="inline-flex items-center gap-3 bg-primary-green text-white px-6 py-3 rounded-full font-semibold text-base shadow-lg hover:bg-primary-green-vibrant hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
      >
        <span>Voir Tous Nos Produits</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
    </div>
    </ScrollReveal>
  </div>
</section>

<!-- Lifestyle Section - Votre Allié Nutrition au Quotidien -->
<section class="py-20 relative overflow-hidden" style="background-color: #EACF0F;">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <ScrollReveal animation="fade-up">
    <div class="text-center mb-12">
      <CmsText key="home.lifestyle.overline" tag="p" class="text-sm font-semibold text-neutral-obsidian uppercase tracking-wider mb-3">Mode de Vie</CmsText>
      <CmsText key="home.lifestyle.title" tag="h2" class="text-4xl md:text-5xl font-bold text-black mb-4">Votre Allié Nutrition au Quotidien</CmsText>
      <CmsText key="home.lifestyle.description" tag="p" class="text-xl text-neutral-charcoal max-w-3xl mx-auto">Nos produits s'adaptent à votre rythme de vie tout en vous apportant le meilleur du Bénin.</CmsText>
    </div>
    </ScrollReveal>
    
    <!-- Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Morning Card -->
      <ScrollReveal animation="fade-up" delay={0}>
      <div class="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
        <Sun class="w-10 h-10 text-orange-500 mb-6" />
        <h4 class="font-bold text-xl text-neutral-obsidian mb-3">Petit-Déjeuner</h4>
        <p class="text-sm text-gray-600 mb-4 leading-relaxed">Commencez votre journée avec énergie et vitalité grâce à nos produits riches en nutriments</p>
        <div class="border-t pt-4">
          <p class="text-xs text-gray-500 mb-2">Recommandé:</p>
          <a href="/produits/fonio-precuit" class="text-sm text-primary-green font-semibold hover:text-primary-green-vibrant hover:underline">
            Fonio au lait de coco
          </a>
        </div>
      </div>
      </ScrollReveal>
      
      <!-- Sport Card -->
      <ScrollReveal animation="fade-up" delay={100}>
      <div class="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
        <Dumbbell class="w-10 h-10 text-green-500 mb-6" />
        <h4 class="font-bold text-xl text-neutral-obsidian mb-3">Sport & Énergie</h4>
        <p class="text-sm text-gray-600 mb-4 leading-relaxed">Boostez vos performances naturellement avec nos super-aliments adaptés aux sportifs</p>
        <div class="border-t pt-4">
          <p class="text-xs text-gray-500 mb-2">Recommandé:</p>
          <a href="/produits/baobab-poudre" class="text-sm text-primary-green font-semibold hover:text-primary-green-vibrant hover:underline">
            Smoothie baobab boost
          </a>
        </div>
      </div>
      </ScrollReveal>
      
      <!-- Family Card -->
      <ScrollReveal animation="fade-up" delay={200}>
      <div class="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
        <Heart class="w-10 h-10 text-pink-500 mb-6" />
        <h4 class="font-bold text-xl text-neutral-obsidian mb-3">En Famille</h4>
        <p class="text-sm text-gray-600 mb-4 leading-relaxed">Des moments de partage savoureux autour de nos produits sains et délicieux</p>
        <div class="border-t pt-4">
          <p class="text-xs text-gray-500 mb-2">Recommandé:</p>
          <a href="/produits/biscuits-baobab" class="text-sm text-primary-green font-semibold hover:text-primary-green-vibrant hover:underline">
            Goûter biscuits maison
          </a>
        </div>
      </div>
      </ScrollReveal>
      
      <!-- Work Card -->
      <ScrollReveal animation="fade-up" delay={300}>
      <div class="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
        <Briefcase class="w-10 h-10 text-blue-500 mb-6" />
        <h4 class="font-bold text-xl text-neutral-obsidian mb-3">Au Bureau</h4>
        <p class="text-sm text-gray-600 mb-4 leading-relaxed">La pause saine et productive pour maintenir votre concentration toute la journée</p>
        <div class="border-t pt-4">
          <p class="text-xs text-gray-500 mb-2">Recommandé:</p>
          <a href="/produits/biscuits-baobab" class="text-sm text-primary-green font-semibold hover:text-primary-green-vibrant hover:underline">
            Snacks nutritifs
          </a>
        </div>
      </div>
      </ScrollReveal>
    </div>
    
    <!-- CTA -->
    <ScrollReveal animation="fade">
    <div class="text-center mt-12">
      <a 
        href="/produits"
        class="inline-flex items-center gap-3 bg-neutral-obsidian/10 text-neutral-obsidian border-2 border-neutral-obsidian/20 px-6 py-3 rounded-full font-semibold text-base hover:bg-neutral-obsidian hover:text-white hover:border-neutral-obsidian transition-all duration-300"
      >
        <span>Découvrir Nos Produits</span>
        <ArrowRight class="w-5 h-5" />
      </a>
    </div>
    </ScrollReveal>
  </div>
</section>


<!-- Testimonials Section -->
<section class="py-20 bg-neutral-sand">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <ScrollReveal animation="fade-up">
    <div class="text-center mb-16">
      <CmsText key="home.testimonials.overline" tag="p" class="text-sm font-semibold text-primary-green uppercase tracking-wider mb-3">Témoignages</CmsText>
      <CmsText key="home.testimonials.title" tag="h2" class="text-4xl md:text-5xl font-bold text-black mb-4">Ce Que Disent Nos Clients</CmsText>
      <CmsText key="home.testimonials.description" tag="p" class="text-xl text-neutral-charcoal max-w-3xl mx-auto">Des milliers de béninois ont adopté nos produits pour une alimentation saine et savoureuse</CmsText>
    </div>
    </ScrollReveal>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Testimonial 1 -->
      <ScrollReveal animation="fade-up" delay={0}>
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
      </ScrollReveal>
      
      <!-- Testimonial 2 -->
      <ScrollReveal animation="fade-up" delay={150}>
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
      </ScrollReveal>
      
      <!-- Testimonial 3 -->
      <ScrollReveal animation="fade-up" delay={300}>
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
      </ScrollReveal>
    </div>
    
    <!-- Additional testimonials slider indicator -->
    <div class="hidden md:flex justify-center mt-12 space-x-2">
      <div class="w-2 h-2 bg-primary-green rounded-full"></div>
      <div class="w-2 h-2 bg-neutral-light rounded-full"></div>
      <div class="w-2 h-2 bg-neutral-light rounded-full"></div>
    </div>
  </div>
</section>


<!-- Wholesaler Section -->
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <!-- Left Content -->
      <ScrollReveal animation="fade-right">
      <div>
        <CmsText key="home.wholesale.overline" tag="p" class="text-sm font-semibold text-primary-green uppercase tracking-wider mb-3 text-center lg:text-left">Partenariat</CmsText>
        <CmsText key="home.wholesale.title" tag="h2" class="text-4xl md:text-5xl font-bold text-black mb-6 text-center lg:text-left">Devenez Partenaire Distributeur</CmsText>
        <CmsText key="home.wholesale.description" tag="p" class="text-xl text-neutral-charcoal mb-8 text-center lg:text-left">Rejoignez notre réseau de distribution avec des marges attractives jusqu'à 35%.</CmsText>
        
        <!-- Benefits Grid - Simplified -->
        <div class="grid grid-cols-2 gap-4 mb-8">
          <div class="flex items-center gap-3">
            <TrendingUp class="w-6 h-6 text-primary-green" />
            <span class="font-semibold text-neutral-obsidian">Marges 35%</span>
          </div>
          
          <div class="flex items-center gap-3">
            <Package class="w-6 h-6 text-accent-gold" />
            <span class="font-semibold text-neutral-obsidian">Livraison 48h</span>
          </div>
          
          <div class="flex items-center gap-3">
            <Users class="w-6 h-6 text-creative-purple" />
            <span class="font-semibold text-neutral-obsidian">Support Dédié</span>
          </div>
          
          <div class="flex items-center gap-3">
            <Store class="w-6 h-6 text-primary-green" />
            <span class="font-semibold text-neutral-obsidian">Marketing Inclus</span>
          </div>
        </div>
        
        <!-- CTA Button -->
        <a 
          href="/grossistes"
          class="inline-flex items-center gap-3 bg-primary-green text-white px-6 py-3 rounded-full font-semibold text-base hover:bg-primary-green-vibrant hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          <span>Devenir Grossiste</span>
          <ArrowRight class="w-5 h-5" />
        </a>
      </div>
      </ScrollReveal>
      
      <!-- Right Image -->
      <ScrollReveal animation="fade-left" delay={200}>
      <div>
        <CmsImage
          key="home.wholesale.image"
          src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=600&fit=crop"
          alt="Supermarché moderne avec nos produits"
          class="rounded-3xl w-full"
        />
      </div>
      </ScrollReveal>
    </div>
  </div>
</section>

<!-- Community Impact Preview Section - Hidden for now -->
<!-- <section id="impact-section" class="py-20 bg-primary-green text-white relative overflow-hidden">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="text-center">
      <p class="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">Notre Impact</p>
      <h2 class="text-4xl md:text-5xl font-bold mb-6">
        Notre Impact Au-Delà du Produit
      </h2>
      <p class="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
        Chaque achat Angel's Floor contribue directement à l'autonomisation des femmes 
        béninoises et au développement durable de nos communautés rurales.
      </p>
      
      <div class="flex flex-wrap justify-center gap-6 mb-12">
        <div class="bg-white p-3 shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
          <img 
            src="https://images.unsplash.com/photo-1594736797933-d0ed62e8681a?w=250&h=300&fit=crop" 
            alt="Femme productrice" 
            class="w-[250px] h-[300px] object-cover grayscale"
          />
          <p class="text-center mt-3 text-gray-700 text-sm font-handwriting">Marie, Atacora</p>
        </div>
        
        <div class="bg-white p-3 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
          <img 
            src="https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=250&h=300&fit=crop" 
            alt="Femme productrice" 
            class="w-[250px] h-[300px] object-cover grayscale"
          />
          <p class="text-center mt-3 text-gray-700 text-sm font-handwriting">Awa, Natitingou</p>
        </div>
        
        <div class="bg-white p-3 shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-300">
          <img 
            src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=250&h=300&fit=crop" 
            alt="Femme productrice" 
            class="w-[250px] h-[300px] object-cover grayscale"
          />
          <p class="text-center mt-3 text-gray-700 text-sm font-handwriting">Fatou, Djougou</p>
        </div>
        
        <div class="bg-white p-3 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
          <img 
            src="https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=250&h=300&fit=crop" 
            alt="Femme productrice" 
            class="w-[250px] h-[300px] object-cover grayscale"
          />
          <p class="text-center mt-3 text-gray-700 text-sm font-handwriting">Grace, Tanguiéta</p>
        </div>
      </div>
      
      <a 
        href="/impact"
        class="inline-block bg-white text-primary-green px-6 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
      >
        Découvrir Notre Impact Complet
      </a>
    </div>
  </div>
  
  <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 select-none pointer-events-none">
    <span class="text-[200px] md:text-[300px] lg:text-[400px] font-black text-white opacity-10">
      +{Math.floor(impactCounter)}
    </span>
  </div>
</section> -->

<!-- Final CTA -->
<section class="py-20 bg-footer-green relative overflow-hidden">
  <ScrollReveal animation="scale">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <CmsText key="home.cta.title" tag="h2" class="text-4xl md:text-6xl font-bold text-white mb-8">Prêt à Transformer Votre Alimentation ?</CmsText>
    <CmsText key="home.cta.description" tag="p" class="text-xl text-white/90 mb-10 max-w-2xl mx-auto">Rejoignez des milliers de béninois qui ont déjà adopté nos produits naturels pour une alimentation saine et authentique.</CmsText>
    
    <div class="flex flex-col sm:flex-row gap-4 justify-center w-full">
      <a 
        href="/produits"
        class="block sm:inline-block w-full sm:w-auto text-center bg-accent-gold text-footer-green px-6 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
      >
        Commander Maintenant
      </a>
      <a 
        href="/grossistes"
        class="block sm:inline-block w-full sm:w-auto text-center bg-transparent border-2 border-accent-gold text-accent-gold px-6 py-3 rounded-full font-semibold text-base hover:bg-accent-gold/10 transition-all duration-300"
      >
        Devenir Distributeur
      </a>
    </div>
  </div>
  </ScrollReveal>
  
  <!-- Divider at bottom -->
  <div class="absolute bottom-0 left-0 right-0 h-px bg-white/10"></div>
</section>

<style>
  .hero-heading {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
  }
  
  .hero-heading.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .hero-heading :global(.hero-title) {
    opacity: 0;
    animation: smoothFadeIn 0.8s ease-out forwards;
    animation-delay: 0.1s;
  }
  
  @keyframes smoothFadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .hero-desc {
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s;
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