<script lang="ts">
  import '../app.css';
  import Header from '$lib/components/layout/Header.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
</script>

<svelte:head>
  <title>Angel's Floor - Produits Naturels du Bénin</title>
  <meta name="description" content="Angel's Floor - Produits alimentaires naturels et sains du Bénin. Fonio, baobab, néré et plus encore." />
  <meta name="keywords" content="produits alimentaires Bénin, fonio, baobab, néré, alimentation naturelle" />
  <meta name="author" content="Angel's Floor" />
  
  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Angel's Floor" />
  <meta property="og:title" content="Angel's Floor - Produits Naturels du Bénin" />
  <meta property="og:description" content="Produits alimentaires naturels et sains du Bénin. Fonio, baobab, néré et plus encore." />
</svelte:head>

<div class="min-h-screen flex flex-col">
  <Header />
  
  <main class="flex-1">
    <slot />
  </main>
  
  <Footer />
</div>