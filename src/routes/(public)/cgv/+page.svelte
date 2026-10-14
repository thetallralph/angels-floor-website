<script lang="ts">
  import ScrollReveal from '$lib/components/ui/ScrollReveal.svelte';
  import { ShoppingCart, Truck, CreditCard, RotateCcw, Shield, AlertCircle, Phone, Mail } from 'lucide-svelte';
  import { CmsText, CmsRichText } from '$lib/components/cms';
  import { t, getLocale } from '$lib/i18n';
</script>

<svelte:head>
  <title>{t('Conditions Générales de Vente', 'Terms and Conditions of Sale')} - Angel's Floor</title>
  <meta name="description" content={t("Conditions générales de vente d'Angel's Floor. Modalités de commande, livraison, paiement et retour pour nos produits béninois naturels.", "Angel's Floor Terms and Conditions of Sale. Ordering, delivery, payment and return terms for our natural Beninese products.")} />
</svelte:head>

<!-- Hero Section -->
<section class="relative bg-primary-green py-16 overflow-hidden">
  <div class="absolute inset-0">
    <div class="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
  </div>
  
  <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <ScrollReveal animation="fade-down">
      <CmsText key="terms.hero.title" tag="h1" class="text-4xl md:text-5xl font-bold text-white mb-4" en="Terms and Conditions of Sale">Conditions Générales de Vente</CmsText>
      <CmsText key="terms.hero.subtitle" tag="p" class="text-lg text-white/90 max-w-2xl mx-auto" en="Effective from 1 January 2025">En vigueur à partir du 1er janvier 2025</CmsText>
    </ScrollReveal>
  </div>
</section>

