<script lang="ts">
	import { onMount } from 'svelte';
	import { listFiles, uploadFile, deleteFile } from '$lib/admin/api';
	import { Upload, Trash2, Copy, Image, Check } from 'lucide-svelte';

	type MediaFile = { filename: string; url: string; size: number; modified: string };

	let files = $state<MediaFile[]>([]);
	let loading = $state(true);
	let uploading = $state(false);
	let copied = $state('');
	let message = $state<{ type: 'success' | 'error'; text: string } | null>(null);

	onMount(loadFiles);

	async function loadFiles() {
		loading = true;
		try {
			files = await listFiles();
		} catch {
			files = [];
		} finally {
			loading = false;
		}
	}

	async function handleUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		const fileList = input.files;
		if (!fileList?.length) return;

		uploading = true;
		try {
			for (const file of fileList) {
				await uploadFile(file);
			}
			message = { type: 'success', text: `${fileList.length} fichier(s) uploadé(s)` };
			await loadFiles();
		} catch (err) {
			message = { type: 'error', text: err instanceof Error ? err.message : 'Erreur upload' };
		} finally {
			uploading = false;
			input.value = '';
		}
	}

	async function handleDelete(filename: string) {
		if (!confirm(`Supprimer "${filename}" ?`)) return;
		try {
			await deleteFile(filename);
			await loadFiles();
		} catch {}
	}

	function copyUrl(url: string) {
		navigator.clipboard.writeText(url);
		copied = url;
		setTimeout(() => (copied = ''), 2000);
	}

	function formatSize(bytes: number): string {
		if (bytes < 1024) return bytes + ' B';
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
	}
</script>

<div>
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-2xl font-bold text-neutral-obsidian">Médias</h1>
			<p class="text-neutral-slate text-sm mt-1">{files.length} fichier(s)</p>
		</div>
		<label class="flex items-center gap-2 bg-primary-green text-white px-4 py-2.5 rounded-xl font-medium text-sm cursor-pointer hover:bg-primary-green-vibrant transition-all duration-200">
			<Upload class="w-4 h-4" />
			{uploading ? 'Upload...' : 'Uploader'}
			<input type="file" accept="image/*" multiple onchange={handleUpload} class="hidden" />
		</label>
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
	{:else if files.length === 0}
		<div class="text-center py-20 bg-white rounded-2xl">
			<Image class="w-12 h-12 text-neutral-light mx-auto mb-3" />
			<p class="text-neutral-slate">Aucun média uploadé</p>
		</div>
	{:else}
		<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
			{#each files as file}
				<div class="bg-white rounded-2xl overflow-hidden shadow-sm group">
					<div class="aspect-square bg-neutral-sand relative">
						<img
							src={file.url}
							alt={file.filename}
							class="w-full h-full object-cover"
						/>
						<div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
							<button
								onclick={() => copyUrl(file.url)}
								class="p-2 bg-white rounded-lg text-neutral-obsidian hover:bg-neutral-sand transition-all"
								title="Copier l'URL"
							>
								{#if copied === file.url}
									<Check class="w-4 h-4 text-green-600" />
								{:else}
									<Copy class="w-4 h-4" />
								{/if}
							</button>
							<button
								onclick={() => handleDelete(file.filename)}
								class="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50 transition-all"
								title="Supprimer"
							>
								<Trash2 class="w-4 h-4" />
							</button>
						</div>
					</div>
					<div class="p-3">
						<p class="text-xs text-neutral-charcoal truncate font-medium">{file.filename}</p>
						<p class="text-xs text-neutral-slate">{formatSize(file.size)}</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
