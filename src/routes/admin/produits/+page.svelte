<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		getContentList,
		deleteContent,
		publishContent,
		unpublishContent
	} from '$lib/admin/api';
	import { PRODUCT_CATEGORIES } from '$lib/admin/types';
	import {
		Plus,
		Pencil,
		Trash2,
		Send,
		EyeOff,
		Search,
		Package,
		Eye
	} from 'lucide-svelte';

	type ProductItem = Record<string, unknown>;

	let products = $state<ProductItem[]>([]);
	let loading = $state(true);
	let search = $state('');
	let filterCategory = $state('');
	let actionLoading = $state('');

	const filteredProducts = $derived(
		products.filter((p) => {
			const matchSearch =
				!search ||
				String(p.name || '')
					.toLowerCase()
					.includes(search.toLowerCase());
			const matchCategory = !filterCategory || p.category === filterCategory;
			return matchSearch && matchCategory;
		})
	);

	onMount(async () => {
		await loadProducts();

		// Ouvrir le formulaire si ?new=1
		if ($page.url.searchParams.get('new') === '1') {
			goto('/admin/produits/nouveau');
		}
	});

	async function loadProducts() {
		loading = true;
		try {
			products = await getContentList('products');
		} catch {
			products = [];
		} finally {
			loading = false;
		}
	}

	async function handlePublish(id: string) {
		actionLoading = id;
		try {
			await publishContent('products', id);
			await loadProducts();
		} finally {
			actionLoading = '';
		}
	}

	async function handleUnpublish(id: string) {
		actionLoading = id;
		try {
			await unpublishContent('products', id);
			await loadProducts();
		} finally {
			actionLoading = '';
		}
	}

	async function handleDelete(id: string, name: string) {
		if (!confirm(`Supprimer "${name}" ? Cette action est irréversible.`)) return;
		actionLoading = id;
		try {
			await deleteContent('products', id);
			await loadProducts();
		} finally {
			actionLoading = '';
		}
	}

	function statusBadge(status: string): { label: string; class: string } {
		switch (status) {
			case 'published':
				return { label: 'En ligne', class: 'bg-green-100 text-green-800' };
			case 'modified':
				return { label: 'Modifié', class: 'bg-yellow-100 text-yellow-800' };
			case 'draft':
			default:
				return { label: 'Brouillon', class: 'bg-gray-100 text-gray-600' };
		}
	}
</script>

<div>
	<!-- Header -->
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-2xl font-bold text-neutral-obsidian">Produits</h1>
			<p class="text-neutral-slate text-sm mt-1">{products.length} produit(s)</p>
		</div>
		<a
			href="/admin/produits/nouveau"
			class="flex items-center gap-2 bg-primary-green text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-green-vibrant transition-all duration-200"
		>
			<Plus class="w-4 h-4" />
			Nouveau produit
		</a>
	</div>

	<!-- Filters -->
	<div class="flex flex-col sm:flex-row gap-3 mb-6">
		<div class="relative flex-1">
			<Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-slate" />
			<input
				type="text"
				bind:value={search}
				placeholder="Rechercher un produit..."
				class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
			/>
		</div>
		<select
			bind:value={filterCategory}
			class="px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm bg-white"
		>
			<option value="">Toutes les catégories</option>
			{#each PRODUCT_CATEGORIES as cat}
				<option value={cat.value}>{cat.label}</option>
			{/each}
		</select>
	</div>

	<!-- Products List -->
	{#if loading}
		<div class="flex items-center justify-center py-20">
			<div class="animate-spin w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full"></div>
		</div>
	{:else if filteredProducts.length === 0}
		<div class="text-center py-20 bg-white rounded-2xl">
			<Package class="w-12 h-12 text-neutral-light mx-auto mb-3" />
			<p class="text-neutral-slate">Aucun produit trouvé</p>
			<a
				href="/admin/produits/nouveau"
				class="inline-block mt-4 text-primary-green font-medium text-sm hover:underline"
			>
				Créer un produit
			</a>
		</div>
	{:else}
		<div class="bg-white rounded-2xl shadow-sm overflow-hidden">
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b border-neutral-light">
							<th class="text-left px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider">Produit</th>
							<th class="text-left px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider">Catégorie</th>
							<th class="text-left px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider">Prix</th>
							<th class="text-left px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider">Statut</th>
							<th class="text-right px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredProducts as product}
							{@const id = String(product._id || product.slug || '')}
							{@const status = statusBadge(String(product._status || 'draft'))}
							<tr class="border-b border-neutral-sand last:border-0 hover:bg-neutral-pearl transition-colors">
								<td class="px-5 py-4">
									<div class="flex items-center gap-3">
										{#if product.image}
											<img
												src={String(product.image)}
												alt={String(product.name || '')}
												class="w-10 h-10 rounded-lg object-cover bg-neutral-sand"
											/>
										{:else}
											<div class="w-10 h-10 rounded-lg bg-neutral-sand flex items-center justify-center">
												<Package class="w-5 h-5 text-neutral-slate" />
											</div>
										{/if}
										<div>
											<p class="font-medium text-neutral-obsidian text-sm">{product.name}</p>
											<p class="text-xs text-neutral-slate">{product.slug}</p>
										</div>
									</div>
								</td>
								<td class="px-5 py-4">
									<span class="text-sm text-neutral-charcoal capitalize">{product.category}</span>
								</td>
								<td class="px-5 py-4">
									<span class="text-sm font-medium text-neutral-obsidian">{Number(product.price).toLocaleString()} FCFA</span>
								</td>
								<td class="px-5 py-4">
									<span class="inline-block px-2.5 py-1 rounded-full text-xs font-medium {status.class}">
										{status.label}
									</span>
								</td>
								<td class="px-5 py-4">
									<div class="flex items-center justify-end gap-1">
										{#if actionLoading === id}
											<div class="animate-spin w-4 h-4 border-2 border-primary-green border-t-transparent rounded-full"></div>
										{:else}
											<a
												href="/admin/preview?type=products&id={id}"
												target="_blank"
												class="p-2 rounded-lg text-neutral-slate hover:bg-neutral-sand hover:text-primary-green transition-all"
												title="Aperçu"
											>
												<Eye class="w-4 h-4" />
											</a>
											<a
												href="/admin/produits/{id}"
												class="p-2 rounded-lg text-neutral-slate hover:bg-neutral-sand hover:text-primary-green transition-all"
												title="Modifier"
											>
												<Pencil class="w-4 h-4" />
											</a>
											{#if product._status === 'draft' || product._status === 'modified'}
												<button
													onclick={() => handlePublish(id)}
													class="p-2 rounded-lg text-neutral-slate hover:bg-green-50 hover:text-green-600 transition-all"
													title="Publier"
												>
													<Send class="w-4 h-4" />
												</button>
											{:else}
												<button
													onclick={() => handleUnpublish(id)}
													class="p-2 rounded-lg text-neutral-slate hover:bg-yellow-50 hover:text-yellow-600 transition-all"
													title="Dépublier"
												>
													<EyeOff class="w-4 h-4" />
												</button>
											{/if}
											<button
												onclick={() => handleDelete(id, String(product.name || ''))}
												class="p-2 rounded-lg text-neutral-slate hover:bg-red-50 hover:text-red-600 transition-all"
												title="Supprimer"
											>
												<Trash2 class="w-4 h-4" />
											</button>
										{/if}
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>
