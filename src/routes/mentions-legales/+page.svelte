<script lang="ts">
  import ScrollReveal from '$lib/components/ui/ScrollReveal.svelte';
  import { Building2, Mail, Phone, Globe, Scale, FileText } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Mentions Légales - Angel's Floor</title>
  <meta name="description" content="Mentions légales et informations juridiques d'Angel's Floor, entreprise béninoise spécialisée dans la transformation de produits africains naturels." />
</svelte:head>

<!-- Hero Section -->
<section class="relative bg-primary-green py-16 overflow-hidden">
  <div class="absolute inset-0">
    <div class="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
  </div>
  
  <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <ScrollReveal animation="fade-down">
      <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Mentions Légales</h1>
      <p class="text-lg text-white/90 max-w-2xl mx-auto">
        Informations légales et réglementaires
      </p>
    </ScrollReveal>
  </div>
</section>

<!-- Content Section -->
<section class="py-16 bg-white">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Éditeur du Site -->
    <ScrollReveal animation="fade-up">
      <div class="mb-12">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-primary-green rounded-full flex items-center justify-center">
            <Building2 class="w-6 h-6 text-white" />
          </div>
          <h2 class="text-2xl font-bold text-primary-green">Éditeur du Site</h2>
        </div>
        <div class="bg-neutral-sand rounded-2xl p-6 space-y-3">
          <p class="text-neutral-charcoal">
            <strong class="text-black">Raison sociale :</strong> Angel's Floor SARL
          </p>
          <p class="text-neutral-charcoal">
            <strong class="text-black">Forme juridique :</strong> Société à Responsabilité Limitée (SARL)
          </p>
          <p class="text-neutral-charcoal">
            <strong class="text-black">Capital social :</strong> 1 000 000 FCFA
          </p>
          <p class="text-neutral-charcoal">
            <strong class="text-black">Siège social :</strong> Quartier Wansirou, Natitingou, République du Bénin
          </p>
          <p class="text-neutral-charcoal">
            <strong class="text-black">RCCM :</strong> RB/NAT/22 A 1234
          </p>
          <p class="text-neutral-charcoal">
            <strong class="text-black">IFU :</strong> 3202210123456
          </p>
        </div>
      </div>
    </ScrollReveal>

    <!-- Directeur de Publication -->
    <ScrollReveal animation="fade-up" delay={100}>
      <div class="mb-12">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-accent-gold rounded-full flex items-center justify-center">
            <FileText class="w-6 h-6 text-white" />
          </div>
          <h2 class="text-2xl font-bold text-primary-green">Directeur de Publication</h2>
        </div>
        <div class="bg-neutral-sand rounded-2xl p-6">
          <p class="text-neutral-charcoal">
            <strong class="text-black">Nom :</strong> Mme Angélique KOUPONI
          </p>
          <p class="text-neutral-charcoal">
            <strong class="text-black">Qualité :</strong> Présidente Directrice Générale
          </p>
        </div>
      </div>
    </ScrollReveal>

    <!-- Contact -->
    <ScrollReveal animation="fade-up" delay={200}>
      <div class="mb-12">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-primary-green rounded-full flex items-center justify-center">
            <Mail class="w-6 h-6 text-white" />
          </div>
          <h2 class="text-2xl font-bold text-primary-green">Contact</h2>
        </div>
        <div class="bg-neutral-sand rounded-2xl p-6 space-y-3">
          <div class="flex items-center gap-3">
            <Phone class="w-5 h-5 text-primary-green" />
            <p class="text-neutral-charcoal">
              <strong class="text-black">Téléphone :</strong> +229 01 96 12 19 71
            </p>
          </div>
          <div class="flex items-center gap-3">
            <Mail class="w-5 h-5 text-primary-green" />
            <p class="text-neutral-charcoal">
              <strong class="text-black">Email :</strong> contact@angelsfloor.bj
            </p>
          </div>
          <div class="flex items-center gap-3">
            <Globe class="w-5 h-5 text-primary-green" />
            <p class="text-neutral-charcoal">
              <strong class="text-black">Site web :</strong> www.angelsfloor.bj
            </p>
          </div>
        </div>
      </div>
    </ScrollReveal>

    <!-- Hébergement -->
    <ScrollReveal animation="fade-up" delay={300}>
      <div class="mb-12">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-accent-sunset rounded-full flex items-center justify-center">
            <Globe class="w-6 h-6 text-white" />
          </div>
          <h2 class="text-2xl font-bold text-primary-green">Hébergement</h2>
        </div>
        <div class="bg-neutral-sand rounded-2xl p-6 space-y-3">
          <p class="text-neutral-charcoal">
            <strong class="text-black">Hébergeur :</strong> Vercel Inc.
          </p>
          <p class="text-neutral-charcoal">
            <strong class="text-black">Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA
          </p>
          <p class="text-neutral-charcoal">
            <strong class="text-black">Site web :</strong> https://vercel.com
          </p>
        </div>
      </div>
    </ScrollReveal>

    <!-- Propriété Intellectuelle -->
    <ScrollReveal animation="fade-up" delay={400}>
      <div class="mb-12">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-creative-purple rounded-full flex items-center justify-center">
            <Scale class="w-6 h-6 text-white" />
          </div>
          <h2 class="text-2xl font-bold text-primary-green">Propriété Intellectuelle</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            L'ensemble du contenu de ce site (textes, images, vidéos, logos, marques, etc.) est la propriété exclusive d'Angel's Floor SARL ou de ses partenaires et est protégé par les lois béninoises et internationales relatives à la propriété intellectuelle.
          </p>
          <p class="mt-4">
            Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable d'Angel's Floor SARL.
          </p>
          <p class="mt-4">
            Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il contient sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux dispositions légales en vigueur.
          </p>
        </div>
      </div>
    </ScrollReveal>

    <!-- Données Personnelles -->
    <ScrollReveal animation="fade-up" delay={500}>
      <div class="mb-12">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-primary-green-vibrant rounded-full flex items-center justify-center">
            <FileText class="w-6 h-6 text-white" />
          </div>
          <h2 class="text-2xl font-bold text-primary-green">Protection des Données Personnelles</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            Conformément à la loi n° 2017-20 du 20 avril 2018 portant code du numérique en République du Bénin, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.
          </p>
          <p class="mt-4">
            Pour exercer ce droit, veuillez nous contacter à l'adresse suivante : contact@angelsfloor.bj
          </p>
          <p class="mt-4">
            Angel's Floor s'engage à ne pas divulguer à des tiers les informations personnelles que vous nous communiquez. Celles-ci sont confidentielles et ne seront utilisées que pour le traitement de vos commandes et l'amélioration de nos services.
          </p>
        </div>
      </div>
    </ScrollReveal>

    <!-- Cookies -->
    <ScrollReveal animation="fade-up" delay={600}>
      <div class="mb-12">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-accent-gold rounded-full flex items-center justify-center">
            <Globe class="w-6 h-6 text-white" />
          </div>
          <h2 class="text-2xl font-bold text-primary-green">Cookies</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            Ce site utilise des cookies pour améliorer votre expérience de navigation. Les cookies sont de petits fichiers texte stockés sur votre appareil qui nous permettent de mémoriser vos préférences et d'analyser l'utilisation du site.
          </p>
          <p class="mt-4">
            Vous pouvez configurer votre navigateur pour refuser les cookies ou pour vous alerter lorsqu'un site tente d'en placer un sur votre ordinateur. Cependant, le refus des cookies peut limiter votre accès à certaines fonctionnalités du site.
          </p>
        </div>
      </div>
    </ScrollReveal>

    <!-- Responsabilité -->
    <ScrollReveal animation="fade-up" delay={700}>
      <div class="mb-12">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-primary-green rounded-full flex items-center justify-center">
            <Scale class="w-6 h-6 text-white" />
          </div>
          <h2 class="text-2xl font-bold text-primary-green">Limitation de Responsabilité</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            Angel's Floor s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site, dont elle se réserve le droit de modifier le contenu à tout moment et sans préavis.
          </p>
          <p class="mt-4">
            Cependant, Angel's Floor ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site. En conséquence, Angel's Floor décline toute responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur le site.
          </p>
        </div>
      </div>
    </ScrollReveal>

    <!-- Droit Applicable -->
    <ScrollReveal animation="fade-up" delay={800}>
      <div class="mb-12">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-accent-sunset rounded-full flex items-center justify-center">
            <Scale class="w-6 h-6 text-white" />
          </div>
          <h2 class="text-2xl font-bold text-primary-green">Droit Applicable et Juridiction</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            Les présentes mentions légales sont régies par le droit béninois. En cas de litige et à défaut d'accord amiable, le différend sera porté devant les tribunaux compétents de Natitingou, République du Bénin.
          </p>
        </div>
      </div>
    </ScrollReveal>

    <!-- Date de mise à jour -->
    <ScrollReveal animation="fade">
      <div class="text-center mt-16 pt-8 border-t border-neutral-light">
        <p class="text-sm text-neutral-slate">
          Dernière mise à jour : Janvier 2025
        </p>
      </div>
    </ScrollReveal>
  </div>
</section>