<script lang="ts">
  import { page } from '$app/state';
  import Header from '$lib/components/layout/Header.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import FloatingCartButton from '$lib/components/cart/FloatingCartButton.svelte';
  import { provideCms } from '$lib/cms/context';
  import { LOCALES, getLocale, switchLocaleHref } from '$lib/i18n';

  let { data, children } = $props();
  provideCms(() => data.cms);

  // The server sets <html lang>; keep it right after client-side language switches.
  $effect(() => {
    document.documentElement.lang = getLocale();
  });
</script>

<svelte:head>
  {#each LOCALES as l (l)}
    <link rel="alternate" hreflang={l} href={page.url.origin + switchLocaleHref(page.url.pathname, l)} />
  {/each}
  <link rel="alternate" hreflang="x-default" href={page.url.origin + switchLocaleHref(page.url.pathname, 'fr')} />
</svelte:head>

<div class="min-h-screen flex flex-col">
  <Header />
  <main class="flex-1">
    {@render children()}
  </main>
  <Footer categories={data.footerCategories} />
  <FloatingCartButton />
</div>
