# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Angel's Floor website - A SvelteKit e-commerce platform for a Beninese company specializing in natural African food products (fonio, baobab, etc.).

## Development Commands

### Essential Commands
```bash
npm run dev          # Start development server on localhost:5173
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Code Quality Commands
```bash
npm run check        # Run svelte-check for type checking
npm run lint         # Run ESLint on all JS/TS/Svelte files
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format code with Prettier
```

**IMPORTANT**: Always run `npm run check` and `npm run lint` before completing any task to ensure code quality.

## Architecture

### Tech Stack
- **Framework**: SvelteKit 2.22.0 with Svelte 5.0.0
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS with extensive custom theme
- **Icons**: Lucide Svelte
- **Maps**: Leaflet for sales point visualization

### Key Directories
- `src/routes/` - File-based routing (pages)
- `src/lib/components/` - Reusable components (layout/, ui/)
- `src/lib/data/` - Static product data (will be replaced with API)
- `src/lib/stores/` - Svelte stores for state management

### Data Structure
Products are organized by categories: fonio, baobab, nere-fagara, mangue, bisbab. Each product has TypeScript interfaces defined in `src/lib/stores/app.ts`.

### Routing Structure
- `/` - Homepage
- `/produits` - Products catalog
- `/a-propos` - About page
- `/impact` - Social impact page

## Important Notes

- **No testing framework installed** - Consider adding Vitest if tests are needed
- **Static data only** - Products data in `src/lib/data/products.ts` is mock data
- **Custom Tailwind theme** - Extensive African-inspired color palette in `tailwind.config.js`
- **Type safety** - Always maintain TypeScript types when modifying components or data structures

## Design Guidelines

### MANDATORY: All pages must follow these design patterns from the homepage

### Visual Hierarchy
1. **Hero Sections**: 
   - Use `bg-primary-green` background with white text
   - Large typography: `text-5xl md:text-6xl lg:text-6xl` for main headings
   - Include animated elements where appropriate (AnimatedText component)
   - Add background decorations with blur effects for depth

2. **Section Structure**:
   - Consistent padding: `py-16 lg:py-24` for hero, `py-20` for regular sections
   - Container width: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
   - Alternate background colors between sections for visual rhythm
   - Use `relative overflow-hidden` for sections with decorative elements

### Typography Standards
- **Headings**: Bold (font-bold), tight letter spacing, specific sizes:
  - H1: `text-5xl md:text-6xl` 
  - H2: `text-4xl md:text-5xl`
  - H3: `text-xl` to `text-2xl`
  - Small labels: `text-sm font-semibold uppercase tracking-wider`
- **Body text**: `text-lg md:text-xl` for important descriptions
- **Line height**: Use `leading-tight` for headings, `leading-relaxed` for body

### Color Usage
- **Primary sections**: `bg-primary-green` with white text
- **Accent sections**: `bg-accent-gold` (#EACF0F) or yellow backgrounds
- **Light sections**: `bg-white` or `bg-neutral-sand`
- **Footer sections**: `bg-footer-green`
- **Text colors**: 
  - Main: `text-neutral-obsidian` or `text-black`
  - Secondary: `text-neutral-charcoal`
  - Light: `text-neutral-slate`

### Component Patterns

#### Cards
- Always use `rounded-2xl` or `rounded-3xl` for large radius
- Shadow progression: `shadow-lg hover:shadow-2xl` or `hover:shadow-xl`
- Hover animations: `hover:-translate-y-0.5` or `hover:scale-105`
- Transition: `transition-all duration-300`
- White background with proper padding (`p-6` or `p-8`)

#### Buttons
- **Primary CTA**: 
  ```html
  bg-primary-green text-white px-6 py-3 rounded-full font-semibold 
  shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300
  ```
- **Secondary CTA**: 
  ```html
  bg-transparent border-2 border-white text-white px-6 py-3 rounded-full 
  font-semibold hover:bg-white/10 transition-all duration-300
  ```
- **With arrow icon**: Include `<ArrowRight class="w-5 h-5" />` for navigation

#### Grid Layouts
- Products: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Stats: `grid grid-cols-2 md:grid-cols-4 gap-8`
- Features: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`

### Interactive Elements
- **Hover states**: Always include hover effects on interactive elements
- **Transitions**: Use `transition-all duration-300` as default
- **Transform effects**: Subtle lifts with `hover:-translate-y-0.5`
- **Icons**: Use Lucide icons consistently, sized at `w-5 h-5` to `w-10 h-10`

### Section Headers Pattern
Always structure section headers as:
```svelte
<p class="text-sm font-semibold text-primary-green uppercase tracking-wider mb-3">Label</p>
<h2 class="text-4xl md:text-5xl font-bold text-black mb-4">Main Title</h2>
<p class="text-xl text-neutral-charcoal max-w-3xl mx-auto">Description</p>
```

### Decorative Elements
- Background blurs: `<div class="absolute w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>`
- Gradient overlays on images
- Geometric shapes with rotation for visual interest
- Use `z-index` layering for depth

### Spacing Rules
- Between sections: Natural flow without extra spacing
- Within sections: `mb-12` for major gaps, `mb-6` for medium, `mb-4` for small
- Container padding: Always use `px-4 sm:px-6 lg:px-8`

### Image Treatment
- Always use `rounded-2xl` or `rounded-3xl` for images
- Include `object-cover` for proper aspect ratio
- Add hover scale effects: `group-hover:scale-105`
- Overlay gradients where appropriate

### Responsive Design
- Mobile-first approach with progressive enhancement
- Breakpoints: `md:` (768px) and `lg:` (1024px) primarily
- Font size scaling across breakpoints
- Grid column adjustments for different screens

### Animation Guidelines
- Use `onMount` for initial animations
- Intersection Observer for scroll-triggered animations
- CSS transitions over JavaScript animations when possible
- Respect `prefers-reduced-motion` user preference

### Consistency Requirements
Every new page MUST:
1. Follow the established section structure
2. Use the defined color palette exclusively
3. Maintain consistent spacing and padding
4. Include proper hover states and transitions
5. Use the same typography scale
6. Follow the button and card patterns
7. Include decorative elements for visual richness
8. Maintain the African-inspired, premium, natural aesthetic