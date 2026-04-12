<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getContent, saveContent, publishContent, uploadFile } from '$lib/admin/api';
	import { PRODUCT_CATEGORIES, type Product } from '$lib/admin/types';
	import { ArrowLeft, Save, Send, Upload, X, Plus, Eye } from 'lucide-svelte';

	const id = $derived($page.params.id ?? '');
	const isNew = $derived(id === 'nouveau');

	let product = $state<Partial<Product>>({
		id: '',
		slug: '',
		name: '',
		category: 'fonio',
		price: 0,
		description: '',
		detailedDescription: '',
		image: '',
		images: [],
		benefits: [],
		usage: '',
		packaging: '',
		origin: 'Bénin',
		certification: '',
		inStock: true,
		featured: false
	});

	let loading = $state(id !== 'nouveau');
	let saving = $state(false);
	let publishing = $state(false);
	let uploading = $state(false);
	let message = $state<{ type: 'success' | 'error'; text: string } | null>(null);
	let newBenefit = $state('');

	function getSlug(): string {
		return product.slug || id;
	}

	onMount(async () => {
		if (id !== 'nouveau') {
			try {
				const data = await getContent('products', id, 'draft');
				product = data as unknown as Product;
			} catch {
				try {
					const data = await getContent('products', id, 'live');
					product = data as unknown as Product;
				} catch {
					message = { type: 'error', text: 'Produit introuvable' };
				}
			}
			loading = false;
		}
	});

	function generateSlug(name: string): string {
		return name
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');
	}

	function handleNameChange() {
		if (isNew && product.name) {
			product.slug = generateSlug(product.name);
			product.id = product.slug;
		}
	}

	async function handleSave() {
		if (!product.name || !product.slug) {
			message = { type: 'error', text: 'Le nom et le slug sont requis' };
			return;
		}

		saving = true;
		message = null;

		try {
			const saveId = getSlug();
			const { _id, _hasDraft, _isPublished, _status, ...data } = product as Record<string, unknown>;
			await saveContent('products', saveId, data);
			message = { type: 'success', text: 'Brouillon sauvegardé' };

			if (id === 'nouveau') {
				goto(`/admin/produits/${saveId}`, { replaceState: true });
			}
		} catch (err) {
			message = { type: 'error', text: err instanceof Error ? err.message : 'Erreur' };
		} finally {
			saving = false;
		}
	}

	async function handlePublish() {
		await handleSave();
		if (message?.type === 'error') return;

		publishing = true;
		try {
			await publishContent('products', getSlug());
			message = { type: 'success', text: 'Produit publié !' };
		} catch (err) {
			message = { type: 'error', text: err instanceof Error ? err.message : 'Erreur' };
		} finally {
			publishing = false;
		}
	}

	async function handleImageUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		uploading = true;
		try {
			const result = await uploadFile(file);
			product.image = result.url;
		} catch (err) {
			message = { type: 'error', text: err instanceof Error ? err.message : 'Erreur upload' };
		} finally {
			uploading = false;
			input.value = '';
		}
	}

	function addBenefit() {
		if (newBenefit.trim()) {
			product.benefits = [...(product.benefits || []), newBenefit.trim()];
			newBenefit = '';
		}
	}

	function removeBenefit(index: number) {
		product.benefits = (product.benefits || []).filter((_, i) => i !== index);
	}
</script>

