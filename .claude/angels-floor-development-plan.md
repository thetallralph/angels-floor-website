# Plan de Développement - Site Web Angel's Floor
## Documentation Complète en 5 Étapes

---

## 📁 Fichiers de Référence du Projet

### Documents de Base
- **Cahier des charges** : `/home/ralph/projects/weni.bj/.claude/contexte/cahier des charges.md`
- **Prompt de développement** : `/home/ralph/projects/weni.bj/.claude/contexte/angels-floor-website-prompt.md`
- **Guide de style** : `/home/ralph/projects/weni.bj/.claude/contexte/angels-floor-design-guidelines.md`
- **Palette de couleurs** : `/home/ralph/projects/weni.bj/.claude/contexte/styleguide-graphic-color.md`

### Inspiration Design
- **Référence Noka** : `/home/ralph/projects/weni.bj/.claude/inspirations/nokawebsite.md`

### Suivi de Projet
- **Todo List** : À créer dans `/home/ralph/projects/weni.bj/.claude/contexte/angels-floor-todos.md`

---

## 🎯 Vue d'Ensemble du Projet

**Objectif** : Développer un site web SvelteKit moderne pour Angel's Floor, entreprise béninoise de transformation agro-alimentaire, en respectant la charte graphique TACA et en s'inspirant du design Noka.

**Stack Technique** : SvelteKit + TypeScript + Tailwind CSS + OpenStreetMap
**Durée Estimée** : 15-20 heures de développement

---

# 📋 ÉTAPE 1 : CONFIGURATION ET ARCHITECTURE DU PROJET
*Durée estimée : 2-3 heures*

## 1.1 Initialisation du Projet SvelteKit

### Setup Initial
```bash
# Créer le projet SvelteKit avec TypeScript
npm create svelte@latest angels-floor-website
cd angels-floor-website

# Options de configuration :
- TypeScript: Yes
- ESLint: Yes  
- Prettier: Yes
- Playwright: Yes (pour les tests)
- Vitest: Yes (pour les tests unitaires)
```

### Installation des Dépendances
```bash
# Dépendances principales
npm install -D tailwindcss @tailwindcss/typography @tailwindcss/forms autoprefixer
npm install lucide-svelte @types/leaflet leaflet

# Utilitaires et optimisation
npm install clsx tailwind-merge
npm install @vercel/analytics (optionnel pour analytics)
```

## 1.2 Structure des Dossiers

### Architecture Recommandée
```
src/
├── lib/
│   ├── components/
│   │   ├── ui/           # Composants UI réutilisables
│   │   ├── layout/       # Header, Footer, Navigation
│   │   ├── sections/     # Sections de pages spécifiques
│   │   └── forms/        # Formulaires et inputs
│   ├── stores/           # Stores Svelte pour état global
│   ├── utils/            # Fonctions utilitaires
│   ├── data/             # Données statiques (produits, etc.)
│   └── styles/           # Styles globaux et variables CSS
├── routes/               # Pages du site (routing SvelteKit)
├── app.html              # Template HTML principal
└── app.css               # Styles globaux
```

## 1.3 Configuration Tailwind CSS

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          green: '#8CB77B',
          white: '#FFFFFF'
        },
        accent: {
          yellow: '#F6E7A6',
          orange: '#F4B860'
        },
        neutral: {
          dark: '#2D2D2D',
          gray: '#6B7280',
          light: '#FAFAFA'
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px'
      }
    },
  },
  plugins: [@tailwindcss/typography, @tailwindcss/forms],
}
```

## 1.4 Configuration des Variables CSS Globales

### src/app.css
```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

:root {
  --primary-green: #8CB77B;
  --pure-white: #FFFFFF;
  --accent-yellow: #F6E7A6;
  --accent-orange: #F4B860;
  --text-dark: #2D2D2D;
  --text-gray: #6B7280;
  --background-light: #FAFAFA;
}

