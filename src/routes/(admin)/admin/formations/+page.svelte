<script lang="ts">
	import { onMount } from 'svelte';
	import { getContentList, saveContent, deleteContent, publishContent, unpublishContent, saveTrainingImage } from '$lib/admin/api';
	import { TRAINING_CATEGORIES, type Training, type TrainingCategory } from '$lib/admin/types';
	import { Plus, Pencil, Trash2, Save, X, GraduationCap, Search, Send, EyeOff, Image as ImageIcon } from 'lucide-svelte';

	type DraftTraining = Omit<Training, 'id'> & { id?: string };

	let trainings = $state<Training[]>([]);
	let loading = $state(true);
	let saving = $state(false);
	let deletingId = $state('');
	let actionLoading = $state('');
	let editing = $state<DraftTraining | null>(null);
	let imageFile = $state<File | null>(null);
	let imagePreview = $state<string>('');
	let clearExistingImage = $state(false);
	let message = $state<{ type: 'success' | 'error'; text: string } | null>(null);
	let search = $state('');
	let categoryFilter = $state<'all' | TrainingCategory>('all');

	function slugify(s: string): string {
		return s
			.normalize('NFD')
			.replace(/[̀-ͯ]/g, '')
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '')
			.slice(0, 80);
	}

	onMount(() => refresh());

	async function refresh() {
		loading = true;
		message = null;
		try {
			const list = await getContentList('trainings');
			trainings = (list as unknown as Training[]).sort((a, b) => {
				if (a.category !== b.category) return a.category.localeCompare(b.category);
				return (a.order_index ?? 0) - (b.order_index ?? 0);
			});
		} catch (err) {
			message = { type: 'error', text: err instanceof Error ? err.message : 'Erreur de chargement' };
		} finally {
			loading = false;
		}
	}

	function startNew() {
		editing = {
			slug: '',
			title: '',
			category: 'agroalimentaire',
			price: 0,
			duration_days: 0,
			description: '',
			order_index: trainings.length + 1,
			published: true,
			image: '',
			imageFilename: ''
		};
		imageFile = null;
		imagePreview = '';
		clearExistingImage = false;
	}

	function startEdit(t: Training) {
		editing = { ...t };
		imageFile = null;
		imagePreview = '';
		clearExistingImage = false;
	}

	function cancelEdit() {
		editing = null;
		imageFile = null;
		imagePreview = '';
		clearExistingImage = false;
	}

	function handleImageInput(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0] || null;
		imageFile = file;
		clearExistingImage = false;
		if (imagePreview) URL.revokeObjectURL(imagePreview);
		imagePreview = file ? URL.createObjectURL(file) : '';
	}

	function removeImage() {
		if (imagePreview) URL.revokeObjectURL(imagePreview);
		imageFile = null;
		imagePreview = '';
		clearExistingImage = true;
	}

	async function handleSave() {
		if (!editing) return;
		if (!editing.title.trim()) {
			message = { type: 'error', text: 'Le titre est requis.' };
			return;
		}
		saving = true;
		message = null;
		try {
			const slug = (editing.slug && editing.slug.trim()) || slugify(editing.title);
			const payload = {
				slug,
				title: editing.title.trim(),
				category: editing.category,
				price: Number(editing.price) || 0,
				duration_days: Number(editing.duration_days) || 0,
				description: editing.description || '',
				order_index: Number(editing.order_index) || 0,
				published: editing.published
			};
			const id = editing.id || slug;
			const result = await saveContent('trainings', id, payload);
			const savedId = result.id || id;
			if (imageFile) {
				await saveTrainingImage(savedId, imageFile);
			} else if (clearExistingImage && editing.id) {
				await saveTrainingImage(savedId, null);
			}
			message = { type: 'success', text: editing.id ? 'Formation mise à jour.' : 'Formation créée.' };
			cancelEdit();
			await refresh();
		} catch (err) {
			message = { type: 'error', text: err instanceof Error ? err.message : 'Erreur' };
		} finally {
			saving = false;
		}
	}

	async function handleDelete(t: Training) {
		if (!confirm(`Supprimer la formation "${t.title}" ?`)) return;
		deletingId = t.id;
		message = null;
		try {
			await deleteContent('trainings', t.id);
			await refresh();
		} catch (err) {
			message = { type: 'error', text: err instanceof Error ? err.message : 'Erreur' };
		} finally {
			deletingId = '';
		}
	}

	async function togglePublished(t: Training) {
		actionLoading = t.id;
		try {
			if (t.published) await unpublishContent('trainings', t.id);
			else await publishContent('trainings', t.id);
			await refresh();
		} finally {
			actionLoading = '';
		}
	}

	function categoryLabel(c: string): string {
		return TRAINING_CATEGORIES.find((tc) => tc.value === c)?.label || c;
	}

	function categoryBadgeClass(c: string): string {
		return c === 'cosmetique' ? 'bg-violet-100 text-violet-700' : 'bg-emerald-100 text-emerald-700';
	}

	let filtered = $derived.by(() => {
		const q = search.trim().toLowerCase();
		return trainings.filter((t) => {
			if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
			if (!q) return true;
			return t.title.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q);
		});
	});
