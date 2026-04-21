<script lang="ts">
	import { goto } from '$app/navigation';
	import { initPB, login } from '$lib/admin/api';
	import { onMount } from 'svelte';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	onMount(async () => {
		await initPB();
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';
		loading = true;

		try {
			await login(email, password);
			goto('/admin');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Erreur de connexion';
		} finally {
			loading = false;
		}
	}
</script>

<div class="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
	<div class="w-full max-w-sm">
		<div class="text-center mb-8">
			<div class="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
				<span class="text-white font-bold text-lg">AF</span>
			</div>
			<h1 class="text-xl font-semibold text-zinc-900">Angel's Floor</h1>
			<p class="text-zinc-500 text-sm mt-1">Connectez-vous à l'admin</p>
		</div>

		<form onsubmit={handleSubmit} class="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 space-y-4">
			{#if error}
				<div class="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
					{error}
				</div>
			{/if}

			<div>
				<label for="email" class="block text-sm font-medium text-zinc-700 mb-1">Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					class="w-full px-3 py-2 rounded-lg border border-zinc-300 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
					placeholder="admin@angelsfloor.bj"
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-zinc-700 mb-1">Mot de passe</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					class="w-full px-3 py-2 rounded-lg border border-zinc-300 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
					placeholder="••••••••"
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="w-full bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{loading ? 'Connexion...' : 'Se connecter'}
			</button>
		</form>
	</div>
</div>
