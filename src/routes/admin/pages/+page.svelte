<script lang="ts">
	import { onMount } from 'svelte';
	import { getContent, saveContent, publishContent } from '$lib/admin/api';
	import { Save, Send, Layers } from 'lucide-svelte';

	const pagesList = [
		{ id: 'home', label: "Page d'accueil" },
		{ id: 'about', label: 'À propos' },
		{ id: 'impact', label: 'Impact' }
	];

	let activePage = $state('home');
	let content = $state<Record<string, unknown>>({});
	let contentJson = $state('');
	let loading = $state(true);
	let saving = $state(false);
	let message = $state<{ type: 'success' | 'error'; text: string } | null>(null);

	onMount(() => loadPage('home'));

	async function loadPage(pageId: string) {
		activePage = pageId;
		loading = true;
		message = null;

		try {
			// Essayer le draft d'abord, sinon le live
			try {
				content = await getContent('pages', pageId, 'draft');
			} catch {
				content = await getContent('pages', pageId, 'live');
			}
			const { _id, _hasDraft, _isPublished, _status, ...clean } = content;
			contentJson = JSON.stringify(clean, null, 2);
		} catch {
			content = {};
			contentJson = '{}';
		} finally {
			loading = false;
		}
	}

	async function handleSave() {
		saving = true;
		message = null;

		try {
			const data = JSON.parse(contentJson);
			await saveContent('pages', activePage, data);
			message = { type: 'success', text: 'Brouillon sauvegardé' };
		} catch (err) {
			message = {
				type: 'error',
				text: err instanceof SyntaxError ? 'JSON invalide' : (err instanceof Error ? err.message : 'Erreur')
			};
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
</script>

<div>
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-2xl font-bold text-neutral-obsidian">Pages</h1>
			<p class="text-neutral-slate text-sm mt-1">Modifier le contenu des pages du site</p>
		</div>
		<div class="flex items-center gap-2">
			<button
				onclick={handleSave}
				disabled={saving}
				class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary-green text-primary-green text-sm font-medium hover:bg-primary-green/5 transition-all disabled:opacity-50"
			>
				<Save class="w-4 h-4" />
				Sauvegarder
			</button>
			<button
				onclick={handlePublish}
				disabled={saving}
				class="flex items-center gap-2 bg-primary-green text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-green-vibrant transition-all disabled:opacity-50"
			>
				<Send class="w-4 h-4" />
				Publier
			</button>
		</div>
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

	<!-- Tabs -->
	<div class="flex gap-1 mb-6 bg-white rounded-xl p-1 shadow-sm w-fit">
		{#each pagesList as p}
			<button
				onclick={() => loadPage(p.id)}
				class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
				class:bg-primary-green={activePage === p.id}
				class:text-white={activePage === p.id}
				class:text-neutral-charcoal={activePage !== p.id}
				class:hover:bg-neutral-sand={activePage !== p.id}
			>
				{p.label}
			</button>
		{/each}
	</div>

	{#if loading}
		<div class="flex items-center justify-center py-20">
			<div class="animate-spin w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full"></div>
		</div>
	{:else}
		<div class="bg-white rounded-2xl p-6 shadow-sm">
			<div class="flex items-center gap-2 mb-4">
				<Layers class="w-4 h-4 text-neutral-slate" />
				<span class="text-sm font-medium text-neutral-charcoal">
					Contenu JSON — {pagesList.find(p => p.id === activePage)?.label}
				</span>
			</div>
			<textarea
				bind:value={contentJson}
				rows="25"
				class="w-full px-4 py-3 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm font-mono resize-y bg-neutral-pearl"
				spellcheck="false"
			></textarea>
			<p class="text-xs text-neutral-slate mt-2">
				Modifiez le JSON directement. Les champs correspondent à la structure des pages du site.
			</p>
		</div>
	{/if}
</div>