body {
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: var(--text-dark);
}
```

---

# 📋 ÉTAPE 2 : COMPOSANTS DE BASE ET LAYOUT
*Durée estimée : 3-4 heures*

## 2.1 Composants UI Fondamentaux

### src/lib/components/ui/Button.svelte
```svelte
<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'outline' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let href: string | undefined = undefined;
  export let disabled = false;
  
  const variants = {
    primary: 'bg-accent-orange text-white hover:bg-orange-600',
    secondary: 'bg-primary-green text-white hover:bg-green-600',
    outline: 'border-2 border-primary-green text-primary-green hover:bg-primary-green hover:text-white'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
</script>

<!-- Implémentation complète du bouton avec toutes les variantes -->
```

### src/lib/components/ui/Card.svelte
```svelte
<!-- Card réutilisable avec slots pour différents contenus -->
<script lang="ts">
  export let padding: 'sm' | 'md' | 'lg' = 'md';
  export let shadow = true;
  export let rounded = true;
</script>

<div class="bg-white {shadow ? 'shadow-lg' : ''} {rounded ? 'rounded-2xl' : ''} {padding === 'sm' ? 'p-4' : padding === 'md' ? 'p-6' : 'p-8'}">
  <slot />
</div>
```

## 2.2 Layout Principal

### src/lib/components/layout/Header.svelte
```svelte
<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/ui/Button.svelte';
  
  let mobileMenuOpen = false;
  
  const navItems = [
    { href: '/', label: 'Accueil' },
    { href: '/a-propos', label: 'À Propos' },
    { href: '/produits', label: 'Nos Produits' },
    { href: '/impact', label: 'Impact Communautaire' },
    { href: '/points-de-vente', label: 'Points de Vente' },
    { href: '/grossistes', label: 'Espace Grossistes' },
    { href: '/actualites', label: 'Actualités' },
    { href: '/contact', label: 'Contact' }
  ];
</script>

<!-- Navigation responsive avec menu hamburger mobile -->
<header class="bg-white shadow-sm sticky top-0 z-50">
  <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Logo centré sur mobile, à gauche sur desktop -->
    <!-- Menu items avec états actifs -->
    <!-- CTA button "Devenir Grossiste" -->
    <!-- Mobile hamburger menu -->
  </nav>
</header>
```

### src/lib/components/layout/Footer.svelte
```svelte
<script lang="ts">
  import { WhatsApp, Facebook, Linkedin, Mail, Phone, MapPin } from 'lucide-svelte';
</script>

<!-- Footer avec 4 colonnes sur desktop, accordéon sur mobile -->
<footer class="bg-primary-green text-white">
  <div class="max-w-7xl mx-auto px-4 py-16">
    <!-- Colonnes : À Propos, Produits, Contact, Réseaux Sociaux -->
    <!-- Newsletter signup -->
    <!-- Copyright et mentions légales -->
  </div>
</footer>
```

## 2.3 Store Global pour l'État

### src/lib/stores/app.ts
```typescript
import { writable } from 'svelte/store';

export interface Product {
  id: string;
  name: string;
  category: 'fonio' | 'baobab' | 'nere-fagara' | 'mangue' | 'bisbab';
  price: number;
  description: string;
  image: string;
  benefits: string[];
  nutritionalInfo?: object;
}

export const products = writable<Product[]>([]);
export const featuredProducts = writable<Product[]>([]);
export the mobileMenuOpen = writable(false);
```

---

# 📋 ÉTAPE 3 : PAGES PRINCIPALES ET CONTENU
*Durée estimée : 5-6 heures*

## 3.1 Page d'Accueil (src/routes/+page.svelte)

### Sections à Développer

#### 3.1.1 Hero Section
```svelte
<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte';
  
  const heroProducts = [
    { name: 'Fonio Précuit', image: '/images/products/fonio-hero.jpg' },
    { name: 'Pulpe de Baobab', image: '/images/products/baobab-hero.jpg' },
    { name: 'Biscuits de Néré', image: '/images/products/nere-hero.jpg' }
  ];
</script>

<section class="bg-primary-green min-h-screen flex items-center relative overflow-hidden">
  <!-- Background avec fruits décoratifs -->
  <!-- Hero text : "Des produits sains et naturels du Bénin" -->
  <!-- CTA buttons : "Découvrir nos produits" / "Devenir grossiste" -->
  <!-- Slider de produits flottants -->
</section>
```

#### 3.1.2 Section "10 ans d'Excellence"
- Timeline de l'entreprise
- Métriques clés (productrices, produits, impact)
- Photos authentiques de l'équipe

#### 3.1.3 Aperçu Produits
- Carousel des gammes principales
- Cards colorées par catégorie
- Quick view avec modal

#### 3.1.4 Témoignages Clients
- Slider de témoignages avec notes
- Photos clients (avec permissions)
- Citations authentiques

#### 3.1.5 Impact Communautaire Preview
- Stats visuelles
- Photos des femmes de l'Atacora
- CTA vers page dédiée

## 3.2 Page À Propos (src/routes/a-propos/+page.svelte)

### Structure Détaillée
1. **Notre Histoire** : Timeline interactive des 10 ans
2. **Mission & Valeurs** : Cards avec icons béninois
3. **L'Équipe** : Photos et rôles des membres clés
4. **Certifications** : Badges et logos officiels
5. **Partenaires** : Logos des partenaires locaux

## 3.3 Catalogue Produits (src/routes/produits/+page.svelte)

### Fonctionnalités Requises
```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import ProductCard from '$lib/components/ProductCard.svelte';
  import FilterBar from '$lib/components/FilterBar.svelte';
  
  let products = [];
  let filteredProducts = [];
  let activeCategory = 'all';
  let priceRange = [0, 5000];
  
  // Logique de filtrage
  $: filteredProducts = products.filter(product => {
    const categoryMatch = activeCategory === 'all' || product.category === activeCategory;
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    return categoryMatch && priceMatch;
  });
</script>

<div class="max-w-7xl mx-auto px-4 py-16">
  <!-- Barre de filtres sticky -->
  <FilterBar bind:activeCategory bind:priceRange />
  
  <!-- Grid responsive des produits -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {#each filteredProducts as product}
      <ProductCard {product} />
    {/each}
  </div>
</div>
```

### Composant ProductCard
```svelte
<!-- src/lib/components/ProductCard.svelte -->
<script lang="ts">
  export let product;
  let showQuickView = false;
</script>

<div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
  <!-- Image produit avec overlay hover -->
  <!-- Nom et catégorie -->
  <!-- Prix en orange vif -->
  <!-- Description courte -->
  <!-- Boutons : "Voir détails" / "Quick view" -->
</div>
```

## 3.4 Page Impact Communautaire (src/routes/impact/+page.svelte)

### Contenu à Développer
1. **Hero avec statistiques** : Nombre de femmes, revenus générés
2. **Stories des productrices** : Cards avec photos et témoignages
3. **Processus de collaboration** : Timeline illustrée
4. **Impact économique** : Graphiques et métriques
5. **Valeurs durables** : Icons avec descriptions

---

# 📋 ÉTAPE 4 : FONCTIONNALITÉS AVANCÉES ET INTERACTIVITÉ
*Durée estimée : 4-5 heures*

## 4.1 Carte Interactive des Points de Vente

### src/routes/points-de-vente/+page.svelte
```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  let mapContainer;
  let map;
  
  const salesPoints = [
    {
      id: 1,
      name: 'Siège Social Natitingou',
      address: 'Natitingou, Atacora, Bénin',
      coordinates: [10.3, 1.4], // Coordonnées approximatives
      type: 'siege',
      contact: '+229 01 96 12 19 71'
    },
    // Autres points de vente...
  ];
  
  onMount(async () => {
    if (browser) {
      const L = await import('leaflet');
      // Configuration de la carte OpenStreetMap
      map = L.map(mapContainer).setView([9.3, 2.3], 7); // Centré sur le Bénin
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      
      // Ajout des marqueurs pour chaque point de vente
      salesPoints.forEach(point => {
        const marker = L.marker(point.coordinates).addTo(map);
        marker.bindPopup(`
          <div class="p-2">
            <h3 class="font-bold">${point.name}</h3>
            <p class="text-sm text-gray-600">${point.address}</p>
            <p class="text-sm font-medium">${point.contact}</p>
          </div>
        `);
      });
    }
  });
</script>

<div class="h-96 w-full rounded-xl overflow-hidden" bind:this={mapContainer}></div>
```

## 4.2 Espace Grossistes avec Formulaires

### src/routes/grossistes/+page.svelte
```svelte
<script lang="ts">
  import PartnershipForm from '$lib/components/forms/PartnershipForm.svelte';
  import PricingTable from '$lib/components/PricingTable.svelte';
  
  const wholesaleBenefits = [
    'Tarifs dégressifs selon volume',
    'Support marketing personnalisé',
    'Formation produits incluse',
    'Livraison prioritaire'
  ];
</script>

<div class="max-w-7xl mx-auto px-4 py-16">
  <!-- Hero section pour grossistes -->
  <section class="text-center mb-16">
    <h1 class="text-4xl font-bold text-primary-green mb-4">
      Rejoignez notre réseau de partenaires
    </h1>
    <p class="text-xl text-gray-600 mb-8">
      Distribuez nos produits authentiques du Bénin dans votre région
    </p>
  </section>
  
  <!-- Grille des avantages -->
  <!-- Tableau de tarification B2B -->
  <!-- Formulaire de demande de partenariat -->
  <PartnershipForm />
</div>
```

### Formulaire Partenariat avec Tally
```svelte
<!-- src/lib/components/forms/PartnershipForm.svelte -->
<script lang="ts">
  // L'URL du formulaire Tally sera fournie par le client
  const TALLY_FORM_URL = 'https://tally.so/r/partnership-form'; // Placeholder
  
  let showForm = false;
</script>

{#if showForm}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
      <div class="p-4 border-b flex justify-between items-center">
        <h3 class="text-xl font-bold">Demande de Partenariat</h3>
        <button on:click={() => showForm = false} class="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
      <iframe src={TALLY_FORM_URL} class="w-full h-96 border-0"></iframe>
    </div>
  </div>
{/if}

<button 
  on:click={() => showForm = true}
  class="bg-accent-orange text-white px-8 py-4 rounded-full font-medium hover:bg-orange-600 transition-colors"
>
  Demander un Partenariat
</button>
```

## 4.3 Blog/Actualités Dynamique

### src/routes/actualites/+page.svelte
```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import BlogCard from '$lib/components/BlogCard.svelte';
  
  let articles = [];
  let featuredArticle = null;
  
  const categories = ['Tous', 'Recettes', 'Bienfaits', 'Actualités Entreprise', 'Communauté'];
  let activeCategory = 'Tous';
  
  onMount(() => {
    // Chargement des articles (statique pour le MVP)
    articles = [
      {
        id: 1,
        title: 'Les bienfaits du fonio pour la santé',
        excerpt: 'Découvrez pourquoi le fonio est considéré comme un super-aliment...',
        image: '/images/blog/fonio-benefits.jpg',
        category: 'Bienfaits',
        date: '2024-01-15',
        author: 'Équipe Angel\'s Floor'
      },
      // Autres articles...
    ];
    featuredArticle = articles[0];
  });
</script>

<div class="max-w-7xl mx-auto px-4 py-16">
  <!-- Article en vedette -->
  {#if featuredArticle}
    <section class="mb-16">
      <div class="bg-gradient-to-r from-primary-green to-green-600 rounded-3xl overflow-hidden">
        <!-- Article hero avec image et contenu -->
      </div>
    </section>
  {/if}
  
  <!-- Filtres par catégorie -->
  <!-- Grille des articles -->
</div>
```

## 4.4 Intégration WhatsApp Business

### src/lib/components/WhatsAppWidget.svelte
```svelte
<script lang="ts">
  const WHATSAPP_NUMBER = '22901961219171'; // Numéro Angel's Floor
  const DEFAULT_MESSAGE = 'Bonjour, je souhaite en savoir plus sur vos produits Angel\'s Floor';
  
  function openWhatsApp() {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
    window.open(url, '_blank');
  }
</script>

<!-- Widget flottant en bas à droite -->
<button 
  on:click={openWhatsApp}
  class="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-40 transition-all duration-300 hover:scale-110"
  aria-label="Contacter sur WhatsApp"
>
  <!-- Icon WhatsApp -->
  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <!-- SVG path pour icon WhatsApp -->
  </svg>
</button>
```

---

# 📋 ÉTAPE 5 : OPTIMISATION, TESTS ET DÉPLOIEMENT
*Durée estimée : 2-3 heures*

## 5.1 Optimisation des Performances

### Configuration Images
```javascript
// vite.config.js - Optimisation des images
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['lucide-svelte'],
          maps: ['leaflet']
        }
      }
    }
  }
});
```

### Lazy Loading Images
```svelte
<!-- src/lib/components/LazyImage.svelte -->
<script lang="ts">
  export let src: string;
  export let alt: string;
  export let className = '';
  
  let loaded = false;
  let imageRef;
  
  function handleLoad() {
    loaded = true;
  }
