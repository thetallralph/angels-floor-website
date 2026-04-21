<script lang="ts">
  import Header from '$lib/components/layout/Header.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import { provideCms } from '$lib/cms/context';

  let { data, children } = $props();
  provideCms(() => data.cms);
</script>

<div class="min-h-screen flex flex-col">
  <Header />
  <main class="flex-1">
    {@render children()}
  </main>
  <Footer />
</div>
