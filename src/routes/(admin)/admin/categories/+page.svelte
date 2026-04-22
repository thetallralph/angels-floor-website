<script lang="ts">
	import { onMount } from 'svelte';
	import {
		listCategories,
		createCategory,
		updateCategory,
		deleteCategory,
		bootstrapCategoriesCollection
	} from '$lib/admin/categories';
	import type { Category } from '$lib/admin/types';
	import { Plus, Pencil, Trash2, Save, X, Tag, Zap } from 'lucide-svelte';

	type DraftCategory = Omit<Category, 'id'> & { id?: string };

	let categories = $state<Category[]>([]);
	let loading = $state(true);
	let needsBootstrap = $state(false);
	let bootstrapping = $state(false);
	let saving = $state(false);
	let deletingId = $state('');
	let editing = $state<DraftCategory | null>(null);
	let message = $state<{ type: 'success' | 'error'; text: string } | null>(null);

	onMount(() => refresh());

	async function refresh() {
		loading = true;
		message = null;
		try {
			const list = await listCategories();
			if (list === null) {
				needsBootstrap = true;
				categories = [];
			} else {
				needsBootstrap = false;
				categories = list;
			}
		} catch (err) {
			message = { type: 'error', text: err instanceof Error ? err.message : 'Erreur de chargement' };
		} finally {
			loading = false;
		}
	}

	async function handleBootstrap() {
		if (!confirm('Initialiser la collection "categories" dans PocketBase et créer les 5 catégories par défaut ?')) return;
		bootstrapping = true;
		message = null;
		try {
			await bootstrapCategoriesCollection();
			message = { type: 'success', text: 'Catégories initialisées.' };
			await refresh();
		} catch (err) {
			message = { type: 'error', text: err instanceof Error ? err.message : 'Erreur bootstrap' };
		} finally {
			bootstrapping = false;
		}
	}

	function startNew() {
		editing = { slug: '', name: '', description: '', order: categories.length + 1 };
	}

	function startEdit(cat: Category) {
		editing = { ...cat };
	}

	function cancelEdit() {
		editing = null;
	}

	function generateSlug(name: string): string {
		return name
			.toLowerCase()
			.normalize('NFD')
			.replace(/[̀-ͯ]/g, '')
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');
	}

	function handleNameChange() {
		if (editing && !editing.id && !editing.slug) {
			editing.slug = generateSlug(editing.name);
		}
	}

	async function handleSave() {
		if (!editing) return;
		if (!editing.name.trim() || !editing.slug.trim()) {
			message = { type: 'error', text: 'Nom et slug sont requis.' };
			return;
		}
		saving = true;
		message = null;
		try {
			if (editing.id) {
				await updateCategory(editing.id, {
					slug: editing.slug.trim(),
					name: editing.name.trim(),
					description: editing.description?.trim() || '',
					order: Number(editing.order) || 0
				});
				message = { type: 'success', text: 'Catégorie mise à jour.' };
			} else {
				await createCategory({
					slug: editing.slug.trim(),
					name: editing.name.trim(),
					description: editing.description?.trim() || '',
					order: Number(editing.order) || 0
				});
				message = { type: 'success', text: 'Catégorie créée.' };
			}
			editing = null;
			await refresh();
		} catch (err) {
			message = { type: 'error', text: err instanceof Error ? err.message : 'Erreur' };
		} finally {
			saving = false;
		}
	}

	async function handleDelete(cat: Category) {
		if (!confirm(`Supprimer la catégorie "${cat.name}" ? Les produits liés garderont leur slug mais ne seront plus regroupés.`)) return;
		deletingId = cat.id;
		message = null;
		try {
			await deleteCategory(cat.id);
			await refresh();
		} catch (err) {
			message = { type: 'error', text: err instanceof Error ? err.message : 'Erreur' };
		} finally {
			deletingId = '';
		}
	}
</script>

