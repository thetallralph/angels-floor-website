<script lang="ts">
  import { onMount } from 'svelte';
  import { ArrowRight, BookOpen, Users, Award, Image as ImageIcon } from 'lucide-svelte';
  import { CmsText, CmsImage } from '$lib/components/cms';
  import type { PageData } from './$types';
  import type { TrainingCategory } from '$lib/admin/types';

  let { data }: { data: PageData } = $props();

  let heroVisible = $state(false);
  let categoryFilter = $state<'all' | TrainingCategory>('all');

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

  const filtered = $derived(
    categoryFilter === 'all'
      ? data.trainings
      : data.trainings.filter((t) => t.category === categoryFilter)
  );

  const counts = $derived.by(() => {
    const agro = data.trainings.filter((t) => t.category === 'agroalimentaire').length;
    const cosm = data.trainings.filter((t) => t.category === 'cosmetique').length;
    return { all: data.trainings.length, agroalimentaire: agro, cosmetique: cosm };
  });

  function formatPrice(n: number): string {
    return n.toLocaleString('fr-FR');
  }

  onMount(() => {
    heroVisible = true;
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

<!-- CATALOGUE avec sidebar filtre -->
<section id="formations" class="bg-neutral-sand py-20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mb-10">
      <CmsText key="trainings.catalog.title" tag="h2" class="text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">Le catalogue</CmsText>
      <CmsText key="trainings.catalog.description" tag="p" class="text-lg text-neutral-charcoal leading-relaxed">Parcourez nos formations et cliquez sur "En savoir plus" pour découvrir les détails.</CmsText>
    </div>

    {#if data.trainings.length === 0}
      <div class="bg-white rounded-3xl px-8 py-16 lg:px-12 lg:py-20">
        <div class="max-w-2xl">
          <h3 class="text-2xl md:text-3xl font-bold text-neutral-obsidian mb-4 leading-tight">Catalogue en cours de mise à jour.</h3>
          <p class="text-base text-neutral-charcoal leading-relaxed">
            Revenez d'ici quelques jours, ou contactez-nous dès maintenant pour discuter de vos besoins.
          </p>
        </div>
      </div>
    {:else}
      <div class="grid grid-cols-12 gap-6 lg:gap-8">
        <!-- SIDEBAR -->
        <aside class="col-span-12 lg:col-span-3">
          <div class="lg:sticky lg:top-24 bg-white rounded-2xl p-5 lg:p-6">
            <div class="text-xs font-semibold text-neutral-slate uppercase tracking-wider mb-4">Catégories</div>
            <nav class="space-y-1">
              <button
                onclick={() => (categoryFilter = 'all')}
                class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors {categoryFilter === 'all' ? 'bg-primary-green text-white' : 'text-neutral-charcoal hover:bg-neutral-sand'}"
              >
                <span>Toutes</span>
                <span class="text-xs {categoryFilter === 'all' ? 'opacity-80' : 'text-neutral-slate'}">{counts.all}</span>
              </button>
              <button
                onclick={() => (categoryFilter = 'agroalimentaire')}
                class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors {categoryFilter === 'agroalimentaire' ? 'bg-primary-green text-white' : 'text-neutral-charcoal hover:bg-neutral-sand'}"
              >
                <span>Agroalimentaire</span>
                <span class="text-xs {categoryFilter === 'agroalimentaire' ? 'opacity-80' : 'text-neutral-slate'}">{counts.agroalimentaire}</span>
              </button>
              <button
                onclick={() => (categoryFilter = 'cosmetique')}
                class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors {categoryFilter === 'cosmetique' ? 'bg-primary-green text-white' : 'text-neutral-charcoal hover:bg-neutral-sand'}"
              >
                <span>Cosmétique</span>
                <span class="text-xs {categoryFilter === 'cosmetique' ? 'opacity-80' : 'text-neutral-slate'}">{counts.cosmetique}</span>
              </button>
            </nav>
          </div>
        </aside>

        <!-- GRID -->
        <div class="col-span-12 lg:col-span-9">
          {#if filtered.length === 0}
            <div class="text-center py-16 text-neutral-slate">
              Aucune formation dans cette catégorie pour l'instant.
            </div>
          {:else}
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {#each filtered as t (t.id)}
                <a href="/formations/{t.slug}" class="block bg-white rounded-2xl overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group">
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
                    <div class="text-xs font-semibold text-primary-green uppercase tracking-wider mb-2">
                      {t.category === 'cosmetique' ? 'Cosmétique' : 'Agroalimentaire'}
                    </div>
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
              {/each}
            </div>
          {/if}
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
