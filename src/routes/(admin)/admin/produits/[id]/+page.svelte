<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getContent, saveContent, publishContent, saveProductImages } from '$lib/admin/api';
	import { listCategories } from '$lib/admin/categories';
	import { DEFAULT_CATEGORIES, type Category, type Product } from '$lib/admin/types';
	import MediaPickerModal from '$lib/admin/MediaPickerModal.svelte';
	import { ArrowLeft, Save, Send, X, Plus, Eye, ImagePlus, FolderOpen, Tag } from 'lucide-svelte';

	const MAX_IMAGES = 10;

	const id = $derived($page.params.id ?? '');
	const isNew = $derived(id === 'nouveau');

	let categories = $state<Array<{ slug: string; name: string }>>(
		DEFAULT_CATEGORIES.map((c) => ({ slug: c.slug, name: c.name }))
	);

	let product = $state<Partial<Product>>({
		id: '',
		slug: '',
		name: '',
		subtitle: '',
		tagline: '',
		specialMention: '',
		qualityClaims: [],
		category: 'fonio',
		price: 0,
		description: '',
		detailedDescription: '',
		image: '',
		images: [],
		benefits: [],
		variants: [],
		tags: [],
		preparation: { ratio: '', recipes: [] },
		nutritionalInfo: { per: '100g' },
		conservation: '',
		usage: '',
		packaging: '',
		origin: 'Bénin',
		certification: '',
		featured: false,
		published: false
	});

	let loading = $state(id !== 'nouveau');
	let saving = $state(false);
	let publishing = $state(false);
	let message = $state<{ type: 'success' | 'error'; text: string } | null>(null);
	let newBenefit = $state('');
	let newTag = $state('');
	let newClaim = $state('');
	let newMineral = $state('');
	let newVitamin = $state('');
	let newVariant = $state<{ size: string; flavor: string; label: string; price: string }>({
		size: '',
		flavor: '',
		label: '',
		price: ''
	});

	type PendingFile = { file: File; previewUrl: string };
	let existingImages = $state<Array<{ filename: string; url: string }>>([]);
	let removedFilenames = $state<string[]>([]);
	let pendingFiles = $state<PendingFile[]>([]);
	let mediaPickerOpen = $state(false);
	const totalImages = $derived(existingImages.length + pendingFiles.length);
	const remainingSlots = $derived(Math.max(0, MAX_IMAGES - totalImages));

	function getSlug(): string {
		return product.slug || id;
	}

	onMount(async () => {
		loadCategoryList();
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
			syncExistingImagesFromProduct();
			loading = false;
		}
	});

	function syncExistingImagesFromProduct() {
		const filenames = product.imageFilenames ?? [];
		const urls = product.images ?? [];
		existingImages = filenames.map((filename, i) => ({
			filename,
			url: urls[i] || ''
		}));
		removedFilenames = [];
	}

	async function loadCategoryList() {
		try {
			const list = await listCategories();
			if (list && list.length > 0) {
				categories = list.map((c: Category) => ({ slug: c.slug, name: c.name }));
				if (isNew && !product.category) {
					product.category = categories[0].slug;
				}
			}
		} catch {
			// keep DEFAULT_CATEGORIES fallback
		}
	}

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
			const { id: savedId } = await saveContent('products', saveId, data);

			const newFiles = pendingFiles.map((p) => p.file);
			if (newFiles.length > 0 || removedFilenames.length > 0) {
				await saveProductImages(savedId, newFiles, removedFilenames);
			}

			message = { type: 'success', text: 'Brouillon sauvegardé' };

			if (id === 'nouveau') {
				goto(`/admin/produits/${saveId}`, { replaceState: true });
			} else if (newFiles.length > 0 || removedFilenames.length > 0) {
				// Re-fetch to pick up the new server-side filenames/URLs.
				const refreshed = await getContent('products', saveId, 'draft');
				product = refreshed as unknown as Product;
				pendingFiles.forEach((p) => URL.revokeObjectURL(p.previewUrl));
				pendingFiles = [];
				syncExistingImagesFromProduct();
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

	function handleImagesSelected(e: Event) {
		const input = e.target as HTMLInputElement;
		const files = Array.from(input.files ?? []);
		if (files.length === 0) return;

		const capacity = MAX_IMAGES - totalImages;
		const toAdd = files.slice(0, Math.max(0, capacity));
		if (files.length > toAdd.length) {
			message = {
				type: 'error',
				text: `Maximum ${MAX_IMAGES} images par produit. ${files.length - toAdd.length} image(s) ignorée(s).`
			};
		}
		pendingFiles = [
			...pendingFiles,
			...toAdd.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }))
		];
		input.value = '';
	}

	function removeExistingImage(filename: string) {
		existingImages = existingImages.filter((img) => img.filename !== filename);
		if (!removedFilenames.includes(filename)) {
			removedFilenames = [...removedFilenames, filename];
		}
	}

	function removePendingFile(index: number) {
		const removed = pendingFiles[index];
		if (removed) URL.revokeObjectURL(removed.previewUrl);
		pendingFiles = pendingFiles.filter((_, i) => i !== index);
	}

	function addFilesFromPicker(files: File[]) {
		const toAdd = files.slice(0, remainingSlots);
		pendingFiles = [
			...pendingFiles,
			...toAdd.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }))
		];
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

	function addTag() {
		const t = newTag.trim().toLowerCase();
		if (!t) return;
		const existing = product.tags || [];
		if (existing.includes(t)) {
			newTag = '';
			return;
		}
		product.tags = [...existing, t];
		newTag = '';
	}

	function removeTag(index: number) {
		product.tags = (product.tags || []).filter((_, i) => i !== index);
	}

	function addVariant() {
		const size = newVariant.size.trim();
		const flavor = newVariant.flavor.trim();
		const label = newVariant.label.trim();
		const price = newVariant.price.trim() ? Number(newVariant.price) : NaN;
		if (!size && !flavor && !label) return;
		product.variants = [
			...(product.variants || []),
			{
				...(size ? { size } : {}),
				...(flavor ? { flavor } : {}),
				...(label ? { label } : {}),
				...(Number.isFinite(price) && price >= 0 ? { price } : {})
			}
		];
		newVariant = { size: '', flavor: '', label: '', price: '' };
	}

	function removeVariant(index: number) {
		product.variants = (product.variants || []).filter((_, i) => i !== index);
	}

	function formatVariant(v: { size?: string; flavor?: string; label?: string; price?: number }): string {
		const base = [v.size, v.flavor, v.label].filter(Boolean).join(' · ');
		if (typeof v.price === 'number' && v.price > 0) {
			return `${base || '—'} — ${v.price.toLocaleString('fr-FR')} FCFA`;
		}
		return base;
	}

	function addClaim() {
		const t = newClaim.trim();
		if (!t) return;
		const existing = product.qualityClaims || [];
		if (existing.includes(t)) {
			newClaim = '';
			return;
		}
		product.qualityClaims = [...existing, t];
		newClaim = '';
	}

	function removeClaim(index: number) {
		product.qualityClaims = (product.qualityClaims || []).filter((_, i) => i !== index);
	}

	function addRecipe() {
		const prep = product.preparation ?? { ratio: '', recipes: [] };
		product.preparation = { ...prep, recipes: [...prep.recipes, { name: '', steps: [] }] };
	}

	function removeRecipe(index: number) {
		const prep = product.preparation ?? { ratio: '', recipes: [] };
		product.preparation = { ...prep, recipes: prep.recipes.filter((_, i) => i !== index) };
	}

	function addStep(recipeIndex: number) {
		const prep = product.preparation ?? { ratio: '', recipes: [] };
		const recipes = prep.recipes.map((r, i) => (i === recipeIndex ? { ...r, steps: [...r.steps, ''] } : r));
		product.preparation = { ...prep, recipes };
	}

	function removeStep(recipeIndex: number, stepIndex: number) {
		const prep = product.preparation ?? { ratio: '', recipes: [] };
		const recipes = prep.recipes.map((r, i) =>
			i === recipeIndex ? { ...r, steps: r.steps.filter((_, j) => j !== stepIndex) } : r
		);
		product.preparation = { ...prep, recipes };
	}

	function addMineral() {
		const t = newMineral.trim();
		if (!t) return;
		const nutrition = product.nutritionalInfo ?? {};
		const minerals = nutrition.minerals ?? [];
		if (minerals.includes(t)) {
			newMineral = '';
			return;
		}
		product.nutritionalInfo = { ...nutrition, minerals: [...minerals, t] };
		newMineral = '';
	}

	function removeMineral(index: number) {
		const nutrition = product.nutritionalInfo ?? {};
		const minerals = (nutrition.minerals ?? []).filter((_, i) => i !== index);
		product.nutritionalInfo = { ...nutrition, minerals };
	}

	function addVitamin() {
		const t = newVitamin.trim();
		if (!t) return;
		const nutrition = product.nutritionalInfo ?? {};
		const vitamins = nutrition.vitamins ?? [];
		if (vitamins.includes(t)) {
			newVitamin = '';
			return;
		}
		product.nutritionalInfo = { ...nutrition, vitamins: [...vitamins, t] };
		newVitamin = '';
	}

	function removeVitamin(index: number) {
		const nutrition = product.nutritionalInfo ?? {};
		const vitamins = (nutrition.vitamins ?? []).filter((_, i) => i !== index);
		product.nutritionalInfo = { ...nutrition, vitamins };
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
								{#each categories as cat}
									<option value={cat.slug}>{cat.name}</option>
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

				<!-- Identité commerciale (BPV) -->
				<div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
					<div>
						<h2 class="font-semibold text-neutral-obsidian">Identité commerciale</h2>
						<p class="text-xs text-neutral-slate mt-0.5">
							Reprise du BPV : ligne secondaire, slogan, mention badge et claims qualité.
						</p>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label for="subtitle" class="block text-sm font-medium text-neutral-charcoal mb-1">Sous-titre / ligne produit</label>
							<input
								id="subtitle"
								type="text"
								bind:value={product.subtitle}
								class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
								placeholder="PURS GRAINS DE FONIO"
							/>
						</div>
						<div>
							<label for="specialMention" class="block text-sm font-medium text-neutral-charcoal mb-1">Mention spéciale (badge)</label>
							<input
								id="specialMention"
								type="text"
								bind:value={product.specialMention}
								class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
								placeholder="SANS GLUTEN"
							/>
						</div>
					</div>

					<div>
						<label for="tagline" class="block text-sm font-medium text-neutral-charcoal mb-1">Slogan / accroche</label>
						<input
							id="tagline"
							type="text"
							bind:value={product.tagline}
							class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
							placeholder="Optez pour votre bien-être !"
						/>
					</div>

					<div>
						<div class="block text-sm font-medium text-neutral-charcoal mb-1">Claims qualité</div>
						<div class="flex gap-2">
							<input
								type="text"
								bind:value={newClaim}
								onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addClaim())}
								class="flex-1 px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
								placeholder="100% Naturel, Sans conservateur, HACCP…"
							/>
							<button
								onclick={addClaim}
								class="p-2.5 bg-primary-green text-white rounded-xl hover:bg-primary-green-vibrant transition-all"
							>
								<Plus class="w-4 h-4" />
							</button>
						</div>
						{#if product.qualityClaims && product.qualityClaims.length > 0}
							<div class="flex flex-wrap gap-2 mt-3">
								{#each product.qualityClaims as claim, i}
									<span class="inline-flex items-center gap-1 bg-primary-green/10 text-primary-green-vibrant px-3 py-1 rounded-full text-xs font-medium">
										{claim}
										<button
											onclick={() => removeClaim(i)}
											class="ml-1 hover:text-red-500 transition-colors"
											title="Retirer"
										>
											<X class="w-3 h-3" />
										</button>
									</span>
								{/each}
							</div>
						{/if}
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

				<!-- Variantes -->
				<div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
					<div>
						<h2 class="font-semibold text-neutral-obsidian">Variantes</h2>
						<p class="text-xs text-neutral-slate mt-0.5">
							Déclinaisons de taille et/ou parfum. Laisser vide si le produit n'a qu'un seul format.
						</p>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2">
						<input
							type="text"
							bind:value={newVariant.size}
							onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addVariant())}
							class="px-3 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
							placeholder="Taille (50G, 1KG, 90ML…)"
						/>
						<input
							type="text"
							bind:value={newVariant.flavor}
							onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addVariant())}
							class="px-3 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
							placeholder="Parfum (Nature…)"
						/>
						<input
							type="text"
							bind:value={newVariant.label}
							onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addVariant())}
							class="px-3 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
							placeholder="Mention (Dragée…)"
						/>
						<input
							type="number"
							bind:value={newVariant.price}
							onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addVariant())}
							min="0"
							step="1"
							class="px-3 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
							placeholder="Prix (FCFA)"
						/>
						<button
							onclick={addVariant}
							class="p-2.5 bg-primary-green text-white rounded-xl hover:bg-primary-green-vibrant transition-all"
							title="Ajouter la variante"
						>
							<Plus class="w-4 h-4" />
						</button>
					</div>

					{#if product.variants && product.variants.length > 0}
						<ul class="space-y-2">
							{#each product.variants as variant, i}
								<li class="flex items-center justify-between bg-neutral-pearl px-4 py-2.5 rounded-xl text-sm">
									<span class="font-medium">{formatVariant(variant) || '—'}</span>
									<button
										onclick={() => removeVariant(i)}
										class="text-neutral-slate hover:text-red-500 transition-colors"
										title="Retirer"
									>
										<X class="w-4 h-4" />
									</button>
								</li>
							{/each}
						</ul>
					{/if}
				</div>

				<!-- Tags -->
				<div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
					<div>
						<h2 class="font-semibold text-neutral-obsidian">Tags</h2>
						<p class="text-xs text-neutral-slate mt-0.5">
							Mots-clés pour grouper les produits de la catégorie « Autres » (igname, tomate, condiment…).
						</p>
					</div>

					<div class="flex gap-2">
						<input
							type="text"
							bind:value={newTag}
							onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
							class="flex-1 px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
							placeholder="Ajouter un tag…"
						/>
						<button
							onclick={addTag}
							class="p-2.5 bg-primary-green text-white rounded-xl hover:bg-primary-green-vibrant transition-all"
						>
							<Plus class="w-4 h-4" />
						</button>
					</div>

					{#if product.tags && product.tags.length > 0}
						<div class="flex flex-wrap gap-2">
							{#each product.tags as tag, i}
								<span class="inline-flex items-center gap-1 bg-accent-gold/10 text-neutral-obsidian px-3 py-1 rounded-full text-xs font-medium">
									<Tag class="w-3 h-3" />
									{tag}
									<button
										onclick={() => removeTag(i)}
										class="ml-1 text-neutral-slate hover:text-red-500 transition-colors"
										title="Retirer"
									>
										<X class="w-3 h-3" />
									</button>
								</span>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Préparation -->
				<div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
					<div>
						<h2 class="font-semibold text-neutral-obsidian">Préparation</h2>
						<p class="text-xs text-neutral-slate mt-0.5">
							Recettes du BPV. Une recette = un titre + une suite d'étapes.
						</p>
					</div>

					<div>
						<label for="ratio" class="block text-sm font-medium text-neutral-charcoal mb-1">Ratio universel</label>
						<input
							id="ratio"
							type="text"
							value={product.preparation?.ratio ?? ''}
							oninput={(e) =>
								(product.preparation = {
									...(product.preparation ?? { recipes: [] }),
									ratio: (e.target as HTMLInputElement).value
								})}
							class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
							placeholder="1 mesure de fonio = 8 mesures d'eau"
						/>
					</div>

					{#if product.preparation?.recipes}
						{#each product.preparation.recipes as recipe, ri}
							<div class="rounded-xl border border-neutral-light p-4 space-y-3">
								<div class="flex items-start gap-2">
									<input
										type="text"
										value={recipe.name}
										oninput={(e) => {
											const prep = product.preparation ?? { ratio: '', recipes: [] };
											prep.recipes[ri].name = (e.target as HTMLInputElement).value;
											product.preparation = { ...prep };
										}}
										class="flex-1 px-3 py-2 rounded-lg border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm font-medium"
										placeholder="Bouillie de grains de fonio"
									/>
									<button
										onclick={() => removeRecipe(ri)}
										class="p-2 text-neutral-slate hover:text-red-500 transition-colors"
										title="Supprimer la recette"
									>
										<X class="w-4 h-4" />
									</button>
								</div>

								<ol class="space-y-2 list-decimal pl-5">
									{#each recipe.steps as step, si}
										<li class="flex items-start gap-2">
											<textarea
												value={step}
												oninput={(e) => {
													const prep = product.preparation ?? { ratio: '', recipes: [] };
													prep.recipes[ri].steps[si] = (e.target as HTMLTextAreaElement).value;
													product.preparation = { ...prep };
												}}
												rows="2"
												class="flex-1 px-3 py-2 rounded-lg border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm resize-y"
												placeholder="Décrivez l'étape…"
											></textarea>
											<button
												onclick={() => removeStep(ri, si)}
												class="mt-1 p-1.5 text-neutral-slate hover:text-red-500 transition-colors"
												title="Retirer l'étape"
											>
												<X class="w-3.5 h-3.5" />
											</button>
										</li>
									{/each}
								</ol>

								<button
									onclick={() => addStep(ri)}
									class="flex items-center gap-1.5 text-sm text-primary-green hover:text-primary-green-vibrant transition-colors"
								>
									<Plus class="w-4 h-4" />
									Ajouter une étape
								</button>
							</div>
						{/each}
					{/if}

					<button
						onclick={addRecipe}
						class="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-neutral-light text-neutral-slate text-sm hover:border-primary-green hover:text-primary-green transition-all w-full justify-center"
					>
						<Plus class="w-4 h-4" />
						Ajouter une recette
					</button>
				</div>

				<!-- Composition nutritionnelle -->
				<div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
					<div>
						<h2 class="font-semibold text-neutral-obsidian">Composition nutritionnelle</h2>
						<p class="text-xs text-neutral-slate mt-0.5">
							Valeurs telles qu'écrites sur l'étiquette ("80g", "352 kCal").
						</p>
					</div>

					<div class="grid grid-cols-2 md:grid-cols-3 gap-3">
						<div>
							<label for="per" class="block text-xs font-medium text-neutral-charcoal mb-1">Pour</label>
							<input
								id="per"
								type="text"
								value={product.nutritionalInfo?.per ?? ''}
								oninput={(e) =>
									(product.nutritionalInfo = { ...(product.nutritionalInfo ?? {}), per: (e.target as HTMLInputElement).value })}
								class="w-full px-3 py-2 rounded-lg border border-neutral-light focus:border-primary-green outline-none text-sm"
								placeholder="100g"
							/>
						</div>
						<div>
							<label for="energy" class="block text-xs font-medium text-neutral-charcoal mb-1">Énergie</label>
							<input
								id="energy"
								type="text"
								value={product.nutritionalInfo?.energy ?? ''}
								oninput={(e) =>
									(product.nutritionalInfo = { ...(product.nutritionalInfo ?? {}), energy: (e.target as HTMLInputElement).value })}
								class="w-full px-3 py-2 rounded-lg border border-neutral-light focus:border-primary-green outline-none text-sm"
								placeholder="352 kCal"
							/>
						</div>
						<div>
							<label for="carbs" class="block text-xs font-medium text-neutral-charcoal mb-1">Glucides</label>
							<input
								id="carbs"
								type="text"
								value={product.nutritionalInfo?.carbs ?? ''}
								oninput={(e) =>
									(product.nutritionalInfo = { ...(product.nutritionalInfo ?? {}), carbs: (e.target as HTMLInputElement).value })}
								class="w-full px-3 py-2 rounded-lg border border-neutral-light focus:border-primary-green outline-none text-sm"
								placeholder="80g"
							/>
						</div>
						<div>
							<label for="protein" class="block text-xs font-medium text-neutral-charcoal mb-1">Protéines</label>
							<input
								id="protein"
								type="text"
								value={product.nutritionalInfo?.protein ?? ''}
								oninput={(e) =>
									(product.nutritionalInfo = { ...(product.nutritionalInfo ?? {}), protein: (e.target as HTMLInputElement).value })}
								class="w-full px-3 py-2 rounded-lg border border-neutral-light focus:border-primary-green outline-none text-sm"
								placeholder="8g"
							/>
						</div>
						<div>
							<label for="fiber" class="block text-xs font-medium text-neutral-charcoal mb-1">Fibres</label>
							<input
								id="fiber"
								type="text"
								value={product.nutritionalInfo?.fiber ?? ''}
								oninput={(e) =>
									(product.nutritionalInfo = { ...(product.nutritionalInfo ?? {}), fiber: (e.target as HTMLInputElement).value })}
								class="w-full px-3 py-2 rounded-lg border border-neutral-light focus:border-primary-green outline-none text-sm"
								placeholder="2,4g"
							/>
						</div>
						<div>
							<label for="fat" class="block text-xs font-medium text-neutral-charcoal mb-1">Lipides</label>
							<input
								id="fat"
								type="text"
								value={product.nutritionalInfo?.fat ?? ''}
								oninput={(e) =>
									(product.nutritionalInfo = { ...(product.nutritionalInfo ?? {}), fat: (e.target as HTMLInputElement).value })}
								class="w-full px-3 py-2 rounded-lg border border-neutral-light focus:border-primary-green outline-none text-sm"
								placeholder="—"
							/>
						</div>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<div class="block text-sm font-medium text-neutral-charcoal mb-1">Minéraux</div>
							<div class="flex gap-2">
								<input
									type="text"
									bind:value={newMineral}
									onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addMineral())}
									class="flex-1 px-3 py-2 rounded-lg border border-neutral-light focus:border-primary-green outline-none text-sm"
									placeholder="Fer, Magnésium…"
								/>
								<button onclick={addMineral} class="p-2 bg-primary-green text-white rounded-lg hover:bg-primary-green-vibrant transition-all">
									<Plus class="w-4 h-4" />
								</button>
							</div>
							{#if product.nutritionalInfo?.minerals && product.nutritionalInfo.minerals.length > 0}
								<div class="flex flex-wrap gap-1.5 mt-2">
									{#each product.nutritionalInfo.minerals as min, i}
										<span class="inline-flex items-center gap-1 bg-neutral-pearl px-2 py-1 rounded-md text-xs">
											{min}
											<button onclick={() => removeMineral(i)} class="text-neutral-slate hover:text-red-500 transition-colors">
												<X class="w-3 h-3" />
											</button>
										</span>
									{/each}
								</div>
							{/if}
						</div>
						<div>
							<div class="block text-sm font-medium text-neutral-charcoal mb-1">Vitamines</div>
							<div class="flex gap-2">
								<input
									type="text"
									bind:value={newVitamin}
									onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addVitamin())}
									class="flex-1 px-3 py-2 rounded-lg border border-neutral-light focus:border-primary-green outline-none text-sm"
									placeholder="B, C…"
								/>
								<button onclick={addVitamin} class="p-2 bg-primary-green text-white rounded-lg hover:bg-primary-green-vibrant transition-all">
									<Plus class="w-4 h-4" />
								</button>
							</div>
							{#if product.nutritionalInfo?.vitamins && product.nutritionalInfo.vitamins.length > 0}
								<div class="flex flex-wrap gap-1.5 mt-2">
									{#each product.nutritionalInfo.vitamins as vit, i}
										<span class="inline-flex items-center gap-1 bg-neutral-pearl px-2 py-1 rounded-md text-xs">
											{vit}
											<button onclick={() => removeVitamin(i)} class="text-neutral-slate hover:text-red-500 transition-colors">
												<X class="w-3 h-3" />
											</button>
										</span>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- Conservation -->
				<div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
					<div>
						<h2 class="font-semibold text-neutral-obsidian">Conservation</h2>
						<p class="text-xs text-neutral-slate mt-0.5">
							Instructions de stockage et durabilité.
						</p>
					</div>
					<textarea
						bind:value={product.conservation}
						rows="3"
						class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm resize-y"
						placeholder="Refermer hermétiquement l'emballage après utilisation. Conserver dans un endroit sec, frais et à l'abri de l'humidité. À consommer de préférence avant la Date de Durabilité Minimale."
					></textarea>
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
				<!-- Images -->
				<div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
					<div class="flex items-center justify-between">
						<h2 class="font-semibold text-neutral-obsidian">Images</h2>
						<span class="text-xs text-neutral-slate">{totalImages}/{MAX_IMAGES}</span>
					</div>
					<p class="text-xs text-neutral-slate">
						La première image est utilisée comme visuel principal. Les changements sont appliqués au clic sur « Sauvegarder ».
					</p>

					{#if existingImages.length > 0 || pendingFiles.length > 0}
						<div class="grid grid-cols-3 gap-2">
							{#each existingImages as img, i (img.filename)}
								<div class="relative group aspect-square">
									<img
										src={img.url}
										alt="Image {i + 1}"
										class="w-full h-full rounded-lg object-cover bg-neutral-sand"
									/>
									{#if i === 0 && pendingFiles.length === 0}
										<span class="absolute bottom-1 left-1 bg-primary-green text-white text-[10px] px-1.5 py-0.5 rounded">Principal</span>
									{/if}
									<button
										type="button"
										onclick={() => removeExistingImage(img.filename)}
										class="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
										title="Supprimer"
									>
										<X class="w-3 h-3" />
									</button>
								</div>
							{/each}
							{#each pendingFiles as pf, i (pf.previewUrl)}
								<div class="relative group aspect-square">
									<img
										src={pf.previewUrl}
										alt="Nouveau {i + 1}"
										class="w-full h-full rounded-lg object-cover bg-neutral-sand ring-2 ring-primary-green/50"
									/>
									<span class="absolute bottom-1 left-1 bg-accent-gold text-neutral-obsidian text-[10px] px-1.5 py-0.5 rounded">À envoyer</span>
									<button
										type="button"
										onclick={() => removePendingFile(i)}
										class="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
										title="Retirer"
									>
										<X class="w-3 h-3" />
									</button>
								</div>
							{/each}
						</div>
					{/if}

					{#if totalImages < MAX_IMAGES}
						<div class="grid grid-cols-2 gap-2">
							<label class="flex items-center justify-center gap-2 px-3 py-3 rounded-xl border-2 border-dashed border-neutral-light text-neutral-slate text-sm cursor-pointer hover:border-primary-green hover:text-primary-green transition-all">
								<ImagePlus class="w-4 h-4" />
								<span>Uploader</span>
								<input
									type="file"
									accept="image/*"
									multiple
									onchange={handleImagesSelected}
									class="hidden"
								/>
							</label>
							<button
								type="button"
								onclick={() => (mediaPickerOpen = true)}
								class="flex items-center justify-center gap-2 px-3 py-3 rounded-xl border-2 border-dashed border-neutral-light text-neutral-slate text-sm cursor-pointer hover:border-primary-green hover:text-primary-green transition-all"
							>
								<FolderOpen class="w-4 h-4" />
								<span>Depuis la galerie</span>
							</button>
						</div>
					{/if}
				</div>

				<!-- Options -->
				<div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
					<h2 class="font-semibold text-neutral-obsidian">Options</h2>

					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={product.published}
							class="w-4 h-4 rounded border-neutral-light text-primary-green focus:ring-primary-green"
						/>
						<span class="text-sm text-neutral-charcoal">Publié (visible sur le site)</span>
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

				<!-- SEO -->
				<div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
					<h2 class="font-semibold text-neutral-obsidian">SEO</h2>
					<div>
						<label for="metaTitle" class="block text-xs font-medium text-neutral-charcoal mb-1">Meta Title</label>
						<input id="metaTitle" type="text" bind:value={product.metaTitle}
							class="w-full px-3 py-2 rounded-lg border border-neutral-light focus:border-primary-green outline-none text-xs"
							placeholder="{product.name || 'Nom du produit'} — Angel's Floor" />
						<p class="text-xs text-neutral-slate mt-1">{(product.metaTitle || '').length}/60</p>
					</div>
					<div>
						<label for="metaDesc" class="block text-xs font-medium text-neutral-charcoal mb-1">Meta Description</label>
						<textarea id="metaDesc" bind:value={product.metaDescription} rows="2"
							class="w-full px-3 py-2 rounded-lg border border-neutral-light focus:border-primary-green outline-none text-xs resize-y"
							placeholder="{product.description || 'Description du produit...'}"></textarea>
						<p class="text-xs text-neutral-slate mt-1">{(product.metaDescription || '').length}/160</p>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<MediaPickerModal bind:open={mediaPickerOpen} maxSelect={remainingSlots} onConfirm={addFilesFromPicker} />
