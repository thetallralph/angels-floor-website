<script lang="ts">
	import { onMount } from 'svelte';
	import {
		getContentList,
		deleteContent,
		publishContent,
		saveContent
	} from '$lib/admin/api';
	import { BLOG_CATEGORIES } from '$lib/admin/types';
	import {
		Plus,
		Pencil,
		Trash2,
		Send,
		Search,
		FileText,
		X,
		Save
	} from 'lucide-svelte';

	type BlogItem = Record<string, unknown>;

	let articles = $state<BlogItem[]>([]);
	let loading = $state(true);
	let search = $state('');
	let editing = $state<Partial<BlogItem> | null>(null);
	let saving = $state(false);
	let message = $state<{ type: 'success' | 'error'; text: string } | null>(null);

	const filteredArticles = $derived(
		articles.filter(
			(a) =>
				!search ||
				String(a.title || '')
					.toLowerCase()
					.includes(search.toLowerCase())
		)
	);

	onMount(loadArticles);

	async function loadArticles() {
		loading = true;
		try {
			articles = await getContentList('blog');
		} catch {
			articles = [];
		} finally {
			loading = false;
		}
	}

	function newArticle() {
		editing = {
			id: '',
			title: '',
			excerpt: '',
			content: '',
			image: '',
			category: 'Recettes',
			date: new Date().toISOString().split('T')[0],
			author: "Équipe Angel's Floor",
			readTime: 5,
			tags: []
		};
	}

	function editArticle(article: BlogItem) {
		editing = { ...article };
	}

	function generateSlug(title: string): string {
		return title
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');
	}

	async function handleSave() {
		if (!editing || !editing.title) return;
		saving = true;

		try {
			const slug = generateSlug(String(editing.title));
			editing.id = editing.id || slug;
			const { _id, _hasDraft, _isPublished, _status, ...data } = editing;
			await saveContent('blog', slug, data);
			message = { type: 'success', text: 'Article sauvegardé' };
			editing = null;
			await loadArticles();
		} catch (err) {
			message = { type: 'error', text: err instanceof Error ? err.message : 'Erreur' };
		} finally {
			saving = false;
		}
	}

	async function handlePublish(id: string) {
		try {
			await publishContent('blog', id);
			await loadArticles();
		} catch {}
	}

	async function handleDelete(id: string, title: string) {
		if (!confirm(`Supprimer "${title}" ?`)) return;
		try {
			await deleteContent('blog', id);
			await loadArticles();
		} catch {}
	}
</script>

<div>
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-2xl font-bold text-neutral-obsidian">Blog</h1>
			<p class="text-neutral-slate text-sm mt-1">{articles.length} article(s)</p>
		</div>
		<button
			onclick={newArticle}
			class="flex items-center gap-2 bg-primary-green text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-green-vibrant transition-all duration-200"
		>
			<Plus class="w-4 h-4" />
			Nouvel article
		</button>
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

	<!-- Éditeur inline -->
	{#if editing}
		<div class="bg-white rounded-2xl p-6 shadow-sm mb-6 space-y-4">
			<div class="flex items-center justify-between">
				<h2 class="font-semibold text-neutral-obsidian">
					{editing._id ? 'Modifier l\'article' : 'Nouvel article'}
				</h2>
				<button onclick={() => (editing = null)} class="text-neutral-slate hover:text-neutral-obsidian">
					<X class="w-5 h-5" />
				</button>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label for="title" class="block text-sm font-medium text-neutral-charcoal mb-1">Titre</label>
					<input id="title" type="text" bind:value={editing.title} class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm" />
				</div>
				<div>
					<label for="category" class="block text-sm font-medium text-neutral-charcoal mb-1">Catégorie</label>
					<select id="category" bind:value={editing.category} class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm bg-white">
						{#each BLOG_CATEGORIES as cat}
							<option value={cat.value}>{cat.label}</option>
						{/each}
					</select>
				</div>
			</div>

			<div>
				<label for="excerpt" class="block text-sm font-medium text-neutral-charcoal mb-1">Résumé</label>
				<textarea id="excerpt" bind:value={editing.excerpt} rows="2" class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm resize-y"></textarea>
			</div>

			<div>
				<label for="content" class="block text-sm font-medium text-neutral-charcoal mb-1">Contenu (Markdown)</label>
				<textarea id="content" bind:value={editing.content} rows="10" class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm resize-y font-mono"></textarea>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div>
					<label for="date" class="block text-sm font-medium text-neutral-charcoal mb-1">Date</label>
					<input id="date" type="date" bind:value={editing.date} class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm" />
				</div>
				<div>
					<label for="author" class="block text-sm font-medium text-neutral-charcoal mb-1">Auteur</label>
					<input id="author" type="text" bind:value={editing.author} class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm" />
				</div>
				<div>
					<label for="readTime" class="block text-sm font-medium text-neutral-charcoal mb-1">Temps de lecture (min)</label>
					<input id="readTime" type="number" bind:value={editing.readTime} min="1" class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm" />
				</div>
			</div>

			<div class="flex items-center gap-2 pt-2">
				<button
					onclick={handleSave}
					disabled={saving}
					class="flex items-center gap-2 bg-primary-green text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-green-vibrant transition-all disabled:opacity-50"
				>
					<Save class="w-4 h-4" />
					{saving ? 'Sauvegarde...' : 'Sauvegarder'}
				</button>
				<button onclick={() => (editing = null)} class="px-4 py-2.5 rounded-xl text-sm text-neutral-slate hover:bg-neutral-sand transition-all">
					Annuler
				</button>
			</div>
		</div>
	{/if}

	<!-- Search -->
	<div class="relative mb-6">
		<Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-slate" />
		<input
			type="text"
			bind:value={search}
			placeholder="Rechercher un article..."
			class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
		/>
	</div>

	<!-- Articles -->
	{#if loading}
		<div class="flex items-center justify-center py-20">
			<div class="animate-spin w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full"></div>
		</div>
	{:else if filteredArticles.length === 0}
		<div class="text-center py-20 bg-white rounded-2xl">
			<FileText class="w-12 h-12 text-neutral-light mx-auto mb-3" />
			<p class="text-neutral-slate">Aucun article</p>
		</div>
	{:else}
		<div class="space-y-3">
			{#each filteredArticles as article}
				{@const aid = String(article._id || '')}
				<div class="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4">
					<div class="flex-1 min-w-0">
						<p class="font-medium text-neutral-obsidian text-sm truncate">{article.title}</p>
						<p class="text-xs text-neutral-slate mt-0.5">
							{article.category} · {article.date} · {article.readTime} min
						</p>
					</div>
					<div class="flex items-center gap-1">
						<button onclick={() => editArticle(article)} class="p-2 rounded-lg text-neutral-slate hover:bg-neutral-sand hover:text-primary-green transition-all">
							<Pencil class="w-4 h-4" />
						</button>
						<button onclick={() => handlePublish(aid)} class="p-2 rounded-lg text-neutral-slate hover:bg-green-50 hover:text-green-600 transition-all">
							<Send class="w-4 h-4" />
						</button>
						<button onclick={() => handleDelete(aid, String(article.title || ''))} class="p-2 rounded-lg text-neutral-slate hover:bg-red-50 hover:text-red-600 transition-all">
							<Trash2 class="w-4 h-4" />
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
