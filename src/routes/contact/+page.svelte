<script lang="ts">
  import { onMount } from 'svelte';
  import { Phone, Mail, MapPin, Clock, Send, MessageSquare, Store } from 'lucide-svelte';
  
  let formData = {
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  };
  
  let isSubmitting = false;
  let showSuccess = false;
  
  async function handleSubmit(event: Event) {
    event.preventDefault();
    isSubmitting = true;
    
    // Simulate form submission
    setTimeout(() => {
      isSubmitting = false;
      showSuccess = true;
      // Reset form
      formData = {
        name: '',
        email: '',
        phone: '',
        subject: 'general',
        message: ''
      };
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        showSuccess = false;
      }, 5000);
    }, 1500);
  }
  
  onMount(() => {
    // Any initialization if needed
  });
</script>

<svelte:head>
  <title>Contact - Angel's Floor</title>
  <meta name="description" content="Contactez Angel's Floor pour vos commandes, questions ou partenariats. Nous sommes à votre écoute." />
</svelte:head>

<!-- Hero Section -->
<section class="relative bg-primary-green py-16 lg:py-24 overflow-hidden">
  <div class="absolute inset-0">
    <div class="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
  </div>
  
  <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h1 class="text-5xl md:text-6xl lg:text-6xl font-bold text-white mb-6 leading-tight">Contactez-Nous</h1>
    <p class="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
      Nous sommes à votre écoute pour répondre à toutes vos questions et vous accompagner dans vos projets
    </p>
  </div>
</section>

<!-- Contact Information Cards -->
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      <!-- Phone Card -->
      <div class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 hover:shadow-lg transition-all duration-300">
        <div class="w-12 h-12 bg-primary-green rounded-full flex items-center justify-center mb-4">
          <Phone class="w-6 h-6 text-white" />
        </div>
        <h3 class="font-bold text-lg text-black mb-2">Téléphone</h3>
        <p class="text-neutral-charcoal text-sm mb-1">+229 01 97 123 456</p>
        <p class="text-neutral-charcoal text-sm">+229 01 96 789 012</p>
      </div>
      
      <!-- Email Card -->
      <div class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 hover:shadow-lg transition-all duration-300">
        <div class="w-12 h-12 bg-primary-green rounded-full flex items-center justify-center mb-4">
          <Mail class="w-6 h-6 text-white" />
        </div>
        <h3 class="font-bold text-lg text-black mb-2">Email</h3>
        <p class="text-neutral-charcoal text-sm mb-1">contact@angelsfloor.bj</p>
        <p class="text-neutral-charcoal text-sm">commandes@angelsfloor.bj</p>
      </div>
      
      <!-- Address Card -->
      <div class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 hover:shadow-lg transition-all duration-300">
        <div class="w-12 h-12 bg-primary-green rounded-full flex items-center justify-center mb-4">
          <MapPin class="w-6 h-6 text-white" />
        </div>
        <h3 class="font-bold text-lg text-black mb-2">Adresse</h3>
        <p class="text-neutral-charcoal text-sm mb-1">Natitingou, Atacora</p>
        <p class="text-neutral-charcoal text-sm">République du Bénin</p>
      </div>
      
      <!-- Hours Card -->
      <div class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 hover:shadow-lg transition-all duration-300">
        <div class="w-12 h-12 bg-primary-green rounded-full flex items-center justify-center mb-4">
          <Clock class="w-6 h-6 text-white" />
        </div>
        <h3 class="font-bold text-lg text-black mb-2">Horaires</h3>
        <p class="text-neutral-charcoal text-sm mb-1">Lun - Ven: 8h - 18h</p>
        <p class="text-neutral-charcoal text-sm">Sam: 9h - 14h</p>
      </div>
    </div>
  </div>
</section>

