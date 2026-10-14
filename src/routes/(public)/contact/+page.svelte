<script lang="ts">
  import { onMount } from 'svelte';
  import { Phone, Mail, MapPin, Clock, Send, MessageSquare, Store } from 'lucide-svelte';
  import { CmsText } from '$lib/components/cms';
  import PageHeader from '$lib/components/ui/PageHeader.svelte';
  import { t, href, getLocale } from '$lib/i18n';

  let formData = $state({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
    website: ''
  });

  let isSubmitting = $state(false);
  let showSuccess = $state(false);
  // 'invalid' = rejected by the API (400), 'failed' = any other error.
  // The message itself is derived so it follows the current language.
  let errorKind = $state<'' | 'invalid' | 'failed'>('');
  const errorMessage = $derived(
    errorKind === 'invalid'
      ? t(
          'Certains champs sont manquants ou invalides. Veuillez vérifier votre saisie.',
          'Some fields are missing or invalid. Please check your details and try again.'
        )
      : errorKind === 'failed'
        ? t(
            "Erreur lors de l'envoi. Veuillez réessayer dans quelques instants.",
            "Your message couldn't be sent. Please try again in a moment."
          )
        : ''
  );

  async function handleSubmit(event: Event) {
    event.preventDefault();
    isSubmitting = true;
    errorKind = '';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, locale: getLocale() })
      });

      if (!res.ok) {
        errorKind = res.status === 400 ? 'invalid' : 'failed';
        return;
      }

      showSuccess = true;
      formData = {
        name: '',
        email: '',
        phone: '',
        subject: 'general',
        message: '',
        website: ''
      };

      setTimeout(() => {
        showSuccess = false;
      }, 5000);
    } catch {
      errorKind = 'failed';
    } finally {
      isSubmitting = false;
    }
  }

  onMount(() => {
    // Any initialization if needed
  });
</script>

<svelte:head>
  <title>Contact - Angel's Floor</title>
  <meta
    name="description"
    content={t(
      "Contactez Angel's Floor pour vos commandes, questions ou partenariats. Nous sommes à votre écoute.",
      "Contact Angel's Floor about orders, questions or partnerships. We're here to help."
    )}
  />
</svelte:head>

<PageHeader
  imageKey="contact.hero.image"
  defaultImage="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&h=1080&fit=crop&q=80"
  overlineKey="contact.hero.overline"
  overline={t('Restons en lien', "Let's Stay in Touch")}
  titleKey="contact.hero.title"
  title={t('Contactez-Nous', 'Contact Us')}
  subtitleKey="contact.hero.subtitle"
  subtitle={t(
    'Nous sommes à votre écoute pour répondre à toutes vos questions et vous accompagner dans vos projets',
    "We're here to answer all your questions and support you with your projects"
  )}
/>

