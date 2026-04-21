<script lang="ts">
	import { onMount } from 'svelte';
	import {
		getCmsOverrides,
		saveCmsText,
		saveCmsImage,
		appendCmsGalleryImages,
		removeCmsGalleryImage,
		reorderCmsGallery,
		getCmsGalleryFilenames,
		clearCmsOverride,
		type CmsOverride,
		type CmsOverrideType
	} from '$lib/admin/api';
	import RichTextEditor from '$lib/admin/RichTextEditor.svelte';
	import { CMS_PAGES } from '$lib/cms/pages';
	import {
		Save,
		Image as ImageIcon,
		Upload,
		Trash2,
		ArrowUp,
		ArrowDown,
		RotateCcw,
		Loader2
	} from 'lucide-svelte';

	type DiscoveredField = {
		key: string;
		type: CmsOverrideType;
		defaultValue: string; // text / richtext default (HTML), or '' for image/gallery
	};

	let activePage = $state(CMS_PAGES[0]);
	let loading = $state(true);
	let saving = $state(false);
	let message = $state<{ type: 'success' | 'error'; text: string } | null>(null);
	let fields = $state<DiscoveredField[]>([]);
	let values = $state<Record<string, string>>({});
	let overrides = $state<Record<string, CmsOverride>>({});
	let dirty = $state<Set<string>>(new Set());
	let uploading = $state<Set<string>>(new Set());

	onMount(() => loadPage(activePage));

	async function discoverFields(path: string): Promise<DiscoveredField[]> {
		const res = await fetch(path);
		const html = await res.text();
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');
		const elements = doc.querySelectorAll('[data-cms]');

		const seen = new Set<string>();
		const discovered: DiscoveredField[] = [];
		elements.forEach((el) => {
			const key = el.getAttribute('data-cms');
			if (!key || seen.has(key)) return;
			seen.add(key);
			const type = ((el.getAttribute('data-cms-type') as CmsOverrideType) || 'text') as CmsOverrideType;
			let defaultValue = '';
			if (type === 'text') {
				defaultValue = el.textContent?.trim() ?? '';
			} else if (type === 'richtext') {
				defaultValue = el.innerHTML.trim();
			}
			discovered.push({ key, type, defaultValue });
		});
		return discovered;
	}

	async function loadPage(page: (typeof CMS_PAGES)[number]) {
		activePage = page;
		loading = true;
		message = null;
		dirty = new Set();

		try {
			const [discovered, existing] = await Promise.all([
				discoverFields(page.path),
				getCmsOverrides(page.id)
			]);
			fields = discovered;
			overrides = existing;

			const merged: Record<string, string> = {};
			for (const f of discovered) {
				const existingValue = existing[f.key]?.value;
				if (f.type === 'text' || f.type === 'richtext') {
					merged[f.key] = existingValue || f.defaultValue;
				} else {
					merged[f.key] = '';
				}
			}
			values = merged;
		} catch (err) {
			console.error(err);
			fields = [];
			values = {};
			overrides = {};
		} finally {
			loading = false;
		}
	}

	function markDirty(key: string) {
		const next = new Set(dirty);
		next.add(key);
		dirty = next;
	}

	async function handleSaveText() {
		saving = true;
		message = null;
		try {
			for (const f of fields) {
				if (f.type !== 'text' && f.type !== 'richtext') continue;
				if (!dirty.has(f.key)) continue;
				const val = values[f.key] ?? '';
				if (val === f.defaultValue) {
					// Value reverted to default — remove the override entry.
					await clearCmsOverride(activePage.id, f.key);
				} else {
					await saveCmsText(activePage.id, f.key, val, f.type);
				}
			}
			await refreshOverrides();
			dirty = new Set();
			message = { type: 'success', text: 'Contenu sauvegardé' };
		} catch (err) {
			message = { type: 'error', text: err instanceof Error ? err.message : 'Erreur' };
		} finally {
			saving = false;
		}
	}

	async function refreshOverrides() {
		overrides = await getCmsOverrides(activePage.id);
	}

	async function handleImageUpload(key: string, event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		uploading = new Set([...uploading, key]);
		message = null;
		try {
			await saveCmsImage(activePage.id, key, file);
			await refreshOverrides();
			message = { type: 'success', text: 'Image mise à jour' };
		} catch (err) {
			message = { type: 'error', text: err instanceof Error ? err.message : 'Erreur upload' };
		} finally {
			const next = new Set(uploading);
			next.delete(key);
			uploading = next;
			input.value = '';
		}
	}

	async function handleImageReset(key: string) {
		if (!confirm('Supprimer la personnalisation et revenir à l\'image par défaut ?')) return;
		try {
			await clearCmsOverride(activePage.id, key);
			await refreshOverrides();
			message = { type: 'success', text: 'Image réinitialisée' };
		} catch (err) {
			message = { type: 'error', text: err instanceof Error ? err.message : 'Erreur' };
		}
	}

	async function handleGalleryAdd(key: string, event: Event) {
		const input = event.target as HTMLInputElement;
		const files = Array.from(input.files ?? []);
		if (files.length === 0) return;

		uploading = new Set([...uploading, key]);
		message = null;
		try {
			await appendCmsGalleryImages(activePage.id, key, files);
			await refreshOverrides();
			message = { type: 'success', text: `${files.length} image(s) ajoutée(s)` };
		} catch (err) {
			message = { type: 'error', text: err instanceof Error ? err.message : 'Erreur upload' };
		} finally {
			const next = new Set(uploading);
			next.delete(key);
			uploading = next;
			input.value = '';
		}
	}

	async function handleGalleryRemove(key: string, filename: string) {
		if (!confirm('Retirer cette image de la galerie ?')) return;
		try {
			await removeCmsGalleryImage(activePage.id, key, filename);
			await refreshOverrides();
		} catch (err) {
			message = { type: 'error', text: err instanceof Error ? err.message : 'Erreur' };
		}
	}

	async function handleGalleryMove(key: string, filename: string, direction: -1 | 1) {
		try {
			const filenames = await getCmsGalleryFilenames(activePage.id, key);
			const idx = filenames.indexOf(filename);
			if (idx === -1) return;
			const target = idx + direction;
			if (target < 0 || target >= filenames.length) return;
			const swapped = [...filenames];
			[swapped[idx], swapped[target]] = [swapped[target], swapped[idx]];
			await reorderCmsGallery(activePage.id, key, swapped);
			await refreshOverrides();
		} catch (err) {
			message = { type: 'error', text: err instanceof Error ? err.message : 'Erreur' };
		}
	}

	function sectionFromKey(key: string): string {
		const parts = key.split('.');
		const section = parts.length >= 2 ? parts[1] : parts[0];
		return section.charAt(0).toUpperCase() + section.slice(1);
	}

	function labelFromKey(key: string): string {
		const parts = key.split('.');
		const label = parts[parts.length - 1].replace(/_/g, ' ');
		return label.charAt(0).toUpperCase() + label.slice(1);
	}

	function groupBySection(fieldsList: DiscoveredField[]): Array<[string, DiscoveredField[]]> {
		const groups = new Map<string, DiscoveredField[]>();
		for (const f of fieldsList) {
			const section = sectionFromKey(f.key);
			if (!groups.has(section)) groups.set(section, []);
			groups.get(section)!.push(f);
		}
		return Array.from(groups.entries());
	}

	function isDirty(key: string): boolean {
		return dirty.has(key);
	}

	function galleryFilenameFromUrl(url: string): string {
		try {
			const u = new URL(url);
			const parts = u.pathname.split('/');
			return parts[parts.length - 1] ?? '';
		} catch {
			const parts = url.split('/');
			return parts[parts.length - 1] ?? '';
		}
	}

	const hasTextDirty = $derived(
		fields.some((f) => (f.type === 'text' || f.type === 'richtext') && dirty.has(f.key))
	);