<div>
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-2xl font-bold text-neutral-obsidian">Catégories</h1>
			<p class="text-neutral-slate text-sm mt-1">{categories.length} catégorie(s)</p>
		</div>
		{#if !needsBootstrap && !editing}
			<button
				onclick={startNew}
				class="flex items-center gap-2 bg-primary-green text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-green-vibrant transition-all"
			>
				<Plus class="w-4 h-4" />
				Nouvelle catégorie
			</button>
		{/if}
	</div>

	{#if message}
		<div
			class="px-4 py-3 rounded-xl text-sm mb-6 {message.type === 'success'
				? 'bg-green-50 border border-green-200 text-green-800'
				: 'bg-red-50 border border-red-200 text-red-700'}"
		>
			{message.text}
		</div>
	{/if}

	{#if loading}
		<div class="flex items-center justify-center py-20">
			<div class="animate-spin w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full"></div>
		</div>
	{:else if needsBootstrap}
		<div class="bg-white rounded-2xl p-8 text-center shadow-sm">
			<Zap class="w-10 h-10 text-primary-green mx-auto mb-3" />
			<h2 class="font-semibold text-neutral-obsidian mb-2">Collection non initialisée</h2>
			<p class="text-sm text-neutral-slate max-w-md mx-auto mb-6">
				La collection <code class="bg-neutral-pearl px-1.5 py-0.5 rounded">categories</code> n'existe pas encore dans PocketBase.
				Clique pour la créer et ajouter les 5 catégories par défaut.
			</p>
			<button
				onclick={handleBootstrap}
				disabled={bootstrapping}
				class="inline-flex items-center gap-2 bg-primary-green text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-green-vibrant transition-all disabled:opacity-50"
			>
				{bootstrapping ? 'Initialisation…' : 'Initialiser les catégories'}
			</button>
		</div>
	{:else}
		{#if editing}
			<div class="bg-white rounded-2xl p-6 shadow-sm mb-6">
				<h2 class="font-semibold text-neutral-obsidian mb-4">
					{editing.id ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
				</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
					<div>
						<label for="cat-name" class="block text-sm font-medium text-neutral-charcoal mb-1">Nom *</label>
						<input
							id="cat-name"
							type="text"
							bind:value={editing.name}
							oninput={handleNameChange}
							class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
							placeholder="Gamme Fonio"
						/>
					</div>
					<div>
						<label for="cat-slug" class="block text-sm font-medium text-neutral-charcoal mb-1">Slug *</label>
						<input
							id="cat-slug"
							type="text"
							bind:value={editing.slug}
							class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
							placeholder="fonio"
						/>
						<p class="text-xs text-neutral-slate mt-1">Identifiant technique. Utilisé par les produits.</p>
					</div>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
					<div class="md:col-span-2">
						<label for="cat-desc" class="block text-sm font-medium text-neutral-charcoal mb-1">Description</label>
						<input
							id="cat-desc"
							type="text"
							bind:value={editing.description}
							class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
							placeholder="Optionnel"
						/>
					</div>
					<div>
						<label for="cat-order" class="block text-sm font-medium text-neutral-charcoal mb-1">Ordre</label>
						<input
							id="cat-order"
							type="number"
							bind:value={editing.order}
							min="0"
							class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
						/>
					</div>
				</div>
				<div class="flex items-center gap-2 justify-end">
					<button
						onclick={cancelEdit}
						class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-light text-neutral-charcoal text-sm font-medium hover:bg-neutral-pearl transition-all"
					>
						<X class="w-4 h-4" />
						Annuler
					</button>
					<button
						onclick={handleSave}
						disabled={saving}
						class="flex items-center gap-2 bg-primary-green text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-green-vibrant transition-all disabled:opacity-50"
					>
						<Save class="w-4 h-4" />
						{saving ? 'Sauvegarde…' : 'Sauvegarder'}
					</button>
				</div>
			</div>
		{/if}

		{#if categories.length === 0}
			<div class="text-center py-16 bg-white rounded-2xl">
				<Tag class="w-12 h-12 text-neutral-light mx-auto mb-3" />
				<p class="text-neutral-slate">Aucune catégorie.</p>
				<button
					onclick={startNew}
					class="inline-block mt-4 text-primary-green font-medium text-sm hover:underline"
				>
					Créer la première
				</button>
			</div>
		{:else}
			<div class="bg-white rounded-2xl shadow-sm overflow-hidden">
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b border-neutral-light">
								<th class="text-left px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider">Ordre</th>
								<th class="text-left px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider">Nom</th>
								<th class="text-left px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider">Slug</th>
								<th class="text-left px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider">Description</th>
								<th class="text-right px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider">Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each categories as cat}
								<tr class="border-b border-neutral-sand last:border-0 hover:bg-neutral-pearl transition-colors">
									<td class="px-5 py-4 text-sm text-neutral-slate">{cat.order}</td>
									<td class="px-5 py-4 text-sm font-medium text-neutral-obsidian">{cat.name}</td>
									<td class="px-5 py-4 text-sm text-neutral-charcoal">
										<code class="bg-neutral-pearl px-1.5 py-0.5 rounded text-xs">{cat.slug}</code>
									</td>
									<td class="px-5 py-4 text-sm text-neutral-slate truncate max-w-xs">{cat.description || '—'}</td>
									<td class="px-5 py-4">
										<div class="flex items-center justify-end gap-1">
											{#if deletingId === cat.id}
												<div class="animate-spin w-4 h-4 border-2 border-primary-green border-t-transparent rounded-full"></div>
											{:else}
												<button
													onclick={() => startEdit(cat)}
													class="p-2 rounded-lg text-neutral-slate hover:bg-neutral-sand hover:text-primary-green transition-all"
													title="Modifier"
												>
													<Pencil class="w-4 h-4" />
												</button>
												<button
													onclick={() => handleDelete(cat)}
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
	{/if}
</div>
