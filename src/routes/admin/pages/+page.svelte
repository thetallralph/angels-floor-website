<script lang="ts">
	import { onMount } from 'svelte';
	import { getContent, saveContent, publishContent, uploadFile } from '$lib/admin/api';
	import { Save, Send, Upload, X, Plus } from 'lucide-svelte';

	const pagesList = [
		{ id: 'home', label: "Page d'accueil" },
		{ id: 'about', label: 'À propos' },
		{ id: 'impact', label: 'Impact' }
	];

	let activePage = $state('home');
	let loading = $state(true);
	let saving = $state(false);
	let message = $state<{ type: 'success' | 'error'; text: string } | null>(null);

	// --- Home page fields ---
	let heroTitle = $state('');
	let heroSubtitle = $state('');
	let heroCtaText = $state('');
	let heroImage = $state('');
	let stats = $state<Array<{ number: string; label: string; icon: string }>>([]);

	// --- About page fields ---
	let aboutTitle = $state('');
	let aboutIntro = $state('');
	let storyTitle = $state('');
	let storyContent = $state('');
	let storyImage = $state('');
	let values = $state<Array<{ title: string; description: string; icon: string }>>([]);

	// --- Impact page fields ---
	let impactTitle = $state('');
	let impactIntro = $state('');
	let impacts = $state<Array<{ title: string; description: string; stat: string; image: string }>>([]);

	onMount(() => loadPage('home'));

	async function loadPage(pageId: string) {
		activePage = pageId;
		loading = true;
		message = null;

		try {
			let content: Record<string, unknown>;
			try {
				content = await getContent('pages', pageId, 'draft');
			} catch {
				content = await getContent('pages', pageId, 'live');
			}

			if (pageId === 'home') {
				const hero = (content.hero ?? {}) as Record<string, string>;
				heroTitle = hero.title ?? '';
				heroSubtitle = hero.subtitle ?? '';
				heroCtaText = hero.ctaText ?? '';
				heroImage = hero.image ?? '';
				stats = (content.stats as typeof stats) ?? [];
			} else if (pageId === 'about') {
				aboutTitle = (content.title as string) ?? '';
				aboutIntro = (content.intro as string) ?? '';
				const story = (content.story ?? {}) as Record<string, string>;
				storyTitle = story.title ?? '';
				storyContent = story.content ?? '';
				storyImage = story.image ?? '';
				values = (content.values as typeof values) ?? [];
			} else if (pageId === 'impact') {
				impactTitle = (content.title as string) ?? '';
				impactIntro = (content.intro as string) ?? '';
				impacts = (content.impacts as typeof impacts) ?? [];
			}
		} catch {
			// Garder les valeurs par défaut
		} finally {
			loading = false;
		}
	}

	function buildPageData(): Record<string, unknown> {
		if (activePage === 'home') {
			return {
				hero: { title: heroTitle, subtitle: heroSubtitle, ctaText: heroCtaText, image: heroImage },
				stats
			};
		} else if (activePage === 'about') {
			return {
				title: aboutTitle,
				intro: aboutIntro,
				story: { title: storyTitle, content: storyContent, image: storyImage },
				values
			};
		} else {
			return { title: impactTitle, intro: impactIntro, impacts };
		}
	}

	async function handleSave() {
		saving = true;
		message = null;
		try {
			await saveContent('pages', activePage, buildPageData());
			message = { type: 'success', text: 'Brouillon sauvegardé' };
		} catch (err) {
			message = { type: 'error', text: err instanceof Error ? err.message : 'Erreur' };
		} finally {
			saving = false;
		}
	}

	async function handlePublish() {
		await handleSave();
		if (message?.type === 'error') return;
		try {
			await publishContent('pages', activePage);
			message = { type: 'success', text: 'Page publiée !' };
		} catch (err) {
			message = { type: 'error', text: err instanceof Error ? err.message : 'Erreur' };
		}
	}

	async function handleImageUpload(e: Event, callback: (url: string) => void) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		try {
			const result = await uploadFile(file);
			callback(result.url);
		} catch (err) {
			message = { type: 'error', text: err instanceof Error ? err.message : 'Erreur upload' };
		}
		input.value = '';
	}

	function addStat() {
		stats = [...stats, { number: '', label: '', icon: 'Star' }];
	}
	function removeStat(i: number) {
		stats = stats.filter((_, idx) => idx !== i);
	}
	function addValue() {
		values = [...values, { title: '', description: '', icon: 'Star' }];
	}
	function removeValue(i: number) {
		values = values.filter((_, idx) => idx !== i);
	}
	function addImpact() {
		impacts = [...impacts, { title: '', description: '', stat: '', image: '' }];
	}
	function removeImpact(i: number) {
		impacts = impacts.filter((_, idx) => idx !== i);
	}
