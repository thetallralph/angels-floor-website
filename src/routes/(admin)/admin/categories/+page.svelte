<script lang="ts">
	import { onMount } from 'svelte';
	import {
		listCategories,
		createCategory,
		updateCategory,
		deleteCategory,
		saveCategoryImage,
		bootstrapCategoriesCollection
	} from '$lib/admin/categories';
	import type { Category } from '$lib/admin/types';
	import { Plus, Pencil, Trash2, Save, X, Tag, Zap, ImagePlus, Eye, EyeOff } from 'lucide-svelte';

	type DraftCategory = Omit<Category, 'id'> & { id?: string };

	let categories = $state<Category[]>([]);
	let loading = $state(true);
	let needsBootstrap = $state(false);
	let bootstrapping = $state(false);
	let saving = $state(false);
	let deletingId = $state('');
	let editing = $state<DraftCategory | null>(null);
	let pendingImage = $state<File | null>(null);
	let pendingImagePreview = $state<string>('');
	let clearImage = $state(false);
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
		if (!confirm('Initialiser la collection "categories" dans PocketBase et créer les catégories par défaut ?')) return;
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
		editing = {
			slug: '',
			name: '',
			description: '',
			order: categories.length + 1,
			published: true
		};
		resetImageState();
	}

	function startEdit(cat: Category) {
		editing = { ...cat };
		resetImageState();
	}

	function resetImageState() {
		if (pendingImagePreview) URL.revokeObjectURL(pendingImagePreview);
		pendingImage = null;
		pendingImagePreview = '';
		clearImage = false;
	}

	function cancelEdit() {
		editing = null;
		resetImageState();
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

	function handleImagePicked(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		if (pendingImagePreview) URL.revokeObjectURL(pendingImagePreview);
		pendingImage = file;
		pendingImagePreview = URL.createObjectURL(file);
		clearImage = false;
		input.value = '';
	}

	function requestClearImage() {
		if (pendingImagePreview) URL.revokeObjectURL(pendingImagePreview);
		pendingImage = null;
		pendingImagePreview = '';
		clearImage = true;
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
			const payload = {
				slug: editing.slug.trim(),
				name: editing.name.trim(),
				description: editing.description?.trim() || '',
				order: Number(editing.order) || 0,
				published: !!editing.published
			};

			let savedId: string;
			if (editing.id) {
				const updated = await updateCategory(editing.id, payload);
				savedId = updated.id;
			} else {
				const created = await createCategory(payload);
				savedId = created.id;
			}

			if (pendingImage) {
				await saveCategoryImage(savedId, pendingImage);
			} else if (clearImage) {
				await saveCategoryImage(savedId, null);
			}

			message = { type: 'success', text: editing.id ? 'Catégorie mise à jour.' : 'Catégorie créée.' };
			editing = null;
			resetImageState();
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

	async function togglePublished(cat: Category) {
		try {
			await updateCategory(cat.id, { published: !cat.published });
			await refresh();
		} catch (err) {
			message = { type: 'error', text: err instanceof Error ? err.message : 'Erreur' };
		}
	}

	const currentImagePreview = $derived(
		pendingImagePreview || (!clearImage && editing?.image ? editing.image : '')
	);
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
				Clique pour la créer et ajouter les catégories par défaut.
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

				<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
					<div class="md:col-span-2 space-y-4">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label for="cat-name" class="block text-sm font-medium text-neutral-charcoal mb-1">Nom *</label>
								<input
									id="cat-name"
									type="text"
									bind:value={editing.name}
									oninput={handleNameChange}
									class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
									placeholder="Fonio"
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

						<div>
							<label for="cat-desc" class="block text-sm font-medium text-neutral-charcoal mb-1">Description</label>
							<input
								id="cat-desc"
								type="text"
								bind:value={editing.description}
								class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
								placeholder="Optionnel"
							/>
						</div>

						<div class="grid grid-cols-2 gap-4">
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
							<div>
								<label for="cat-published" class="block text-sm font-medium text-neutral-charcoal mb-1">Statut</label>
								<label class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-light bg-white cursor-pointer">
									<input
										id="cat-published"
										type="checkbox"
										bind:checked={editing.published}
										class="w-4 h-4 rounded border-neutral-light text-primary-green focus:ring-primary-green"
									/>
									<span class="text-sm text-neutral-charcoal">Publiée</span>
								</label>
							</div>
						</div>
					</div>

					<div>
						<div class="block text-sm font-medium text-neutral-charcoal mb-1">Image</div>
						<div class="aspect-square rounded-xl bg-neutral-pearl border border-neutral-light overflow-hidden flex items-center justify-center relative">
							{#if currentImagePreview}
								<img src={currentImagePreview} alt="Aperçu" class="w-full h-full object-cover" />
								<button
									type="button"
									onclick={requestClearImage}
									class="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
									title="Retirer l'image"
								>
									<X class="w-3 h-3" />
								</button>
							{:else}
								<ImagePlus class="w-8 h-8 text-neutral-light" />
							{/if}
						</div>
						<label class="mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-neutral-light text-neutral-slate text-sm cursor-pointer hover:border-primary-green hover:text-primary-green transition-all">
							<ImagePlus class="w-4 h-4" />
							<span>{currentImagePreview ? 'Remplacer' : 'Uploader'}</span>
							<input type="file" accept="image/*" onchange={handleImagePicked} class="hidden" />
						</label>
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
								<th class="text-left px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider">Image</th>
								<th class="text-left px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider">Nom</th>
								<th class="text-left px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider">Slug</th>
								<th class="text-left px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider">Statut</th>
								<th class="text-right px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider">Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each categories as cat}
								<tr class="border-b border-neutral-sand last:border-0 hover:bg-neutral-pearl transition-colors">
									<td class="px-5 py-4 text-sm text-neutral-slate">{cat.order}</td>
									<td class="px-5 py-4">
										{#if cat.image}
											<img src={cat.image} alt={cat.name} class="w-10 h-10 rounded-lg object-cover" />
										{:else}
											<div class="w-10 h-10 rounded-lg bg-neutral-pearl flex items-center justify-center">
												<ImagePlus class="w-4 h-4 text-neutral-light" />
											</div>
										{/if}
									</td>
									<td class="px-5 py-4 text-sm font-medium text-neutral-obsidian">{cat.name}</td>
									<td class="px-5 py-4 text-sm text-neutral-charcoal">
										<code class="bg-neutral-pearl px-1.5 py-0.5 rounded text-xs">{cat.slug}</code>
									</td>
									<td class="px-5 py-4">
										<button
											onclick={() => togglePublished(cat)}
											class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all {cat.published
												? 'bg-green-50 text-green-700 hover:bg-green-100'
												: 'bg-neutral-pearl text-neutral-slate hover:bg-neutral-sand'}"
											title="Basculer publié/brouillon"
										>
											{#if cat.published}
												<Eye class="w-3 h-3" /> Publiée
											{:else}
												<EyeOff class="w-3 h-3" /> Brouillon
											{/if}
										</button>
									</td>
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