<div>
	<!-- Header -->
	<div class="flex items-center justify-between mb-6">
		<div class="flex items-center gap-4">
			<a
				href="/admin/produits"
				class="p-2 rounded-xl hover:bg-white transition-all text-neutral-slate"
			>
				<ArrowLeft class="w-5 h-5" />
			</a>
			<div>
				<h1 class="text-2xl font-bold text-neutral-obsidian">
					{isNew ? 'Nouveau produit' : 'Modifier le produit'}
				</h1>
				{#if !isNew}
					<p class="text-neutral-slate text-sm mt-0.5">{product.name}</p>
				{/if}
			</div>
		</div>
		<div class="flex items-center gap-2">
			{#if !isNew}
				<a
					href="/admin/preview?type=products&id={product.slug || id}"
					target="_blank"
					class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-light text-neutral-charcoal text-sm font-medium hover:bg-white transition-all"
				>
					<Eye class="w-4 h-4" />
					Aperçu
				</a>
			{/if}
			<button
				onclick={handleSave}
				disabled={saving}
				class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary-green text-primary-green text-sm font-medium hover:bg-primary-green/5 transition-all disabled:opacity-50"
			>
				<Save class="w-4 h-4" />
				{saving ? 'Sauvegarde...' : 'Sauvegarder'}
			</button>
			<button
				onclick={handlePublish}
				disabled={publishing || saving}
				class="flex items-center gap-2 bg-primary-green text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-green-vibrant transition-all disabled:opacity-50"
			>
				<Send class="w-4 h-4" />
				{publishing ? 'Publication...' : 'Publier'}
			</button>
		</div>
	</div>

	<!-- Message -->
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
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Main Form -->
			<div class="lg:col-span-2 space-y-6">
				<!-- Infos de base -->
				<div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
					<h2 class="font-semibold text-neutral-obsidian">Informations générales</h2>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label for="name" class="block text-sm font-medium text-neutral-charcoal mb-1">Nom *</label>
							<input
								id="name"
								type="text"
								bind:value={product.name}
								oninput={handleNameChange}
								class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
								placeholder="Fonio Précuit Bio"
							/>
						</div>
						<div>
							<label for="slug" class="block text-sm font-medium text-neutral-charcoal mb-1">Slug *</label>
							<input
								id="slug"
								type="text"
								bind:value={product.slug}
								class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
								placeholder="fonio-precuit-bio"
							/>
						</div>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label for="category" class="block text-sm font-medium text-neutral-charcoal mb-1">Catégorie</label>
							<select
								id="category"
								bind:value={product.category}
								class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm bg-white"
							>
								{#each PRODUCT_CATEGORIES as cat}
									<option value={cat.value}>{cat.label}</option>
								{/each}
							</select>
						</div>
						<div>
							<label for="price" class="block text-sm font-medium text-neutral-charcoal mb-1">Prix (FCFA)</label>
							<input
								id="price"
								type="number"
								bind:value={product.price}
								min="0"
								class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
							/>
						</div>
					</div>

					<div>
						<label for="description" class="block text-sm font-medium text-neutral-charcoal mb-1">Description courte</label>
						<textarea
							id="description"
							bind:value={product.description}
							rows="2"
							class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm resize-y"
							placeholder="Description affichée sur les cartes produit"
						></textarea>
					</div>

					<div>
						<label for="detailedDescription" class="block text-sm font-medium text-neutral-charcoal mb-1">Description détaillée</label>
						<textarea
							id="detailedDescription"
							bind:value={product.detailedDescription}
							rows="5"
							class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm resize-y"
							placeholder="Description complète du produit..."
						></textarea>
					</div>
				</div>

				<!-- Bénéfices -->
				<div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
					<h2 class="font-semibold text-neutral-obsidian">Bénéfices</h2>

					<div class="flex gap-2">
						<input
							type="text"
							bind:value={newBenefit}
							onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
							class="flex-1 px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
							placeholder="Ajouter un bénéfice..."
						/>
						<button
							onclick={addBenefit}
							class="p-2.5 bg-primary-green text-white rounded-xl hover:bg-primary-green-vibrant transition-all"
						>
							<Plus class="w-4 h-4" />
						</button>
					</div>

					{#if product.benefits && product.benefits.length > 0}
						<ul class="space-y-2">
							{#each product.benefits as benefit, i}
								<li class="flex items-center justify-between bg-neutral-pearl px-4 py-2.5 rounded-xl text-sm">
									<span>{benefit}</span>
									<button
										onclick={() => removeBenefit(i)}
										class="text-neutral-slate hover:text-red-500 transition-colors"
									>
										<X class="w-4 h-4" />
									</button>
								</li>
							{/each}
						</ul>
					{/if}
				</div>

				<!-- Détails -->
				<div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
					<h2 class="font-semibold text-neutral-obsidian">Détails</h2>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label for="packaging" class="block text-sm font-medium text-neutral-charcoal mb-1">Conditionnement</label>
							<input
								id="packaging"
								type="text"
								bind:value={product.packaging}
								class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
								placeholder="Sachet de 500g"
							/>
						</div>
						<div>
							<label for="origin" class="block text-sm font-medium text-neutral-charcoal mb-1">Origine</label>
							<input
								id="origin"
								type="text"
								bind:value={product.origin}
								class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
								placeholder="Bénin"
							/>
						</div>
					</div>

					<div>
						<label for="usage" class="block text-sm font-medium text-neutral-charcoal mb-1">Utilisation</label>
						<textarea
							id="usage"
							bind:value={product.usage}
							rows="3"
							class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm resize-y"
							placeholder="Mode d'emploi..."
						></textarea>
					</div>

					<div>
						<label for="certification" class="block text-sm font-medium text-neutral-charcoal mb-1">Certification</label>
						<input
							id="certification"
							type="text"
							bind:value={product.certification}
							class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
							placeholder="Agriculture Biologique"
						/>
					</div>
				</div>
			</div>

			<!-- Sidebar -->
			<div class="space-y-6">
				<!-- Image principale -->
				<div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
					<h2 class="font-semibold text-neutral-obsidian">Image principale</h2>

					{#if product.image}
						<div class="relative group">
							<img
								src={product.image}
								alt={product.name || ''}
								class="w-full aspect-square rounded-xl object-cover bg-neutral-sand"
							/>
							<button
								onclick={() => (product.image = '')}
								class="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
							>
								<X class="w-3 h-3" />
							</button>
						</div>
					{/if}

					<label class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-neutral-light text-neutral-slate text-sm cursor-pointer hover:border-primary-green hover:text-primary-green transition-all">
						<Upload class="w-4 h-4" />
						{uploading ? 'Upload en cours...' : 'Choisir une image'}
						<input
							type="file"
							accept="image/*"
							onchange={handleImageUpload}
							class="hidden"
						/>
					</label>

					<div>
						<label for="imageUrl" class="block text-xs text-neutral-slate mb-1">ou URL directe</label>
						<input
							id="imageUrl"
							type="text"
							bind:value={product.image}
							class="w-full px-3 py-2 rounded-lg border border-neutral-light focus:border-primary-green outline-none text-xs"
							placeholder="/uploads/image.jpg"
						/>
					</div>
				</div>

				<!-- Options -->
				<div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
					<h2 class="font-semibold text-neutral-obsidian">Options</h2>

					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={product.inStock}
							class="w-4 h-4 rounded border-neutral-light text-primary-green focus:ring-primary-green"
						/>
						<span class="text-sm text-neutral-charcoal">En stock</span>
					</label>

					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={product.featured}
							class="w-4 h-4 rounded border-neutral-light text-primary-green focus:ring-primary-green"
						/>
						<span class="text-sm text-neutral-charcoal">Produit vedette</span>
					</label>
				</div>
			</div>
		</div>
	{/if}
</div>