<!-- Content Section -->
<section class="py-16 bg-white">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
  {#if getLocale() === 'en'}
    <p class="text-sm text-neutral-slate text-center mb-12">
      This English version is provided for convenience. In case of discrepancy, the French version prevails.
    </p>
  {/if}
  <CmsRichText key="terms.body" class="prose prose-lg max-w-none">
    {#snippet en()}
    <!-- Préambule -->
    <ScrollReveal animation="fade-up">
      <div class="mb-12">
        <div class="bg-neutral-sand rounded-2xl p-6">
          <p class="text-neutral-charcoal leading-relaxed">
            These Terms and Conditions of Sale (the “Terms”) govern the commercial relationship between Angel's Floor SARL,
            a company registered with the Registre du Commerce et du Crédit Mobilier (RCCM, Trade and Personal Property
            Credit Register) under number RB/NAT/22 A 1234, whose registered office is located in Natitingou, Republic of
            Benin, and its customers, for any order of products placed on the website www.angelsfloor.bj or by any other
            means of communication.
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
          <h2 class="text-2xl font-bold text-primary-green">Purpose</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            The purpose of these Terms is to define the rights and obligations of the parties in connection with the
            distance selling of processed food products offered by Angel's Floor to its customers.
          </p>
          <p class="mt-4">
            Placing an order implies unreserved acceptance of these Terms. Angel's Floor reserves the right to amend
            these Terms at any time. The applicable Terms are those in force on the date of the order.
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
          <h2 class="text-2xl font-bold text-primary-green">Article 2: Products</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            The products offered for sale are those described on the website www.angelsfloor.bj. Product photographs
            and descriptions are as accurate as possible but cannot guarantee a perfect likeness.
          </p>
          <p class="mt-4">
            <strong>Our product ranges include:</strong>
          </p>
          <ul class="mt-2 space-y-2">
            <li>Pre-cooked fonio and fonio-based products</li>
            <li>Baobab pulp and baobab-based products</li>
            <li>Processed néré and fagara</li>
            <li>Dried mango products</li>
            <li>Baobab-enriched biscuits</li>
          </ul>
          <p class="mt-4">
            All our products are certified organic and comply with Beninese and international quality standards.
            Nutritional information and expiry dates are clearly indicated on each package.
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
          <h2 class="text-2xl font-bold text-primary-green">Article 3: Prices</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            Our product prices are stated in CFA francs (XOF), inclusive of all taxes. Angel's Floor reserves the right
            to change its prices at any time; however, products will be invoiced at the prices in force when the order
            is confirmed.
          </p>
          <p class="mt-4">
            Delivery charges are calculated according to the weight of the order and the delivery area. They are
            shown to the customer before final confirmation of the order.
          </p>
          <div class="bg-neutral-sand rounded-xl p-4 mt-4">
            <p class="font-semibold text-black mb-2">Delivery rates:</p>
            <ul class="space-y-1 text-sm">
              <li>• Natitingou town: 500 FCFA</li>
              <li>• Other towns in Benin: 1,000 to 2,500 FCFA</li>
              <li>• Free delivery on orders exceeding 25,000 FCFA</li>
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
          <h2 class="text-2xl font-bold text-primary-green">Article 4: Orders</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            Orders may be placed:
          </p>
          <ul class="mt-2 space-y-2">
            <li>By telephone on +229 01 96 12 19 71</li>
            <li>By email at contact@angelsfloor.bj</li>
            <li>Via the contact form on our website</li>
            <li>Directly at our physical sales points</li>
          </ul>
          <p class="mt-4">
            <strong>Ordering process:</strong>
          </p>
          <ol class="mt-2 space-y-2">
            <li>1. Selection of the desired products and quantities</li>
            <li>2. Review of the order summary</li>
            <li>3. Entry of delivery details</li>
            <li>4. Choice of payment method</li>
            <li>5. Final confirmation of the order</li>
          </ol>
          <p class="mt-4">
            A confirmation email summarising the order details will be sent to the customer. Angel's Floor reserves
            the right to cancel or refuse any order from a customer with whom a dispute exists.
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
          <h2 class="text-2xl font-bold text-primary-green">Article 5: Payment Terms</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            Payment for orders may be made by:
          </p>
          <ul class="mt-2 space-y-2">
            <li><strong>Mobile Money:</strong> MTN Mobile Money, Moov Money</li>
            <li><strong>Bank transfer:</strong> To our business account</li>
            <li><strong>Cash:</strong> On delivery or at a sales point</li>
            <li><strong>Cheque:</strong> For business orders</li>
          </ul>
          <p class="mt-4">
            For payment on delivery, the delivery person will hand over a receipted invoice. For advance payments,
            orders are prepared once payment has been confirmed.
          </p>
          <div class="bg-accent-gold/20 rounded-xl p-4 mt-4">
            <p class="text-sm">
              <strong>Note:</strong> For business orders exceeding 100,000 FCFA, a 50% deposit is required when the
              order is placed.
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
          <h2 class="text-2xl font-bold text-primary-green">Article 6: Delivery</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            Products are delivered to the address provided by the customer when ordering. Delivery times are given
            for information only:
          </p>
          <ul class="mt-2 space-y-2">
            <li><strong>Natitingou:</strong> 24 to 48 hours</li>
            <li><strong>Other towns in Benin:</strong> 3 to 7 working days</li>
            <li><strong>Special orders/large volumes:</strong> Timeframe agreed with the customer</li>
          </ul>
          <p class="mt-4">
            In the event of a delivery delay, Angel's Floor undertakes to inform the customer as soon as possible.
            The customer must check the condition of the products upon receipt and immediately report any damage or
            missing items.
          </p>
          <p class="mt-4">
            <strong>Delivery areas covered:</strong> The whole of Benin, with logistics partners in the main cities
            (Cotonou, Porto-Novo, Parakou, Natitingou, Abomey-Calavi).
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
          <h2 class="text-2xl font-bold text-primary-green">Article 7: Right of Withdrawal and Returns</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            In accordance with the legislation in force, the customer has 7 days from receipt of the products to
            exercise their right of withdrawal, without having to give reasons or pay any penalty.
          </p>
          <p class="mt-4">
            <strong>Exceptions:</strong> The right of withdrawal does not apply to:
          </p>
          <ul class="mt-2 space-y-2">
            <li>Food products that have been unsealed or opened</li>
            <li>Perishable products</li>
            <li>Personalised or made-to-order products</li>
          </ul>
          <p class="mt-4">
            To exercise this right, the customer must notify us of their decision by email or by post. Products must
            be returned unopened in their original packaging, together with the invoice. Return costs are borne by
            the customer.
          </p>
          <p class="mt-4">
            Refunds will be made within 14 days of receipt of the returned products, using the same means of payment
            as was used for the order.
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
          <h2 class="text-2xl font-bold text-primary-green">Article 8: Warranties and Liability</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            All our products are covered by the legal warranty of conformity and the warranty against latent defects.
            Angel's Floor undertakes to deliver products that conform to the order and are free from any defect.
          </p>
          <p class="mt-4">
            <strong>Quality guarantee:</strong>
          </p>
          <ul class="mt-2 space-y-2">
            <li>100% natural and organic products</li>
            <li>Compliance with food hygiene and safety standards</li>
            <li>Full traceability throughout the production chain</li>
            <li>Clearly indicated expiry dates</li>
          </ul>
          <p class="mt-4">
            In the event of non-conformity or a defect, the customer may obtain a replacement or a refund of the
            product concerned. Angel's Floor cannot be held liable for failure to perform the contract in the event
            of force majeure.
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
          <h2 class="text-2xl font-bold text-primary-green">Article 9: Personal Data Protection</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            The information collected when an order is placed is necessary to process that order and may be used to
            inform you of our commercial offers. In accordance with loi n° 2017-20 du 20 avril 2018 portant code du
            numérique en République du Bénin (Law No. 2017-20 of 20 April 2018 on the Digital Code of the Republic of
            Benin), you have the right to access, rectify and delete data concerning you.
          </p>
          <p class="mt-4">
            Angel's Floor undertakes not to disclose your personal data to third parties without your prior consent,
            except where required by law.
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
          <h2 class="text-2xl font-bold text-primary-green">Article 10: Customer Service</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            For any question, complaint or information about our products and services, our customer service team
            is at your disposal:
          </p>
          <div class="bg-neutral-sand rounded-xl p-6 mt-4 space-y-3">
            <div class="flex items-center gap-3">
              <Phone class="w-5 h-5 text-primary-green" />
              <p><strong>Telephone:</strong> +229 01 96 12 19 71</p>
            </div>
            <div class="flex items-center gap-3">
              <Mail class="w-5 h-5 text-primary-green" />
              <p><strong>Email:</strong> contact@angelsfloor.bj</p>
            </div>
            <p class="text-sm pt-2">
              <strong>Opening hours:</strong> Monday to Friday from 8 am to 6 pm, Saturday from 9 am to 1 pm
            </p>
          </div>
          <p class="mt-4">
            We undertake to respond to your requests within a maximum of 48 working hours.
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
          <h2 class="text-2xl font-bold text-primary-green">Article 11: Dispute Resolution</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            In the event of a dispute, an amicable solution will be sought before any legal action is taken. Failing
            an amicable settlement, the dispute will be brought before the competent courts of Natitingou.
          </p>
          <p class="mt-4">
            These Terms are governed by Beninese law. The language of the contract is French.
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
          <h2 class="text-2xl font-bold text-primary-green">Article 12: Amendment of the Terms</h2>
        </div>
        <div class="prose prose-lg max-w-none text-neutral-charcoal">
          <p>
            Angel's Floor reserves the right to amend its terms and conditions of sale at any time. The new terms will
            apply to all orders placed after such amendment.
          </p>
          <p class="mt-4">
            Customers are advised to consult these Terms regularly in order to be aware of any changes.
          </p>
        </div>
      </div>
    </ScrollReveal>

    <!-- Acceptation des CGV -->
    <ScrollReveal animation="fade-up" delay={1300}>
      <div class="bg-primary-green text-white rounded-2xl p-8 text-center">
        <Shield class="w-16 h-16 mx-auto mb-4 opacity-80" />
        <h3 class="text-xl font-bold mb-4">Acceptance of the Terms</h3>
        <p class="text-white/90">
          Placing an order implies the customer's full and unreserved acceptance of these Terms and Conditions of
          Sale. No special condition may prevail over these Terms unless formally accepted in writing by
          Angel's Floor.
        </p>
      </div>
    </ScrollReveal>

    <!-- Contact pour questions -->
    <ScrollReveal animation="fade" delay={1400}>
      <div class="text-center mt-16 pt-8 border-t border-neutral-light">
        <p class="text-sm text-neutral-slate mb-4">
          If you have any questions about these Terms, please contact us:
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
          Version 1.0 - January 2025
        </p>
      </div>
    </ScrollReveal>
    {/snippet}

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
  </CmsRichText>
  </div>
</section>