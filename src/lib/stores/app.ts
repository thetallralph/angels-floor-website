import { writable } from 'svelte/store';

// Product interface
export interface Product {
  id: string;
  name: string;
  category: 'fonio' | 'baobab' | 'nere-fagara' | 'mangue' | 'bisbab';
  price: number;
  description: string;
  image: string;
  images?: string[];
  benefits: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fiber?: number;
    fat?: number;
  };
  inStock: boolean;
  featured: boolean;
}

// Blog article interface
export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: 'Recettes' | 'Bienfaits' | 'Actualités Entreprise' | 'Communauté';
  date: string;
  author: string;
  readTime: number;
  tags: string[];
}

// Contact/Sales point interface
export interface SalesPoint {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  type: 'siege' | 'grossiste' | 'detaillant';
  contact: string;
  email?: string;
  hours?: string;
}

// Global app state stores
export const products = writable<Product[]>([]);
export const featuredProducts = writable<Product[]>([]);
export const blogArticles = writable<BlogArticle[]>([]);
export const salesPoints = writable<SalesPoint[]>([]);

// UI state stores
export const mobileMenuOpen = writable(false);
export const isLoading = writable(false);

// Newsletter and contact forms
export const newsletterEmail = writable('');

// Shopping/favorites functionality (for future enhancement)
export const favorites = writable<string[]>([]);

// Search and filtering
export const searchQuery = writable('');
export const selectedCategory = writable<string>('all');
export const priceRange = writable<[number, number]>([0, 10000]);

// Utility functions for stores
export const appStore = {
  // Load initial data (will be implemented with actual data)
  async loadProducts() {
    isLoading.set(true);
    try {
      // This will be replaced with actual API calls or static data loading
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Fonio Précuit Bio',
          category: 'fonio',
          price: 2500,
          description: 'Fonio précuit de qualité supérieure, prêt en 10 minutes',
          image: '/images/products/fonio-precuit.jpg',
          benefits: ['Riche en fibres', 'Sans gluten', 'Facile à digérer'],
          inStock: true,
          featured: true
        },
        {
          id: '2',
          name: 'Pulpe de Baobab Pure',
          category: 'baobab',
          price: 3500,
          description: 'Pulpe de baobab 100% naturelle, riche en vitamine C',
          image: '/images/products/baobab-pulpe.jpg',
          benefits: ['Riche en vitamine C', 'Antioxydant naturel', 'Renforce l\'immunité'],
          inStock: true,
          featured: true
        }
      ];
      
      products.set(mockProducts);
      featuredProducts.set(mockProducts.filter(p => p.featured));
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      isLoading.set(false);
    }
  },

  async loadBlogArticles() {
    isLoading.set(true);
    try {
      const mockArticles: BlogArticle[] = [
        {
          id: '1',
          title: 'Les bienfaits du fonio pour la santé',
          excerpt: 'Découvrez pourquoi le fonio est considéré comme un super-aliment africain.',
          content: '',
          image: '/images/blog/fonio-benefits.jpg',
          category: 'Bienfaits',
          date: '2024-01-15',
          author: 'Équipe Angel\'s Floor',
          readTime: 5,
          tags: ['fonio', 'santé', 'nutrition']
        }
      ];
      
      blogArticles.set(mockArticles);
    } catch (error) {
      console.error('Failed to load blog articles:', error);
    } finally {
      isLoading.set(false);
    }
  },

  async loadSalesPoints() {
    isLoading.set(true);
    try {
      const mockSalesPoints: SalesPoint[] = [
        {
          id: '1',
          name: 'Siège Social Natitingou',
          address: 'Natitingou, Atacora, Bénin',
          coordinates: [10.3, 1.4],
          type: 'siege',
          contact: '+229 01 96 12 19 71',
          email: 'contact@angelsfloor.bj',
          hours: 'Lun-Ven: 8h-17h'
        }
      ];
      
      salesPoints.set(mockSalesPoints);
    } catch (error) {
      console.error('Failed to load sales points:', error);
    } finally {
      isLoading.set(false);
    }
  },

  // Initialize all data
  async initialize() {
    await Promise.all([
      this.loadProducts(),
      this.loadBlogArticles(),
      this.loadSalesPoints()
    ]);
  },

  // Utility functions
  toggleFavorite(productId: string) {
    favorites.update(favs => {
      if (favs.includes(productId)) {
        return favs.filter(id => id !== productId);
      } else {
        return [...favs, productId];
      }
    });
  },

  filterProducts(category: string, query: string = '', range: [number, number] = [0, 10000]) {
    return new Promise<Product[]>((resolve) => {
      products.subscribe(allProducts => {
        let filtered = allProducts;

        // Filter by category
        if (category !== 'all') {
          filtered = filtered.filter(p => p.category === category);
        }

        // Filter by search query
        if (query.trim()) {
          const lowercaseQuery = query.toLowerCase();
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(lowercaseQuery) ||
            p.description.toLowerCase().includes(lowercaseQuery) ||
            p.benefits.some(b => b.toLowerCase().includes(lowercaseQuery))
          );
        }

        // Filter by price range
        filtered = filtered.filter(p => p.price >= range[0] && p.price <= range[1]);

        resolve(filtered);
      })();
    });
  }
};