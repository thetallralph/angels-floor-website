<script lang="ts">
  import { onMount } from 'svelte';
  import {
    TrendingUp, Package, Users, Truck, Shield,
    Handshake, ArrowRight,
    Mail, Star
  } from 'lucide-svelte';
  import { CmsText, CmsImage } from '$lib/components/cms';
  import { t, href } from '$lib/i18n';
  
  let heroVisible = $state(false);
  
  const benefits = $derived([
    {
      icon: TrendingUp,
      title: t("MARGES", "MARGINS"),
      percentage: "35%",
      subtitle: t("de rentabilité", "profitability")
    },
    {
      icon: Truck,
      title: t("LIVRAISON", "DELIVERY"),
      percentage: "48H",
      subtitle: t("partout au Bénin", "anywhere in Benin")
    },
    {
      icon: Shield,
      title: t("QUALITÉ", "QUALITY"),
      percentage: "100%",
      subtitle: t("certifié bio", "certified organic")
    },
    {
      icon: Users,
      title: "SUPPORT",
      percentage: "24/7",
      subtitle: t("équipe dédiée", "dedicated team")
    }
  ]);
  
  const partnershipSteps = $derived([
    { 
      step: 1, 
      title: t("Candidature", "Application"), 
      description: t(
        "Contactez notre équipe commerciale et présentez votre entreprise. Nous étudions votre dossier sous 48h.",
        "Contact our sales team and introduce your business. We review your application within 48 hours."
      ), 
      icon: Mail
    },
    { 
      step: 2, 
      title: t("Validation", "Approval"), 
      description: t(
        "Rencontre avec notre équipe, visite de vos installations et signature du contrat de partenariat.",
        "A meeting with our team, a visit to your premises and signing of the partnership agreement."
      ), 
      icon: Handshake
    },
    { 
      step: 3, 
      title: t("Lancement", "Launch"), 
      description: t(
        "Formation sur nos produits, première commande et début de notre collaboration commerciale.",
        "Training on our products, your first order and the start of our business partnership."
      ), 
      icon: Package
    }
  ]);
  
  onMount(() => {
    heroVisible = true;
  });
</script>

<svelte:head>
  <title>{t("Devenir Grossiste | Angel's Floor - Partenariat Distribution", "Become a Wholesaler | Angel's Floor - Distribution Partnership")}</title>
  <meta
    name="description"
    content={t(
      "Rejoignez notre réseau de distributeurs Angel's Floor. Marges attractives jusqu'à 35%, livraison 48h, support commercial dédié. Devenez partenaire grossiste.",
      "Join the Angel's Floor distributor network. Attractive margins of up to 35%, 48-hour delivery and dedicated sales support. Become a wholesale partner."
    )}
  />
</svelte:head>

