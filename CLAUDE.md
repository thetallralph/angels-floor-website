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