</script>

<div class="relative {className}">
  {#if !loaded}
    <div class="absolute inset-0 bg-gray-200 animate-pulse rounded"></div>
  {/if}
  
  <img 
    bind:this={imageRef}
    {src} 
    {alt} 
    on:load={handleLoad}
    class="w-full h-full object-cover transition-opacity duration-300 {loaded ? 'opacity-100' : 'opacity-0'}"
    loading="lazy"
  />
</div>
```

## 5.2 SEO et Métadonnées

### src/app.html Template
```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    
    <!-- SEO Meta Tags par défaut -->
    <meta name="description" content="Angel's Floor - Produits alimentaires naturels et sains du Bénin. Fonio, baobab, néré et plus encore." />
    <meta name="keywords" content="produits alimentaires Bénin, fonio, baobab, néré, alimentation naturelle" />
    <meta name="author" content="Angel's Floor" />
    
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Angel's Floor" />
    
    <!-- Schema.org pour Google -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Angel's Floor",
      "url": "https://angelsfloor.bj",
      "logo": "https://angelsfloor.bj/images/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+229-01-96-12-19-71",
        "contactType": "customer service"
      }
    }
    </script>
    
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

### Métadonnées Dynamiques par Page
```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
  import Header from '$lib/components/layout/Header.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import WhatsAppWidget from '$lib/components/WhatsAppWidget.svelte';
</script>

<svelte:head>
  <title>Angel's Floor - Produits Naturels du Bénin</title>
</svelte:head>

<Header />
<main>
  <slot />
</main>
<Footer />
<WhatsAppWidget />
```

