<script lang="ts">
	import { onMount } from 'svelte';
	import { getContent, saveContent, publishContent } from '$lib/admin/api';
	import type { SiteSettings } from '$lib/admin/types';
	import { Save, Send, Settings, Lock } from 'lucide-svelte';

	let settings = $state<Partial<SiteSettings>>({
		siteName: '',
		description: '',
		email: '',
		phone: '',
		address: '',
		social: { facebook: '', instagram: '', twitter: '', linkedin: '', youtube: '' }
	});

	let loading = $state(true);
	let saving = $state(false);
	let message = $state<{ type: 'success' | 'error'; text: string } | null>(null);

	// Password change
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let changingPassword = $state(false);
	let passwordMessage = $state<{ type: 'success' | 'error'; text: string } | null>(null);

	onMount(async () => {
		try {
			try {
				const data = await getContent('settings', 'general', 'draft');
				settings = data as unknown as SiteSettings;
			} catch {
				const data = await getContent('settings', 'general', 'live');
				settings = data as unknown as SiteSettings;
			}
		} catch {}
		finally { loading = false; }
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
		} finally { saving = false; }
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

	async function handleChangePassword() {
		passwordMessage = null;

		if (!currentPassword || !newPassword) {
			passwordMessage = { type: 'error', text: 'Tous les champs sont requis' };
			return;
		}
		if (newPassword.length < 8) {
			passwordMessage = { type: 'error', text: 'Le nouveau mot de passe doit faire au moins 8 caractères' };
			return;
		}
		if (newPassword !== confirmPassword) {
			passwordMessage = { type: 'error', text: 'Les mots de passe ne correspondent pas' };
			return;
		}

		changingPassword = true;
		try {
			const token = localStorage.getItem('cms_token');
			const res = await fetch('/api/auth.php?action=change-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({ current: currentPassword, new: newPassword })
			});
			const data = await res.json();

			if (!res.ok) throw new Error(data.error || 'Erreur');

			passwordMessage = { type: 'success', text: 'Mot de passe changé. Reconnectez-vous.' };
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';

			// Déconnexion après 2s
			setTimeout(() => {
				localStorage.removeItem('cms_token');
				localStorage.removeItem('cms_user');
				window.location.href = '/admin/login';
			}, 2000);
		} catch (err) {
			passwordMessage = { type: 'error', text: err instanceof Error ? err.message : 'Erreur' };
		} finally {
			changingPassword = false;
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
		<div class="px-4 py-3 rounded-xl text-sm mb-6 {message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-700'}">{message.text}</div>
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

			<!-- Changement de mot de passe -->
			<div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
				<div class="flex items-center gap-2 mb-2">
					<Lock class="w-4 h-4 text-neutral-slate" />
					<h2 class="font-semibold text-neutral-obsidian">Changer le mot de passe</h2>
				</div>

				{#if passwordMessage}
					<div class="px-4 py-3 rounded-xl text-sm {passwordMessage.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-700'}">{passwordMessage.text}</div>
				{/if}

				<div>
					<label for="currentPw" class="block text-sm font-medium text-neutral-charcoal mb-1">Mot de passe actuel</label>
					<input id="currentPw" type="password" bind:value={currentPassword} class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm" />
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label for="newPw" class="block text-sm font-medium text-neutral-charcoal mb-1">Nouveau mot de passe</label>
						<input id="newPw" type="password" bind:value={newPassword} class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm" placeholder="Min. 8 caractères" />
					</div>
					<div>
						<label for="confirmPw" class="block text-sm font-medium text-neutral-charcoal mb-1">Confirmer</label>
						<input id="confirmPw" type="password" bind:value={confirmPassword} class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green outline-none text-sm" />
					</div>
				</div>
				<button onclick={handleChangePassword} disabled={changingPassword}
					class="flex items-center gap-2 bg-neutral-obsidian text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-charcoal transition-all disabled:opacity-50">
					<Lock class="w-4 h-4" />
					{changingPassword ? 'Changement...' : 'Changer le mot de passe'}
				</button>
			</div>
		</div>
	{/if}
</div>
