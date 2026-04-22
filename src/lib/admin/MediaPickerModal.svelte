<script lang="ts">
	import { listFiles } from './api';
	import { X, Check, Image as ImageIcon } from 'lucide-svelte';

	type MediaFile = { filename: string; url: string; size: number; modified: string };

	let {
		open = $bindable(false),
		maxSelect = Infinity,
		onConfirm
	}: {
		open?: boolean;
		maxSelect?: number;
		onConfirm: (_files: File[]) => void;
	} = $props();

	let files = $state<MediaFile[]>([]);
	let loading = $state(false);
	let selected = $state<Set<string>>(new Set());
	let fetching = $state(false);
	let error = $state('');

	$effect(() => {
		if (open) {
			selected = new Set();
			error = '';
			loadFiles();
		}
	});

	async function loadFiles() {
		loading = true;
		try {
			files = await listFiles();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Erreur chargement';
			files = [];
		} finally {
			loading = false;
		}
	}

	function toggle(url: string) {
		const next = new Set(selected);
		if (next.has(url)) {
			next.delete(url);
		} else {
			if (next.size >= maxSelect) return;
			next.add(url);
		}
		selected = next;
	}

	async function confirm() {
		if (selected.size === 0) return;
		fetching = true;
		error = '';
		try {
			const picked = files.filter((f) => selected.has(f.url));
			const result: File[] = [];
			for (const f of picked) {
				const res = await fetch(f.url);
				if (!res.ok) throw new Error(`Échec ${f.filename} (${res.status})`);
				const blob = await res.blob();
				result.push(new File([blob], f.filename, { type: blob.type || 'image/*' }));
			}
			onConfirm(result);
			open = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Erreur';
		} finally {
			fetching = false;
		}
	}

	function cancel() {
		open = false;
	}
</script>

{#if open}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
			<div class="flex items-center justify-between p-5 border-b border-neutral-light">
				<div>
					<h2 class="font-semibold text-neutral-obsidian">Choisir depuis la galerie</h2>
					<p class="text-xs text-neutral-slate mt-0.5">
						{selected.size} sélectionnée(s){maxSelect !== Infinity ? ` / max ${maxSelect}` : ''}
					</p>
				</div>
				<button
					onclick={cancel}
					class="p-2 rounded-lg text-neutral-slate hover:bg-neutral-pearl transition-colors"
					aria-label="Fermer"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<div class="flex-1 overflow-y-auto p-5">
				{#if loading}
					<div class="flex items-center justify-center py-20">
						<div class="animate-spin w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full"></div>
					</div>
				{:else if files.length === 0}
					<div class="text-center py-16">
						<ImageIcon class="w-12 h-12 text-neutral-light mx-auto mb-3" />
						<p class="text-neutral-slate text-sm">Aucun média disponible.</p>
						<a href="/admin/medias" class="inline-block mt-2 text-primary-green text-sm font-medium hover:underline">
							Uploader dans la bibliothèque →
						</a>
					</div>
				{:else}
					<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
						{#each files as file (file.url)}
							{@const isSelected = selected.has(file.url)}
							<button
								type="button"
								onclick={() => toggle(file.url)}
								class="relative aspect-square rounded-xl overflow-hidden bg-neutral-sand border-2 transition-all group {isSelected
									? 'border-primary-green ring-2 ring-primary-green/30'
									: 'border-transparent hover:border-primary-green/40'}"
								title={file.filename}
							>
								<img src={file.url} alt={file.filename} class="w-full h-full object-cover" />
								{#if isSelected}
									<div class="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-primary-green text-white flex items-center justify-center shadow">
										<Check class="w-4 h-4" />
									</div>
								{/if}
								<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1">
									<p class="text-[10px] text-white truncate">{file.filename}</p>
								</div>
							</button>
						{/each}
					</div>
				{/if}
			</div>

			{#if error}
				<div class="px-5 pb-2 text-xs text-red-600">{error}</div>
			{/if}

			<div class="flex items-center justify-end gap-2 p-5 border-t border-neutral-light">
				<button
					onclick={cancel}
					class="px-4 py-2.5 rounded-xl border border-neutral-light text-neutral-charcoal text-sm font-medium hover:bg-neutral-pearl transition-all"
				>
					Annuler
				</button>
				<button
					onclick={confirm}
					disabled={selected.size === 0 || fetching}
					class="flex items-center gap-2 bg-primary-green text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-green-vibrant transition-all disabled:opacity-50"
				>
					{fetching ? 'Chargement…' : `Ajouter ${selected.size || ''}`.trim()}
				</button>
			</div>
		</div>
	</div>
{/if}