## 5.3 Tests et Qualité

### Tests E2E avec Playwright
```javascript
// tests/homepage.spec.js
import { expect, test } from '@playwright/test';

test('Homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  
  // Vérifier que le hero est visible
  await expect(page.getByRole('heading', { name: /des produits sains/i })).toBeVisible();
  
  // Vérifier la navigation
  await expect(page.getByRole('link', { name: 'À Propos' })).toBeVisible();
  
  // Tester le menu mobile
  await page.setViewportSize({ width: 375, height: 667 });
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
});

test('Product catalog filtering works', async ({ page }) => {
  await page.goto('/produits');
  
  // Tester les filtres
  await page.getByText('Fonio').click();
  await expect(page.getByTestId('product-card')).toHaveCount(2);
  
  // Tester la recherche
  await page.getByPlaceholder('Rechercher...').fill('baobab');
  await expect(page.getByText('Pulpe de baobab')).toBeVisible();
});
```

### Validation Accessibilité
```javascript
// tests/accessibility.spec.js
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Homepage accessibility', async ({ page }) => {
  await page.goto('/');
  
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

## 5.4 Configuration de Déploiement

### Configuration Vercel (vercel.json)
```json
{
  "framework": "sveltekit",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["fra1"],
  "functions": {
    "src/routes/**/*.js": {
      "maxDuration": 30
    }
  }
}
```

### Variables d'Environnement
```bash
# .env.example
PUBLIC_SITE_URL=https://angelsfloor.bj
PUBLIC_WHATSAPP_NUMBER=22901961219171
PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
TALLY_CONTACT_FORM_URL=https://tally.so/r/contact
TALLY_PARTNERSHIP_FORM_URL=https://tally.so/r/partnership
```

## 5.5 Documentation et Maintenance

### README.md du Projet
```markdown
# Angel's Floor Website