</script>

<div>
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-2xl font-bold text-neutral-obsidian">Formations</h1>
			<p class="text-neutral-slate text-sm mt-1">{trainings.length} formation(s)</p>
		</div>
		{#if !editing}
			<button
				onclick={startNew}
				class="flex items-center gap-2 bg-primary-green text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-green-vibrant transition-all"
			>
				<Plus class="w-4 h-4" />
				Nouvelle formation
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
	{:else}
		{#if editing}
			<div class="bg-white rounded-2xl p-6 shadow-sm mb-6">
				<h2 class="font-semibold text-neutral-obsidian mb-4">
					{editing.id ? 'Modifier la formation' : 'Nouvelle formation'}
				</h2>

				<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<div class="lg:col-span-2">
						<label for="t-title" class="block text-sm font-medium text-neutral-charcoal mb-1">Titre *</label>
						<input
							id="t-title"
							type="text"
							bind:value={editing.title}
							class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
							placeholder="Fonio sale en fonio propre prêt pour la cuisine"
						/>
					</div>

					<div>
						<label for="t-category" class="block text-sm font-medium text-neutral-charcoal mb-1">Catégorie *</label>
						<select
							id="t-category"
							bind:value={editing.category}
							class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm bg-white"
						>
							{#each TRAINING_CATEGORIES as c}
								<option value={c.value}>{c.label}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="t-slug" class="block text-sm font-medium text-neutral-charcoal mb-1">Slug</label>
						<input
							id="t-slug"
							type="text"
							bind:value={editing.slug}
							class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm font-mono"
							placeholder="auto depuis le titre"
						/>
					</div>

					<div>
						<label for="t-price" class="block text-sm font-medium text-neutral-charcoal mb-1">Prix (FCFA) *</label>
						<input
							id="t-price"
							type="number"
							min="0"
							bind:value={editing.price}
							class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
						/>
					</div>

					<div>
						<label for="t-duration" class="block text-sm font-medium text-neutral-charcoal mb-1">Durée (jours) *</label>
						<input
							id="t-duration"
							type="number"
							min="0"
							bind:value={editing.duration_days}
							class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
						/>
					</div>

					<div>
						<label for="t-order" class="block text-sm font-medium text-neutral-charcoal mb-1">Ordre d'affichage</label>
						<input
							id="t-order"
							type="number"
							min="0"
							bind:value={editing.order_index}
							class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
						/>
					</div>

					<div class="lg:col-span-2">
						<label for="t-desc" class="block text-sm font-medium text-neutral-charcoal mb-1">Description (optionnel)</label>
						<textarea
							id="t-desc"
							bind:value={editing.description}
							rows="3"
							class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
							placeholder="Détails supplémentaires affichés dans la fiche..."
						></textarea>
					</div>

					<div class="lg:col-span-2">
						<div class="block text-sm font-medium text-neutral-charcoal mb-1">Image (optionnel)</div>
						<div class="flex items-start gap-4">
							<div class="w-32 h-32 rounded-xl bg-neutral-sand border border-neutral-light overflow-hidden flex items-center justify-center shrink-0">
								{#if imagePreview}
									<img src={imagePreview} alt="Aperçu" class="w-full h-full object-cover" />
								{:else if editing.image && !clearExistingImage}
									<img src={editing.image} alt="Aperçu actuel" class="w-full h-full object-cover" />
								{:else}
									<ImageIcon class="w-8 h-8 text-neutral-slate" />
								{/if}
							</div>
							<div class="flex-1 space-y-2">
								<input
									id="t-image"
									type="file"
									accept="image/*"
									onchange={handleImageInput}
									class="block w-full text-sm text-neutral-charcoal file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-green/10 file:text-primary-green hover:file:bg-primary-green/20"
								/>
								{#if (editing.image && !clearExistingImage) || imagePreview}
									<button type="button" onclick={removeImage} class="text-xs text-red-600 hover:underline">
										Retirer l'image
									</button>
								{/if}
								<p class="text-xs text-neutral-slate">JPG, PNG ou WebP. Format carré recommandé.</p>
							</div>
						</div>
					</div>

					<div class="lg:col-span-2">
						<label class="inline-flex items-center gap-2 cursor-pointer">
							<input type="checkbox" bind:checked={editing.published} class="w-4 h-4 rounded border-neutral-light text-primary-green focus:ring-primary-green" />
							<span class="text-sm text-neutral-charcoal">Publié (visible sur le site)</span>
						</label>
					</div>
				</div>

				<div class="flex items-center gap-2 justify-end mt-6 pt-4 border-t border-neutral-sand">
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

		{#if trainings.length === 0}
			<div class="text-center py-16 bg-white rounded-2xl">
				<GraduationCap class="w-12 h-12 text-neutral-light mx-auto mb-3" />
				<p class="text-neutral-slate">Aucune formation.</p>
				<button onclick={startNew} class="inline-block mt-4 text-primary-green font-medium text-sm hover:underline">
					Créer la première
				</button>
			</div>
		{:else}
			<div class="bg-white rounded-2xl p-4 shadow-sm mb-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
					<div class="relative">
						<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-slate" />
						<input
							type="text"
							bind:value={search}
							placeholder="Rechercher par titre ou slug…"
							class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
						/>
					</div>
					<select
						bind:value={categoryFilter}
						class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm bg-white"
					>
						<option value="all">Toutes les catégories</option>
						{#each TRAINING_CATEGORIES as c}
							<option value={c.value}>{c.label}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="bg-white rounded-2xl shadow-sm overflow-hidden">
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b border-neutral-light">
								<th class="text-left px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider">Formation</th>
								<th class="text-left px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider">Catégorie</th>
								<th class="text-left px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider">Durée</th>
								<th class="text-left px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider">Prix</th>
								<th class="text-left px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider">Statut</th>
								<th class="text-right px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider">Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each filtered as t}
								<tr class="border-b border-neutral-sand last:border-0 hover:bg-neutral-pearl transition-colors">
									<td class="px-5 py-4">
										<div class="flex items-center gap-3">
											{#if t.image}
												<img src={t.image} alt={t.title} class="w-10 h-10 rounded-lg object-cover bg-neutral-sand shrink-0" />
											{:else}
												<div class="w-10 h-10 rounded-lg bg-neutral-sand flex items-center justify-center shrink-0">
													<GraduationCap class="w-5 h-5 text-neutral-slate" />
												</div>
											{/if}
											<div class="min-w-0">
												<p class="font-medium text-neutral-obsidian text-sm">{t.title}</p>
												<p class="text-xs text-neutral-slate">{t.slug}</p>
											</div>
										</div>
									</td>
									<td class="px-5 py-4">
										<span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium {categoryBadgeClass(t.category)}">
											{categoryLabel(t.category)}
										</span>
									</td>
									<td class="px-5 py-4 text-sm text-neutral-charcoal">{t.duration_days} jours</td>
									<td class="px-5 py-4 text-sm font-medium text-neutral-obsidian">{Number(t.price).toLocaleString('fr-FR')} FCFA</td>
									<td class="px-5 py-4">
										{#if t.published}
											<span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Publié</span>
										{:else}
											<span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600">Brouillon</span>
										{/if}
									</td>
									<td class="px-5 py-4">
										<div class="flex items-center justify-end gap-1">
											{#if deletingId === t.id || actionLoading === t.id}
												<div class="animate-spin w-4 h-4 border-2 border-primary-green border-t-transparent rounded-full"></div>
											{:else}
												<button
													onclick={() => startEdit(t)}
													class="p-2 rounded-lg text-neutral-slate hover:bg-neutral-sand hover:text-primary-green transition-all"
													title="Modifier"
												>
													<Pencil class="w-4 h-4" />
												</button>
												<button
													onclick={() => togglePublished(t)}
													class="p-2 rounded-lg text-neutral-slate {t.published ? 'hover:bg-yellow-50 hover:text-yellow-600' : 'hover:bg-green-50 hover:text-green-600'} transition-all"
													title={t.published ? 'Dépublier' : 'Publier'}
												>
													{#if t.published}
														<EyeOff class="w-4 h-4" />
													{:else}
														<Send class="w-4 h-4" />
													{/if}
												</button>
												<button
													onclick={() => handleDelete(t)}
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
					{#if filtered.length === 0}
						<div class="px-5 py-10 text-center text-sm text-neutral-slate">
							Aucun résultat pour ces filtres.
						</div>
					{/if}
				</div>
			</div>
		{/if}
	{/if}
</div>