<!-- Hero Section with Image Background -->
<section class="relative overflow-hidden bg-white">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-8 items-center py-16 lg:py-20">
      <!-- Text Content -->
      <div class="relative z-10 text-center lg:text-left {heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} transition-all duration-700">
        <CmsText key="wholesale.hero.title" tag="h1" class="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight text-center lg:text-left" en="Grow Your Business with Angel's Floor">Développez Votre Business avec Angel's Floor</CmsText>
        <CmsText key="wholesale.hero.subtitle" tag="p" class="text-lg md:text-xl text-neutral-charcoal mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0" en="Join a network of more than 50 distributors across Benin and enjoy exceptional margins on organic products in high demand.">Rejoignez un réseau de plus de 50 distributeurs à travers le Bénin et bénéficiez de marges exceptionnelles sur des produits bio en forte demande.</CmsText>
        
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full lg:w-auto">
          <a 
            href={href('/contact')}
            class="inline-flex items-center justify-center gap-3 bg-primary-green text-white px-6 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto"
          >
            <span>{t('Devenir Partenaire', 'Become a Partner')}</span>
            <ArrowRight class="w-5 h-5" />
          </a>
          <a 
            href="#avantages"
            class="inline-flex items-center justify-center gap-3 bg-transparent border-2 border-primary-green text-primary-green px-6 py-3 rounded-full font-semibold text-base hover:bg-primary-green/10 transition-all duration-300 w-full sm:w-auto"
          >
            <span>{t('Découvrir les Avantages', 'Discover the Benefits')}</span>
          </a>
        </div>
      </div>
      
      <!-- Hero Image -->
      <div class="relative h-[400px] lg:h-[600px] {heroVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} transition-all duration-700 delay-300">
        <CmsImage
          key="home.wholesale.image"
          src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=600&fit=crop"
          alt={t("Supermarché Mont Sinaï – partenaire Angel's Floor", "Mont Sinaï supermarket – Angel's Floor partner")}
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
      <CmsText key="wholesale.benefits.title" tag="h2" class="text-4xl md:text-5xl font-bold text-black mb-4" en="Why Choose Us?">Pourquoi Nous Choisir?</CmsText>
      <CmsText key="wholesale.benefits.description" tag="p" class="text-xl text-neutral-charcoal max-w-3xl mx-auto" en="Join a high-performing distribution network with attractive margins, streamlined logistics, certified premium-quality products and personalised sales support to maximise your success">Rejoignez un réseau de distribution performant avec des marges attractives, une logistique optimisée, des produits certifiés de qualité supérieure et un accompagnement commercial personnalisé pour maximiser votre succès</CmsText>
    </div>
    
    <!-- Benefits Grid - Bold Numbers -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
      {#each benefits as benefit}
        <div class="text-center group">
          <!-- Icon -->
          <div class="mb-4">
            <benefit.icon class="w-12 h-12 text-primary-green mx-auto" />
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
      <CmsText key="wholesale.testimonial.overline" tag="p" class="text-sm font-semibold text-primary-green uppercase tracking-wider mb-3" en="Testimonial">Témoignage</CmsText>
      <CmsText key="wholesale.testimonial.title" tag="h2" class="text-4xl md:text-5xl font-bold text-black mb-4" en="Hear From Our Partners">La Parole à Nos Partenaires</CmsText>
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
          <CmsText key="wholesale.testimonial.quote" tag="p" class="text-xl md:text-2xl text-neutral-charcoal leading-relaxed text-center mb-10 max-w-3xl mx-auto" en="“A partner for 3 years now, Angel's Floor guarantees us consistent product quality and deliveries that are always on time. Their sales support is exceptional and our customers love the quality of their organic products. It's a win-win partnership that helps us stand out in the market.”">« Partenaire depuis 3 ans, Angel's Floor nous garantit des produits de qualité constante et des livraisons toujours à temps. Leur accompagnement commercial est exceptionnel et nos clients adorent la qualité de leurs produits bio. C'est un partenariat gagnant-gagnant qui nous permet de nous différencier sur le marché. »</CmsText>

          <!-- Author Info -->
          <div class="text-center">

            <!-- Author Details -->
            <CmsText key="wholesale.testimonial.name" tag="p" class="text-xl font-bold text-neutral-obsidian">Jean-Baptiste Soglo</CmsText>
            <CmsText key="wholesale.testimonial.role" tag="p" class="text-neutral-slate" en="Director, Champion Supermarket">Directeur, Supermarché Champion</CmsText>
            <CmsText key="wholesale.testimonial.location" tag="p" class="text-sm text-neutral-slate">Cotonou</CmsText>
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
      <CmsText key="wholesale.process.overline" tag="p" class="text-sm font-semibold text-primary-green uppercase tracking-wider mb-3" en="Simple Process">Processus Simple</CmsText>
      <CmsText key="wholesale.process.title" tag="h2" class="text-4xl md:text-5xl font-bold text-black mb-4" en="3 Steps to Become a Partner">3 Étapes Pour Devenir Partenaire</CmsText>
      <CmsText key="wholesale.process.description" tag="p" class="text-xl text-neutral-charcoal max-w-3xl mx-auto" en="A quick and simple process to start working together">Un processus simple et rapide pour démarrer notre collaboration</CmsText>
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
              <step.icon class="w-12 h-12 text-primary-green group-hover:scale-110 transition-transform" />
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
    <CmsText key="wholesale.cta.title" tag="h2" class="text-4xl md:text-6xl font-bold text-white mb-8" en="Contact Our Sales Team">Contactez Notre Équipe Commerciale</CmsText>
    <CmsText key="wholesale.cta.description" tag="p" class="text-xl text-white/90 mb-10 max-w-2xl mx-auto" en="Our team is available to discuss your partnership project and answer all your questions">Notre équipe est disponible pour discuter de votre projet de partenariat et répondre à toutes vos questions</CmsText>
    
    <div class="flex flex-col sm:flex-row gap-4 justify-center w-full">
      <a 
        href={href('/contact')}
        class="block sm:inline-block w-full sm:w-auto text-center bg-accent-gold text-footer-green px-6 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
      >
      {t('Contactez-Nous', 'Contact Us')}
      </a>
      <a 
        href={href('/produits')}
        class="block sm:inline-block w-full sm:w-auto text-center bg-transparent border-2 border-accent-gold text-accent-gold px-6 py-3 rounded-full font-semibold text-base hover:bg-accent-gold/10 transition-all duration-300"
      >
        {t('Découvrir Nos Produits', 'Discover Our Products')}
      </a>
    </div>
  </div>
  
  <!-- Background decoration -->
  <div class="absolute bottom-0 left-0 right-0 h-px bg-white/10"></div>
</section>