</script>

<div>
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-2xl font-bold text-neutral-obsidian">Pages</h1>
			<p class="text-neutral-slate text-sm mt-1">Modifier le contenu des pages du site</p>
		</div>
		<div class="flex items-center gap-2">
			<button onclick={handleSave} disabled={saving}
				class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary-green text-primary-green text-sm font-medium hover:bg-primary-green/5 transition-all disabled:opacity-50">
				<Save class="w-4 h-4" /> Sauvegarder
			</button>
			<button onclick={handlePublish} disabled={saving}
				class="flex items-center gap-2 bg-primary-green text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-green-vibrant transition-all disabled:opacity-50">
				<Send class="w-4 h-4" /> Publier
			</button>
		</div>
	</div>

	{#if message}
		<div class="px-4 py-3 rounded-xl text-sm mb-6 {message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-700'}">
			{message.text}
		</div>
	{/if}

	<!-- Tabs -->
	<div class="flex gap-1 mb-6 bg-white rounded-xl p-1 shadow-sm w-fit">
		{#each pagesList as p}
			<button onclick={() => loadPage(p.id)}
				class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
				class:bg-primary-green={activePage === p.id}
				class:text-white={activePage === p.id}
				class:text-neutral-charcoal={activePage !== p.id}
				class:hover:bg-neutral-sand={activePage !== p.id}>
				{p.label}
			</button>
		{/each}
	</div>

	{#if loading}
		<div class="flex items-center justify-center py-20">
			<div class="animate-spin w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full"></div>
		</div>

	<!-- HOME -->
	{:else if activePage === 'home'}
		<div class="space-y-6">
			<div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
				<h2 class="font-semibold text-neutral-obsidian">Section Héro</h2>
				<div>
					<label for="heroTitle" class="block text-sm font-medium text-neutral-charcoal mb-1">Titre</label>
					<input id="heroTitle" type="text" bind:value={heroTitle} class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm" />
				</div>
				<div>
					<label for="heroSubtitle" class="block text-sm font-medium text-neutral-charcoal mb-1">Sous-titre</label>
					<textarea id="heroSubtitle" bind:value={heroSubtitle} rows="3" class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm resize-y"></textarea>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label for="heroCta" class="block text-sm font-medium text-neutral-charcoal mb-1">Texte du bouton</label>
						<input id="heroCta" type="text" bind:value={heroCtaText} class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm" />
					</div>
					<div>
						<label for="heroImg" class="block text-sm font-medium text-neutral-charcoal mb-1">Image</label>
						<div class="flex gap-2">
							<input id="heroImg" type="text" bind:value={heroImage} class="flex-1 px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm" placeholder="/uploads/hero.jpg" />
							<label class="px-3 py-2.5 bg-neutral-sand rounded-xl cursor-pointer hover:bg-neutral-light transition-all">
								<Upload class="w-4 h-4 text-neutral-slate" />
								<input type="file" accept="image/*" class="hidden" onchange={(e) => handleImageUpload(e, (url) => heroImage = url)} />
							</label>
						</div>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
				<div class="flex items-center justify-between">
					<h2 class="font-semibold text-neutral-obsidian">Statistiques</h2>
					<button onclick={addStat} class="p-2 bg-primary-green text-white rounded-xl hover:bg-primary-green-vibrant transition-all"><Plus class="w-4 h-4" /></button>
				</div>
				{#each stats as stat, i}
					<div class="flex gap-3 items-start bg-neutral-pearl rounded-xl p-4">
						<div class="flex-1 grid grid-cols-3 gap-3">
							<input type="text" bind:value={stat.number} placeholder="500+" class="px-3 py-2 rounded-lg border border-neutral-light focus:border-primary-green outline-none text-sm" />
							<input type="text" bind:value={stat.label} placeholder="Label" class="px-3 py-2 rounded-lg border border-neutral-light focus:border-primary-green outline-none text-sm" />
							<input type="text" bind:value={stat.icon} placeholder="Icône" class="px-3 py-2 rounded-lg border border-neutral-light focus:border-primary-green outline-none text-sm" />
						</div>
						<button onclick={() => removeStat(i)} class="p-2 text-red-400 hover:text-red-600 transition-colors"><X class="w-4 h-4" /></button>
					</div>
				{/each}
			</div>
		</div>

	<!-- ABOUT -->
	{:else if activePage === 'about'}
		<div class="space-y-6">
			<div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
				<h2 class="font-semibold text-neutral-obsidian">Introduction</h2>
				<input type="text" bind:value={aboutTitle} placeholder="Titre" class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm" />
				<textarea bind:value={aboutIntro} rows="4" placeholder="Texte d'introduction..." class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm resize-y"></textarea>
			</div>

			<div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
				<h2 class="font-semibold text-neutral-obsidian">Notre Histoire</h2>
				<input type="text" bind:value={storyTitle} placeholder="Titre" class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm" />
				<textarea bind:value={storyContent} rows="6" placeholder="Contenu..." class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm resize-y"></textarea>
				<div class="flex gap-2">
					<input type="text" bind:value={storyImage} placeholder="/uploads/story.jpg" class="flex-1 px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm" />
					<label class="px-3 py-2.5 bg-neutral-sand rounded-xl cursor-pointer hover:bg-neutral-light transition-all">
						<Upload class="w-4 h-4 text-neutral-slate" />
						<input type="file" accept="image/*" class="hidden" onchange={(e) => handleImageUpload(e, (url) => storyImage = url)} />
					</label>
				</div>
			</div>

			<div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
				<div class="flex items-center justify-between">
					<h2 class="font-semibold text-neutral-obsidian">Valeurs</h2>
					<button onclick={addValue} class="p-2 bg-primary-green text-white rounded-xl hover:bg-primary-green-vibrant transition-all"><Plus class="w-4 h-4" /></button>
				</div>
				{#each values as val, i}
					<div class="flex gap-3 items-start bg-neutral-pearl rounded-xl p-4">
						<div class="flex-1 space-y-2">
							<div class="grid grid-cols-2 gap-3">
								<input type="text" bind:value={val.title} placeholder="Titre" class="px-3 py-2 rounded-lg border border-neutral-light focus:border-primary-green outline-none text-sm" />
								<input type="text" bind:value={val.icon} placeholder="Icône Lucide" class="px-3 py-2 rounded-lg border border-neutral-light focus:border-primary-green outline-none text-sm" />
							</div>
							<textarea bind:value={val.description} placeholder="Description" rows="2" class="w-full px-3 py-2 rounded-lg border border-neutral-light focus:border-primary-green outline-none text-sm resize-y"></textarea>
						</div>
						<button onclick={() => removeValue(i)} class="p-2 text-red-400 hover:text-red-600 transition-colors"><X class="w-4 h-4" /></button>
					</div>
				{/each}
			</div>
		</div>

	<!-- IMPACT -->
	{:else if activePage === 'impact'}
		<div class="space-y-6">
			<div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
				<h2 class="font-semibold text-neutral-obsidian">Introduction</h2>
				<input type="text" bind:value={impactTitle} placeholder="Titre" class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm" />
				<textarea bind:value={impactIntro} rows="4" placeholder="Texte d'introduction..." class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm resize-y"></textarea>
			</div>

			<div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
				<div class="flex items-center justify-between">
					<h2 class="font-semibold text-neutral-obsidian">Impacts</h2>
					<button onclick={addImpact} class="p-2 bg-primary-green text-white rounded-xl hover:bg-primary-green-vibrant transition-all"><Plus class="w-4 h-4" /></button>
				</div>
				{#each impacts as impact, i}
					<div class="flex gap-3 items-start bg-neutral-pearl rounded-xl p-4">
						<div class="flex-1 space-y-2">
							<div class="grid grid-cols-2 gap-3">
								<input type="text" bind:value={impact.title} placeholder="Titre" class="px-3 py-2 rounded-lg border border-neutral-light focus:border-primary-green outline-none text-sm" />
								<input type="text" bind:value={impact.stat} placeholder="Statistique (ex: 500+)" class="px-3 py-2 rounded-lg border border-neutral-light focus:border-primary-green outline-none text-sm" />
							</div>
							<textarea bind:value={impact.description} placeholder="Description" rows="2" class="w-full px-3 py-2 rounded-lg border border-neutral-light focus:border-primary-green outline-none text-sm resize-y"></textarea>
							<div class="flex gap-2">
								<input type="text" bind:value={impact.image} placeholder="/uploads/impact.jpg" class="flex-1 px-3 py-2 rounded-lg border border-neutral-light focus:border-primary-green outline-none text-sm" />
								<label class="px-3 py-2 bg-neutral-sand rounded-lg cursor-pointer hover:bg-neutral-light transition-all">
									<Upload class="w-4 h-4 text-neutral-slate" />
									<input type="file" accept="image/*" class="hidden" onchange={(e) => handleImageUpload(e, (url) => impact.image = url)} />
								</label>
							</div>
						</div>
						<button onclick={() => removeImpact(i)} class="p-2 text-red-400 hover:text-red-600 transition-colors"><X class="w-4 h-4" /></button>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
