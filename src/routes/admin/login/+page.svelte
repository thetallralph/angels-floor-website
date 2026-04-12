<script lang="ts">
	import { goto } from '$app/navigation';
	import { login } from '$lib/admin/api';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

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

<div class="min-h-screen bg-neutral-sand flex items-center justify-center px-4">
	<div class="w-full max-w-md">
		<!-- Logo -->
		<div class="text-center mb-8">
			<div class="w-16 h-16 bg-primary-green rounded-2xl flex items-center justify-center mx-auto mb-4">
				<span class="text-white font-bold text-2xl">AF</span>
			</div>
			<h1 class="text-2xl font-bold text-neutral-obsidian">Angel's Floor</h1>
			<p class="text-neutral-slate mt-1">Administration du site</p>
		</div>

		<!-- Form -->
		<form
			onsubmit={handleSubmit}
			class="bg-white rounded-2xl shadow-lg p-8 space-y-5"
		>
			{#if error}
				<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
					{error}
				</div>
			{/if}

			<div>
				<label for="email" class="block text-sm font-medium text-neutral-charcoal mb-1.5">
					Email
				</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					class="w-full px-4 py-3 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none transition-all"
					placeholder="admin@angelsfloor.bj"
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-neutral-charcoal mb-1.5">
					Mot de passe
				</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					class="w-full px-4 py-3 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none transition-all"
					placeholder="••••••••"
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="w-full bg-primary-green text-white py-3 rounded-xl font-semibold hover:bg-primary-green-vibrant transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{loading ? 'Connexion...' : 'Se connecter'}
			</button>
		</form>
	</div>
</div>
