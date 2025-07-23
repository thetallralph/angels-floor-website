<script lang="ts">
  import { onMount } from 'svelte';
  import { Award, Heart, Users, Target, Leaf, TrendingUp } from 'lucide-svelte';
  
  let activeTimelineItem = 0;
  let timelineRef: HTMLElement;
  
  const timelineEvents = [
    {
      year: 2015,
      title: "La Naissance d'Angel's Floor",
      description: "Fondation avec 5 femmes productrices dans l'Atacora. Première transformation artisanale de fonio.",
      milestone: "5 femmes productrices",
      color: "bg-primary-green"
    },
    {
      year: 2016,
      title: "Premiers Pas",
      description: "Développement des premières recettes et techniques de transformation. Formation des productrices.",
      milestone: "Premières ventes locales",
      color: "bg-primary-green-bright"
    },
    {
      year: 2018,
      title: "Expansion du Réseau",
      description: "50 femmes rejoignent le réseau. Lancement de la gamme baobab et premiers partenariats.",
      milestone: "50 femmes productrices",
      color: "bg-accent-sunset"
    },
    {
      year: 2020,
      title: "Innovation & Résilience",
      description: "Certification bio obtenue. Lancement des biscuits enrichis. 200 femmes actives malgré la pandémie.",
      milestone: "Certification Bio",
      color: "bg-creative-purple"
    },
    {
      year: 2022,
      title: "Croissance Durable",
      description: "Expansion dans 8 régions du Bénin. Partenariats avec des distributeurs nationaux.",
      milestone: "8 régions couvertes",
      color: "bg-primary-green-vibrant"
    },
    {
      year: 2023,
      title: "Reconnaissance Nationale",
      description: "Prix de l'entrepreneuriat féminin béninois. Présence dans 15 points de vente.",
      milestone: "Prix de l'entrepreneuriat",
      color: "bg-accent-gold"
    },
    {
      year: 2025,
      title: "10 Ans d'Excellence",
      description: "500+ femmes impactées, gamme complète de produits, lancement de nouvelles innovations.",
      milestone: "500+ femmes autonomisées",
      color: "bg-primary-green"
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
<section class="relative bg-gradient-to-br from-primary-green via-primary-green-vibrant to-accent-gold py-20 overflow-hidden">
  <div class="absolute inset-0">
    <div class="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-accent-gold/20 rounded-full blur-3xl"></div>
  </div>
  
  <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
    <h1 class="text-5xl md:text-7xl font-bold mb-6">Notre Histoire</h1>
    <p class="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
      10 ans de passion, d'innovation et d'impact social au service des saveurs béninoises
    </p>
  </div>
</section>

<!-- Interactive Timeline Section -->
<section class="py-20 bg-neutral-sand" bind:this={timelineRef}>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-bold text-primary-green mb-4">
        Une Décennie de Transformation
      </h2>
      <p class="text-xl text-neutral-charcoal max-w-3xl mx-auto">
        De 5 femmes pionnières à plus de 500 productrices autonomisées
      </p>
    </div>
    
    <!-- Timeline -->
    <div class="relative">
      <!-- Timeline Line -->
      <div class="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full bg-neutral-light"></div>
      
      <!-- Timeline Events -->
      <div class="space-y-16">
        {#each timelineEvents as event, index}
          <div class="timeline-item relative flex items-center {index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}">
            <!-- Mobile Layout -->
            <div class="md:hidden flex items-start space-x-6 w-full">
              <!-- Timeline Dot -->
              <div class="relative z-10">
                <div class="w-16 h-16 {event.color} rounded-full flex items-center justify-center text-white font-bold shadow-lg {activeTimelineItem >= index ? 'scale-100' : 'scale-75'} transition-transform duration-500">
                  {event.year}
                </div>
              </div>
              
              <!-- Content -->
              <div class="flex-1">
                <div class="bg-white rounded-2xl p-6 shadow-lg {activeTimelineItem >= index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700">
                  <h3 class="text-xl font-bold text-primary-green mb-2">{event.title}</h3>
                  <p class="text-neutral-charcoal mb-3">{event.description}</p>
                  <div class="inline-flex items-center bg-neutral-sand rounded-full px-4 py-2 text-sm font-semibold text-primary-green">
                    <Award class="w-4 h-4 mr-2" />
                    {event.milestone}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Desktop Layout -->
            <div class="hidden md:flex items-center w-full">
              {#if index % 2 === 0}
                <!-- Left Side Content -->
                <div class="w-5/12 pr-8 text-right">
                  <div class="bg-white rounded-2xl p-8 shadow-lg {activeTimelineItem >= index ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'} transition-all duration-700">
                    <h3 class="text-2xl font-bold text-primary-green mb-3">{event.title}</h3>
                    <p class="text-neutral-charcoal mb-4">{event.description}</p>
                    <div class="inline-flex items-center bg-neutral-sand rounded-full px-4 py-2 text-sm font-semibold text-primary-green">
                      <Award class="w-4 h-4 mr-2" />
                      {event.milestone}
                    </div>
                  </div>
                </div>
                
                <!-- Timeline Dot -->
                <div class="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div class="w-16 h-16 {event.color} rounded-full flex items-center justify-center text-white font-bold shadow-lg {activeTimelineItem >= index ? 'scale-100' : 'scale-75'} transition-transform duration-500">
                    {event.year}
                  </div>
                </div>
                
                <!-- Right Side Spacer -->
                <div class="w-5/12"></div>
              {:else}
                <!-- Left Side Spacer -->
                <div class="w-5/12"></div>
                
                <!-- Timeline Dot -->
                <div class="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div class="w-16 h-16 {event.color} rounded-full flex items-center justify-center text-white font-bold shadow-lg {activeTimelineItem >= index ? 'scale-100' : 'scale-75'} transition-transform duration-500">
                    {event.year}
                  </div>
                </div>
                
                <!-- Right Side Content -->
                <div class="w-5/12 pl-8">
                  <div class="bg-white rounded-2xl p-8 shadow-lg {activeTimelineItem >= index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'} transition-all duration-700">
                    <h3 class="text-2xl font-bold text-primary-green mb-3">{event.title}</h3>
                    <p class="text-neutral-charcoal mb-4">{event.description}</p>
                    <div class="inline-flex items-center bg-neutral-sand rounded-full px-4 py-2 text-sm font-semibold text-primary-green">
                      <Award class="w-4 h-4 mr-2" />
                      {event.milestone}
                    </div>
                  </div>
                </div>
              {/if}
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
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-bold text-primary-green mb-4">
        Notre Mission & Valeurs
      </h2>
      <p class="text-xl text-neutral-charcoal max-w-3xl mx-auto">
        Transformer les produits locaux en opportunités durables pour nos communautés
      </p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Mission -->
      <div class="bg-gradient-to-br from-primary-green to-primary-green-vibrant rounded-3xl p-8 text-white">
        <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
          <Target class="w-8 h-8" />
        </div>
        <h3 class="text-2xl font-bold mb-4">Notre Mission</h3>
        <p class="text-white/90">
          Valoriser les produits agricoles béninois en créant des opportunités économiques durables 
          pour les femmes rurales tout en offrant des aliments sains et authentiques.
        </p>
      </div>
      
      <!-- Values 1 -->
      <div class="bg-neutral-sand rounded-3xl p-8">
        <div class="w-16 h-16 bg-accent-sunset rounded-full flex items-center justify-center mb-6">
          <Heart class="w-8 h-8 text-white" />
        </div>
        <h3 class="text-2xl font-bold text-primary-green mb-4">Authenticité</h3>
        <ul class="space-y-3 text-neutral-charcoal">
          <li class="flex items-start">
            <span class="text-accent-sunset mr-2">•</span>
            Produits 100% naturels et locaux
          </li>
          <li class="flex items-start">
            <span class="text-accent-sunset mr-2">•</span>
            Méthodes traditionnelles préservées
          </li>
          <li class="flex items-start">
            <span class="text-accent-sunset mr-2">•</span>
            Transparence totale sur nos processus
          </li>
        </ul>
      </div>
      
      <!-- Values 2 -->
      <div class="bg-neutral-sand rounded-3xl p-8">
        <div class="w-16 h-16 bg-creative-purple rounded-full flex items-center justify-center mb-6">
          <Users class="w-8 h-8 text-white" />
        </div>
        <h3 class="text-2xl font-bold text-primary-green mb-4">Impact Social</h3>
        <ul class="space-y-3 text-neutral-charcoal">
          <li class="flex items-start">
            <span class="text-creative-purple mr-2">•</span>
            Autonomisation des femmes rurales
          </li>
          <li class="flex items-start">
            <span class="text-creative-purple mr-2">•</span>
            Commerce équitable et solidaire
          </li>
          <li class="flex items-start">
            <span class="text-creative-purple mr-2">•</span>
            Développement communautaire durable
          </li>
        </ul>
      </div>
    </div>
    
    <!-- Additional Values -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      <div class="bg-gradient-to-r from-accent-gold to-accent-sunset rounded-3xl p-8 text-white">
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
      
      <div class="bg-gradient-to-r from-primary-green-bright to-primary-green-vibrant rounded-3xl p-8 text-white">
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
    </div>
  </div>
</section>

<!-- Team Section -->
<section class="py-20 bg-neutral-sand">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-bold text-primary-green mb-4">
        Notre Équipe
      </h2>
      <p class="text-xl text-neutral-charcoal max-w-3xl mx-auto">
        Des femmes passionnées qui transforment les traditions en innovations
      </p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Team Member 1 -->
      <div class="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div class="h-64 bg-gradient-to-br from-primary-green to-primary-green-vibrant flex items-center justify-center">
          <div class="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
            <span class="text-5xl text-white font-bold">AF</span>
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-primary-green mb-1">Angélique Foundatrice</h3>
          <p class="text-accent-sunset font-semibold mb-3">Fondatrice & Directrice</p>
          <p class="text-neutral-charcoal text-sm">
            Visionnaire passionnée, elle a créé Angel's Floor pour transformer la vie des femmes 
            de sa communauté à travers la valorisation des produits locaux.
          </p>
        </div>
      </div>
      
      <!-- Team Member 2 -->
      <div class="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div class="h-64 bg-gradient-to-br from-accent-sunset to-accent-gold flex items-center justify-center">
          <div class="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
            <span class="text-5xl text-white font-bold">RK</span>
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-primary-green mb-1">Rose Kpohinto</h3>
          <p class="text-accent-sunset font-semibold mb-3">Responsable Production</p>
          <p class="text-neutral-charcoal text-sm">
            Experte en transformation alimentaire, elle garantit la qualité exceptionnelle 
            de chaque produit Angel's Floor.
          </p>
        </div>
      </div>
      
      <!-- Team Member 3 -->
      <div class="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div class="h-64 bg-gradient-to-br from-creative-purple to-primary-green-vibrant flex items-center justify-center">
          <div class="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
            <span class="text-5xl text-white font-bold">MA</span>
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-primary-green mb-1">Mariam Alidou</h3>
          <p class="text-accent-sunset font-semibold mb-3">Coordinatrice Réseau</p>
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
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-bold text-primary-green mb-4">
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
          <div class="bg-neutral-sand rounded-2xl p-6 flex items-center">
            <div class="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <span class="text-white text-2xl">🌿</span>
            </div>
            <div>
              <h4 class="font-semibold text-neutral-obsidian">Certification Bio</h4>
              <p class="text-sm text-neutral-slate">Produits 100% biologiques certifiés</p>
            </div>
          </div>
          
          <div class="bg-neutral-sand rounded-2xl p-6 flex items-center">
            <div class="w-16 h-16 bg-accent-sunset rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <span class="text-white text-2xl">✓</span>
            </div>
            <div>
              <h4 class="font-semibold text-neutral-obsidian">Normes HACCP</h4>
              <p class="text-sm text-neutral-slate">Sécurité alimentaire garantie</p>
            </div>
          </div>
          
          <div class="bg-neutral-sand rounded-2xl p-6 flex items-center">
            <div class="w-16 h-16 bg-creative-purple rounded-full flex items-center justify-center mr-4 flex-shrink-0">
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
          <div class="bg-neutral-sand rounded-2xl p-6 flex items-center justify-center h-24">
            <span class="text-primary-green font-bold">MASM</span>
          </div>
          <div class="bg-neutral-sand rounded-2xl p-6 flex items-center justify-center h-24">
            <span class="text-primary-green font-bold">TACA</span>
          </div>
          <div class="bg-neutral-sand rounded-2xl p-6 flex items-center justify-center h-24">
            <span class="text-primary-green font-bold">ONG Locale</span>
          </div>
          <div class="bg-neutral-sand rounded-2xl p-6 flex items-center justify-center h-24">
            <span class="text-primary-green font-bold">Distributeurs</span>
          </div>
        </div>
        
        <div class="mt-6 p-6 bg-gradient-to-r from-primary-green to-primary-green-vibrant rounded-2xl text-white">
          <h4 class="font-semibold mb-2">Devenir Partenaire</h4>
          <p class="text-sm text-white/90 mb-4">
            Rejoignez notre réseau de partenaires engagés pour un impact durable.
          </p>
          <button 
            on:click={() => window.location.href='/contact'}
            class="bg-white text-primary-green px-6 py-2 rounded-full font-semibold text-sm hover:scale-105 transition-transform"
          >
            Nous contacter
          </button>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Call to Action -->
<section class="py-20 bg-gradient-to-br from-primary-green via-primary-green-vibrant to-accent-gold relative overflow-hidden">
  <div class="absolute inset-0">
    <div class="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-accent-gold/20 rounded-full blur-3xl"></div>
  </div>
  
  <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
    <h2 class="text-4xl md:text-5xl font-bold mb-6">
      Faites Partie de Notre Histoire
    </h2>
    <p class="text-xl text-white/90 mb-10">
      Découvrez comment nos produits peuvent transformer votre alimentation 
      tout en soutenant l'autonomisation des femmes béninoises.
    </p>
    
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button 
        on:click={() => window.location.href='/produits'}
        class="bg-white text-primary-green px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
      >
        Découvrir Nos Produits
      </button>
      <button 
        on:click={() => window.location.href='/impact'}
        class="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary-green transition-all duration-300"
      >
        Voir Notre Impact
      </button>
    </div>
  </div>
</section>