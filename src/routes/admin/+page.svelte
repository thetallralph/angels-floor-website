<script lang="ts">
	import { onMount } from 'svelte';
	import { getContentList } from '$lib/admin/api';
	import { Package, FileText, Layers, Image, ArrowRight, AlertCircle } from 'lucide-svelte';

	let stats = $state({
		products: { total: 0, draft: 0 },
		blog: { total: 0, draft: 0 },
		pages: { total: 0, draft: 0 }
	});
	let loading = $state(true);
	let error = $state('');

	onMount(async () => {
		try {
			const [products, blog, pages] = await Promise.all([
				getContentList('products').catch(() => []),
				getContentList('blog').catch(() => []),
				getContentList('pages').catch(() => [])
			]);

			stats = {
				products: {
					total: products.length,
					draft: products.filter((p) => p._status === 'draft' || p._status === 'modified').length
				},
				blog: {
					total: blog.length,
					draft: blog.filter((p) => p._status === 'draft' || p._status === 'modified').length
				},
				pages: {
					total: pages.length,
					draft: pages.filter((p) => p._status === 'draft' || p._status === 'modified').length
				}
			};
		} catch (err) {
			error = err instanceof Error ? err.message : 'Erreur de chargement';
		} finally {
			loading = false;
		}
	});

	const cards = [
		{
			label: 'Produits',
			icon: Package,
			href: '/admin/produits',
			key: 'products' as const,
			color: 'bg-primary-green'
		},
		{
			label: 'Articles',
			icon: FileText,
			href: '/admin/blog',
			key: 'blog' as const,
			color: 'bg-accent-gold'
		},
		{
			label: 'Pages',
			icon: Layers,
			href: '/admin/pages',
			key: 'pages' as const,
			color: 'bg-creative-teal'
		},
		{
			label: 'Médias',
			icon: Image,
			href: '/admin/medias',
			color: 'bg-accent-sunset'
		}
	];
</script>

<div>
	<h1 class="text-2xl font-bold text-neutral-obsidian mb-1">Dashboard</h1>
	<p class="text-neutral-slate mb-8">Bienvenue dans l'administration d'Angel's Floor</p>

	{#if error}
		<div class="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2">
			<AlertCircle class="w-4 h-4" />
			<span>L'API n'est pas accessible. Vérifiez que les fichiers PHP sont déployés sur IONOS.</span>
		</div>
	{/if}

	<!-- Stats Cards -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
		{#each cards as card}
			<a
				href={card.href}
				class="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
			>
				<div class="flex items-center justify-between mb-4">
					<div class="{card.color} w-10 h-10 rounded-xl flex items-center justify-center">
						<card.icon class="w-5 h-5 text-white" />
					</div>
					<ArrowRight class="w-4 h-4 text-neutral-light group-hover:text-neutral-slate transition-colors" />
				</div>
				<p class="text-2xl font-bold text-neutral-obsidian">
					{#if loading}
						-
					{:else if card.key}
						{stats[card.key].total}
					{:else}
						-
					{/if}
				</p>
				<p class="text-sm text-neutral-slate">{card.label}</p>
				{#if !loading && card.key && stats[card.key].draft > 0}
					<p class="text-xs text-accent-gold mt-1 font-medium">
						{stats[card.key].draft} brouillon(s)
					</p>
				{/if}
			</a>
		{/each}
	</div>

	<!-- Quick Actions -->
	<div class="bg-white rounded-2xl p-6 shadow-sm">
		<h2 class="text-lg font-semibold text-neutral-obsidian mb-4">Actions rapides</h2>
		<div class="flex flex-wrap gap-3">
			<a
				href="/admin/produits?new=1"
				class="px-4 py-2 bg-primary-green text-white rounded-xl text-sm font-medium hover:bg-primary-green-vibrant transition-all duration-200"
			>
				+ Nouveau produit
			</a>
			<a
				href="/admin/blog?new=1"
				class="px-4 py-2 bg-accent-gold text-neutral-obsidian rounded-xl text-sm font-medium hover:bg-accent-gold-bright transition-all duration-200"
			>
				+ Nouvel article
			</a>
			<a
				href="/admin/medias"
				class="px-4 py-2 bg-neutral-sand text-neutral-charcoal rounded-xl text-sm font-medium hover:bg-neutral-light transition-all duration-200"
			>
				Gérer les médias
			</a>
		</div>
	</div>
</div>
