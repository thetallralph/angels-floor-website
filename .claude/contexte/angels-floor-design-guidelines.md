# Guide de Style - Site Web Angel's Floor

## Philosophie Design

Le design d'Angel's Floor s'inspire de l'authenticité béninoise et de la modernité, alliant tradition et innovation dans l'industrie agro-alimentaire. L'approche visuelle doit transmettre la qualité, la naturalité et l'engagement communautaire tout en restant professionnelle et accessible.

---

## Palette de Couleurs

### Couleurs Primaires

#### 1. Vert Nature (Couleur Signature)
- **HEX** : `#8CB77B`
- **RGB** : `rgb(140, 183, 123)`
- **Utilisation** : 
  - Couleur principale de la marque
  - Headers et navigation
  - Textes importants et titres
  - Boutons primaires
  - Éléments de branding

#### 2. Blanc Pur (Clarté)
- **HEX** : `#FFFFFF`
- **RGB** : `rgb(255, 255, 255)`
- **Utilisation** :
  - Arrière-plans principaux
  - Espaces négatifs
  - Texte sur fonds colorés
  - Cards et conteneurs

### Couleurs Secondaires (Accents)

#### 3. Jaune Doré (Chaleur)
- **HEX** : `#F6E7A6`
- **RGB** : `rgb(246, 231, 166)`
- **Utilisation** :
  - Éléments d'accent
  - Hover states
  - Badges et étiquettes
  - Surlignages légers

#### 4. Orange Vif (Énergie)
- **HEX** : `#F4B860`
- **RGB** : `rgb(244, 184, 96)`
- **Utilisation** :
  - Boutons call-to-action
  - Éléments interactifs
  - Accents graphiques
  - Indicateurs de prix/promotion

### Variables CSS Recommandées
```css
:root {
  --primary-green: #8CB77B;
  --pure-white: #FFFFFF;
  --accent-yellow: #F6E7A6;
  --accent-orange: #F4B860;
  --text-dark: #2D2D2D;
  --text-gray: #6B7280;
  --background-light: #FAFAFA;
}
```

---

## Typographie

### Hiérarchie Typographique

