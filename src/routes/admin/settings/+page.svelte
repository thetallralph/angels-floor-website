<script lang="ts">
	import { onMount } from 'svelte';
	import { getContent, saveContent, publishContent } from '$lib/admin/api';
	import type { SiteSettings } from '$lib/admin/types';
	import { Save, Send, Settings } from 'lucide-svelte';

	let settings = $state<Partial<SiteSettings>>({
		siteName: '',
		description: '',
		email: '',
		phone: '',
		address: '',
		social: {
			facebook: '',
			instagram: '',
			twitter: '',
			linkedin: '',
			youtube: ''
		}
	});

	let loading = $state(true);
	let saving = $state(false);
	let message = $state<{ type: 'success' | 'error'; text: string } | null>(null);

	onMount(async () => {
		try {
			try {
				const data = await getContent('settings', 'general', 'draft');
				settings = data as unknown as SiteSettings;
			} catch {
				const data = await getContent('settings', 'general', 'live');
				settings = data as unknown as SiteSettings;
			}
		} catch {
			// Garder les valeurs par défaut
		} finally {
			loading = false;
		}
	});

	async function handleSave() {
		saving = true;
		message = null;

		try {
			const { _id, _hasDraft, _isPublished, _status, ...data } = settings as Record<string, unknown>;
			await saveContent('settings', 'general', data);
			message = { type: 'success', text: 'Paramètres sauvegardés' };
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
			await publishContent('settings', 'general');
			message = { type: 'success', text: 'Paramètres publiés !' };
		} catch (err) {
			message = { type: 'error', text: err instanceof Error ? err.message : 'Erreur' };
		}
	}
</script>

<div>
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-2xl font-bold text-neutral-obsidian">Paramètres</h1>
			<p class="text-neutral-slate text-sm mt-1">Configuration générale du site</p>
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

	{#if loading}
		<div class="flex items-center justify-center py-20">
			<div class="animate-spin w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full"></div>
		</div>
	{:else}
		<div class="space-y-6">
			<!-- Infos générales -->
			<div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
				<div class="flex items-center gap-2 mb-2">
					<Settings class="w-4 h-4 text-neutral-slate" />
					<h2 class="font-semibold text-neutral-obsidian">Informations générales</h2>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label for="siteName" class="block text-sm font-medium text-neutral-charcoal mb-1">Nom du site</label>
						<input id="siteName" type="text" bind:value={settings.siteName} class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm" />
					</div>
					<div>
						<label for="email" class="block text-sm font-medium text-neutral-charcoal mb-1">Email</label>
						<input id="email" type="email" bind:value={settings.email} class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm" />
					</div>
				</div>

				<div>
					<label for="description" class="block text-sm font-medium text-neutral-charcoal mb-1">Description</label>
					<textarea id="description" bind:value={settings.description} rows="2" class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm resize-y"></textarea>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label for="phone" class="block text-sm font-medium text-neutral-charcoal mb-1">Téléphone</label>
						<input id="phone" type="text" bind:value={settings.phone} class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm" />
					</div>
					<div>
						<label for="address" class="block text-sm font-medium text-neutral-charcoal mb-1">Adresse</label>
						<input id="address" type="text" bind:value={settings.address} class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm" />
					</div>
				</div>
			</div>

			<!-- Réseaux sociaux -->
			<div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
				<h2 class="font-semibold text-neutral-obsidian">Réseaux sociaux</h2>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label for="facebook" class="block text-sm font-medium text-neutral-charcoal mb-1">Facebook</label>
						<input id="facebook" type="url" bind:value={settings.social!.facebook} class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm" placeholder="https://facebook.com/..." />
					</div>
					<div>
						<label for="instagram" class="block text-sm font-medium text-neutral-charcoal mb-1">Instagram</label>
						<input id="instagram" type="url" bind:value={settings.social!.instagram} class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm" placeholder="https://instagram.com/..." />
					</div>
					<div>
						<label for="linkedin" class="block text-sm font-medium text-neutral-charcoal mb-1">LinkedIn</label>
						<input id="linkedin" type="url" bind:value={settings.social!.linkedin} class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm" placeholder="https://linkedin.com/..." />
					</div>
					<div>
						<label for="youtube" class="block text-sm font-medium text-neutral-charcoal mb-1">YouTube</label>
						<input id="youtube" type="url" bind:value={settings.social!.youtube} class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm" placeholder="https://youtube.com/..." />
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