</script>

<div>
	<div class="flex items-center justify-between mb-6 gap-4 flex-wrap">
		<div>
			<h1 class="text-2xl font-bold text-neutral-obsidian">Contenu des pages</h1>
			<p class="text-neutral-slate text-sm mt-1">Modifier textes, images et galeries de chaque page</p>
		</div>
		<button
			onclick={handleSaveText}
			disabled={saving || !hasTextDirty}
			class="flex items-center gap-2 bg-primary-green text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-green-vibrant transition-all disabled:opacity-40 disabled:cursor-not-allowed">
			<Save class="w-4 h-4" /> {saving ? 'Sauvegarde…' : 'Sauvegarder les textes'}
		</button>
	</div>

	{#if message}
		<div
			class="px-4 py-3 rounded-xl text-sm mb-6 {message.type === 'success'
				? 'bg-green-50 border border-green-200 text-green-800'
				: 'bg-red-50 border border-red-200 text-red-700'}">
			{message.text}
		</div>
	{/if}

	<div class="flex gap-1 mb-6 bg-white rounded-xl p-1 shadow-sm w-fit flex-wrap">
		{#each CMS_PAGES as page}
			<button
				onclick={() => loadPage(page)}
				class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
				class:bg-primary-green={activePage.id === page.id}
				class:text-white={activePage.id === page.id}
				class:text-neutral-charcoal={activePage.id !== page.id}
				class:hover:bg-neutral-sand={activePage.id !== page.id}>
				{page.label}
			</button>
		{/each}
	</div>

	{#if loading}
		<div class="flex items-center justify-center py-20">
			<div
				class="animate-spin w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full">
			</div>
		</div>
	{:else if fields.length === 0}
		<div class="bg-white rounded-2xl p-8 shadow-sm text-center">
			<p class="text-neutral-slate">Aucun champ éditable trouvé sur cette page.</p>
			<p class="text-neutral-slate text-sm mt-2">
				Ajoute un composant <code class="bg-neutral-pearl px-1.5 py-0.5 rounded text-xs">CmsText</code>,
				<code class="bg-neutral-pearl px-1.5 py-0.5 rounded text-xs">CmsImage</code>,
				<code class="bg-neutral-pearl px-1.5 py-0.5 rounded text-xs">CmsRichText</code> ou
				<code class="bg-neutral-pearl px-1.5 py-0.5 rounded text-xs">CmsGallery</code> dans la page pour rendre un élément éditable.
			</p>
		</div>
	{:else}
		<div class="space-y-6">
			{#each groupBySection(fields) as [section, sectionFields]}
				<div class="bg-white rounded-2xl p-6 shadow-sm space-y-5">
					<h2 class="font-semibold text-neutral-obsidian text-lg">{section}</h2>

					{#each sectionFields as field}
						<div class="space-y-2">
							<div class="flex items-center gap-2">
								<label for={field.key} class="block text-sm font-medium text-neutral-charcoal">
									{labelFromKey(field.key)}
								</label>
								<span class="text-[10px] uppercase tracking-wider text-neutral-slate-light bg-neutral-sand px-1.5 py-0.5 rounded">
									{field.type}
								</span>
								{#if isDirty(field.key)}
									<span class="text-[10px] uppercase tracking-wider text-accent-sunset">modifié</span>
								{/if}
							</div>

							{#if field.type === 'text'}
								{#if field.defaultValue.length > 80}
									<textarea
										id={field.key}
										rows="3"
										value={values[field.key] ?? ''}
										oninput={(e) => {
											values[field.key] = e.currentTarget.value;
											markDirty(field.key);
										}}
										class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm resize-y"></textarea>
								{:else}
									<input
										id={field.key}
										type="text"
										value={values[field.key] ?? ''}
										oninput={(e) => {
											values[field.key] = e.currentTarget.value;
											markDirty(field.key);
										}}
										class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm" />
								{/if}
							{:else if field.type === 'richtext'}
								<RichTextEditor
									value={values[field.key] ?? ''}
									onChange={(html) => {
										values[field.key] = html;
										markDirty(field.key);
									}} />
							{:else if field.type === 'image'}
								{@const currentUrl = overrides[field.key]?.imageUrl}
								<div class="flex items-start gap-4">
									<div class="w-32 h-32 rounded-xl bg-neutral-sand border border-neutral-light flex items-center justify-center overflow-hidden shrink-0">
										{#if currentUrl}
											<img src={currentUrl} alt="" class="w-full h-full object-cover" />
										{:else}
											<ImageIcon class="w-10 h-10 text-neutral-slate-light" />
										{/if}
									</div>
									<div class="space-y-2 flex-1">
										<label
											class="inline-flex items-center gap-2 bg-primary-green text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-primary-green-vibrant transition cursor-pointer">
											{#if uploading.has(field.key)}
												<Loader2 class="w-4 h-4 animate-spin" /> Upload…
											{:else}
												<Upload class="w-4 h-4" />
												{currentUrl ? 'Remplacer' : 'Téléverser une image'}
											{/if}
											<input
												type="file"
												accept="image/*"
												class="hidden"
												onchange={(e) => handleImageUpload(field.key, e)} />
										</label>
										{#if currentUrl}
											<button
												type="button"
												onclick={() => handleImageReset(field.key)}
												class="inline-flex items-center gap-2 text-sm text-neutral-slate hover:text-accent-sunset transition ml-2">
												<RotateCcw class="w-4 h-4" /> Réinitialiser
											</button>
										{/if}
										<p class="text-xs text-neutral-slate-light">Formats : JPG, PNG, WebP. Max ~5 Mo.</p>
									</div>
								</div>
							{:else if field.type === 'gallery'}
								{@const entry = overrides[field.key]}
								{@const urls = entry?.galleryUrls ?? []}
								<div class="space-y-3">
									{#if urls.length > 0}
										<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
											{#each urls as url, i}
												<div class="relative group rounded-xl overflow-hidden border border-neutral-light bg-neutral-sand">
													<img src={url} alt="" class="w-full h-32 object-cover" />
													<div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1">
														<button
															type="button"
															disabled={i === 0}
															onclick={() => handleGalleryMove(field.key, galleryFilenameFromUrl(url), -1)}
															class="p-2 bg-white rounded-lg hover:bg-neutral-sand disabled:opacity-40 disabled:cursor-not-allowed"
															aria-label="Déplacer avant">
															<ArrowUp class="w-4 h-4" />
														</button>
														<button
															type="button"
															disabled={i === urls.length - 1}
															onclick={() => handleGalleryMove(field.key, galleryFilenameFromUrl(url), 1)}
															class="p-2 bg-white rounded-lg hover:bg-neutral-sand disabled:opacity-40 disabled:cursor-not-allowed"
															aria-label="Déplacer après">
															<ArrowDown class="w-4 h-4" />
														</button>
														<button
															type="button"
															onclick={() => handleGalleryRemove(field.key, galleryFilenameFromUrl(url))}
															class="p-2 bg-accent-sunset text-white rounded-lg hover:bg-accent-terracotta"
															aria-label="Supprimer">
															<Trash2 class="w-4 h-4" />
														</button>
													</div>
													<div class="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
														{i + 1}
													</div>
												</div>
											{/each}
										</div>
									{:else}
										<p class="text-sm text-neutral-slate italic">Aucune image personnalisée. Les images par défaut de la page s'affichent.</p>
									{/if}

									<label
										class="inline-flex items-center gap-2 bg-primary-green text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-primary-green-vibrant transition cursor-pointer w-fit">
										{#if uploading.has(field.key)}
											<Loader2 class="w-4 h-4 animate-spin" /> Upload…
										{:else}
											<Upload class="w-4 h-4" /> Ajouter des images
										{/if}
										<input
											type="file"
											accept="image/*"
											multiple
											class="hidden"
											onchange={(e) => handleGalleryAdd(field.key, e)} />
									</label>

									{#if urls.length > 0}
										<button
											type="button"
											onclick={() => handleImageReset(field.key)}
											class="inline-flex items-center gap-2 text-sm text-neutral-slate hover:text-accent-sunset transition ml-3">
											<RotateCcw class="w-4 h-4" /> Revenir aux images par défaut
										</button>
									{/if}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	{/if}
</div>