<!-- Contact Information Cards -->
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      <!-- Phone Card -->
      <div class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 hover:shadow-lg transition-all duration-300">
        <div class="w-12 h-12 bg-primary-green rounded-full flex items-center justify-center mb-4">
          <Phone class="w-6 h-6 text-white" />
        </div>
        <CmsText key="contact.phone.label" tag="h3" class="font-bold text-lg text-black mb-2" en="Phone">Téléphone</CmsText>
        <CmsText key="contact.phone.line1" tag="p" class="text-neutral-charcoal text-sm mb-1">+229 01 97 123 456</CmsText>
        <CmsText key="contact.phone.line2" tag="p" class="text-neutral-charcoal text-sm">+229 01 96 789 012</CmsText>
      </div>

      <!-- Email Card -->
      <div class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 hover:shadow-lg transition-all duration-300">
        <div class="w-12 h-12 bg-primary-green rounded-full flex items-center justify-center mb-4">
          <Mail class="w-6 h-6 text-white" />
        </div>
        <CmsText key="contact.email.label" tag="h3" class="font-bold text-lg text-black mb-2" en="Email">Email</CmsText>
        <CmsText key="contact.email.line1" tag="p" class="text-neutral-charcoal text-sm mb-1">contact@angelsfloor.com</CmsText>
        <CmsText key="contact.email.line2" tag="p" class="text-neutral-charcoal text-sm">commandes@angelsfloor.com</CmsText>
      </div>

      <!-- Address Card -->
      <div class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 hover:shadow-lg transition-all duration-300">
        <div class="w-12 h-12 bg-primary-green rounded-full flex items-center justify-center mb-4">
          <MapPin class="w-6 h-6 text-white" />
        </div>
        <CmsText key="contact.address.label" tag="h3" class="font-bold text-lg text-black mb-2" en="Address">Adresse</CmsText>
        <CmsText key="contact.address.line1" tag="p" class="text-neutral-charcoal text-sm mb-1">Natitingou, Atacora</CmsText>
        <CmsText key="contact.address.line2" tag="p" class="text-neutral-charcoal text-sm" en="Republic of Benin">République du Bénin</CmsText>
      </div>

      <!-- Hours Card -->
      <div class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 hover:shadow-lg transition-all duration-300">
        <div class="w-12 h-12 bg-primary-green rounded-full flex items-center justify-center mb-4">
          <Clock class="w-6 h-6 text-white" />
        </div>
        <CmsText key="contact.hours.label" tag="h3" class="font-bold text-lg text-black mb-2" en="Opening Hours">Horaires</CmsText>
        <CmsText key="contact.hours.line1" tag="p" class="text-neutral-charcoal text-sm mb-1" en="Mon - Fri: 8am - 6pm">Lun - Ven: 8h - 18h</CmsText>
        <CmsText key="contact.hours.line2" tag="p" class="text-neutral-charcoal text-sm" en="Sat: 9am - 2pm">Sam: 9h - 14h</CmsText>
      </div>
    </div>
  </div>
</section>

