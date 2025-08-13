<script lang="ts">
  import { onMount } from 'svelte';
  import { Award, Heart, Users, Target, Leaf, TrendingUp } from 'lucide-svelte';
  import ScrollReveal from '$lib/components/ui/ScrollReveal.svelte';
  
  let activeTimelineItem = 0;
  let timelineRef: HTMLElement;
  
  const timelineEvents = [
    {
      year: 2015,
      title: "La Naissance d'Angel's Floor",
      description: "Fondation avec 5 femmes productrices dans l'Atacora. Première transformation artisanale de fonio.",
      milestone: "5 femmes productrices"
    },
    {
      year: 2016,
      title: "Premiers Pas",
      description: "Développement des premières recettes et techniques de transformation. Formation des productrices.",
      milestone: "Premières ventes locales"
    },
    {
      year: 2018,
      title: "Expansion du Réseau",
      description: "50 femmes rejoignent le réseau. Lancement de la gamme baobab et premiers partenariats.",
      milestone: "50 femmes productrices"
    },
    {
      year: 2020,
      title: "Innovation & Résilience",
      description: "Certification bio obtenue. Lancement des biscuits enrichis. 200 femmes actives malgré la pandémie.",
      milestone: "Certification Bio"
    },
    {
      year: 2022,
      title: "Croissance Durable",
      description: "Expansion dans 8 régions du Bénin. Partenariats avec des distributeurs nationaux.",
      milestone: "8 régions couvertes"
    },
    {
      year: 2023,
      title: "Reconnaissance Nationale",
      description: "Prix de l'entrepreneuriat féminin béninois. Présence dans 15 points de vente.",
      milestone: "Prix de l'entrepreneuriat"
    },
    {
      year: 2025,
      title: "10 Ans d'Excellence",
      description: "500+ femmes impactées, gamme complète de produits, lancement de nouvelles innovations.",
      milestone: "500+ femmes autonomisées"
    }
  ];
  
  onMount(() => {
    const handleScroll = () => {
      if (!timelineRef) return;
      
      const items = timelineRef.querySelectorAll('.timeline-item');
      const scrollPosition = window.scrollY + window.innerHeight * 0.7;
      
      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const itemTop = rect.top + window.scrollY;
        
        if (scrollPosition > itemTop) {
          activeTimelineItem = index;
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<svelte:head>
  <title>À Propos - Angel's Floor</title>
  <meta name="description" content="Découvrez l'histoire d'Angel's Floor, 10 ans d'excellence dans la transformation des produits béninois et l'autonomisation des femmes." />
</svelte:head>

<!-- Hero Section -->
<section class="relative bg-primary-green py-16 lg:py-24 overflow-hidden">
  <div class="absolute inset-0">
    <div class="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
  </div>
  
  <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <ScrollReveal animation="fade-down">
      <h1 class="text-5xl md:text-6xl lg:text-6xl font-bold text-white mb-6 leading-tight">Notre Histoire</h1>
      <p class="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
        10 ans de passion, d'innovation et d'impact social au service des saveurs béninoises
      </p>
    </ScrollReveal>
  </div>
</section>

<!-- Interactive Timeline Section -->
<section class="py-20 bg-neutral-sand" bind:this={timelineRef}>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <ScrollReveal animation="fade-up">
      <div class="text-center mb-12">
        <p class="text-sm font-semibold text-primary-green uppercase tracking-wider mb-3">Notre Parcours</p>
        <h2 class="text-4xl md:text-5xl font-bold text-black mb-4">
          Une Décennie de Transformation
        </h2>
        <p class="text-xl text-neutral-charcoal max-w-3xl mx-auto">
          De 5 femmes pionnières à plus de 500 productrices autonomisées
        </p>
      </div>
    </ScrollReveal>
    
    <!-- Timeline Container -->
    <div class="relative">
      <!-- Timeline Vertical Line - Desktop only with gradient -->
      <div class="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary-green/5 via-primary-green/20 to-primary-green/5"></div>
      
      <!-- Timeline Events -->
      <div class="space-y-12 md:space-y-16">
        {#each timelineEvents as event, index}
          <!-- Mobile Layout -->
          <div class="timeline-item md:hidden">
            {#if index === timelineEvents.length - 1}
              <!-- Last Item Mobile - Special -->
              <div class="flex flex-col items-center">
                <div class="w-16 h-16 bg-white border-4 border-primary-green rounded-full flex items-center justify-center text-primary-green font-bold shadow-lg mb-4 {activeTimelineItem >= index ? 'scale-100' : 'scale-75'} transition-transform duration-500">
                  <span class="text-2xl">⭐</span>
                </div>
                <div class="w-full bg-primary-green text-white rounded-3xl p-6 shadow-2xl {activeTimelineItem >= index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700">
                  <h3 class="text-xl font-bold text-white mb-2 text-center">{event.title}</h3>
                  <p class="text-white/90 mb-3 text-sm text-center">{event.description}</p>
                  <div class="flex justify-center">
                    <div class="inline-flex items-center bg-white/20 rounded-full px-4 py-2 text-xs font-semibold text-white">
                      <Award class="w-3 h-3 mr-1.5" />
                      {event.milestone}
                    </div>
                  </div>
                </div>
              </div>
            {:else}
              <div class="flex items-start gap-4">
                <!-- Mobile Timeline Dot -->
                <div class="flex-shrink-0 relative">
                  <div class="w-14 h-14 bg-white border-4 border-primary-green rounded-full flex items-center justify-center text-primary-green font-bold shadow-lg {activeTimelineItem >= index ? 'scale-100' : 'scale-75'} transition-transform duration-500">
                    {event.year}
                  </div>
                  <!-- Vertical Line for Mobile with gradient -->
                  {#if index < timelineEvents.length - 1}
                    <div class="absolute top-14 left-1/2 transform -translate-x-1/2 w-1 h-20 bg-gradient-to-b from-primary-green/20 to-primary-green/5"></div>
                  {/if}
                </div>
                
                <!-- Mobile Content -->
                <div class="flex-1 pb-8">
                  <div class="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl {activeTimelineItem >= index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700">
                    <h3 class="text-xl font-bold text-black mb-2">{event.title}</h3>
                    <p class="text-neutral-charcoal mb-3 text-sm">{event.description}</p>
                    <div class="inline-flex items-center bg-neutral-sand rounded-full px-3 py-1.5 text-xs font-semibold text-primary-green">
                      <Award class="w-3 h-3 mr-1.5" />
                      {event.milestone}
                    </div>
                  </div>
                </div>
              </div>
            {/if}
          </div>
          
          <!-- Desktop Layout -->
          <div class="timeline-item hidden md:block relative">
            <div class="flex items-center">
              {#if index === timelineEvents.length - 1}
                <!-- Last Item - Centered with proper spacing -->
                <div class="w-full flex justify-center relative">
                  <div class="max-w-lg bg-primary-green text-white rounded-3xl p-10 shadow-2xl hover:shadow-3xl {activeTimelineItem >= index ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} transition-all duration-700 mt-8">
                    <h3 class="text-3xl font-bold text-white mb-4 text-center">{event.title}</h3>
                    <p class="text-white/90 mb-6 text-center text-lg">{event.description}</p>
                    <div class="flex justify-center">
                      <div class="inline-flex items-center bg-white/20 rounded-full px-6 py-3 text-sm font-semibold text-white">
                        <Award class="w-5 h-5 mr-2" />
                        {event.milestone}
                      </div>
                    </div>
                  </div>
                </div>
              {:else if index % 2 === 0}
                <!-- Left Side Content -->
                <div class="w-1/2 pr-12 flex justify-end">
                  <div class="max-w-md w-full bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl {activeTimelineItem >= index ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'} transition-all duration-700">
                    <h3 class="text-2xl font-bold text-black mb-3">{event.title}</h3>
                    <p class="text-neutral-charcoal mb-4">{event.description}</p>
                    <div class="inline-flex items-center bg-neutral-sand rounded-full px-4 py-2 text-sm font-semibold text-primary-green">
                      <Award class="w-4 h-4 mr-2" />
                      {event.milestone}
                    </div>
                  </div>
                </div>
                
                <!-- Right Side Empty -->
                <div class="w-1/2 pl-12"></div>
              {:else}
                <!-- Left Side Empty -->
                <div class="w-1/2 pr-12"></div>
                
                <!-- Right Side Content -->
                <div class="w-1/2 pl-12">
                  <div class="max-w-md w-full bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl {activeTimelineItem >= index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'} transition-all duration-700">
                    <h3 class="text-2xl font-bold text-black mb-3">{event.title}</h3>
                    <p class="text-neutral-charcoal mb-4">{event.description}</p>
                    <div class="inline-flex items-center bg-neutral-sand rounded-full px-4 py-2 text-sm font-semibold text-primary-green">
                      <Award class="w-4 h-4 mr-2" />
                      {event.milestone}
                    </div>
                  </div>
                </div>
              {/if}
              
              <!-- Center Timeline Dot - Absolute positioned -->
              <div class="absolute left-1/2 transform -translate-x-1/2 {index === timelineEvents.length - 1 ? '-top-4' : 'top-0'} z-20">
                <div class="relative">
                  <!-- Pulse animation for active items -->
                  {#if activeTimelineItem >= index}
                    <div class="absolute inset-0 {index === timelineEvents.length - 1 ? 'w-20 h-20' : 'w-16 h-16'} bg-primary-green rounded-full animate-ping opacity-20"></div>
                  {/if}
                  <div class="relative {index === timelineEvents.length - 1 ? 'w-20 h-20' : 'w-16 h-16'} bg-white border-4 border-primary-green rounded-full flex items-center justify-center text-primary-green font-bold shadow-lg ring-4 ring-neutral-sand {activeTimelineItem >= index ? 'scale-100' : 'scale-75'} transition-transform duration-500">
                    {#if index === timelineEvents.length - 1}
                      <span class="text-3xl">⭐</span>
                    {:else}
                      {event.year}
                    {/if}
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<!-- Mission & Values Section -->
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <ScrollReveal animation="fade-up">
      <div class="text-center mb-12">
        <p class="text-sm font-semibold text-primary-green uppercase tracking-wider mb-3">Ce Qui Nous Guide</p>
        <h2 class="text-4xl md:text-5xl font-bold text-black mb-4">
          Notre Mission & Valeurs
        </h2>
        <p class="text-xl text-neutral-charcoal max-w-3xl mx-auto">
          Transformer les produits locaux en opportunités durables pour nos communautés
        </p>
      </div>
    </ScrollReveal>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Mission -->
      <ScrollReveal animation="fade-up" delay={0}>
      <div class="bg-primary-green rounded-3xl p-8 text-white">
        <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
          <Target class="w-8 h-8" />
        </div>
        <h3 class="text-2xl font-bold mb-4">Notre Mission</h3>
        <p class="text-white/90">
          Valoriser les produits agricoles béninois en créant des opportunités économiques durables 
          pour les femmes rurales tout en offrant des aliments sains et authentiques.
        </p>
      </div>
      </ScrollReveal>
      
      <!-- Values 1 -->
      <ScrollReveal animation="fade-up" delay={100}>
      <div class="bg-white border-2 border-primary-green/20 rounded-3xl p-8">
        <div class="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center mb-6">
          <Heart class="w-8 h-8 text-white" />
        </div>
        <h3 class="text-2xl font-bold text-primary-green mb-4">Authenticité</h3>
        <ul class="space-y-3 text-neutral-charcoal">
          <li class="flex items-start">
            <span class="text-primary-green mr-2">•</span>
            Produits 100% naturels et locaux
          </li>
          <li class="flex items-start">
            <span class="text-primary-green mr-2">•</span>
            Méthodes traditionnelles préservées
          </li>
          <li class="flex items-start">
            <span class="text-primary-green mr-2">•</span>
            Transparence totale sur nos processus
          </li>
        </ul>
      </div>
      </ScrollReveal>
      
      <!-- Values 2 -->
      <ScrollReveal animation="fade-up" delay={200}>
      <div class="bg-white border-2 border-primary-green/20 rounded-3xl p-8">
        <div class="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center mb-6">
          <Users class="w-8 h-8 text-white" />
        </div>
        <h3 class="text-2xl font-bold text-primary-green mb-4">Impact Social</h3>
        <ul class="space-y-3 text-neutral-charcoal">
          <li class="flex items-start">
            <span class="text-primary-green mr-2">•</span>
            Autonomisation des femmes rurales
          </li>
          <li class="flex items-start">
            <span class="text-primary-green mr-2">•</span>
            Commerce équitable et solidaire
          </li>
          <li class="flex items-start">
            <span class="text-primary-green mr-2">•</span>
            Développement communautaire durable
          </li>
        </ul>
      </div>
      </ScrollReveal>
    </div>
    
    <!-- Additional Values -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      <ScrollReveal animation="fade-right">
      <div class="bg-primary-green rounded-3xl p-8 text-white">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
            <Leaf class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold">Durabilité Environnementale</h3>
        </div>
        <p class="text-white/90">
          Agriculture biologique, emballages éco-responsables, et pratiques de production 
          respectueuses de l'environnement.
        </p>
      </div>
      </ScrollReveal>
      
      <ScrollReveal animation="fade-left">
      <div class="bg-primary-green rounded-3xl p-8 text-white">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
            <TrendingUp class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold">Innovation Continue</h3>
        </div>
        <p class="text-white/90">
          Recherche constante de nouvelles recettes, amélioration des processus, et adaptation 
          aux besoins changeants du marché.
        </p>
      </div>
      </ScrollReveal>
    </div>
  </div>
</section>

<!-- Team Section -->
<section class="py-20 bg-neutral-sand">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <ScrollReveal animation="fade-up">
      <div class="text-center mb-12">
        <p class="text-sm font-semibold text-primary-green uppercase tracking-wider mb-3">Les Visages d'Angel's Floor</p>
        <h2 class="text-4xl md:text-5xl font-bold text-black mb-4">
          Notre Équipe
        </h2>
        <p class="text-xl text-neutral-charcoal max-w-3xl mx-auto">
          Des femmes passionnées qui transforment les traditions en innovations
        </p>
      </div>
    </ScrollReveal>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Team Member 1 -->
      <div class="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300">
        <div class="h-64 relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&q=80" 
            alt="Angélique Foundatrice"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-primary-green mb-1">Angélique Foundatrice</h3>
          <p class="text-primary-green font-semibold mb-3">Fondatrice & Directrice</p>
          <p class="text-neutral-charcoal text-sm">
            Visionnaire passionnée, elle a créé Angel's Floor pour transformer la vie des femmes 
            de sa communauté à travers la valorisation des produits locaux.
          </p>
        </div>
      </div>
      
      <!-- Team Member 2 -->
      <div class="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300">
        <div class="h-64 relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=400&fit=crop&q=80" 
            alt="Rose Kpohinto"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-primary-green mb-1">Rose Kpohinto</h3>
          <p class="text-primary-green font-semibold mb-3">Responsable Production</p>
          <p class="text-neutral-charcoal text-sm">
            Experte en transformation alimentaire, elle garantit la qualité exceptionnelle 
            de chaque produit Angel's Floor.
          </p>
        </div>
      </div>
      
      <!-- Team Member 3 -->
      <div class="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300">
        <div class="h-64 relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&q=80" 
            alt="Mariam Alidou"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-primary-green mb-1">Mariam Alidou</h3>
          <p class="text-primary-green font-semibold mb-3">Coordinatrice Réseau</p>
          <p class="text-neutral-charcoal text-sm">
            Elle coordonne le réseau de plus de 500 productrices et assure la formation 
            continue des membres.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Certifications & Partners Section -->
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <p class="text-sm font-semibold text-primary-green uppercase tracking-wider mb-3">Reconnaissance & Collaboration</p>
      <h2 class="text-4xl md:text-5xl font-bold text-black mb-4">
        Certifications & Partenaires
      </h2>
      <p class="text-xl text-neutral-charcoal max-w-3xl mx-auto">
        Des garanties de qualité et des collaborations qui renforcent notre impact
      </p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
      <!-- Certifications -->
      <div>
        <h3 class="text-2xl font-bold text-primary-green mb-6">Nos Certifications</h3>
        <div class="space-y-4">
          <div class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 flex items-center hover:shadow-lg transition-all duration-300">
            <div class="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <span class="text-white text-2xl">🌿</span>
            </div>
            <div>
              <h4 class="font-semibold text-neutral-obsidian">Certification Bio</h4>
              <p class="text-sm text-neutral-slate">Produits 100% biologiques certifiés</p>
            </div>
          </div>
          
          <div class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 flex items-center hover:shadow-lg transition-all duration-300">
            <div class="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <span class="text-white text-2xl">✓</span>
            </div>
            <div>
              <h4 class="font-semibold text-neutral-obsidian">Normes HACCP</h4>
              <p class="text-sm text-neutral-slate">Sécurité alimentaire garantie</p>
            </div>
          </div>
          
          <div class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 flex items-center hover:shadow-lg transition-all duration-300">
            <div class="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <span class="text-white text-2xl">🤝</span>
            </div>
            <div>
              <h4 class="font-semibold text-neutral-obsidian">Commerce Équitable</h4>
              <p class="text-sm text-neutral-slate">Pratiques commerciales éthiques</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Partners -->
      <div>
        <h3 class="text-2xl font-bold text-primary-green mb-6">Partenaires Clés</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 flex items-center justify-center h-24 hover:shadow-lg transition-all duration-300">
            <span class="text-primary-green font-bold">MASM</span>
          </div>
          <div class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 flex items-center justify-center h-24 hover:shadow-lg transition-all duration-300">
            <span class="text-primary-green font-bold">TACA</span>
          </div>
          <div class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 flex items-center justify-center h-24 hover:shadow-lg transition-all duration-300">
            <span class="text-primary-green font-bold">ONG Locale</span>
          </div>
          <div class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 flex items-center justify-center h-24 hover:shadow-lg transition-all duration-300">
            <span class="text-primary-green font-bold">Distributeurs</span>
          </div>
        </div>
        
        <div class="mt-6 p-6 bg-primary-green rounded-3xl text-white">
          <h4 class="font-semibold mb-2">Devenir Partenaire</h4>
          <p class="text-sm text-white/90 mb-4">
            Rejoignez notre réseau de partenaires engagés pour un impact durable.
          </p>
          <a 
            href="/contact"
            class="inline-block bg-white text-primary-green px-6 py-2 rounded-full font-semibold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            Nous contacter
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Call to Action -->
<section class="py-20 bg-primary-green relative overflow-hidden">
  <div class="absolute inset-0">
    <div class="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
  </div>
  
  <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
      Faites Partie de Notre Histoire
    </h2>
    <p class="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
      Découvrez comment nos produits peuvent transformer votre alimentation 
      tout en soutenant l'autonomisation des femmes béninoises.
    </p>
    
    <div class="flex flex-col sm:flex-row gap-4 justify-center w-full">
      <a 
        href="/produits"
        class="block sm:inline-block w-full sm:w-auto text-center bg-white text-primary-green px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
      >
        Découvrir Nos Produits
      </a>
      <a 
        href="/contact"
        class="block sm:inline-block w-full sm:w-auto text-center bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white/10 transition-all duration-300"
      >
        Nous Contacter
      </a>
    </div>
  </div>
</section>