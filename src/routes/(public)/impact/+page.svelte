<script lang="ts">
  import { onMount } from 'svelte';
  import { TrendingUp, Users, Heart, Leaf, MapPin, Award } from 'lucide-svelte';
  import ScrollReveal from '$lib/components/ui/ScrollReveal.svelte';
  import { CmsText, CmsImage } from '$lib/components/cms';
  import { t, href } from '$lib/i18n';
  
  let statsVisible = false;
  let currentStat = $state({ women: 0, villages: 0, income: 0, families: 0 });
  
  const targetStats = {
    women: 500,
    villages: 10,
    income: 250,
    families: 2000
  };
  
  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !statsVisible) {
            statsVisible = true;
            animateStats();
          }
        });
      },
      { threshold: 0.5 }
    );
    
    const statsSection = document.querySelector('#stats-section');
    if (statsSection) observer.observe(statsSection);
    
    return () => observer.disconnect();
  });
  
  function animateStats() {
    const duration = 2000;
    const interval = 50;
    const steps = duration / interval;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      currentStat = {
        women: Math.floor(targetStats.women * progress),
        villages: Math.floor(targetStats.villages * progress),
        income: Math.floor(targetStats.income * progress),
        families: Math.floor(targetStats.families * progress)
      };
      
      if (step >= steps) {
        clearInterval(timer);
        currentStat = targetStats;
      }
    }, interval);
  }
  
  const producerStories = $derived([
    {
      name: "Mariama Touré",
      role: t("Productrice de fonio depuis 2016", "Fonio producer since 2016"),
      location: "Natitingou",
      story: t(
        "Grâce à Angel's Floor, j'ai pu scolariser mes 4 enfants et agrandir ma parcelle. Le prix équitable nous permet de vivre dignement.",
        "Thanks to Angel's Floor, I've been able to send my 4 children to school and expand my plot. The fair price lets us live with dignity."
      ),
      image: "https://images.unsplash.com/photo-1594736797933-d0ed62e8681a?w=400&h=400&fit=crop&crop=center"
    },
    {
      name: "Fatoumata Diallo",
      role: t("Responsable coopérative", "Cooperative leader"),
      location: "Tanguiéta",
      story: t(
        "Notre coopérative compte maintenant 50 femmes. Nous avons construit un centre de transformation qui profite à tout le village.",
        "Our cooperative now has 50 women. We've built a processing centre that benefits the whole village."
      ),
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400&h=400&fit=crop&crop=center"
    },
    {
      name: "Aïssatou Koné",
      role: t("Formatrice en agriculture bio", "Organic farming trainer"),
      location: "Matéri",
      story: t(
        "Je forme les nouvelles productrices aux techniques biologiques. C'est gratifiant de voir notre communauté grandir et prospérer.",
        "I train new women producers in organic techniques. It's so rewarding to see our community grow and thrive."
      ),
      image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=400&fit=crop&crop=center"
    }
  ]);
  
  const processSteps = $derived([
    {
      number: "01",
      title: "Identification",
      description: t(
        "Nous identifions les femmes productrices motivées dans les villages de l'Atacora",
        "We identify motivated women producers in the villages of the Atacora region"
      ),
      icon: MapPin,
      color: "bg-primary-green"
    },
    {
      number: "02",
      title: t("Formation", "Training"),
      description: t(
        "Formation gratuite aux techniques de production bio et de transformation",
        "Free training in organic production and processing techniques"
      ),
      icon: Award,
      color: "bg-accent-sunset"
    },
    {
      number: "03",
      title: "Production",
      description: t(
        "Accompagnement continu et fourniture de semences de qualité",
        "Ongoing support and a supply of quality seeds"
      ),
      icon: Leaf,
      color: "bg-creative-purple"
    },
    {
      number: "04",
      title: t("Achat garanti", "Guaranteed purchase"),
      description: t(
        "Achat de la production à prix équitable fixé à l'avance",
        "We buy the harvest at a fair price agreed in advance"
      ),
      icon: Heart,
      color: "bg-primary-green-vibrant"
    },
    {
      number: "05",
      title: t("Transformation", "Processing"),
      description: t(
        "Transformation dans nos unités selon des normes strictes de qualité",
        "Processing in our own units to strict quality standards"
      ),
      icon: TrendingUp,
      color: "bg-accent-gold"
    },
    {
      number: "06",
      title: "Distribution",
      description: t(
        "Vente des produits finis et partage équitable des bénéfices",
        "Sale of the finished products and fair sharing of the profits"
      ),
      icon: Users,
      color: "bg-primary-green-bright"
    }
  ]);
