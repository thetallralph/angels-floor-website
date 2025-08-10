<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    TrendingUp, Package, Users, Truck, Shield,
    Handshake, ArrowRight,
    Mail, Star
  } from 'lucide-svelte';
  
  let heroVisible = false;
  
  const benefits = [
    {
      icon: TrendingUp,
      title: "MARGES",
      percentage: "35%",
      subtitle: "de rentabilité"
    },
    {
      icon: Truck,
      title: "LIVRAISON",
      percentage: "48H",
      subtitle: "partout au Bénin"
    },
    {
      icon: Shield,
      title: "QUALITÉ",
      percentage: "100%",
      subtitle: "certifié bio"
    },
    {
      icon: Users,
      title: "SUPPORT",
      percentage: "24/7",
      subtitle: "équipe dédiée"
    }
  ];
  
  const partnershipSteps = [
    { 
      step: 1, 
      title: "Candidature", 
      description: "Contactez notre équipe commerciale et présentez votre entreprise. Nous étudions votre dossier sous 48h.", 
      icon: Mail
    },
    { 
      step: 2, 
      title: "Validation", 
      description: "Rencontre avec notre équipe, visite de vos installations et signature du contrat de partenariat.", 
      icon: Handshake
    },
    { 
      step: 3, 
      title: "Lancement", 
      description: "Formation sur nos produits, première commande et début de notre collaboration commerciale.", 
      icon: Package
    }
  ];
  
  onMount(() => {
    heroVisible = true;
  });
</script>

<svelte:head>
  <title>Devenir Grossiste | Angel's Floor - Partenariat Distribution</title>
  <meta name="description" content="Rejoignez notre réseau de distributeurs Angel's Floor. Marges attractives jusqu'à 35%, livraison 48h, support commercial dédié. Devenez partenaire grossiste." />
</svelte:head>

<!-- Hero Section with Image Background -->
<section class="relative overflow-hidden bg-white">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-8 items-center py-16 lg:py-20">
      <!-- Text Content -->
      <div class="relative z-10 text-center lg:text-left {heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} transition-all duration-700">
        <h1 class="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight text-center lg:text-left">
          Développez Votre Business avec Angel's Floor
        </h1>
        <p class="text-lg md:text-xl text-neutral-charcoal mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
          Rejoignez un réseau de plus de 50 distributeurs à travers le Bénin et bénéficiez 
          de marges exceptionnelles sur des produits bio en forte demande.
        </p>
        
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full lg:w-auto">
          <a 
            href="/contact"
            class="inline-flex items-center justify-center gap-3 bg-primary-green text-white px-6 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto"
          >
            <span>Devenir Partenaire</span>
            <ArrowRight class="w-5 h-5" />
          </a>
          <a 
            href="#avantages"
            class="inline-flex items-center justify-center gap-3 bg-transparent border-2 border-primary-green text-primary-green px-6 py-3 rounded-full font-semibold text-base hover:bg-primary-green/10 transition-all duration-300 w-full sm:w-auto"
          >
            <span>Découvrir les Avantages</span>
          </a>
        </div>
      </div>
      
      <!-- Hero Image -->
      <div class="relative h-[400px] lg:h-[600px] {heroVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} transition-all duration-700 delay-300">
        <img 
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop"
          alt="Partenariat commercial Angel's Floor"
          class="w-full h-full object-cover rounded-3xl shadow-2xl"
        />

      </div>
    </div>
  </div>
</section>