#### Headers (H1-H6)
- **Style** : Bold, moderne, clean
- **Caractère** : Minuscules privilégiées pour un ton accessible
- **Couleur** : Vert nature (#8CB77B) ou noir (#2D2D2D)
- **Espacement** : Généreux entre les sections

#### Corps de Texte
- **Weight** : Regular (400) pour la lisibilité
- **Couleur** : Gris foncé (#2D2D2D) ou gris moyen (#6B7280)
- **Line-height** : 1.6 pour une lecture confortable

#### Éléments Interactifs
- **Boutons** : Texte en minuscules, weight medium
- **Links** : Couleur vert nature avec underline subtil

### Recommandations de Polices
- **Système** : `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`
- **Alternative Web** : Montserrat, Lato, ou Open Sans

---

## Éléments Visuels

### Inspiration Noka adaptée à Angel's Floor

#### 1. Formes et Containers
- **Cards** : Coins arrondis (border-radius: 12px-20px)
- **Boutons** : Entièrement arrondis, padding généreux
- **Sections** : Blocs pleine largeur avec backgrounds colorés alternés

#### 2. Imagery & Visuels
- **Produits** : Style "flottant" avec ombres douces
- **Fruits/Ingrédients** : Éléments décoratifs autour des produits
- **Photos lifestyle** : Intégration des productrices et communauté locale
- **Textures naturelles** : Intégration subtile de motifs béninois

#### 3. Animations et Interactions
- **Transitions** : Douces et fluides (300ms ease-in-out)
- **Hover states** : Changements de couleur et légères élévations
- **Sliders** : Transitions smooth pour les galleries produits
- **Parallax subtil** : Sur certains éléments heroes

---

## Layout et Structure

### Principes de Mise en Page

#### 1. Sections Alternées
- **Pattern** : Fond blanc → Fond coloré → Fond blanc
- **Couleurs de section** :
  - Vert nature pour sections importantes
  - Jaune doré pour sections secondaires
  - Orange vif pour call-to-actions

#### 2. Espacement et Grille
- **Container max-width** : 1200px
- **Padding horizontal** : 20px mobile, 40px desktop
- **Espacement vertical** : Sections spacées de 80px à 120px
- **Grid** : CSS Grid et Flexbox pour layouts responsive

#### 3. Responsive Design
- **Mobile-first** : Design optimisé pour mobile en priorité
- **Breakpoints** :
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

---

## Composants UI Spécifiques

### 1. Navigation
- **Style** : Clean, fond blanc avec ombre subtile
- **Logo** : Centré sur mobile, à gauche sur desktop
- **Menu items** : Espacement généreux, couleur vert nature
- **Hamburger menu** : Animation fluide sur mobile

### 2. Hero Section
- **Background** : Vert nature avec gradient subtil
- **Texte** : Blanc sur fond coloré
- **CTA Button** : Orange vif, corners arrondis
- **Produits** : Arrangement "flottant" avec fruits décoratifs

### 3. Product Cards
- **Container** : Fond blanc, border-radius 16px
- **Image** : Aspect ratio 1:1, object-fit cover
- **Texte** : Titre en vert nature, description en gris
- **Prix** : Orange vif, weight bold
- **Hover** : Légère élévation (box-shadow)

### 4. Boutons
```css
.btn-primary {
  background: var(--accent-orange);
  color: white;
  border-radius: 25px;
  padding: 12px 24px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-secondary {
  background: transparent;
  color: var(--primary-green);
  border: 2px solid var(--primary-green);
  border-radius: 25px;
}
```

### 5. Testimonials
- **Cards** : Fond blanc avec ombre douce
- **Quotes** : Style italique, couleur gris moyen
- **Photos** : Circulaires, border vert nature

---

## Patterns Spécifiques Angel's Floor

### 1. Section Communautaire
- **Background** : Jaune doré avec texture subtile
- **Photos** : Femmes productrices de l'Atacora
- **Style** : Authentique, chaleureux, documentaire

### 2. Section Produits
- **Layout** : Grid responsive avec filtres
- **Categorisation** : Code couleur par gamme (Fonio, Baobab, etc.)
- **Interactions** : Quick view, ajout favoris

### 3. Section Impact
- **Visuels** : Métriques avec icons béninois
- **Graphiques** : Style minimaliste, couleurs de marque
- **Storytelling** : Mix texte/images pour narratif engageant

### 4. Footer
- **Style** : Vert nature foncé (#6B8B5C)
- **Structure** : 4 colonnes sur desktop, accordéon sur mobile
- **Éléments** : Contact, liens sociaux, newsletter signup

---

## Iconographie

### Style d'Icons
- **Type** : Line icons ou filled selon contexte
- **Stroke width** : 2px pour cohérence
- **Couleurs** : Vert nature ou orange selon importance
- **Taille** : Modulaire (16px, 24px, 32px, 48px)

### Icons Spécifiques
- **Produits** : Icons représentant fonio, baobab, néré
- **Valeurs** : Icons nature, santé, communauté
- **Navigation** : Menu, search, cart, user account

---

## Performances et Optimisation

### Images
- **Format** : WebP avec fallback JPEG
- **Lazy loading** : Implémenté sur toutes les images
- **Sizes** : Multiples résolutions pour responsive

### Animations
- **Principe** : Enhance, don't distract
- **Performance** : Utilisation de transform et opacity uniquement
- **Accessibilité** : Respect de prefers-reduced-motion

---

## Accessibilité

### Contraste
- **Minimum** : 4.5:1 pour texte normal
- **Enhanced** : 7:1 pour éléments importants
- **Vérification** : Tous les couples couleur/fond testés

### Navigation
- **Keyboard** : Tous les éléments accessibles au clavier
- **Focus states** : Visibles et cohérents
- **Screen readers** : Alt texts et aria-labels appropriés

---

*Ce guide de style assure la cohérence visuelle et l'authenticité de la marque Angel's Floor tout en s'inspirant des meilleures pratiques du web design moderne.*