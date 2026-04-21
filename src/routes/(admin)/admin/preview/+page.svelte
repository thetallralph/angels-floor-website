<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getContent } from '$lib/admin/api';
	import type { Product } from '$lib/admin/types';
	import { ArrowLeft } from 'lucide-svelte';

	const type = $derived($page.url.searchParams.get('type') || '');
	const id = $derived($page.url.searchParams.get('id') || '');

	let content = $state<Record<string, unknown> | null>(null);
	let loading = $state(true);
	let error = $state('');

	onMount(async () => {
		if (!type || !id) {
			error = 'Paramètres manquants (type et id requis)';
			loading = false;
			return;
		}

		try {
			// Charger le draft pour le preview
			try {
				content = await getContent(type, id, 'draft');
			} catch {
				content = await getContent(type, id, 'live');
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Contenu introuvable';
		} finally {
			loading = false;
		}
	});
</script>

<div>
	<!-- Preview Banner -->
	<div class="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
		<div class="flex items-center gap-3">
			<span class="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">APERÇU</span>
			<span class="text-sm text-yellow-800">Ceci est un aperçu du brouillon. Le contenu n'est pas encore publié.</span>
		</div>
		<a href="/admin/{type === 'products' ? 'produits' : type}" class="flex items-center gap-1 text-sm text-yellow-800 hover:text-yellow-900 font-medium">
			<ArrowLeft class="w-4 h-4" />
			Retour
		</a>
	</div>

	{#if loading}
		<div class="flex items-center justify-center py-20">
			<div class="animate-spin w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full"></div>
		</div>
	{:else if error}
		<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
			{error}
		</div>
	{:else if content && type === 'products'}
		{@const product = content as unknown as Product}
		<!-- Product Preview -->
		<div class="bg-white rounded-2xl shadow-sm overflow-hidden max-w-4xl mx-auto">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-0">
				<!-- Image -->
				<div class="aspect-square bg-neutral-sand">
					{#if product.image}
						<img src={product.image} alt={product.name} class="w-full h-full object-cover" />
					{:else}
						<div class="w-full h-full flex items-center justify-center text-neutral-slate">Pas d'image</div>
					{/if}
				</div>

				<!-- Details -->
				<div class="p-8 flex flex-col justify-center">
					<p class="text-sm font-semibold text-primary-green uppercase tracking-wider mb-2">
						{product.category}
					</p>
					<h1 class="text-3xl font-bold text-neutral-obsidian mb-2">{product.name}</h1>
					<p class="text-2xl font-bold text-primary-green mb-4">
						{Number(product.price).toLocaleString()} FCFA
					</p>
					<p class="text-neutral-charcoal leading-relaxed mb-6">{product.description}</p>

					{#if product.benefits && product.benefits.length > 0}
						<div class="space-y-2 mb-6">
							<p class="text-sm font-semibold text-neutral-obsidian">Bénéfices :</p>
							<ul class="space-y-1">
								{#each product.benefits as benefit}
									<li class="text-sm text-neutral-charcoal flex items-center gap-2">
										<span class="w-1.5 h-1.5 bg-primary-green rounded-full"></span>
										{benefit}
									</li>
								{/each}
							</ul>
						</div>
					{/if}

					<div class="grid grid-cols-2 gap-4 text-sm">
						{#if product.packaging}
							<div>
								<span class="text-neutral-slate">Conditionnement</span>
								<p class="font-medium text-neutral-obsidian">{product.packaging}</p>
							</div>
						{/if}
						{#if product.origin}
							<div>
								<span class="text-neutral-slate">Origine</span>
								<p class="font-medium text-neutral-obsidian">{product.origin}</p>
							</div>
						{/if}
					</div>

					<div class="mt-6 flex gap-2">
						<span class="px-3 py-1 rounded-full text-xs font-medium {product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
							{product.inStock ? 'En stock' : 'Rupture de stock'}
						</span>
						{#if product.featured}
							<span class="px-3 py-1 rounded-full text-xs font-medium bg-accent-gold/20 text-accent-gold">
								Produit vedette
							</span>
						{/if}
					</div>
				</div>
			</div>

			{#if product.detailedDescription}
				<div class="border-t border-neutral-light p-8">
					<h2 class="text-xl font-bold text-neutral-obsidian mb-4">Description détaillée</h2>
					<div class="text-neutral-charcoal leading-relaxed whitespace-pre-line">
						{product.detailedDescription}
					</div>
				</div>
			{/if}

			{#if product.usage}
				<div class="border-t border-neutral-light p-8">
					<h2 class="text-xl font-bold text-neutral-obsidian mb-4">Mode d'emploi</h2>
					<p class="text-neutral-charcoal leading-relaxed">{product.usage}</p>
				</div>
			{/if}
		</div>
	{:else}
		<!-- Generic JSON Preview -->
		<div class="bg-white rounded-2xl p-6 shadow-sm max-w-4xl mx-auto">
			<h2 class="font-semibold text-neutral-obsidian mb-4">Aperçu du contenu</h2>
			<pre class="bg-neutral-pearl rounded-xl p-4 text-sm font-mono overflow-auto">{JSON.stringify(content, null, 2)}</pre>
		</div>
	{/if}
</div>