</script>

<svelte:head>
  <title>{t("Notre Impact - Angel's Floor", "Our Impact - Angel's Floor")}</title>
  <meta
    name="description"
    content={t(
      "Découvrez l'impact social d'Angel's Floor : 500+ femmes autonomisées, développement rural durable et transformation de communautés au Bénin.",
      "Discover Angel's Floor's social impact: 500+ women empowered, sustainable rural development and communities transformed in Benin."
    )}
  />
</svelte:head>

<!-- Hero Section with Statistics -->
<section id="stats-section" class="relative bg-gradient-to-br from-primary-green via-primary-green-vibrant to-accent-gold py-20 overflow-hidden">
  <div class="absolute inset-0">
    <div class="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-accent-gold/20 rounded-full blur-3xl"></div>
  </div>
  
  <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <ScrollReveal animation="fade-down">
      <div class="text-center text-white mb-16">
        <CmsText key="impact.hero.title" tag="h1" class="text-5xl md:text-7xl font-bold mb-6" en="Our Impact">Notre Impact</CmsText>
        <CmsText key="impact.hero.subtitle" tag="p" class="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto" en="Every Angel's Floor product transforms lives and builds a sustainable future">Chaque produit Angel's Floor transforme des vies et construit un avenir durable</CmsText>
      </div>
    </ScrollReveal>
    
    <!-- Animated Statistics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <!-- Stat 1 -->
      <ScrollReveal animation="fade-up" delay={0}>
      <div class="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 text-center transform hover:scale-105 transition-transform duration-300">
        <div class="text-5xl font-bold text-white mb-2">
          {currentStat.women}+
        </div>
        <h3 class="text-xl font-semibold text-accent-gold mb-2">{t("Femmes Autonomisées", "Women Empowered")}</h3>
        <p class="text-white/80 text-sm">{t("Productrices actives dans notre réseau", "Active women producers in our network")}</p>
      </div>
      </ScrollReveal>
      
      <!-- Stat 2 -->
      <ScrollReveal animation="fade-up" delay={100}>
      <div class="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 text-center transform hover:scale-105 transition-transform duration-300">
        <div class="text-5xl font-bold text-white mb-2">
          {currentStat.villages}
        </div>
        <h3 class="text-xl font-semibold text-accent-gold mb-2">{t("Villages Impactés", "Villages Reached")}</h3>
        <p class="text-white/80 text-sm">{t("Dans la région de l'Atacora", "In the Atacora region")}</p>
      </div>
      </ScrollReveal>
      
      <!-- Stat 3 -->
      <ScrollReveal animation="fade-up" delay={200}>
      <div class="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 text-center transform hover:scale-105 transition-transform duration-300">
        <div class="text-5xl font-bold text-white mb-2">
          +{currentStat.income}%
        </div>
        <h3 class="text-xl font-semibold text-accent-gold mb-2">{t("Augmentation Revenus", "Income Increase")}</h3>
        <p class="text-white/80 text-sm">{t("Revenu moyen des productrices", "Average producer income")}</p>
      </div>
      </ScrollReveal>
      
      <!-- Stat 4 -->
      <ScrollReveal animation="fade-up" delay={300}>
      <div class="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 text-center transform hover:scale-105 transition-transform duration-300">
        <div class="text-5xl font-bold text-white mb-2">
          {currentStat.families}+
        </div>
        <h3 class="text-xl font-semibold text-accent-gold mb-2">{t("Familles Bénéficiaires", "Families Benefiting")}</h3>
        <p class="text-white/80 text-sm">{t("Impact indirect sur les communautés", "Indirect impact on communities")}</p>
      </div>
      </ScrollReveal>
    </div>
  </div>