<!-- Benefits Section - Light & Bold -->
<section id="avantages" class="py-20 bg-primary-green/10">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h2 class="text-4xl md:text-5xl font-bold text-black mb-4">
        Pourquoi Nous Choisir?
      </h2>
      <p class="text-xl text-neutral-charcoal max-w-3xl mx-auto">
        Rejoignez un réseau de distribution performant avec des marges attractives, une logistique optimisée, 
        des produits certifiés de qualité supérieure et un accompagnement commercial personnalisé pour maximiser votre succès
      </p>
    </div>
    
    <!-- Benefits Grid - Bold Numbers -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
      {#each benefits as benefit}
        <div class="text-center group">
          <!-- Icon -->
          <div class="mb-4">
            <svelte:component this={benefit.icon} class="w-12 h-12 text-primary-green mx-auto" />
          </div>
          
          <!-- Big Number -->
          <div class="text-6xl md:text-7xl font-bold text-primary-green mb-2 group-hover:scale-110 transition-transform">
            {benefit.percentage}
          </div>
          
          <!-- Title -->
          <div class="text-black font-bold text-sm tracking-wider mb-1">
            {benefit.title}
          </div>
          
          <!-- Subtitle -->
          <div class="text-neutral-charcoal text-sm">
            {benefit.subtitle}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>



<!-- Single Large Testimonial -->
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <p class="text-sm font-semibold text-primary-green uppercase tracking-wider mb-3">Témoignage</p>
      <h2 class="text-4xl md:text-5xl font-bold text-black mb-4">
        La Parole à Nos Partenaires
      </h2>
    </div>
    
    <!-- Large Testimonial Card -->
    <div class="max-w-4xl mx-auto">
      <div class="bg-neutral-sand rounded-3xl p-8 md:p-12 relative">
        <!-- Quote Icon -->
        <div class="absolute top-8 left-8 md:top-12 md:left-12">
          <div class="w-16 h-16 bg-primary-green/10 rounded-full flex items-center justify-center">
            <span class="text-4xl text-primary-green">"</span>
          </div>
        </div>
        
        <!-- Testimonial Content -->
        <div class="mt-8">
          <!-- Stars -->
          <div class="flex gap-1 justify-center mb-8">
            {#each [1, 2, 3, 4, 5] as _}
              <Star class="w-7 h-7 fill-accent-gold text-accent-gold" />
            {/each}
          </div>
          
          <!-- Quote Text -->
          <p class="text-xl md:text-2xl text-neutral-charcoal leading-relaxed text-center mb-10 max-w-3xl mx-auto">
            « Partenaire depuis 3 ans, Angel's Floor nous garantit des produits de qualité constante 
            et des livraisons toujours à temps. Leur accompagnement commercial est exceptionnel et 
            nos clients adorent la qualité de leurs produits bio. C'est un partenariat gagnant-gagnant 
            qui nous permet de nous différencier sur le marché. »
          </p>
          
          <!-- Author Info -->
          <div class="text-center">
            
            <!-- Author Details -->
            <p class="text-xl font-bold text-neutral-obsidian">Jean-Baptiste Soglo</p>
            <p class="text-neutral-slate">Directeur, Supermarché Champion</p>
            <p class="text-sm text-neutral-slate">Cotonou</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Partnership Process Cards -->
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <p class="text-sm font-semibold text-primary-green uppercase tracking-wider mb-3">Processus Simple</p>
      <h2 class="text-4xl md:text-5xl font-bold text-black mb-4">
        3 Étapes Pour Devenir Partenaire
      </h2>
      <p class="text-xl text-neutral-charcoal max-w-3xl mx-auto">
        Un processus simple et rapide pour démarrer notre collaboration
      </p>
    </div>
    
    <!-- Steps Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {#each partnershipSteps as step, i}
        <div class="relative group">
          <!-- Card -->
          <div class="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-light h-full">
            <!-- Step Number Badge -->
            <div class="absolute -top-4 -right-4 w-12 h-12 bg-primary-green rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {step.step}
            </div>
            
            <!-- Icon -->
            <div class="mb-6">
              <svelte:component this={step.icon} class="w-12 h-12 text-primary-green group-hover:scale-110 transition-transform" />
            </div>
            
            <!-- Content -->
            <h3 class="text-2xl font-bold text-neutral-obsidian mb-4">
              {step.title}
            </h3>
            <p class="text-neutral-charcoal leading-relaxed">
              {step.description}
            </p>
          </div>
          
          <!-- Arrow between cards (desktop only) -->
          {#if i < partnershipSteps.length - 1}
            <div class="hidden md:block absolute top-1/2 -right-4 transform translate-x-1/2 -translate-y-1/2 z-10">
              <ArrowRight class="w-8 h-8 text-primary-green" />
            </div>
          {/if}
        </div>
      {/each}
    </div>
    
  </div>
</section>

<!-- Final CTA -->
<section class="py-20 bg-footer-green relative overflow-hidden">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 class="text-4xl md:text-6xl font-bold text-white mb-8">
      Contactez Notre Équipe Commerciale
    </h2>
    <p class="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
      Notre équipe est disponible pour discuter de votre projet de partenariat et répondre à toutes vos questions
    </p>
    
    <div class="flex flex-col sm:flex-row gap-4 justify-center w-full">
      <a 
        href="/contact"
        class="block sm:inline-block w-full sm:w-auto text-center bg-accent-gold text-footer-green px-6 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
      >
      Contactez-Nous
      </a>
      <a 
        href="/produits"
        class="block sm:inline-block w-full sm:w-auto text-center bg-transparent border-2 border-accent-gold text-accent-gold px-6 py-3 rounded-full font-semibold text-base hover:bg-accent-gold/10 transition-all duration-300"
      >
        Découvrir Nos Produits
      </a>
    </div>
  </div>
  
  <!-- Background decoration -->
  <div class="absolute bottom-0 left-0 right-0 h-px bg-white/10"></div>
</section>