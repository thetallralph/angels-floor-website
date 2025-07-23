import type { Product } from '$lib/stores/app.js';

export const products: Product[] = [
  {
    id: '1',
    name: 'Fonio Précuit Bio',
    category: 'fonio',
    price: 2500,
    description: 'Fonio précuit de qualité supérieure, prêt en 10 minutes. Cultivé par les femmes de l\'Atacora selon des méthodes traditionnelles.',
    image: '/images/products/fonio-precuit.jpg',
    images: [
      '/images/products/fonio-precuit.jpg',
      '/images/products/fonio-precuit-2.jpg'
    ],
    benefits: [
      'Riche en fibres alimentaires',
      'Sans gluten naturellement',
      'Facile à digérer',
      'Source de protéines végétales',
      'Cuisson rapide (10 min)'
    ],
    nutritionalInfo: {
      calories: 341,
      protein: 10.4,
      carbs: 76.1,
      fiber: 8.5,
      fat: 1.9
    },
    inStock: true,
    featured: true
  },
  {
    id: '2',
    name: 'Pulpe de Baobab Pure',
    category: 'baobab',
    price: 3500,
    description: 'Pulpe de baobab 100% naturelle, riche en vitamine C. Séchée au soleil et finement moulue.',
    image: '/images/products/baobab-pulpe.jpg',
    images: [
      '/images/products/baobab-pulpe.jpg',
      '/images/products/baobab-pulpe-2.jpg'
    ],
    benefits: [
      'Riche en vitamine C (6x plus que l\'orange)',
      'Antioxydant naturel puissant',
      'Renforce le système immunitaire',
      'Améliore la digestion',
      'Source de calcium et fer'
    ],
    nutritionalInfo: {
      calories: 162,
      protein: 2.3,
      carbs: 76.8,
      fiber: 44.5,
      fat: 0.3
    },
    inStock: true,
    featured: true
  },
  {
    id: '3',
    name: 'Farine de Néré Bio',
    category: 'nere-fagara',
    price: 1800,
    description: 'Farine de néré traditionnelle, parfaite pour les sauces et assaisonnements africains.',
    image: '/images/products/nere-farine.jpg',
    benefits: [
      'Riche en protéines',
      'Améliore le goût des plats',
      'Tradition culinaire béninoise',
      'Source de minéraux'
    ],
    inStock: true,
    featured: false
  },
  {
    id: '4',
    name: 'Confiture de Mangue Artisanale',
    category: 'mangue',
    price: 2200,
    description: 'Confiture de mangue Kent, préparée artisanalement avec 60% de fruits.',
    image: '/images/products/confiture-mangue.jpg',
    benefits: [
      '60% de fruits',
      'Sans conservateurs artificiels',
      'Préparation artisanale',
      'Mangues locales de qualité'
    ],
    inStock: true,
    featured: false
  },
  {
    id: '5',
    name: 'Biscuits au Baobab',
    category: 'bisbab',
    price: 1500,
    description: 'Biscuits croustillants enrichis à la pulpe de baobab, sans additifs artificiels.',
    image: '/images/products/biscuits-baobab.jpg',
    benefits: [
      'Enrichis en vitamine C',
      'Texture croustillante',
      'Sans additifs artificiels',
      'Goût unique du baobab'
    ],
    inStock: true,
    featured: true
  },
  {
    id: '6',
    name: 'Épices Fagara Premium',
    category: 'nere-fagara',
    price: 2800,
    description: 'Fagara premium, épice rare aux propriétés aromatiques exceptionnelles.',
    image: '/images/products/fagara-epices.jpg',
    benefits: [
      'Arôme unique et intense',
      'Propriétés digestives',
      'Récolte traditionnelle',
      'Qualité premium'
    ],
    inStock: false,
    featured: false
  }
];

export const categories = [
  { id: 'all', name: 'Tous les produits', count: products.length },
  { id: 'fonio', name: 'Gamme Fonio', count: products.filter(p => p.category === 'fonio').length },
  { id: 'baobab', name: 'Pulpe de Baobab', count: products.filter(p => p.category === 'baobab').length },
  { id: 'nere-fagara', name: 'Néré & Fagara', count: products.filter(p => p.category === 'nere-fagara').length },
  { id: 'mangue', name: 'Produits Mangue', count: products.filter(p => p.category === 'mangue').length },
  { id: 'bisbab', name: 'Biscuits Baobab', count: products.filter(p => p.category === 'bisbab').length }
];

export const featuredProducts = products.filter(p => p.featured);