<!-- Contact Form & Map Section -->
<section class="py-20 bg-neutral-sand">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <CmsText key="contact.form.overline" tag="p" class="text-sm font-semibold text-primary-green uppercase tracking-wider mb-3" en="Contact Form">Formulaire de Contact</CmsText>
      <CmsText key="contact.form.title" tag="h2" class="text-4xl md:text-5xl font-bold text-black mb-4" en="Send Us a Message">Envoyez-Nous un Message</CmsText>
      <CmsText key="contact.form.description" tag="p" class="text-xl text-neutral-charcoal max-w-3xl mx-auto" en="Fill in the form below and we'll get back to you as soon as possible">Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais</CmsText>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      <!-- Contact Form -->
      <div class="bg-white rounded-3xl p-8 shadow-lg h-fit">
        {#if showSuccess}
          <div class="bg-primary-green/10 border-2 border-primary-green rounded-2xl p-6 mb-6">
            <p class="text-primary-green font-semibold text-center">
              {t(
                '✓ Message envoyé avec succès! Nous vous répondrons bientôt.',
                "✓ Message sent successfully! We'll get back to you soon."
              )}
            </p>
          </div>
        {/if}

        {#if errorMessage}
          <div class="bg-red-50 border-2 border-red-500 rounded-2xl p-6 mb-6">
            <p class="text-red-700 font-semibold text-center">
              {errorMessage}
            </p>
          </div>
        {/if}

        <form onsubmit={handleSubmit} class="space-y-6">
          <div class="absolute left-[-9999px]" aria-hidden="true">
            <label for="website">{t('Ne pas remplir', 'Leave this field empty')}</label>
            <input
              type="text"
              id="website"
              name="website"
              bind:value={formData.website}
              tabindex="-1"
              autocomplete="off"
            />
          </div>
          <!-- Name & Email Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="name" class="block text-sm font-semibold text-neutral-obsidian mb-2">
                {t('Nom Complet *', 'Full Name *')}
              </label>
              <input
                type="text"
                id="name"
                bind:value={formData.name}
                required
                class="w-full px-4 py-3 rounded-2xl border-2 border-neutral-light focus:border-primary-green focus:outline-none transition-colors"
                placeholder={t('Votre nom', 'Your name')}
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-semibold text-neutral-obsidian mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                bind:value={formData.email}
                required
                class="w-full px-4 py-3 rounded-2xl border-2 border-neutral-light focus:border-primary-green focus:outline-none transition-colors"
                placeholder={t('votre@email.com', 'your@email.com')}
              />
            </div>
          </div>

          <!-- Phone & Subject Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="phone" class="block text-sm font-semibold text-neutral-obsidian mb-2">
                {t('Téléphone', 'Phone')}
              </label>
              <input
                type="tel"
                id="phone"
                bind:value={formData.phone}
                class="w-full px-4 py-3 rounded-2xl border-2 border-neutral-light focus:border-primary-green focus:outline-none transition-colors"
                placeholder="+229 XX XXX XXX"
              />
            </div>

            <div>
              <label for="subject" class="block text-sm font-semibold text-neutral-obsidian mb-2">
                {t('Sujet *', 'Subject *')}
              </label>
              <select
                id="subject"
                bind:value={formData.subject}
                required
                class="w-full px-4 py-3 rounded-2xl border-2 border-neutral-light focus:border-primary-green focus:outline-none transition-colors"
              >
                <option value="general">{t('Question Générale', 'General Question')}</option>
                <option value="order">{t('Commande', 'Order')}</option>
                <option value="wholesale">{t('Grossiste / Partenariat', 'Wholesale / Partnership')}</option>
                <option value="other">{t('Autre', 'Other')}</option>
              </select>
            </div>
          </div>

          <!-- Message -->
          <div>
            <label for="message" class="block text-sm font-semibold text-neutral-obsidian mb-2">
              Message *
            </label>
            <textarea
              id="message"
              bind:value={formData.message}
              required
              rows="6"
              class="w-full px-4 py-3 rounded-2xl border-2 border-neutral-light focus:border-primary-green focus:outline-none transition-colors resize-none"
              placeholder={t('Votre message...', 'Your message...')}
            ></textarea>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            disabled={isSubmitting}
            class="w-full bg-primary-green text-white px-6 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {#if isSubmitting}
              <span>{t('Envoi en cours...', 'Sending...')}</span>
            {:else}
              <Send class="w-5 h-5" />
              <span>{t('Envoyer le Message', 'Send Message')}</span>
            {/if}
          </button>
        </form>
      </div>

      <!-- Quick Contact Options -->
      <div class="space-y-8">
        <div class="bg-primary-green rounded-3xl p-8 text-white">
          <h3 class="text-2xl font-bold mb-6">{t("Besoin d'Aide Rapide?", 'Need Help Fast?')}</h3>

          <div class="space-y-4">
            <a href="https://wa.me/22997123456" target="_blank" rel="noopener noreferrer" class="flex items-center gap-4 bg-white/10 rounded-2xl p-4 hover:bg-white/20 transition-colors">
              <MessageSquare class="w-6 h-6" />
              <div>
                <p class="font-semibold">WhatsApp</p>
                <p class="text-sm text-white/80">{t('Chattez avec nous directement', 'Chat with us directly')}</p>
              </div>
            </a>

            <a href="tel:+22997123456" class="flex items-center gap-4 bg-white/10 rounded-2xl p-4 hover:bg-white/20 transition-colors">
              <Phone class="w-6 h-6" />
              <div>
                <p class="font-semibold">{t('Appel Direct', 'Call Us')}</p>
                <p class="text-sm text-white/80">+229 97 123 456</p>
              </div>
            </a>

            <a href={href('/points-de-vente')} class="flex items-center gap-4 bg-white/10 rounded-2xl p-4 hover:bg-white/20 transition-colors">
              <Store class="w-6 h-6" />
              <div>
                <p class="font-semibold">{t('Points de Vente', 'Where to Buy')}</p>
                <p class="text-sm text-white/80">{t('Trouvez nos produits près de chez vous', 'Find our products near you')}</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- FAQ Section -->
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <CmsText key="contact.faq.overline" tag="p" class="text-sm font-semibold text-primary-green uppercase tracking-wider mb-3" en="FAQ">FAQ</CmsText>
      <CmsText key="contact.faq.title" tag="h2" class="text-4xl md:text-5xl font-bold text-black mb-4" en="Frequently Asked Questions">Questions Fréquentes</CmsText>
    </div>

    <div class="max-w-3xl mx-auto space-y-6">
      <!-- FAQ Item 1 -->
      <details class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 group">
        <summary class="font-semibold text-lg text-black cursor-pointer list-none flex items-center justify-between">
          {t('Comment passer une commande?', 'How do I place an order?')}
          <span class="text-primary-green group-open:rotate-45 transition-transform">+</span>
        </summary>
        <p class="mt-4 text-neutral-charcoal">
          {t(
            'Vous pouvez passer commande directement via WhatsApp, par téléphone, ou en nous envoyant un email. Pour les commandes en gros, contactez notre service commercial dédié.',
            'You can order directly via WhatsApp, by phone or by sending us an email. For bulk orders, please contact our dedicated sales team.'
          )}
        </p>
      </details>

      <!-- FAQ Item 2 -->
      <details class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 group">
        <summary class="font-semibold text-lg text-black cursor-pointer list-none flex items-center justify-between">
          {t('Quels sont les délais de livraison?', 'How long does delivery take?')}
          <span class="text-primary-green group-open:rotate-45 transition-transform">+</span>
        </summary>
        <p class="mt-4 text-neutral-charcoal">
          {t(
            'Les livraisons sont effectuées dans un délai de 24 à 48 heures à Natitingou. Pour les autres villes du Bénin, comptez 2 à 5 jours ouvrables selon la destination.',
            'Deliveries in Natitingou are made within 24 to 48 hours. For other towns in Benin, allow 2 to 5 working days depending on the destination.'
          )}
        </p>
      </details>

      <!-- FAQ Item 3 -->
      <details class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 group">
        <summary class="font-semibold text-lg text-black cursor-pointer list-none flex items-center justify-between">
          {t('Comment devenir distributeur?', 'How can I become a distributor?')}
          <span class="text-primary-green group-open:rotate-45 transition-transform">+</span>
        </summary>
        <p class="mt-4 text-neutral-charcoal">
          {t(
            "Pour devenir distributeur Angel's Floor, visitez notre page dédiée aux grossistes ou contactez-nous directement. Nous offrons des marges attractives jusqu'à 35% et un accompagnement commercial personnalisé.",
            "To become an Angel's Floor distributor, visit our wholesale page or contact us directly. We offer attractive margins of up to 35% and personalised sales support."
          )}
        </p>
      </details>

      <!-- FAQ Item 4 -->
      <details class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 group">
        <summary class="font-semibold text-lg text-black cursor-pointer list-none flex items-center justify-between">
          {t('Vos produits sont-ils certifiés bio?', 'Are your products certified organic?')}
          <span class="text-primary-green group-open:rotate-45 transition-transform">+</span>
        </summary>
        <p class="mt-4 text-neutral-charcoal">
          {t(
            "Oui, tous nos produits sont 100% naturels et certifiés biologiques. Nous travaillons exclusivement avec des productrices qui respectent les normes de l'agriculture biologique.",
            'Yes, all our products are 100% natural and certified organic. We work exclusively with women producers who follow organic farming standards.'
          )}
        </p>
      </details>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="py-20 bg-primary-green relative overflow-hidden">
  <div class="absolute inset-0">
    <div class="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
  </div>

  <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <CmsText key="contact.cta.title" tag="h2" class="text-4xl md:text-5xl font-bold text-white mb-6" en="Ready to Work Together?">Prêt à Collaborer?</CmsText>
    <CmsText key="contact.cta.description" tag="p" class="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto" en="Whether you're an individual, a business or a distributor, we have a solution tailored to your needs.">Que vous soyez un particulier, un professionnel ou un distributeur, nous avons une solution adaptée à vos besoins.</CmsText>

    <div class="flex flex-col sm:flex-row gap-4 justify-center w-full">
      <a
        href={href('/produits')}
        class="block sm:inline-block w-full sm:w-auto text-center bg-white text-primary-green px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
      >
        {t('Découvrir Nos Produits', 'Discover Our Products')}
      </a>
      <a
        href={href('/grossistes')}
        class="block sm:inline-block w-full sm:w-auto text-center bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white/10 transition-all duration-300"
      >
        {t('Devenir Partenaire', 'Become a Partner')}
      </a>
    </div>
  </div>
</section>