<!-- Contact Form & Map Section -->
<section class="py-20 bg-neutral-sand">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <p class="text-sm font-semibold text-primary-green uppercase tracking-wider mb-3">Formulaire de Contact</p>
      <h2 class="text-4xl md:text-5xl font-bold text-black mb-4">
        Envoyez-Nous un Message
      </h2>
      <p class="text-xl text-neutral-charcoal max-w-3xl mx-auto">
        Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais
      </p>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      <!-- Contact Form -->
      <div class="bg-white rounded-3xl p-8 shadow-lg h-fit">
        {#if showSuccess}
          <div class="bg-primary-green/10 border-2 border-primary-green rounded-2xl p-6 mb-6">
            <p class="text-primary-green font-semibold text-center">
              ✓ Message envoyé avec succès! Nous vous répondrons bientôt.
            </p>
          </div>
        {/if}
        
        <form on:submit={handleSubmit} class="space-y-6">
          <!-- Name & Email Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="name" class="block text-sm font-semibold text-neutral-obsidian mb-2">
                Nom Complet *
              </label>
              <input
                type="text"
                id="name"
                bind:value={formData.name}
                required
                class="w-full px-4 py-3 rounded-2xl border-2 border-neutral-light focus:border-primary-green focus:outline-none transition-colors"
                placeholder="Votre nom"
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
                placeholder="votre@email.com"
              />
            </div>
          </div>
          
          <!-- Phone & Subject Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="phone" class="block text-sm font-semibold text-neutral-obsidian mb-2">
                Téléphone
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
                Sujet *
              </label>
              <select
                id="subject"
                bind:value={formData.subject}
                required
                class="w-full px-4 py-3 rounded-2xl border-2 border-neutral-light focus:border-primary-green focus:outline-none transition-colors"
              >
                <option value="general">Question Générale</option>
                <option value="order">Commande</option>
                <option value="wholesale">Grossiste / Partenariat</option>
                <option value="other">Autre</option>
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
              placeholder="Votre message..."
            ></textarea>
          </div>
          
          <!-- Submit Button -->
          <button
            type="submit"
            disabled={isSubmitting}
            class="w-full bg-primary-green text-white px-6 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {#if isSubmitting}
              <span>Envoi en cours...</span>
            {:else}
              <Send class="w-5 h-5" />
              <span>Envoyer le Message</span>
            {/if}
          </button>
        </form>
      </div>
      
      <!-- Quick Contact Options -->
      <div class="space-y-8">
        <div class="bg-primary-green rounded-3xl p-8 text-white">
          <h3 class="text-2xl font-bold mb-6">Besoin d'Aide Rapide?</h3>
          
          <div class="space-y-4">
            <a href="https://wa.me/22997123456" target="_blank" rel="noopener noreferrer" class="flex items-center gap-4 bg-white/10 rounded-2xl p-4 hover:bg-white/20 transition-colors">
              <MessageSquare class="w-6 h-6" />
              <div>
                <p class="font-semibold">WhatsApp</p>
                <p class="text-sm text-white/80">Chattez avec nous directement</p>
              </div>
            </a>
            
            <a href="tel:+22997123456" class="flex items-center gap-4 bg-white/10 rounded-2xl p-4 hover:bg-white/20 transition-colors">
              <Phone class="w-6 h-6" />
              <div>
                <p class="font-semibold">Appel Direct</p>
                <p class="text-sm text-white/80">+229 97 123 456</p>
              </div>
            </a>
            
            <a href="/points-de-vente" class="flex items-center gap-4 bg-white/10 rounded-2xl p-4 hover:bg-white/20 transition-colors">
              <Store class="w-6 h-6" />
              <div>
                <p class="font-semibold">Points de Vente</p>
                <p class="text-sm text-white/80">Trouvez nos produits près de chez vous</p>
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
      <p class="text-sm font-semibold text-primary-green uppercase tracking-wider mb-3">FAQ</p>
      <h2 class="text-4xl md:text-5xl font-bold text-black mb-4">
        Questions Fréquentes
      </h2>
    </div>
    
    <div class="max-w-3xl mx-auto space-y-6">
      <!-- FAQ Item 1 -->
      <details class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 group">
        <summary class="font-semibold text-lg text-black cursor-pointer list-none flex items-center justify-between">
          Comment passer une commande?
          <span class="text-primary-green group-open:rotate-45 transition-transform">+</span>
        </summary>
        <p class="mt-4 text-neutral-charcoal">
          Vous pouvez passer commande directement via WhatsApp, par téléphone, ou en nous envoyant un email. 
          Pour les commandes en gros, contactez notre service commercial dédié.
        </p>
      </details>
      
      <!-- FAQ Item 2 -->
      <details class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 group">
        <summary class="font-semibold text-lg text-black cursor-pointer list-none flex items-center justify-between">
          Quels sont les délais de livraison?
          <span class="text-primary-green group-open:rotate-45 transition-transform">+</span>
        </summary>
        <p class="mt-4 text-neutral-charcoal">
          Les livraisons sont effectuées dans un délai de 24 à 48 heures à Natitingou. 
          Pour les autres villes du Bénin, comptez 2 à 5 jours ouvrables selon la destination.
        </p>
      </details>
      
      <!-- FAQ Item 3 -->
      <details class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 group">
        <summary class="font-semibold text-lg text-black cursor-pointer list-none flex items-center justify-between">
          Comment devenir distributeur?
          <span class="text-primary-green group-open:rotate-45 transition-transform">+</span>
        </summary>
        <p class="mt-4 text-neutral-charcoal">
          Pour devenir distributeur Angel's Floor, visitez notre page dédiée aux grossistes ou contactez-nous directement. 
          Nous offrons des marges attractives jusqu'à 35% et un accompagnement commercial personnalisé.
        </p>
      </details>
      
      <!-- FAQ Item 4 -->
      <details class="bg-white border-2 border-primary-green/20 rounded-3xl p-6 group">
        <summary class="font-semibold text-lg text-black cursor-pointer list-none flex items-center justify-between">
          Vos produits sont-ils certifiés bio?
          <span class="text-primary-green group-open:rotate-45 transition-transform">+</span>
        </summary>
        <p class="mt-4 text-neutral-charcoal">
          Oui, tous nos produits sont 100% naturels et certifiés biologiques. 
          Nous travaillons exclusivement avec des productrices qui respectent les normes de l'agriculture biologique.
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
    <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
      Prêt à Collaborer?
    </h2>
    <p class="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
      Que vous soyez un particulier, un professionnel ou un distributeur, 
      nous avons une solution adaptée à vos besoins.
    </p>
    
    <div class="flex flex-col sm:flex-row gap-4 justify-center w-full">
      <a 
        href="/produits"
        class="block sm:inline-block w-full sm:w-auto text-center bg-white text-primary-green px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
      >
        Découvrir Nos Produits
      </a>
      <a 
        href="/grossistes"
        class="block sm:inline-block w-full sm:w-auto text-center bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white/10 transition-all duration-300"
      >
        Devenir Partenaire
      </a>
    </div>
  </div>
</section>