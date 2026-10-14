<script lang="ts">
  import { MapPin, Phone, Clock, Search, Filter, Navigation } from 'lucide-svelte';
  import type { PublicSalesPoint } from '$lib/cms/salesPoints';
  import { CmsText } from '$lib/components/cms';
  import { t } from '$lib/i18n';

  let { data }: { data: { salesPoints: PublicSalesPoint[] } } = $props();
  const salesPoints = $derived(data.salesPoints);

  let selectedDepartment = $state('Tous');
  let selectedType = $state('Tous');
  let searchQuery = $state('');

  const departments = $derived([
    'Tous',
    ...Array.from(new Set(salesPoints.map((p) => p.department))).sort()
  ]);
  const types = ['Tous', 'boutique', 'supermarché', 'marché', 'pharmacie'];

  const filteredSalesPoints = $derived(
    salesPoints.filter((point) => {
      const matchesDepartment =
        selectedDepartment === 'Tous' || point.department === selectedDepartment;
      const matchesType = selectedType === 'Tous' || point.type === selectedType;
      const matchesSearch =
        searchQuery === '' ||
        point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        point.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        point.city.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDepartment && matchesType && matchesSearch;
    })
  );

  const salesPointsByDepartment = $derived(
    filteredSalesPoints.reduce(
      (acc, point) => {
        if (!acc[point.department]) {
          acc[point.department] = [];
        }
        acc[point.department].push(point);
        return acc;
      },
      {} as Record<string, PublicSalesPoint[]>
    )
  );

  function getTypeColor(type: string) {
    switch (type) {
      case 'boutique':
        return '#4ADE80';
      case 'supermarché':
        return '#F59E0B';
      case 'marché':
        return '#8B5CF6';
      case 'pharmacie':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  }

  function getTypeLabel(type: string) {
    switch (type) {
      case 'Tous':
        return t('Tous', 'All');
      case 'boutique':
        return t('Boutique', 'Shop');
      case 'supermarché':
        return t('Supermarché', 'Supermarket');
      case 'marché':
        return t('Marché', 'Market');
      case 'pharmacie':
        return t('Pharmacie', 'Pharmacy');
      default:
        return type;
    }
  }
</script>

<div class="min-h-screen bg-neutral-sand">
  <!-- Simple page header — white bg, left-aligned, no overline -->
  <section class="bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <CmsText
        key="sales-points.hero.title"
        tag="h1"
        class="text-4xl md:text-5xl font-bold text-black mb-4 leading-tight"
        en="Where to Buy"
        >Nos Points de Vente</CmsText
      >
      <CmsText
        key="sales-points.hero.subtitle"
        tag="p"
        class="text-lg text-neutral-charcoal max-w-2xl leading-relaxed"
        en="Find our products at our partner retailers across Benin"
        >Trouvez nos produits chez nos revendeurs partenaires à travers le Bénin</CmsText
      >
    </div>
  </section>

  <!-- Filtres -->
  <section class="bg-white border-b sticky top-0 z-40 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Recherche -->
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-slate" />
          <input
            type="text"
            bind:value={searchQuery}
            placeholder={t('Rechercher un point de vente...', 'Search for a sales point...')}
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green"
          />
        </div>

        <!-- Filtre Département -->
        <div class="relative">
          <Filter class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-slate" />
          <select
            bind:value={selectedDepartment}
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green appearance-none bg-white"
          >
            {#each departments as dept}
              <option value={dept}>{dept === 'Tous' ? t('Tous', 'All') : dept}</option>
            {/each}
          </select>
        </div>

        <!-- Filtre Type -->
        <div class="relative">
          <MapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-slate" />
          <select
            bind:value={selectedType}
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green appearance-none bg-white"
          >
            {#each types as type}
              <option value={type}>{getTypeLabel(type)}</option>
            {/each}
          </select>
        </div>

        <!-- Résultats -->
        <div class="flex items-center justify-center md:justify-end">
          <span class="text-neutral-charcoal font-semibold">
            {t(
              `${filteredSalesPoints.length} point${filteredSalesPoints.length > 1 ? 's' : ''} de vente`,
              `${filteredSalesPoints.length} sales point${filteredSalesPoints.length === 1 ? '' : 's'}`
            )}
          </span>
        </div>
      </div>
    </div>
  </section>

  <!-- Liste des points de vente -->
  <section class="py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {#if salesPoints.length === 0}
        <div class="bg-white rounded-2xl shadow-lg p-12 text-center">
          <MapPin class="w-12 h-12 text-neutral-slate mx-auto mb-4" />
          <p class="text-lg text-neutral-charcoal">{t('Nos points de vente arrivent bientôt', 'Our sales points are coming soon')}</p>
          <p class="text-sm text-neutral-slate mt-2">
            {t(
              'Contactez-nous pour connaître le revendeur le plus proche de chez vous.',
              'Contact us to find the retailer nearest you.'
            )}
          </p>
        </div>
      {:else if Object.keys(salesPointsByDepartment).length === 0}
        <div class="bg-white rounded-2xl shadow-lg p-12 text-center">
          <MapPin class="w-12 h-12 text-neutral-slate mx-auto mb-4" />
          <p class="text-lg text-neutral-charcoal">{t('Aucun point de vente trouvé', 'No sales points found')}</p>
          <p class="text-sm text-neutral-slate mt-2">{t('Essayez de modifier vos filtres', 'Try adjusting your filters')}</p>
        </div>
      {:else}
        {#each Object.entries(salesPointsByDepartment) as [department, points]}
          <div class="mb-12">
            <h2
              class="text-2xl font-bold text-primary-green mb-6 pb-2 border-b-2 border-primary-green/20"
            >
              {department}
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {#each points as point}
                <div
                  class="bg-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 p-6"
                >
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <h3 class="font-semibold text-lg text-neutral-obsidian">
                      {point.name}
                    </h3>
                    <span
                      class="shrink-0 px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style="background-color: {getTypeColor(point.type)}"
                    >
                      {getTypeLabel(point.type)}
                    </span>
                  </div>
                  <p class="text-sm text-neutral-charcoal flex items-start">
                    <MapPin class="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span>{point.address}, {point.city}</span>
                  </p>
                  {#if point.situation}
                    <p class="text-sm text-neutral-slate mt-2 flex items-start">
                      <Navigation class="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                      <span>{point.situation}</span>
                    </p>
                  {/if}
                  {#if point.phone}
                    <p class="text-sm text-neutral-slate mt-2 flex items-center">
                      <Phone class="w-4 h-4 mr-2 shrink-0" />
                      {point.phone}
                    </p>
                  {/if}
                  {#if point.hours}
                    <p class="text-sm text-neutral-slate mt-2 flex items-center">
                      <Clock class="w-4 h-4 mr-2 shrink-0" />
                      {point.hours}
                    </p>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </section>

  <!-- Légende -->
  <section class="pb-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-lg font-semibold text-neutral-obsidian mb-4">{t('Légende', 'Legend')}</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="flex items-center">
            <div class="w-6 h-6 rounded-full mr-3" style="background-color: #4ADE80;"></div>
            <span class="text-sm text-neutral-charcoal">{getTypeLabel('boutique')}</span>
          </div>
          <div class="flex items-center">
            <div class="w-6 h-6 rounded-full mr-3" style="background-color: #F59E0B;"></div>
            <span class="text-sm text-neutral-charcoal">{getTypeLabel('supermarché')}</span>
          </div>
          <div class="flex items-center">
            <div class="w-6 h-6 rounded-full mr-3" style="background-color: #8B5CF6;"></div>
            <span class="text-sm text-neutral-charcoal">{getTypeLabel('marché')}</span>
          </div>
          <div class="flex items-center">
            <div class="w-6 h-6 rounded-full mr-3" style="background-color: #EF4444;"></div>
            <span class="text-sm text-neutral-charcoal">{getTypeLabel('pharmacie')}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
