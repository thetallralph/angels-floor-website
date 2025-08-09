/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // Bold Natural Angel's Floor Colors - Authentic African-Inspired Palette
        primary: {
          green: '#2E7D32',      // Bold forest green - strong & natural
          'green-vibrant': '#388E3C',  // Vibrant natural green  
          'green-bright': '#4CAF50',   // Bright balanced green
          'green-glow': '#00897B',     // Deep emerald accent
          white: '#FFFFFF'
        },
        accent: {
          gold: '#FFB000',       // Bold African gold
          'gold-bright': '#FFC42E',    // Bright golden yellow
          'gold-soft': '#FFE066',      // Soft gold for backgrounds
          sunset: '#FF6B35',     // Bold sunset orange
          'sunset-bright': '#FF8C42',  // Bright coral
          'sunset-glow': '#FFB284',    // Warm glow
          terracotta: '#D2691E'  // Earthy terracotta
        },
        creative: {
          purple: '#6A0DAD',     // Royal purple for contrast
          'purple-soft': '#9D4EDD', // Soft purple
          teal: '#20B2AA',       // Vibrant teal
          'teal-bright': '#40E0D0', // Electric teal
          crimson: '#DC143C',    // Bold crimson for CTAs
          emerald: '#50C878'     // Bright emerald
        },
        footer: {
          green: '#0A2E1A',      // Deep forest green for footer
          'green-dark': '#051A0F' // Even darker green for accents
        },
        neutral: {
          obsidian: '#0B0C10',   // Deep obsidian for text
          charcoal: '#1F2937',   // Rich charcoal
          slate: '#374151',      // Modern slate
          'slate-light': '#6B7280', // Light slate
          light: '#E5E7EB',      // Light gray
          sand: '#F3F4F6',       // Light sand
          pearl: '#F8FAFC',      // Pearl white
          cream: '#FFFBF0'       // Warm cream
        },
        gradient: {
          'green-start': '#2E7D32',
          'green-end': '#00897B',
          'sunset-start': '#FF6B35', 
          'sunset-end': '#FFB000',
          'purple-start': '#6A0DAD',
          'purple-end': '#9D4EDD'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.75rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.2' }],
        '7xl': ['4.5rem', { lineHeight: '1.2' }],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px', 
        '3xl': '20px',
        '4xl': '28px',
        '5xl': '40px'
      },
      backgroundImage: {
        'gradient-green': 'linear-gradient(135deg, #2E7D32 0%, #00897B 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #FF6B35 0%, #FFB000 100%)',
        'gradient-purple': 'linear-gradient(135deg, #6A0DAD 0%, #9D4EDD 100%)',
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(0, 137, 123, 0.5)',
        'glow-gold': '0 0 20px rgba(255, 176, 0, 0.5)',
        'glow-sunset': '0 0 20px rgba(255, 107, 53, 0.5)',
        'creative': '0 10px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'hover-lift': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }
    },
  },
  plugins: [],
}