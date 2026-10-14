<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { Heart, Users, Target, Leaf, TrendingUp } from 'lucide-svelte';
  import ScrollReveal from '$lib/components/ui/ScrollReveal.svelte';
  import { CmsText, CmsImage } from '$lib/components/cms';
  import { t, href } from '$lib/i18n';

  // Scroll-jacked horizontal timeline (desktop only).
  let pinnedSection = $state<HTMLElement>();
  let timelineTrack = $state<HTMLElement>();
  let translateX = $state(0);
  let progress = $state(0);
  let sectionHeight = $state('400vh');
  let rafScheduled = false;

  function measure() {
    if (!timelineTrack) return;
    const trackWidth = timelineTrack.scrollWidth;
    const viewportWidth = window.innerWidth;
    const maxX = Math.max(0, trackWidth - viewportWidth);
    sectionHeight = `${maxX + window.innerHeight}px`;
  }

  function update() {
    if (!pinnedSection || !timelineTrack) return;
    const rect = pinnedSection.getBoundingClientRect();
    const sectionH = pinnedSection.offsetHeight;
    const viewportH = window.innerHeight;
    const scrollDist = sectionH - viewportH;
    if (scrollDist <= 0) {
      translateX = 0;
      progress = 0;
      return;
    }
    const scrolled = Math.max(0, Math.min(scrollDist, -rect.top));
    progress = scrolled / scrollDist;
    const maxX = Math.max(0, timelineTrack.scrollWidth - window.innerWidth);
    translateX = progress * maxX;
  }

  function onScroll() {
    if (rafScheduled) return;
    rafScheduled = true;
    requestAnimationFrame(() => {
      update();
      rafScheduled = false;
    });
  }

  function onResize() {
    measure();
    update();
  }

  onMount(() => {
    tick().then(() => {
      measure();
      update();
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  });

  const timelineEvents = $derived([
    {
      year: 2015,
      title: t("La Naissance", "The Beginning"),
      description: t(
        "Fondation avec 5 femmes productrices dans l'Atacora. Première transformation artisanale de fonio.",
        "Founded with 5 women producers in the Atacora. Our first batches of hand-processed fonio."
      ),
      milestone: t("5 femmes productrices", "5 women producers"),
      image: "/images/about/timeline-2015.jpg"
    },
    {
      year: 2016,
      title: t("Premiers Pas", "First Steps"),
      description: t(
        "Développement des premières recettes et techniques de transformation. Formation des productrices.",
        "Developing our first recipes and processing techniques. Training the women producers."
      ),
      milestone: t("Premières ventes locales", "First local sales"),
      image: "/images/about/timeline-2016.jpg"
    },
    {
      year: 2018,
      title: t("Expansion du Réseau", "A Growing Network"),
      description: t(
        "50 femmes rejoignent le réseau. Lancement de la gamme baobab et premiers partenariats.",
        "50 women join the network. Launch of the baobab range and our first partnerships."
      ),
      milestone: t("50 femmes productrices", "50 women producers"),
      image: "/images/about/timeline-2018.jpg"
    },
    {
      year: 2020,
      title: t("Innovation & Résilience", "Innovation & Resilience"),
      description: t(
        "Certification bio obtenue. Lancement des biscuits enrichis. 200 femmes actives malgré la pandémie.",
        "Organic certification achieved. Launch of our fortified biscuits. 200 women still active despite the pandemic."
      ),
      milestone: t("Certification Bio", "Organic Certification"),
      image: "/images/about/timeline-2020.jpg"
    },
    {
      year: 2022,
      title: t("Croissance Durable", "Sustainable Growth"),
      description: t(
        "Expansion dans 8 régions du Bénin. Partenariats avec des distributeurs nationaux.",
        "Expansion into 8 regions of Benin. Partnerships with national distributors."
      ),
      milestone: t("8 régions couvertes", "8 regions covered"),
      image: "/images/about/timeline-2022.jpg"
    },
    {
      year: 2023,
      title: t("Reconnaissance Nationale", "National Recognition"),
      description: t(
        "Prix de l'entrepreneuriat féminin béninois. Présence dans 15 points de vente.",
        "Beninese Women's Entrepreneurship Award. Now stocked in 15 sales points."
      ),
      milestone: t("Prix de l'entrepreneuriat", "Entrepreneurship Award"),
      image: "/images/about/timeline-2023.jpg"
    },
    {
      year: 2025,
      title: t("10 Ans d'Excellence", "10 Years of Excellence"),
      description: t(
        "500+ femmes impactées, gamme complète de produits, lancement de nouvelles innovations.",
        "500+ women reached, a complete product range and the launch of new innovations."
      ),
      milestone: t("500+ femmes autonomisées", "500+ women empowered"),
      image: "/images/about/timeline-2025.jpg"
    }
  ]);

  // Subtle organic rotations + tape positions for the polaroid feel.
  const laneStyles = [
    { rotate: -3, tape: 'tl' },
    { rotate: 2, tape: 'tr' },
    { rotate: -5, tape: 'tl' },
    { rotate: 4, tape: 'tr' },
    { rotate: -2, tape: 'tl' },
    { rotate: 3, tape: 'tr' },
    { rotate: -4, tape: 'tl' }
  ];
</script>

<svelte:head>
  <title>{t("À Propos - Angel's Floor", "About - Angel's Floor")}</title>
  <meta name="description" content={t("Découvrez l'histoire d'Angel's Floor, 10 ans d'excellence dans la transformation des produits béninois et l'autonomisation des femmes.", "Discover the story of Angel's Floor: 10 years of excellence in processing Beninese products and empowering women.")} />
</svelte:head>

<!-- About Hero — cooperative collage -->
<section class="relative isolate bg-footer-green text-white overflow-hidden min-h-[90vh] lg:min-h-[95vh] flex items-center py-20">
  <!-- Background layers -->
  <div class="absolute inset-0 -z-10">
    <div class="absolute inset-0 bg-gradient-to-br from-footer-green via-primary-green/65 to-footer-green"></div>
    <div class="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-accent-gold/20 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-0 w-[36rem] h-[36rem] bg-primary-green-vibrant/25 rounded-full blur-3xl"></div>
    <div class="absolute inset-0 opacity-[0.05] mix-blend-overlay"
         style="background-image: radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px); background-size: 3px 3px;"></div>
  </div>

  <!-- Collage photos (desktop) — 4 photos -->
  <div class="hidden md:block absolute inset-0 pointer-events-none">
    <!-- ph1: top-left, medium portrait -->
    <div
      class="about-photo absolute top-[8%] left-[5%] w-48 h-64 lg:w-56 lg:h-72 -rotate-[8deg] rounded-2xl overflow-hidden ring-1 ring-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
      style="animation-delay: 200ms;"
    >
      <CmsImage
        key="about.hero.photo1"
        src="/images/about/hero-portrait.jpg"
        alt=""
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-footer-green/40 to-transparent"></div>
    </div>

    <!-- ph2: top-right, large anchor — group scene -->
    <div
      class="about-photo absolute top-[6%] right-[5%] w-60 h-80 lg:w-72 lg:h-[26rem] rotate-[5deg] rounded-2xl overflow-hidden ring-1 ring-accent-gold/30 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)]"
      style="animation-delay: 350ms;"
    >
      <CmsImage
        key="about.hero.photo2"
        src="/images/about/hero-cooperative.jpg"
        alt=""
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-footer-green/30 to-transparent"></div>
    </div>

    <!-- ph3: bottom-left, square — hands detail -->
    <div
      class="about-photo absolute bottom-[8%] left-[8%] w-48 h-48 lg:w-56 lg:h-56 -rotate-[4deg] rounded-2xl overflow-hidden ring-1 ring-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
      style="animation-delay: 500ms;"
    >
      <CmsImage
        key="about.hero.photo3"
        src="/images/about/hero-hands.jpg"
        alt=""
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-footer-green/40 to-transparent"></div>
    </div>

    <!-- ph4: bottom-right, portrait — packaging -->
    <div
      class="about-photo absolute bottom-[8%] right-[7%] w-48 h-64 lg:w-56 lg:h-72 rotate-[7deg] rounded-2xl overflow-hidden ring-1 ring-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
      style="animation-delay: 650ms;"
    >
      <CmsImage
        key="about.hero.photo4"
        src="/images/about/hero-packaging.jpg"
        alt=""
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-footer-green/40 to-transparent"></div>
    </div>
  </div>

  <!-- Text content -->
  <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
    <div class="max-w-2xl mx-auto text-center">
      <ScrollReveal animation="fade-down">
        <CmsText
          key="about.hero.title"
          tag="h1"
          class="text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.02] tracking-tight mb-8"
          en="Our Story"
        >Notre Histoire</CmsText>

        <CmsText
          key="about.hero.subtitle"
          tag="p"
          class="text-lg md:text-xl text-white/75 leading-relaxed max-w-xl mx-auto"
          en="A cooperative of Beninese women processing fonio, baobab and the flavours of our land since 2015."
        >Une coopérative de femmes béninoises qui transforme le fonio, le baobab et les saveurs du terroir depuis 2015.</CmsText>
      </ScrollReveal>

      <!-- Mobile photo strip — 4 mini cards staggered -->
      <div class="md:hidden mt-12 grid grid-cols-4 gap-2 max-w-md mx-auto">
        <div class="aspect-[3/4] rounded-lg overflow-hidden ring-1 ring-white/15 shadow-lg -rotate-[5deg] translate-y-1">
          <CmsImage key="about.hero.photo1" src="/images/about/hero-portrait.jpg" alt="" class="w-full h-full object-cover" />
        </div>
        <div class="aspect-[3/4] rounded-lg overflow-hidden ring-1 ring-accent-gold/30 shadow-lg -translate-y-1">
          <CmsImage key="about.hero.photo2" src="/images/about/hero-cooperative.jpg" alt="" class="w-full h-full object-cover" />
        </div>
        <div class="aspect-[3/4] rounded-lg overflow-hidden ring-1 ring-white/15 shadow-lg translate-y-1">
          <CmsImage key="about.hero.photo3" src="/images/about/hero-hands.jpg" alt="" class="w-full h-full object-cover" />
        </div>
        <div class="aspect-[3/4] rounded-lg overflow-hidden ring-1 ring-white/15 shadow-lg rotate-[5deg] -translate-y-1">
          <CmsImage key="about.hero.photo4" src="/images/about/hero-packaging.jpg" alt="" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Scroll-jacked horizontal timeline (desktop) — wall of polaroids -->
<section
  bind:this={pinnedSection}
  class="hidden md:block relative bg-[#071810] text-white"
  style="height: {sectionHeight};"
  aria-label={t("Chronologie Angel's Floor", "Angel's Floor timeline")}
>
  <div class="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
    <!-- Wall background -->
    <div class="absolute inset-0 -z-10 pointer-events-none">
      <div class="absolute inset-0 bg-gradient-to-b from-footer-green/60 via-[#071810] to-[#05140C]"></div>
      <div class="absolute inset-0 opacity-[0.07] mix-blend-overlay"
           style="background-image: radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1.4px); background-size: 4px 4px;"></div>
      <div class="absolute -top-32 left-1/4 w-[28rem] h-[28rem] bg-accent-gold/[0.06] rounded-full blur-3xl"></div>
      <div class="absolute -bottom-32 right-1/4 w-[28rem] h-[28rem] bg-primary-green-vibrant/10 rounded-full blur-3xl"></div>
    </div>

    <!-- Header (stays fixed while track pans) -->
    <div class="pt-14 lg:pt-20 pb-6 lg:pb-10 px-8 lg:px-16 shrink-0 relative z-10">
      <div class="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div class="max-w-2xl">
          <CmsText
            key="about.timeline.overline"
            tag="p"
            class="text-xs font-semibold text-accent-gold uppercase tracking-[0.3em] mb-3"
            en="Our Journey"
          >Notre Parcours</CmsText>
          <CmsText
            key="about.timeline.title"
            tag="h2"
            class="text-3xl lg:text-5xl font-bold leading-[1.05] mb-4"
            en="A decade of transformation"
          >Une décennie de transformation</CmsText>
          <CmsText
            key="about.timeline.description"
            tag="p"
            class="text-white/60 text-base lg:text-lg leading-relaxed"
            en="From 5 pioneering women in the Atacora to more than 500 empowered women producers across Benin."
          >De 5 femmes pionnières dans l'Atacora à plus de 500 productrices autonomisées à travers le Bénin.</CmsText>
        </div>
        <div class="hidden lg:flex flex-col gap-3 shrink-0 w-64">
          <div class="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40 flex justify-between">
            <span>{t('Défilez ↓', 'Scroll ↓')}</span>
            <span class="text-accent-gold/80">{Math.round(progress * 100)}%</span>
          </div>
          <div class="h-1 bg-white/10 rounded-full overflow-hidden">
            <div class="h-full bg-accent-gold" style="width: {progress * 100}%;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Horizontal track (translates with vertical scroll) -->
    <div class="flex-1 flex items-center relative">
      <div
        bind:this={timelineTrack}
        class="relative inline-flex items-end gap-16 lg:gap-24 px-[10vw] lg:px-[14vw] will-change-transform"
        style="transform: translate3d(-{translateX}px, 0, 0);"
      >
        <!-- Continuous baseline timeline line spanning all lanes -->
        <div class="absolute bottom-[100px] left-0 right-0 h-px bg-white/15"></div>

        <!-- Graduation tick marks along the line -->
        <div
          class="timeline-graduations pointer-events-none absolute bottom-[97px] left-0 right-0 h-[7px]"
          aria-hidden="true"
        ></div>

        {#each timelineEvents as event, index (event.year)}
          {@const style = laneStyles[index]}
          {@const isLast = index === timelineEvents.length - 1}
          <div class="shrink-0 w-[32rem] lg:w-[36rem] relative pb-0">
            <!-- Event group: polaroid + text side-by-side -->
            <div class="flex flex-row items-start gap-6 lg:gap-8 mb-10">
              <!-- Polaroid -->
              <div
                class="polaroid relative w-[19rem] lg:w-[21rem] shrink-0 bg-[#f5efe4] p-3 lg:p-4 pb-12 lg:pb-14 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]"
                style="transform: rotate({style.rotate}deg);"
              >
                {#if style.tape === 'tl'}<span class="tape tape-tl"></span>{/if}
                {#if style.tape === 'tr'}<span class="tape tape-tr"></span>{/if}
                <div class="aspect-[4/3] overflow-hidden bg-neutral-charcoal">
                  {#if isLast}
                    <CmsImage
                      key="about.timeline.celebration.image"
                      src={event.image}
                      alt="{event.title} — {event.year}"
                      class="w-full h-full object-cover pointer-events-none"
                    />
                  {:else}
                    <img src={event.image} alt="{event.title} — {event.year}" loading="lazy" draggable="false" class="w-full h-full object-cover pointer-events-none" />
                  {/if}
                </div>
                <span class="absolute bottom-3 lg:bottom-4 left-0 right-0 text-center font-handwritten text-neutral-charcoal text-lg lg:text-xl">
                  {event.year}
                </span>
              </div>

              <!-- Text block -->
              <div class="flex-1 text-left pt-2">
                <h3 class="text-xl lg:text-2xl font-bold leading-tight mb-3 text-white">{event.title}</h3>
                <p class="text-sm lg:text-base text-white/65 leading-relaxed mb-4">{event.description}</p>
                <p class="inline-flex items-center gap-2 text-xs font-semibold text-accent-gold/90">
                  <span class="block w-1.5 h-1.5 rounded-full bg-accent-gold"></span>
                  {event.milestone}
                </p>
              </div>
            </div>

            <!-- Connector + dot + year anchored on baseline -->
            <div class="relative h-[100px] flex flex-col items-center">
              <div class="w-px h-7 bg-gradient-to-b from-accent-gold/0 via-accent-gold/40 to-accent-gold/70 mx-auto"></div>
              <div class="relative">
                <span class="absolute inset-0 rounded-full bg-accent-gold/40 blur-md"></span>
                <span class="relative block w-4 h-4 rounded-full bg-accent-gold ring-4 ring-[#071810]"></span>
              </div>
              <span class="mt-3 font-mono text-xl lg:text-2xl font-bold text-accent-gold tracking-wider">{event.year}</span>
            </div>
          </div>
        {/each}
      </div>

      <!-- Edge fades -->
      <div class="absolute top-0 bottom-0 left-0 w-12 lg:w-24 bg-gradient-to-r from-[#071810] to-transparent pointer-events-none z-10"></div>
      <div class="absolute top-0 bottom-0 right-0 w-12 lg:w-24 bg-gradient-to-l from-[#071810] to-transparent pointer-events-none z-10"></div>
    </div>
  </div>
</section>

<!-- Mobile timeline — native horizontal scroll, wall of polaroids -->
<section class="md:hidden relative bg-[#071810] text-white py-16 overflow-hidden" aria-label={t("Chronologie Angel's Floor (mobile)", "Angel's Floor timeline (mobile)")}>
  <div class="absolute inset-0 -z-10">
    <div class="absolute inset-0 bg-gradient-to-b from-footer-green/60 via-[#071810] to-[#05140C]"></div>
    <div class="absolute inset-0 opacity-[0.07] mix-blend-overlay"
         style="background-image: radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1.4px); background-size: 4px 4px;"></div>
  </div>

  <div class="px-6 mb-10">
    <CmsText
      key="about.timeline.overline"
      tag="p"
      class="text-[11px] font-semibold text-accent-gold uppercase tracking-[0.3em] mb-3"
      en="Our Journey"
    >Notre Parcours</CmsText>
    <CmsText
      key="about.timeline.title"
      tag="h2"
      class="text-3xl font-bold leading-[1.1] mb-3"
      en="A decade of transformation"
    >Une décennie de transformation</CmsText>
    <CmsText
      key="about.timeline.description"
      tag="p"
      class="text-white/60 text-sm leading-relaxed"
      en="From 5 pioneering women to more than 500 empowered producers."
    >De 5 femmes pionnières à plus de 500 productrices autonomisées.</CmsText>
  </div>

  <div class="timeline-track-mobile overflow-x-auto overflow-y-hidden snap-x snap-proximity">
    <div class="inline-flex items-center gap-10 px-6 py-8">
      {#each timelineEvents as event, index (event.year)}
        {@const style = laneStyles[index]}
        <div class="shrink-0 w-[18rem] snap-start flex flex-col items-center gap-6">
          <div
            class="polaroid relative w-64 bg-[#f5efe4] p-3 pb-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)]"
            style="transform: rotate({style.rotate}deg);"
          >
            {#if style.tape === 'tl'}<span class="tape tape-tl"></span>{/if}
            {#if style.tape === 'tr'}<span class="tape tape-tr"></span>{/if}
            <div class="aspect-[4/3] overflow-hidden bg-neutral-charcoal">
              <img src={event.image} alt="{event.title} — {event.year}" loading="lazy" class="w-full h-full object-cover" />
            </div>
            <span class="absolute bottom-2 left-0 right-0 text-center font-handwritten text-neutral-charcoal text-lg">
              {event.year}
            </span>
          </div>
          <div class="text-center">
            <h3 class="text-xl font-bold leading-tight mb-2 text-white">{event.title}</h3>
            <p class="text-sm text-white/65 leading-relaxed mb-2">{event.description}</p>
            <p class="inline-flex items-center gap-2 text-xs font-semibold text-accent-gold/90">
              <span class="block w-1.5 h-1.5 rounded-full bg-accent-gold"></span>
              {event.milestone}
            </p>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <p class="text-center text-[10px] font-mono uppercase tracking-[0.3em] text-white/40 mt-4">
    {t('← Faire défiler →', '← Scroll →')}
  </p>
</section>

<!-- Founder Section -->
<section class="py-20 lg:py-24 bg-neutral-sand">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-12 gap-8 lg:gap-12 items-center">
      <!-- Portrait -->
      <div class="col-span-12 lg:col-span-5">
        <ScrollReveal animation="fade-up">
          <div class="relative aspect-[4/5] max-w-md mx-auto lg:mx-0 overflow-hidden rounded-3xl shadow-xl">
            <CmsImage
              key="about.founder.portrait"
              src="/images/about/angele-tawari.jpg"
              alt={t("Angèle Tawari, fondatrice d'Angel's Floor", "Angèle Tawari, founder of Angel's Floor")}
              class="w-full h-full object-cover"
            />
          </div>
        </ScrollReveal>
      </div>

      <!-- Story -->
      <div class="col-span-12 lg:col-span-7">
        <ScrollReveal animation="fade-up" delay={150}>
          <CmsText key="about.founder.kicker" tag="p" class="text-sm font-semibold text-primary-green uppercase tracking-wider mb-3" en="The founder">La fondatrice</CmsText>
          <CmsText key="about.founder.name" tag="h2" class="text-4xl md:text-5xl font-bold text-black mb-3 leading-tight">Angèle Tawari</CmsText>
          <CmsText key="about.founder.role" tag="p" class="text-lg text-neutral-charcoal mb-8" en="Food-processing entrepreneur and founder of Angel's Floor">Entrepreneure agroalimentaire, fondatrice d'Angel's Floor</CmsText>

          <div class="space-y-5 text-base md:text-lg text-neutral-charcoal leading-relaxed">
            <CmsText
              key="about.founder.p1"
              tag="p"
              en="Originally from Boukombé and now based in Natitingou, Angèle Tawari combines enterprise with a deep social commitment."
            >Originaire de Boukombé et basée à Natitingou, Angèle Tawari allie action économique et engagement social.</CmsText>

            <CmsText
              key="about.founder.p2"
              tag="p"
              en="Since 2012, she has led Angel's Floor, her company dedicated to bringing out the value of local resources: fonio, baobab, néré and mango. These are foods that were long overlooked, some even at risk of disappearing, yet they are rich in nutritional, social and economic value."
            >Depuis 2012, elle dirige Angel's Floor, son entreprise dédiée à la valorisation des ressources locales : fonio, baobab, néré, mangue. Des produits longtemps sous-exploités, parfois en voie de disparition, mais à forte valeur nutritionnelle et socio-économique.</CmsText>

            <CmsText
              key="about.founder.p3"
              tag="p"
              en="She has turned this venture into a driver of local development, creating jobs and opening up lasting economic opportunities for the young people and women of her region. Active in several community groups and networks, many of which she coordinates or chairs, she amplifies the economic and social impact of local entrepreneurship."
            >Elle a transformé cette initiative en levier de développement local, créant des emplois et ouvrant des opportunités économiques durables aux jeunes et aux femmes de sa région. Active dans plusieurs groupements et réseaux communautaires qu'elle coordonne ou préside, elle renforce l'impact économique et social de l'entrepreneuriat local.</CmsText>

            <CmsText
              key="about.founder.p4"
              tag="p"
              en="Backed by numerous programmes and partnerships, she embodies a new generation of Beninese women in business who draw on innovation, tradition and civic engagement to transform the land they call home."
            >Soutenue par de nombreux programmes et partenariats, elle incarne une nouvelle génération d'actrices économiques béninoises qui misent sur l'innovation, la tradition et l'engagement citoyen pour transformer leur territoire.</CmsText>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </div>
</section>

<!-- Mission & Values Section -->
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <ScrollReveal animation="fade-up">
      <div class="text-center mb-12">
        <CmsText key="about.mission.overline" tag="p" class="text-sm font-semibold text-primary-green uppercase tracking-wider mb-3" en="What Guides Us">Ce Qui Nous Guide</CmsText>
        <CmsText key="about.mission.title" tag="h2" class="text-4xl md:text-5xl font-bold text-black mb-4" en="Our Mission & Values">Notre Mission & Valeurs</CmsText>
        <CmsText key="about.mission.description" tag="p" class="text-xl text-neutral-charcoal max-w-3xl mx-auto" en="Turning local products into lasting opportunities for our communities">Transformer les produits locaux en opportunités durables pour nos communautés</CmsText>
      </div>
    </ScrollReveal>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Mission -->
      <ScrollReveal animation="fade-up" delay={0}>
      <div class="bg-primary-green rounded-3xl p-8 text-white">
        <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
          <Target class="w-8 h-8" />
        </div>
        <h3 class="text-2xl font-bold mb-4">{t('Notre Mission', 'Our Mission')}</h3>
        <p class="text-white/90">
          {t(
            'Valoriser les produits agricoles béninois en créant des opportunités économiques durables pour les femmes rurales tout en offrant des aliments sains et authentiques.',
            'To champion Beninese agricultural products by creating lasting economic opportunities for rural women, while offering healthy, authentic food.'
          )}
        </p>
      </div>
      </ScrollReveal>
      
      <!-- Values 1 -->
      <ScrollReveal animation="fade-up" delay={100}>
      <div class="bg-white border-2 border-primary-green/20 rounded-3xl p-8">
        <div class="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center mb-6">
          <Heart class="w-8 h-8 text-white" />
        </div>
        <h3 class="text-2xl font-bold text-primary-green mb-4">{t('Authenticité', 'Authenticity')}</h3>
        <ul class="space-y-3 text-neutral-charcoal">
          <li class="flex items-start">
            <span class="text-primary-green mr-2">•</span>
            {t('Produits 100% naturels et locaux', '100% natural, local products')}
          </li>
          <li class="flex items-start">
            <span class="text-primary-green mr-2">•</span>
            {t('Méthodes traditionnelles préservées', 'Traditional methods preserved')}
          </li>
          <li class="flex items-start">
            <span class="text-primary-green mr-2">•</span>
            {t('Transparence totale sur nos processus', 'Full transparency about our processes')}
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
        <h3 class="text-2xl font-bold text-primary-green mb-4">{t('Impact Social', 'Social Impact')}</h3>
        <ul class="space-y-3 text-neutral-charcoal">
          <li class="flex items-start">
            <span class="text-primary-green mr-2">•</span>
            {t('Autonomisation des femmes rurales', 'Empowering rural women')}
          </li>
          <li class="flex items-start">
            <span class="text-primary-green mr-2">•</span>
            {t('Commerce équitable et solidaire', 'Fair and ethical trade')}
          </li>
          <li class="flex items-start">
            <span class="text-primary-green mr-2">•</span>
            {t('Développement communautaire durable', 'Sustainable community development')}
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
          <h3 class="text-xl font-bold">{t('Durabilité Environnementale', 'Environmental Sustainability')}</h3>
        </div>
        <p class="text-white/90">
          {t(
            "Agriculture biologique, emballages éco-responsables, et pratiques de production respectueuses de l'environnement.",
            'Organic farming, eco-friendly packaging and environmentally responsible production practices.'
          )}
        </p>
      </div>
      </ScrollReveal>
      
      <ScrollReveal animation="fade-left">
      <div class="bg-primary-green rounded-3xl p-8 text-white">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
            <TrendingUp class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold">{t('Innovation Continue', 'Continuous Innovation')}</h3>
        </div>
        <p class="text-white/90">
          {t(
            'Recherche constante de nouvelles recettes, amélioration des processus, et adaptation aux besoins changeants du marché.',
            "A constant search for new recipes, ever-better processes and close attention to the market's changing needs."
          )}
        </p>
      </div>
      </ScrollReveal>
    </div>
  </div>
</section>

<!-- Team Section (Hidden) -->
{#if false}
<section class="py-20 bg-neutral-sand">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <ScrollReveal animation="fade-up">
      <div class="text-center mb-12">
        <p class="text-sm font-semibold text-primary-green uppercase tracking-wider mb-3">{t("Les Visages d'Angel's Floor", "The Faces of Angel's Floor")}</p>
        <h2 class="text-4xl md:text-5xl font-bold text-black mb-4">
          {t('Notre Équipe', 'Our Team')}
        </h2>
        <p class="text-xl text-neutral-charcoal max-w-3xl mx-auto">
          {t('Des femmes passionnées qui transforment les traditions en innovations', 'Passionate women turning tradition into innovation')}
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
          <p class="text-primary-green font-semibold mb-3">{t('Fondatrice & Directrice', 'Founder & Director')}</p>
          <p class="text-neutral-charcoal text-sm">
            {t(
              "Visionnaire passionnée, elle a créé Angel's Floor pour transformer la vie des femmes de sa communauté à travers la valorisation des produits locaux.",
              "A passionate visionary, she founded Angel's Floor to transform the lives of the women in her community by championing local products."
            )}
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
          <p class="text-primary-green font-semibold mb-3">{t('Responsable Production', 'Production Manager')}</p>
          <p class="text-neutral-charcoal text-sm">
            {t(
              "Experte en transformation alimentaire, elle garantit la qualité exceptionnelle de chaque produit Angel's Floor.",
              "An expert in food processing, she guarantees the exceptional quality of every Angel's Floor product."
            )}
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
          <p class="text-primary-green font-semibold mb-3">{t('Coordinatrice Réseau', 'Network Coordinator')}</p>
          <p class="text-neutral-charcoal text-sm">
            {t(
              'Elle coordonne le réseau de plus de 500 productrices et assure la formation continue des membres.',
              'She coordinates the network of more than 500 women producers and leads ongoing training for its members.'
            )}
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
{/if}

<!-- Certifications & Partners Section (Hidden) -->
{#if false}
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <p class="text-sm font-semibold text-primary-green uppercase tracking-wider mb-3">{t('Reconnaissance & Collaboration', 'Recognition & Collaboration')}</p>
      <h2 class="text-4xl md:text-5xl font-bold text-black mb-4">
        {t('Certifications & Partenaires', 'Certifications & Partners')}
      </h2>
      <p class="text-xl text-neutral-charcoal max-w-3xl mx-auto">
        {t('Des garanties de qualité et des collaborations qui renforcent notre impact', 'Quality guarantees and collaborations that strengthen our impact')}
      </p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
      <!-- Certifications -->
      <div>
        <h3 class="text-2xl font-bold text-primary-green mb-6">{t('Nos Certifications', 'Our Certifications')}</h3>
        <div class="space-y-4">
          <div class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 flex items-center hover:shadow-lg transition-all duration-300">
            <div class="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <span class="text-white text-2xl">🌿</span>
            </div>
            <div>
              <h4 class="font-semibold text-neutral-obsidian">{t('Certification Bio', 'Organic Certification')}</h4>
              <p class="text-sm text-neutral-slate">{t('Produits 100% biologiques certifiés', 'Certified 100% organic products')}</p>
            </div>
          </div>
          
          <div class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 flex items-center hover:shadow-lg transition-all duration-300">
            <div class="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <span class="text-white text-2xl">✓</span>
            </div>
            <div>
              <h4 class="font-semibold text-neutral-obsidian">{t('Normes HACCP', 'HACCP Standards')}</h4>
              <p class="text-sm text-neutral-slate">{t('Sécurité alimentaire garantie', 'Guaranteed food safety')}</p>
            </div>
          </div>
          
          <div class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 flex items-center hover:shadow-lg transition-all duration-300">
            <div class="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <span class="text-white text-2xl">🤝</span>
            </div>
            <div>
              <h4 class="font-semibold text-neutral-obsidian">{t('Commerce Équitable', 'Fair Trade')}</h4>
              <p class="text-sm text-neutral-slate">{t('Pratiques commerciales éthiques', 'Ethical trading practices')}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Partners -->
      <div>
        <h3 class="text-2xl font-bold text-primary-green mb-6">{t('Partenaires Clés', 'Key Partners')}</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 flex items-center justify-center h-24 hover:shadow-lg transition-all duration-300">
            <span class="text-primary-green font-bold">MASM</span>
          </div>
          <div class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 flex items-center justify-center h-24 hover:shadow-lg transition-all duration-300">
            <span class="text-primary-green font-bold">TACA</span>
          </div>
          <div class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 flex items-center justify-center h-24 hover:shadow-lg transition-all duration-300">
            <span class="text-primary-green font-bold">{t('ONG Locale', 'Local NGO')}</span>
          </div>
          <div class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 flex items-center justify-center h-24 hover:shadow-lg transition-all duration-300">
            <span class="text-primary-green font-bold">{t('Distributeurs', 'Distributors')}</span>
          </div>
        </div>
        
        <div class="mt-6 p-6 bg-primary-green rounded-3xl text-white">
          <h4 class="font-semibold mb-2">{t('Devenir Partenaire', 'Become a Partner')}</h4>
          <p class="text-sm text-white/90 mb-4">
            {t('Rejoignez notre réseau de partenaires engagés pour un impact durable.', 'Join our network of committed partners for lasting impact.')}
          </p>
          <a 
            href={href('/contact')}
            class="inline-block bg-white text-primary-green px-6 py-2 rounded-full font-semibold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            {t('Nous contacter', 'Contact us')}
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
{/if}

<!-- Call to Action -->
<section class="py-20 bg-primary-green relative overflow-hidden">
  <div class="absolute inset-0">
    <div class="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
  </div>
  
  <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <CmsText key="about.cta.title" tag="h2" class="text-4xl md:text-5xl font-bold text-white mb-6" en="Be Part of Our Story">Faites Partie de Notre Histoire</CmsText>
    <CmsText key="about.cta.description" tag="p" class="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto" en="Discover how our products can transform the way you eat while supporting the empowerment of Beninese women.">Découvrez comment nos produits peuvent transformer votre alimentation tout en soutenant l'autonomisation des femmes béninoises.</CmsText>
    
    <div class="flex flex-col sm:flex-row gap-4 justify-center w-full">
      <a 
        href={href('/produits')}
        class="block sm:inline-block w-full sm:w-auto text-center bg-white text-primary-green px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
      >
        {t('Découvrir Nos Produits', 'Discover Our Products')}
      </a>
      <a 
        href={href('/contact')}
        class="block sm:inline-block w-full sm:w-auto text-center bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white/10 transition-all duration-300"
      >
        {t('Nous Contacter', 'Contact Us')}
      </a>
    </div>
  </div>
</section>

<style>
  /* Graduation tick marks along the baseline — short verticals every 24px */
  .timeline-graduations {
    background-image: repeating-linear-gradient(
      to right,
      transparent 0,
      transparent 23px,
      rgba(255, 255, 255, 0.22) 23px,
      rgba(255, 255, 255, 0.22) 24px
    );
  }

  .timeline-track-mobile {
    scrollbar-width: none;
  }
  .timeline-track-mobile::-webkit-scrollbar {
    display: none;
  }

  /* Polaroid styling — slight off-white paper feel with tape */
  .polaroid {
    transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
    will-change: transform;
  }
  .polaroid:hover {
    transform: rotate(0deg) scale(1.02) !important;
    z-index: 5;
  }

  /* Masking tape on polaroid corners */
  .tape {
    position: absolute;
    width: 70px;
    height: 22px;
    background: linear-gradient(
      to bottom,
      rgba(255, 245, 200, 0.65),
      rgba(255, 235, 175, 0.55)
    );
    border-left: 1px solid rgba(255, 255, 255, 0.4);
    border-right: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
    pointer-events: none;
  }
  .tape-tl {
    top: -8px;
    left: 16px;
    transform: rotate(-14deg);
  }
  .tape-tr {
    top: -8px;
    right: 16px;
    transform: rotate(14deg);
  }

  /* Handwriting-style date on polaroids — fallback to system cursive */
  .font-handwritten {
    font-family: 'Caveat', 'Bradley Hand', 'Comic Sans MS', cursive;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  .about-photo {
    opacity: 0;
    animation: aboutPhotoIn 1.1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }
  @keyframes aboutPhotoIn {
    to {
      opacity: 1;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .about-photo {
      animation: none;
      opacity: 1;
    }
    .polaroid {
      transition: none;
    }
  }
</style>