Site web officiel d'Angel's Floor, entreprise béninoise de transformation agro-alimentaire.

## Développement Local

```bash
npm install
npm run dev
```

## Structure du Projet
- `/src/routes/` - Pages du site
- `/src/lib/components/` - Composants réutilisables
- `/src/lib/data/` - Données statiques (produits, etc.)
- `/static/` - Assets statiques (images, etc.)

## Déploiement
Le site est déployé automatiquement sur Vercel lors des push sur `main`.

## Maintenance
- Images : Optimiser et utiliser WebP
- Contenu : Mettre à jour les produits dans `/src/lib/data/products.ts`
- Formulaires : URLs Tally dans les variables d'environnement
```

---

## 📋 LIVRABLES FINAUX

### Checklist de Validation
- [ ] **Design** : Respect de la charte graphique TACA
- [ ] **Responsive** : Fonctionnel sur mobile, tablette, desktop
- [ ] **Performance** : Lighthouse score > 90
- [ ] **Accessibilité** : WCAG 2.1 AA compliance
- [ ] **SEO** : Métadonnées complètes sur toutes les pages
- [ ] **Fonctionnalités** : Tous les composants interactifs testés
- [ ] **Contenu** : Placeholder appropriés en attendant le contenu final
- [ ] **Intégrations** : WhatsApp, cartes, formulaires Tally

### Documentation de Handover
1. **Guide d'utilisation** : Comment mettre à jour le contenu
2. **Guide technique** : Architecture et composants
3. **Accès et comptes** : Déploiement, analytics, etc.
4. **Plan de maintenance** : Mises à jour, sécurité, backups

---

*Ce plan de développement assure une approche méthodique et complète pour créer un site web professionnel et performant pour Angel's Floor, en respectant les standards de qualité et les exigences spécifiques du projet.*