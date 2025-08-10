<script lang="ts">
  import ScrollReveal from '$lib/components/ui/ScrollReveal.svelte';
  import { ShoppingCart, Truck, CreditCard, RotateCcw, Shield, AlertCircle, Phone, Mail } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Conditions Générales de Vente - Angel's Floor</title>
  <meta name="description" content="Conditions générales de vente d'Angel's Floor. Modalités de commande, livraison, paiement et retour pour nos produits béninois naturels." />
</svelte:head>

<!-- Hero Section -->
<section class="relative bg-primary-green py-16 overflow-hidden">
  <div class="absolute inset-0">
    <div class="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
  </div>
  
  <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <ScrollReveal animation="fade-down">
      <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Conditions Générales de Vente</h1>
      <p class="text-lg text-white/90 max-w-2xl mx-auto">
        En vigueur à partir du 1er janvier 2025
      </p>
    </ScrollReveal>
  </div>
</section>

<!-- Content Section -->
<section class="py-16 bg-white">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Préambule -->
    <ScrollReveal animation="fade-up">
      <div class="mb-12">
        <div class="bg-neutral-sand rounded-2xl p-6">
          <p class="text-neutral-charcoal leading-relaxed">
            Les présentes Conditions Générales de Vente (CGV) régissent les relations commerciales entre Angel's Floor SARL, 
            société immatriculée au RCCM sous le numéro RB/NAT/22 A 1234, dont le siège social est situé à Natitingou, 
            République du Bénin, et ses clients pour toute commande de produits effectuée sur le site www.angelsfloor.bj 
            ou par tout autre moyen de communication.
          </p>
        </div>
      </div>
    </ScrollReveal>

    <!-- Article 1 : Objet -->
    <ScrollReveal animation="fade-up" delay={100}>
      <div class="mb-12">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-primary-green rounded-full flex items-center justify-center">
            <span class="text-white font-bold">1</span>
          </div>
          <h2 class="text-2xl font-bold text-primary-green">Objet</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            Les présentes CGV ont pour objet de définir les droits et obligations des parties dans le cadre de la vente 
            à distance de produits alimentaires transformés proposés par Angel's Floor à ses clients.
          </p>
          <p class="mt-4">
            Toute commande implique l'acceptation sans réserve des présentes CGV. Angel's Floor se réserve le droit de 
            modifier ses CGV à tout moment. Les CGV applicables sont celles en vigueur à la date de la commande.
          </p>
        </div>
      </div>
    </ScrollReveal>

    <!-- Article 2 : Produits -->
    <ScrollReveal animation="fade-up" delay={200}>
      <div class="mb-12">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-accent-gold rounded-full flex items-center justify-center">
            <ShoppingCart class="w-6 h-6 text-white" />
          </div>
          <h2 class="text-2xl font-bold text-primary-green">Article 2 : Produits</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            Les produits proposés à la vente sont ceux décrits sur le site www.angelsfloor.bj. Les photographies et 
            descriptions des produits sont les plus fidèles possibles mais ne peuvent assurer une similitude parfaite.
          </p>
          <p class="mt-4">
            <strong>Nos gammes de produits comprennent :</strong>
          </p>
          <ul class="mt-2 space-y-2">
            <li>Fonio précuit et dérivés</li>
            <li>Pulpe de baobab et produits dérivés</li>
            <li>Néré et fagara transformés</li>
            <li>Produits à base de mangue séchée</li>
            <li>Biscuits enrichis au baobab</li>
          </ul>
          <p class="mt-4">
            Tous nos produits sont certifiés biologiques et répondent aux normes de qualité béninoises et internationales. 
            Les informations nutritionnelles et les dates de péremption sont clairement indiquées sur chaque emballage.
          </p>
        </div>
      </div>
    </ScrollReveal>

    <!-- Article 3 : Prix -->
    <ScrollReveal animation="fade-up" delay={300}>
      <div class="mb-12">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-primary-green rounded-full flex items-center justify-center">
            <CreditCard class="w-6 h-6 text-white" />
          </div>
          <h2 class="text-2xl font-bold text-primary-green">Article 3 : Prix</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            Les prix de nos produits sont indiqués en Francs CFA (XOF) toutes taxes comprises. Angel's Floor se réserve 
            le droit de modifier ses prix à tout moment, mais les produits seront facturés sur la base des tarifs en 
            vigueur au moment de la validation de la commande.
          </p>
          <p class="mt-4">
            Les frais de livraison sont calculés en fonction du poids de la commande et de la zone de livraison. 
            Ils sont indiqués au client avant la validation finale de la commande.
          </p>
          <div class="bg-neutral-sand rounded-xl p-4 mt-4">
            <p class="font-semibold text-black mb-2">Tarifs de livraison :</p>
            <ul class="space-y-1 text-sm">
              <li>• Natitingou ville : 500 FCFA</li>
              <li>• Autres villes du Bénin : 1000 à 2500 FCFA</li>
              <li>• Livraison gratuite pour les commandes supérieures à 25 000 FCFA</li>
            </ul>
          </div>
        </div>
      </div>
    </ScrollReveal>

    <!-- Article 4 : Commandes -->
    <ScrollReveal animation="fade-up" delay={400}>
      <div class="mb-12">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-accent-sunset rounded-full flex items-center justify-center">
            <span class="text-white font-bold">4</span>
          </div>
          <h2 class="text-2xl font-bold text-primary-green">Article 4 : Commandes</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            Les commandes peuvent être passées :
          </p>
          <ul class="mt-2 space-y-2">
            <li>Par téléphone au +229 01 96 12 19 71</li>
            <li>Par email à contact@angelsfloor.bj</li>
            <li>Via le formulaire de contact sur notre site web</li>
            <li>Directement dans nos points de vente physiques</li>
          </ul>
          <p class="mt-4">
            <strong>Processus de commande :</strong>
          </p>
          <ol class="mt-2 space-y-2">
            <li>1. Sélection des produits et quantités désirées</li>
            <li>2. Vérification du récapitulatif de commande</li>
            <li>3. Indication des coordonnées de livraison</li>
            <li>4. Choix du mode de paiement</li>
            <li>5. Validation finale de la commande</li>
          </ol>
          <p class="mt-4">
            Un email de confirmation sera envoyé au client récapitulant les détails de la commande. Angel's Floor se 
            réserve le droit d'annuler ou de refuser toute commande d'un client avec lequel il existerait un litige.
          </p>
        </div>
      </div>
    </ScrollReveal>

    <!-- Article 5 : Paiement -->
    <ScrollReveal animation="fade-up" delay={500}>
      <div class="mb-12">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-creative-purple rounded-full flex items-center justify-center">
            <CreditCard class="w-6 h-6 text-white" />
          </div>
          <h2 class="text-2xl font-bold text-primary-green">Article 5 : Modalités de Paiement</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            Le règlement des commandes s'effectue :
          </p>
          <ul class="mt-2 space-y-2">
            <li><strong>Mobile Money :</strong> MTN Mobile Money, Moov Money</li>
            <li><strong>Virement bancaire :</strong> Sur notre compte professionnel</li>
            <li><strong>Espèces :</strong> À la livraison ou en point de vente</li>
            <li><strong>Chèque :</strong> Pour les commandes professionnelles</li>
          </ul>
          <p class="mt-4">
            Pour les paiements à la livraison, le livreur remettra une facture acquittée. Les commandes sont préparées 
            après confirmation du paiement pour les règlements anticipés.
          </p>
          <div class="bg-accent-gold/20 rounded-xl p-4 mt-4">
            <p class="text-sm">
              <strong>Note :</strong> Pour les commandes professionnelles supérieures à 100 000 FCFA, un acompte de 50% 
              est demandé à la commande.
            </p>
          </div>
        </div>
      </div>
    </ScrollReveal>

    <!-- Article 6 : Livraison -->
    <ScrollReveal animation="fade-up" delay={600}>
      <div class="mb-12">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-primary-green-vibrant rounded-full flex items-center justify-center">
            <Truck class="w-6 h-6 text-white" />
          </div>
          <h2 class="text-2xl font-bold text-primary-green">Article 6 : Livraison</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            Les produits sont livrés à l'adresse indiquée par le client lors de la commande. Les délais de livraison 
            sont donnés à titre indicatif :
          </p>
          <ul class="mt-2 space-y-2">
            <li><strong>Natitingou :</strong> 24 à 48 heures</li>
            <li><strong>Autres villes du Bénin :</strong> 3 à 7 jours ouvrables</li>
            <li><strong>Commandes spéciales/gros volumes :</strong> Délai convenu avec le client</li>
          </ul>
          <p class="mt-4">
            En cas de retard de livraison, Angel's Floor s'engage à informer le client dans les meilleurs délais. 
            Le client devra vérifier l'état des produits à la réception et signaler immédiatement tout dommage ou 
            produit manquant.
          </p>
          <p class="mt-4">
            <strong>Zones de livraison couvertes :</strong> Tout le territoire béninois avec des partenaires logistiques 
            dans les principales villes (Cotonou, Porto-Novo, Parakou, Natitingou, Abomey-Calavi).
          </p>
        </div>
      </div>
    </ScrollReveal>

    <!-- Article 7 : Droit de rétractation -->
    <ScrollReveal animation="fade-up" delay={700}>
      <div class="mb-12">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-accent-gold rounded-full flex items-center justify-center">
            <RotateCcw class="w-6 h-6 text-white" />
          </div>
          <h2 class="text-2xl font-bold text-primary-green">Article 7 : Droit de Rétractation et Retours</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            Conformément à la législation en vigueur, le client dispose d'un délai de 7 jours à compter de la réception 
            des produits pour exercer son droit de rétractation sans avoir à justifier de motifs ni à payer de pénalités.
          </p>
          <p class="mt-4">
            <strong>Exceptions :</strong> Le droit de rétractation ne s'applique pas aux :
          </p>
          <ul class="mt-2 space-y-2">
            <li>Produits alimentaires descellés ou entamés</li>
            <li>Produits périssables</li>
            <li>Commandes personnalisées ou sur mesure</li>
          </ul>
          <p class="mt-4">
            Pour exercer ce droit, le client doit nous informer par email ou courrier de sa décision. Les produits 
            doivent être retournés dans leur emballage d'origine, non ouverts, accompagnés de la facture. Les frais 
            de retour sont à la charge du client.
          </p>
          <p class="mt-4">
            Le remboursement sera effectué dans un délai de 14 jours après réception des produits retournés, par le 
            même moyen de paiement utilisé lors de la commande.
          </p>
        </div>
      </div>
    </ScrollReveal>

    <!-- Article 8 : Garanties -->
    <ScrollReveal animation="fade-up" delay={800}>
      <div class="mb-12">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-primary-green rounded-full flex items-center justify-center">
            <Shield class="w-6 h-6 text-white" />
          </div>
          <h2 class="text-2xl font-bold text-primary-green">Article 8 : Garanties et Responsabilité</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            Tous nos produits bénéficient de la garantie légale de conformité et de la garantie contre les vices cachés. 
            Angel's Floor s'engage à livrer des produits conformes à la commande et exempts de tout défaut.
          </p>
          <p class="mt-4">
            <strong>Garantie de qualité :</strong>
          </p>
          <ul class="mt-2 space-y-2">
            <li>Produits 100% naturels et biologiques</li>
            <li>Respect des normes d'hygiène et de sécurité alimentaire</li>
            <li>Traçabilité complète de la chaîne de production</li>
            <li>Dates de péremption clairement indiquées</li>
          </ul>
          <p class="mt-4">
            En cas de non-conformité ou de défaut, le client pourra obtenir le remplacement ou le remboursement du 
            produit concerné. Angel's Floor ne saurait être tenu responsable de l'inexécution du contrat en cas de 
            force majeure.
          </p>
        </div>
      </div>
    </ScrollReveal>

    <!-- Article 9 : Données personnelles -->
    <ScrollReveal animation="fade-up" delay={900}>
      <div class="mb-12">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-accent-sunset rounded-full flex items-center justify-center">
            <span class="text-white font-bold">9</span>
          </div>
          <h2 class="text-2xl font-bold text-primary-green">Article 9 : Protection des Données Personnelles</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            Les informations recueillies lors de la commande sont nécessaires à la gestion de celle-ci et pourront être 
            utilisées pour vous informer de nos offres commerciales. Conformément à la loi n° 2017-20 du 20 avril 2018 
            portant code du numérique en République du Bénin, vous disposez d'un droit d'accès, de rectification et de 
            suppression des données vous concernant.
          </p>
          <p class="mt-4">
            Angel's Floor s'engage à ne pas communiquer vos données personnelles à des tiers sans votre consentement 
            préalable, sauf obligation légale.
          </p>
        </div>
      </div>
    </ScrollReveal>

    <!-- Article 10 : Service Client -->
    <ScrollReveal animation="fade-up" delay={1000}>
      <div class="mb-12">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-creative-purple rounded-full flex items-center justify-center">
            <Phone class="w-6 h-6 text-white" />
          </div>
          <h2 class="text-2xl font-bold text-primary-green">Article 10 : Service Client</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            Pour toute question, réclamation ou information sur nos produits et services, notre service client est 
            à votre disposition :
          </p>
          <div class="bg-neutral-sand rounded-xl p-6 mt-4 space-y-3">
            <div class="flex items-center gap-3">
              <Phone class="w-5 h-5 text-primary-green" />
              <p><strong>Téléphone :</strong> +229 01 96 12 19 71</p>
            </div>
            <div class="flex items-center gap-3">
              <Mail class="w-5 h-5 text-primary-green" />
              <p><strong>Email :</strong> contact@angelsfloor.bj</p>
            </div>
            <p class="text-sm pt-2">
              <strong>Horaires :</strong> Du lundi au vendredi de 8h à 18h, samedi de 9h à 13h
            </p>
          </div>
          <p class="mt-4">
            Nous nous engageons à répondre à vos demandes dans un délai maximum de 48 heures ouvrables.
          </p>
        </div>
      </div>
    </ScrollReveal>

    <!-- Article 11 : Litiges -->
    <ScrollReveal animation="fade-up" delay={1100}>
      <div class="mb-12">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-primary-green-bright rounded-full flex items-center justify-center">
            <AlertCircle class="w-6 h-6 text-white" />
          </div>
          <h2 class="text-2xl font-bold text-primary-green">Article 11 : Règlement des Litiges</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À défaut d'accord 
            amiable, le litige sera porté devant les tribunaux compétents de Natitingou.
          </p>
          <p class="mt-4">
            Les présentes CGV sont soumises au droit béninois. La langue du contrat est le français.
          </p>
        </div>
      </div>
    </ScrollReveal>

    <!-- Article 12 : Modification des CGV -->
    <ScrollReveal animation="fade-up" delay={1200}>
      <div class="mb-12">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-accent-gold rounded-full flex items-center justify-center">
            <span class="text-white font-bold">12</span>
          </div>
          <h2 class="text-2xl font-bold text-primary-green">Article 12 : Modification des CGV</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            Angel's Floor se réserve le droit de modifier ses conditions générales de vente à tout moment. Les nouvelles 
            conditions s'appliqueront à toutes les commandes postérieures à cette modification.
          </p>
          <p class="mt-4">
            Il est conseillé aux clients de consulter régulièrement les CGV afin de prendre connaissance des éventuelles 
            modifications.
          </p>
        </div>
      </div>
    </ScrollReveal>

    <!-- Acceptation des CGV -->
    <ScrollReveal animation="fade-up" delay={1300}>
      <div class="bg-primary-green text-white rounded-2xl p-8 text-center">
        <Shield class="w-16 h-16 mx-auto mb-4 opacity-80" />
        <h3 class="text-xl font-bold mb-4">Acceptation des Conditions</h3>
        <p class="text-white/90">
          Le fait de passer commande implique l'adhésion entière et sans réserve du client aux présentes 
          Conditions Générales de Vente. Aucune condition particulière ne peut, sauf acceptation formelle et 
          écrite d'Angel's Floor, prévaloir contre les CGV.
        </p>
      </div>
    </ScrollReveal>

    <!-- Contact pour questions -->
    <ScrollReveal animation="fade" delay={1400}>
      <div class="text-center mt-16 pt-8 border-t border-neutral-light">
        <p class="text-sm text-neutral-slate mb-4">
          Pour toute question concernant ces CGV, contactez-nous :
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="tel:+22901961219771" class="inline-flex items-center gap-2 text-primary-green hover:text-primary-green-vibrant transition-colors">
            <Phone class="w-4 h-4" />
            +229 01 96 12 19 71
          </a>
          <a href="mailto:contact@angelsfloor.bj" class="inline-flex items-center gap-2 text-primary-green hover:text-primary-green-vibrant transition-colors">
            <Mail class="w-4 h-4" />
            contact@angelsfloor.bj
          </a>
        </div>
        <p class="text-xs text-neutral-slate mt-6">
          Version 1.0 - Janvier 2025
        </p>
      </div>
    </ScrollReveal>
  </div>
</section>