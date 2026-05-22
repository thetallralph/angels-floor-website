<script lang="ts">
  import { onMount } from 'svelte';
  import { ArrowRight, BookOpen, Users, Award, Image as ImageIcon, ChevronDown, Filter } from 'lucide-svelte';
  import { CmsText, CmsImage } from '$lib/components/cms';
  import ScrollReveal from '$lib/components/ui/ScrollReveal.svelte';
  import type { PageData } from './$types';
  import type { TrainingCategory } from '$lib/admin/types';

  let { data }: { data: PageData } = $props();

  let heroVisible = $state(false);
  let activeCategory = $state<TrainingCategory>('agroalimentaire');
  let mobileMenuOpen = $state(false);

  const benefits = [
    {
      icon: BookOpen,
      title: 'La pratique avant tout',
      description: '70% du temps consacré à manipuler, formuler, produire. Vous apprenez en faisant.'
    },
    {
      icon: Users,
      title: 'Des praticiens, pas des théoriciens',
      description: 'Vos formateurs viennent de la production. Dix ans de métier derrière eux et un suivi possible après la formation.'
    },
    {
      icon: Award,
      title: 'Un certificat à la fin',
      description: 'Délivré en fin de session, il atteste des compétences acquises et peut servir à démarrer une activité.'
    }
  ];

  const categories: { id: TrainingCategory; name: string }[] = [
    { id: 'agroalimentaire', name: 'Agroalimentaire' },
    { id: 'cosmetique', name: 'Cosmétique' }
  ];

  const trainingsByCategory = $derived.by(() => {
    const result: Record<TrainingCategory, typeof data.trainings> = {
      agroalimentaire: [],
      cosmetique: []
    };
    for (const t of data.trainings) {
      result[t.category].push(t);
    }
    return result;
  });

  const categoriesWithCount = $derived(
    categories.map((c) => ({ ...c, count: trainingsByCategory[c.id].length }))
  );

  function formatPrice(n: number): string {
    return n.toLocaleString('fr-FR');
  }

  function scrollToCategory(id: string) {
    const el = document.getElementById(`category-${id}`);
    if (el) {
      const offset = window.innerWidth < 1024 ? 140 : 100;
      window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' });
    }
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (mobileMenuOpen && !target.closest('.lg\\:hidden')) {
      mobileMenuOpen = false;
    }
  }

  $effect(() => {
    if (typeof window === 'undefined') return;
    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  });

  onMount(() => {
    heroVisible = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeCategory = entry.target.id.replace('category-', '') as TrainingCategory;
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    categories.forEach((c) => {
      const el = document.getElementById(`category-${c.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  });
</script>

<svelte:head>
  <title>Formations | Angel's Floor</title>
  <meta name="description" content="Formations Angel's Floor en cosmétique naturelle et transformation alimentaire à base de produits africains. Apprenez auprès de nos experts praticiens." />
</svelte:head>

<!-- HERO -->
<section class="relative bg-neutral-sand overflow-hidden">
  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
    <div class="grid grid-cols-12 gap-6 lg:gap-12 items-center">
      <div class="col-span-12 lg:col-span-7 {heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} transition-all duration-700">
        <CmsText
          key="trainings.hero.title"
          tag="h1"
          class="text-4xl md:text-5xl font-bold text-black mb-5 leading-tight"
        >Apprenez nos savoir-faire</CmsText>

        <CmsText
          key="trainings.hero.subtitle"
          tag="p"
          class="text-base md:text-lg text-neutral-charcoal mb-7 leading-relaxed max-w-2xl"
        >Angel's Floor partage dix années de pratique en cosmétique naturelle et transformation alimentaire. Des formations courtes et denses, conçues pour qu'on reparte capable de faire.</CmsText>

        <div class="flex flex-col sm:flex-row gap-3">
          <a
            href="#formations"
            class="inline-flex items-center justify-center gap-2 bg-primary-green text-white px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Voir le catalogue
            <ArrowRight class="w-4 h-4" />
          </a>
          <a
            href="/contact"
            class="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-primary-green text-primary-green px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-primary-green/10 transition-all duration-300"
          >
            Être prévenu
          </a>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-5 {heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} transition-all duration-700 delay-200">
        <div class="relative aspect-[4/5] max-w-sm mx-auto lg:ml-auto lg:mr-0 overflow-hidden rounded-3xl shadow-xl">
          <CmsImage
            key="trainings.hero.image"
            src="/images/formations/hero.jpg"
            alt="Formatrices Angel's Floor en train de préparer une pâte lors d'une session"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </div>
</section>

<!-- BÉNÉFICES — 3 cartes -->
<section class="bg-white py-20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mb-12">
      <CmsText key="trainings.value.title" tag="h2" class="text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">Apprendre auprès de ceux qui font</CmsText>
      <CmsText key="trainings.value.description" tag="p" class="text-lg text-neutral-charcoal leading-relaxed">Une pédagogie pensée pour celles et ceux qui veulent transformer la formation en métier.</CmsText>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      {#each benefits as b}
        {@const Icon = b.icon}
        <div class="bg-neutral-sand rounded-2xl p-6 lg:p-7 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
          <div class="w-12 h-12 rounded-xl bg-primary-green/10 flex items-center justify-center mb-5">
            <Icon class="w-6 h-6 text-primary-green" />
          </div>
          <h3 class="text-xl font-bold text-neutral-obsidian mb-3 leading-tight">{b.title}</h3>
          <p class="text-base text-neutral-charcoal leading-relaxed">{b.description}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- CATALOGUE — anchored sections + left sidebar (structure produits) -->
<section id="formations" class="bg-white min-h-screen">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {#if data.trainings.length === 0}
      <div class="bg-neutral-sand rounded-3xl px-8 py-16 lg:px-12 lg:py-20">
        <div class="max-w-2xl">
          <h3 class="text-2xl md:text-3xl font-bold text-neutral-obsidian mb-4 leading-tight">Catalogue en cours de mise à jour.</h3>
          <p class="text-base text-neutral-charcoal leading-relaxed">
            Revenez d'ici quelques jours, ou contactez-nous dès maintenant pour discuter de vos besoins.
          </p>
        </div>
      </div>
    {:else}
      <div class="flex flex-col lg:flex-row gap-12">
        <!-- Mobile Category Navigation - Fixed/Sticky -->
        <div class="lg:hidden">
          <div class="fixed top-0 left-0 right-0 z-30 bg-white border-b border-neutral-light shadow-md">
            <button
              onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
              class="w-full px-4 py-3 flex items-center justify-between hover:bg-neutral-sand transition-colors"
            >
              <div class="flex items-center gap-2">
                <Filter class="w-5 h-5 text-primary-green" />
                <span class="font-semibold text-neutral-charcoal">
                  {categoriesWithCount.find((c) => c.id === activeCategory)?.name || 'Catégories'}
                </span>
              </div>
              <ChevronDown class="w-5 h-5 text-neutral-charcoal transition-transform duration-200 {mobileMenuOpen ? 'rotate-180' : ''}" />
            </button>

            {#if mobileMenuOpen}
              <div class="absolute top-full left-0 right-0 bg-white border-b border-neutral-light shadow-xl max-h-[70vh] overflow-y-auto">
                <nav class="py-2">
                  {#each categoriesWithCount as category}
                    <button
                      onclick={() => {
                        scrollToCategory(category.id);
                        mobileMenuOpen = false;
                      }}
                      class="w-full text-left px-4 py-3 flex items-center justify-between transition-colors
                        {activeCategory === category.id
                          ? 'bg-primary-green text-white'
                          : 'hover:bg-neutral-sand text-neutral-charcoal'}"
                    >
                      <span class="font-medium">{category.name}</span>
                      <span class="text-sm {activeCategory === category.id ? 'text-white/80' : 'text-neutral-slate'}">
                        {category.count}
                      </span>
                    </button>
                  {/each}
                </nav>
              </div>
            {/if}
          </div>
        </div>

        <!-- Desktop Left Navigation Panel -->
        <aside class="hidden lg:block lg:w-64 lg:sticky lg:top-24 lg:h-fit">
          <ScrollReveal animation="fade-right">
            <div>
              <h2 class="text-sm font-semibold uppercase tracking-wider text-neutral-slate mb-4">Catégories</h2>
              <nav class="space-y-1">
                {#each categoriesWithCount as category}
                  <button
                    onclick={() => scrollToCategory(category.id)}
                    class="w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between
                      {activeCategory === category.id
                        ? 'bg-neutral-sand text-primary-green font-medium'
                        : 'hover:bg-neutral-sand text-neutral-charcoal'}"
                  >
                    <span>{category.name}</span>
                    <span class="text-sm text-neutral-slate">{category.count}</span>
                  </button>
                {/each}
              </nav>

              <!-- Contact Info -->
              <div class="mt-12">
                <h3 class="text-sm font-semibold uppercase tracking-wider text-neutral-slate mb-4">Pour s'inscrire</h3>
                <div class="space-y-3 text-sm">
                  <a href="tel:+22901961219771" class="flex items-center gap-2 text-neutral-charcoal hover:text-primary-green transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +229 01 96 12 19 71
                  </a>
                  <a href="mailto:contact@angelsfloor.bj" class="flex items-center gap-2 text-neutral-charcoal hover:text-primary-green transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    contact@angelsfloor.bj
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </aside>

        <!-- Trainings Content (anchored sections) -->
        <div class="flex-1 pt-14 lg:pt-0">
          {#each categoriesWithCount as category}
            {@const list = trainingsByCategory[category.id]}
            {#if list.length > 0}
              <div id="category-{category.id}" class="mb-16 scroll-mt-36 lg:scroll-mt-24">
                <ScrollReveal animation="fade-up">
                  <div class="mb-8 pb-4 border-b border-neutral-light">
                    <h2 class="text-2xl font-semibold text-neutral-charcoal">{category.name}</h2>
                    <p class="text-sm text-neutral-slate mt-1">{list.length} formation{list.length > 1 ? 's' : ''}</p>
                  </div>
                </ScrollReveal>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {#each list as t, i (t.id)}
                    <ScrollReveal animation="fade-up" delay={i * 100}>
                      <a href="/formations/{t.slug}" class="block bg-white border border-neutral-light rounded-2xl overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group h-full">
                        <div class="aspect-[4/3] bg-neutral-sand overflow-hidden">
                          {#if t.image}
                            <img src={t.image} alt={t.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          {:else}
                            <div class="w-full h-full flex items-center justify-center text-neutral-slate">
                              <ImageIcon class="w-10 h-10" />
                            </div>
                          {/if}
                        </div>

                        <div class="p-5 flex flex-col flex-1">
                          <h3 class="text-base font-bold text-neutral-obsidian mb-3 leading-snug">{t.title}</h3>

                          {#if t.description}
                            <p class="text-sm text-neutral-charcoal leading-relaxed mb-4 line-clamp-3">{t.description}</p>
                          {/if}

                          <div class="flex items-baseline justify-between mt-auto mb-4 pt-3 border-t border-neutral-light">
                            <div class="text-sm text-neutral-charcoal">{t.duration_days} jours</div>
                            <div class="text-base font-bold text-primary-green">{formatPrice(t.price)} <span class="text-xs font-medium">FCFA</span></div>
                          </div>

                          <span class="inline-flex items-center justify-center gap-2 bg-neutral-sand text-neutral-charcoal group-hover:bg-primary-green group-hover:text-white px-4 py-2.5 rounded-full text-sm font-semibold transition-all">
                            En savoir plus
                            <ArrowRight class="w-4 h-4" />
                          </span>
                        </div>
                      </a>
                    </ScrollReveal>
                  {/each}
                </div>
              </div>
            {/if}
          {/each}
        </div>
      </div>
    {/if}
  </div>
</section>

<!-- CTA -->
<section class="bg-footer-green py-20">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <CmsText key="trainings.cta.title" tag="h2" class="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Une question sur nos formations ?</CmsText>
    <CmsText key="trainings.cta.description" tag="p" class="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">Notre équipe vous répond par téléphone, WhatsApp ou email pour vous aider à choisir.</CmsText>

    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a
        href="/contact"
        class="inline-flex items-center justify-center gap-3 bg-accent-gold text-footer-green px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
      >
        Nous contacter
        <ArrowRight class="w-5 h-5" />
      </a>
      <a
        href="#formations"
        class="inline-flex items-center justify-center gap-3 bg-transparent border-2 border-accent-gold text-accent-gold px-6 py-3 rounded-full font-semibold hover:bg-accent-gold/10 transition-all duration-300"
      >
        Revoir le catalogue
      </a>
    </div>
  </div>
</section>

<style>
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