</section>

<!-- Producer Stories Section -->
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <ScrollReveal animation="fade-up">
      <div class="text-center mb-16">
        <CmsText key="impact.stories.title" tag="h2" class="text-4xl md:text-5xl font-bold text-primary-green mb-4" en="Stories of Transformation">Histoires de Transformation</CmsText>
        <CmsText key="impact.stories.subtitle" tag="p" class="text-xl text-neutral-charcoal max-w-3xl mx-auto" en="Meet the courageous women at the heart of Angel's Floor">Rencontrez les femmes courageuses qui sont le cœur d'Angel's Floor</CmsText>
      </div>
    </ScrollReveal>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {#each producerStories as story, i}
        <ScrollReveal animation="fade-up" delay={i * 150}>
        <div class="group">
          <div class="relative overflow-hidden rounded-3xl mb-6">
            <img 
              src={story.image} 
              alt={story.name}
              class="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div class="absolute bottom-4 left-4 right-4 text-white">
              <h3 class="text-xl font-bold mb-1">{story.name}</h3>
              <p class="text-sm text-white/80">{story.role}</p>
              <p class="text-sm text-white/80 flex items-center mt-1">
                <MapPin class="w-3 h-3 mr-1" />
                {story.location}
              </p>
            </div>
          </div>
          <p class="text-neutral-charcoal italic">"{story.story}"</p>
        </div>
        </ScrollReveal>
      {/each}
    </div>
    
    <div class="text-center mt-12">
      <button 
        class="bg-primary-green text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-primary-green-vibrant transform hover:scale-105 transition-all duration-300"
      >
        {t("Lire Plus d'Histoires", 'Read More Stories')}
      </button>
    </div>
  </div>
</section>

<!-- Collaboration Process Timeline -->
<section class="py-20 bg-neutral-sand">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <ScrollReveal animation="fade-up">
      <div class="text-center mb-16">
        <CmsText key="impact.process.title" tag="h2" class="text-4xl md:text-5xl font-bold text-primary-green mb-4" en="How We Work Together">Notre Processus de Collaboration</CmsText>
        <CmsText key="impact.process.subtitle" tag="p" class="text-xl text-neutral-charcoal max-w-3xl mx-auto" en="A fair partnership from the field to your table">Un partenariat équitable du champ à votre table</CmsText>
      </div>
    </ScrollReveal>
    
    <!-- Process Steps Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each processSteps as step, index}
        <ScrollReveal animation="fade-up" delay={index * 100}>
        <div class="relative group">
          <!-- Connection Line (except for last item) -->
          {#if index < processSteps.length - 1}
            <div class="hidden lg:block absolute top-1/2 left-full w-8 h-0.5 bg-neutral-light -translate-y-1/2 z-0"></div>
          {/if}
          
          <div class="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 z-10">
            <!-- Step Number -->
            <div class="absolute -top-4 -right-4 w-12 h-12 {step.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {step.number}
            </div>
            
            <!-- Icon -->
            <div class="w-16 h-16 {step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <step.icon class="w-8 h-8 text-white" />
            </div>
            
            <!-- Content -->
            <h3 class="text-xl font-bold text-primary-green mb-3">{step.title}</h3>
            <p class="text-neutral-charcoal">{step.description}</p>
          </div>
        </div>
        </ScrollReveal>
      {/each}
    </div>
  </div>
</section>

<!-- Economic Impact Metrics -->
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <ScrollReveal animation="fade-up">
      <div class="text-center mb-16">
        <CmsText key="impact.metrics.title" tag="h2" class="text-4xl md:text-5xl font-bold text-primary-green mb-4" en="Measurable Economic Impact">Impact Économique Mesurable</CmsText>
        <CmsText key="impact.metrics.subtitle" tag="p" class="text-xl text-neutral-charcoal max-w-3xl mx-auto" en="Figures that tell a story of lasting transformation">Des chiffres qui racontent une histoire de transformation durable</CmsText>
      </div>
    </ScrollReveal>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <!-- Metrics -->
      <ScrollReveal animation="fade-right">
      <div class="space-y-6">
        <!-- Metric 1 -->
        <div class="bg-gradient-to-r from-primary-green to-primary-green-vibrant rounded-2xl p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold">{t("Revenus distribués aux productrices", "Income paid to producers")}</h3>
            <span class="text-2xl font-bold">85%</span>
          </div>
          <div class="w-full bg-white/20 rounded-full h-3">
            <div class="bg-white rounded-full h-3" style="width: 85%"></div>
          </div>
          <p class="text-sm text-white/80 mt-2">{t("Des revenus de vente retournent directement aux productrices", "Of sales revenue goes straight back to the producers")}</p>
        </div>
        
        <!-- Metric 2 -->
        <div class="bg-gradient-to-r from-accent-sunset to-accent-gold rounded-2xl p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold">{t("Taux de rétention des productrices", "Producer retention rate")}</h3>
            <span class="text-2xl font-bold">92%</span>
          </div>
          <div class="w-full bg-white/20 rounded-full h-3">
            <div class="bg-white rounded-full h-3" style="width: 92%"></div>
          </div>
          <p class="text-sm text-white/80 mt-2">{t("Des productrices restent actives année après année", "Of producers stay active year after year")}</p>
        </div>
        
        <!-- Metric 3 -->
        <div class="bg-gradient-to-r from-creative-purple to-primary-green-bright rounded-2xl p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold">{t("Enfants scolarisés", "Children in school")}</h3>
            <span class="text-2xl font-bold">1200+</span>
          </div>
          <div class="w-full bg-white/20 rounded-full h-3">
            <div class="bg-white rounded-full h-3" style="width: 100%"></div>
          </div>
          <p class="text-sm text-white/80 mt-2">{t("Grâce aux revenus stables des mères productrices", "Thanks to the steady income of their producer mothers")}</p>
        </div>
      </div>
      </ScrollReveal>
      
      <!-- Visual Impact -->
      <ScrollReveal animation="fade-left" delay={200}>
      <div class="relative">
        <CmsImage
          key="impact.metrics.image"
          src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop&crop=center"
          alt={t("Impact économique Angel's Floor", "Angel's Floor economic impact")}
          class="rounded-3xl shadow-2xl"
        />
        <div class="absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-xl">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center">
              <TrendingUp class="w-8 h-8 text-white" />
            </div>
            <div>
              <p class="text-3xl font-bold text-primary-green">32M FCFA</p>
              <p class="text-sm text-neutral-slate">{t('Revenus annuels générés', 'Annual income generated')}</p>
            </div>
          </div>
        </div>
      </div>
      </ScrollReveal>
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
    <ScrollReveal animation="scale">
      <CmsText key="impact.cta.title" tag="h2" class="text-4xl md:text-5xl font-bold mb-6" en="Be Part of This Impact">Faites Partie de Cet Impact</CmsText>
      <CmsText key="impact.cta.description" tag="p" class="text-xl text-white/90 mb-10" en="Every purchase directly helps transform lives and build a sustainable future for Beninese communities.">Chaque achat contribue directement à transformer des vies et à bâtir un avenir durable pour les communautés béninoises.</CmsText>
    
    <div class="flex flex-col sm:flex-row gap-4 justify-center w-full">
      <button 
        onclick={() => window.location.href = href('/produits')}
        class="w-full sm:w-auto bg-white text-primary-green px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
      >
        {t('Acheter Nos Produits', 'Shop Our Products')}
      </button>
      <button 
        onclick={() => window.location.href = href('/grossistes')}
        class="w-full sm:w-auto bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary-green transition-all duration-300"
      >
        {t('Devenir Partenaire', 'Become a Partner')}
      </button>
    </div>
    </ScrollReveal>
  </div>
</section>