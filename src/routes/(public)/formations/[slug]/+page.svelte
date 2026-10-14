<script lang="ts">
  import { onMount } from 'svelte';
  import { ArrowLeft, ArrowRight, MessageCircle, X, Clock, Tag, Image as ImageIcon } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { t, href, formatNumber } from '$lib/i18n';

  let { data }: { data: PageData } = $props();

  const WHATSAPP_NUMBER = '22901961219171';

  let modalOpen = $state(false);
  let name = $state('');
  let phone = $state('');
  let period = $state('');
  let note = $state('');

  function categoryLabel(c: string): string {
    return c === 'cosmetique' ? t('Cosmétique', 'Cosmetics') : t('Agroalimentaire', 'Food processing');
  }

  function daysLabel(n: number): string {
    return t(`${n} jours`, `${n} ${n === 1 ? 'day' : 'days'}`);
  }

  function openModal() {
    name = '';
    phone = '';
    period = '';
    note = '';
    modalOpen = true;
    if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOpen = false;
    if (typeof document !== 'undefined') document.body.style.overflow = '';
  }

  function buildMessage(): string {
    const training = data.training;
    const days = daysLabel(training.duration_days);
    const price = formatNumber(training.price);
    const lines: string[] = [];
    lines.push(t("Bonjour Angel's Floor,", "Hello Angel's Floor,"));
    lines.push('');
    lines.push(
      t(
        `Je suis intéressé(e) par la formation : ${training.title}`,
        `I'm interested in the training course: ${training.title}`
      )
    );
    lines.push(t(`Durée : ${days} · Prix : ${price} FCFA`, `Duration: ${days} · Price: ${price} FCFA`));
    lines.push('');
    if (period.trim()) {
      lines.push(t(`Période souhaitée : ${period.trim()}`, `Preferred dates: ${period.trim()}`));
      lines.push('');
    }
    if (name.trim()) lines.push(t(`Nom : ${name.trim()}`, `Name: ${name.trim()}`));
    if (phone.trim()) lines.push(t(`Téléphone : ${phone.trim()}`, `Phone: ${phone.trim()}`));
    if (note.trim()) {
      lines.push('');
      lines.push(t(`Note : ${note.trim()}`, `Note: ${note.trim()}`));
    }
    lines.push('');
    lines.push(t('Merci.', 'Thank you.'));
    return lines.join('\n');
  }

  function sendOnWhatsApp() {
    const text = encodeURIComponent(buildMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener');
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Escape' && modalOpen) closeModal();
  }

  onMount(() => () => {
    if (typeof document !== 'undefined') document.body.style.overflow = '';
  });
</script>

<svelte:window onkeydown={handleKey} />

<svelte:head>
  <title>{data.training.title} | {t("Formations Angel's Floor", "Angel's Floor Training")}</title>
  <meta
    name="description"
    content={data.training.description ||
      t(
        `Formation Angel's Floor : ${data.training.title}. ${daysLabel(data.training.duration_days)}.`,
        `Angel's Floor training course: ${data.training.title}. ${daysLabel(data.training.duration_days)}.`
      )}
  />
</svelte:head>

<!-- Breadcrumb / Retour -->
<section class="bg-neutral-sand pt-8 pb-2">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <a
      href={href('/formations')}
      class="inline-flex items-center gap-2 text-sm text-neutral-charcoal hover:text-primary-green transition-colors"
    >
      <ArrowLeft class="w-4 h-4" />
      {t('Retour au catalogue', 'Back to the catalogue')}
    </a>
  </div>
</section>

<!-- DÉTAIL -->
<section class="bg-neutral-sand pt-6 pb-16 lg:pb-20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-12 gap-6 lg:gap-10">
      <!-- Image -->
      <div class="col-span-12 lg:col-span-6">
        <div class="aspect-[4/3] bg-white rounded-3xl overflow-hidden shadow-sm">
          {#if data.training.image}
            <img src={data.training.image} alt={data.training.title} class="w-full h-full object-cover" />
          {:else}
            <div class="w-full h-full flex items-center justify-center text-neutral-slate">
              <ImageIcon class="w-16 h-16" />
            </div>
          {/if}
        </div>
      </div>

      <!-- Content -->
      <div class="col-span-12 lg:col-span-6 flex flex-col">
        <div class="inline-flex items-center gap-2 text-xs font-semibold text-primary-green uppercase tracking-wider mb-4">
          <Tag class="w-3.5 h-3.5" />
          {categoryLabel(data.training.category)}
        </div>

        <h1 class="text-3xl md:text-4xl font-bold text-neutral-obsidian leading-tight mb-5">{data.training.title}</h1>

        {#if data.training.description}
          <p class="text-base md:text-lg text-neutral-charcoal leading-relaxed mb-8">{data.training.description}</p>
        {/if}

        <!-- Meta -->
        <div class="bg-white rounded-2xl p-5 mb-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-xs font-semibold text-neutral-slate uppercase tracking-wider mb-1">{t('Durée', 'Duration')}</div>
              <div class="inline-flex items-center gap-2 text-lg font-bold text-neutral-obsidian">
                <Clock class="w-4 h-4 text-primary-green" />
                {daysLabel(data.training.duration_days)}
              </div>
            </div>
            <div>
              <div class="text-xs font-semibold text-neutral-slate uppercase tracking-wider mb-1">{t('Prix', 'Price')}</div>
              <div class="text-lg font-bold text-primary-green">{formatNumber(data.training.price)} <span class="text-xs font-medium text-neutral-charcoal">FCFA</span></div>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <button
          onclick={openModal}
          class="inline-flex items-center justify-center gap-2 bg-primary-green text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 self-start"
        >
          {t('Je suis intéressé', "I'm interested")}
          <ArrowRight class="w-5 h-5" />
        </button>

        <p class="text-xs text-neutral-slate mt-3">
          {t('Nous fixons ensemble une date qui vous convient.', "Together, we'll set a date that suits you.")}
        </p>
      </div>
    </div>
  </div>
</section>

<!-- Voir aussi -->
{#if data.related.length > 0}
  <section class="bg-white py-16 lg:py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-2xl md:text-3xl font-bold text-neutral-obsidian mb-8">{t('Dans la même catégorie', 'In the same category')}</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {#each data.related as related}
          <a href={href(`/formations/${related.slug}`)} class="block bg-neutral-sand rounded-2xl overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group">
            <div class="aspect-[4/3] bg-white overflow-hidden">
              {#if related.image}
                <img src={related.image} alt={related.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {:else}
                <div class="w-full h-full flex items-center justify-center text-neutral-slate">
                  <ImageIcon class="w-10 h-10" />
                </div>
              {/if}
            </div>
            <div class="p-5 flex flex-col flex-1">
              <h3 class="text-base font-bold text-neutral-obsidian mb-3 leading-snug">{related.title}</h3>
              <div class="flex items-baseline justify-between mt-auto pt-3 border-t border-neutral-light">
                <div class="text-sm text-neutral-charcoal">{daysLabel(related.duration_days)}</div>
                <div class="text-base font-bold text-primary-green">{formatNumber(related.price)} <span class="text-xs font-medium">FCFA</span></div>
              </div>
            </div>
          </a>
        {/each}
      </div>
    </div>
  </section>
{/if}

<!-- MODAL -->
{#if modalOpen}
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
    <button type="button" class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick={closeModal} aria-label={t('Fermer', 'Close')}></button>

    <div class="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl">
      <button
        type="button"
        onclick={closeModal}
        class="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-md transition-colors"
        aria-label={t('Fermer', 'Close')}
      >
        <X class="w-5 h-5 text-neutral-charcoal" />
      </button>

      <div class="bg-neutral-sand p-6 lg:p-8">
        <div class="text-xs font-semibold text-primary-green uppercase tracking-wider mb-2">{categoryLabel(data.training.category)}</div>
        <h2 class="text-xl md:text-2xl font-bold text-neutral-obsidian mb-2 leading-tight">{data.training.title}</h2>
        <div class="flex flex-wrap gap-x-4 text-sm text-neutral-charcoal">
          <span>{daysLabel(data.training.duration_days)}</span>
          <span class="font-semibold text-primary-green">{formatNumber(data.training.price)} FCFA</span>
        </div>
      </div>

      <div class="p-6 lg:p-8">
        <h3 class="text-base font-bold text-neutral-obsidian mb-1">{t('Vos coordonnées', 'Your details')}</h3>
        <p class="text-sm text-neutral-charcoal mb-5">{t('Nous démarrons la discussion sur WhatsApp pour fixer la date et les détails.', "We'll pick up the conversation on WhatsApp to set the date and details.")}</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="d-name" class="block text-sm font-medium text-neutral-charcoal mb-1">{t('Votre nom', 'Your name')}</label>
            <input
              id="d-name"
              type="text"
              bind:value={name}
              class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
              placeholder={t('Prénom Nom', 'First name Last name')}
            />
          </div>
          <div>
            <label for="d-phone" class="block text-sm font-medium text-neutral-charcoal mb-1">{t('Téléphone / WhatsApp', 'Phone / WhatsApp')}</label>
            <input
              id="d-phone"
              type="tel"
              bind:value={phone}
              class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
              placeholder="+229 XX XX XX XX"
            />
          </div>
          <div class="sm:col-span-2">
            <label for="d-period" class="block text-sm font-medium text-neutral-charcoal mb-1">{t('Quand souhaitez-vous faire la formation ?', 'When would you like to take the course?')}</label>
            <input
              id="d-period"
              type="text"
              bind:value={period}
              class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
              placeholder={t('Ex : dès que possible, juin 2026, les weekends…', 'E.g. as soon as possible, June 2026, weekends…')}
            />
          </div>
          <div class="sm:col-span-2">
            <label for="d-note" class="block text-sm font-medium text-neutral-charcoal mb-1">{t('Note (optionnel)', 'Note (optional)')}</label>
            <textarea
              id="d-note"
              bind:value={note}
              rows="3"
              class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
              placeholder={t('Une question, un détail à préciser…', 'A question, a detail to clarify…')}
            ></textarea>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 mt-6 pt-5 border-t border-neutral-light">
          <button
            type="button"
            onclick={closeModal}
            class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-neutral-light text-neutral-charcoal text-sm font-semibold hover:bg-neutral-sand transition-colors"
          >
            {t('Annuler', 'Cancel')}
          </button>
          <button
            type="button"
            onclick={sendOnWhatsApp}
            class="flex-1 inline-flex items-center justify-center gap-2 bg-primary-green text-white px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <MessageCircle class="w-5 h-5" />
            {t('Démarrer sur WhatsApp', 'Continue on WhatsApp')}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
