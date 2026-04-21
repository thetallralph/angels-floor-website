<script lang="ts">
	import { onMount } from 'svelte';
	import { getContentList } from '$lib/admin/api';
	import { Package, FileText, Type, Image, ArrowRight } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	let stats = $state({ products: 0, blog: 0, cms_content: 0 });
	let loading = $state(true);

	onMount(async () => {
		try {
			const [products, blog, cms] = await Promise.all([
				getContentList('products').catch(() => []),
				getContentList('blog').catch(() => []),
				getContentList('cms_content').catch(() => [])
			]);
			stats = {
				products: products.length,
				blog: blog.length,
				cms_content: cms.length
			};
		} finally {
			loading = false;
		}
	});

	const cards = [
		{ label: 'Produits', count: () => stats.products, icon: Package, href: '/admin/produits', color: 'text-emerald-600 bg-emerald-50' },
		{ label: 'Articles', count: () => stats.blog, icon: FileText, href: '/admin/blog', color: 'text-amber-600 bg-amber-50' },
		{ label: 'Contenu CMS', count: () => stats.cms_content, icon: Type, href: '/admin/pages', color: 'text-blue-600 bg-blue-50' },
		{ label: 'Médias', count: () => '-', icon: Image, href: '/admin/medias', color: 'text-purple-600 bg-purple-50' }
	];
</script>

<div>
	<div class="mb-8">
		<h1 class="text-2xl font-semibold text-zinc-900">Dashboard</h1>
		<p class="text-zinc-500 text-sm mt-1">Bienvenue dans l'administration d'Angel's Floor</p>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
		{#each cards as card}
			<a
				href={card.href}
				class="bg-white rounded-xl border border-zinc-200 p-5 hover:shadow-md transition-all group"
			>
				<div class="flex items-center justify-between mb-3">
					<div class={cn("w-9 h-9 rounded-lg flex items-center justify-center", card.color)}>
						<card.icon class="w-4 h-4" />
					</div>
					<ArrowRight class="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
				</div>
				<p class="text-2xl font-semibold text-zinc-900">
					{loading ? '...' : card.count()}
				</p>
				<p class="text-sm text-zinc-500">{card.label}</p>
			</a>
		{/each}
	</div>

	<div class="bg-white rounded-xl border border-zinc-200 p-5">
		<h2 class="text-sm font-semibold text-zinc-900 mb-3">Actions rapides</h2>
		<div class="flex flex-wrap gap-2">
			<a href="/admin/produits" class="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors">
				+ Nouveau produit
			</a>
			<a href="/admin/blog" class="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-medium hover:bg-amber-600 transition-colors">
				+ Nouvel article
			</a>
			<a href="/admin/pages" class="px-3 py-1.5 bg-zinc-100 text-zinc-700 rounded-lg text-xs font-medium hover:bg-zinc-200 transition-colors">
				Gérer le contenu
			</a>
		</div>
	</div>
</div>
