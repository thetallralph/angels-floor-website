<script lang="ts">
	import { onMount, tick } from 'svelte';
	import {
		listSalesPoints,
		createSalesPoint,
		updateSalesPoint,
		deleteSalesPoint,
		bootstrapSalesPointsCollection
	} from '$lib/admin/salesPoints';
	import { SALES_POINT_TYPES, type SalesPoint, type SalesPointType } from '$lib/admin/types';
	import { Plus, Pencil, Trash2, Save, X, MapPin, Zap, Search } from 'lucide-svelte';

	type DraftSalesPoint = Omit<SalesPoint, 'id'> & { id?: string };

	const BENIN_CENTER: [number, number] = [6.3703, 2.3912];

	let points = $state<SalesPoint[]>([]);
	let loading = $state(true);
	let needsBootstrap = $state(false);
	let bootstrapping = $state(false);
	let saving = $state(false);
	let deletingId = $state('');
	let editing = $state<DraftSalesPoint | null>(null);
	let message = $state<{ type: 'success' | 'error'; text: string } | null>(null);
	let search = $state('');
	let typeFilter = $state<'all' | SalesPointType>('all');

	let L: any = null;
	let map: any = null;
	let marker: any = null;

	onMount(() => refresh());

	async function refresh() {
		loading = true;
		message = null;
		try {
			const list = await listSalesPoints();
			if (list === null) {
				needsBootstrap = true;
				points = [];
			} else {
				needsBootstrap = false;
				points = list;
			}
		} catch (err) {
			message = {
				type: 'error',
				text: err instanceof Error ? err.message : 'Erreur de chargement'
			};
		} finally {
			loading = false;
		}
	}

	async function handleBootstrap() {
		if (
			!confirm(
				'Initialiser la collection "sales_points" dans PocketBase et importer les points de vente existants ?'
			)
		)
			return;
		bootstrapping = true;
		message = null;
		try {
			await bootstrapSalesPointsCollection();
			message = { type: 'success', text: 'Points de vente initialisés.' };
			await refresh();
		} catch (err) {
			message = { type: 'error', text: err instanceof Error ? err.message : 'Erreur bootstrap' };
		} finally {
			bootstrapping = false;
		}
	}

	async function startNew() {
		editing = {
			name: '',
			address: '',
			department: '',
			city: '',
			lat: BENIN_CENTER[0],
			lng: BENIN_CENTER[1],
			type: 'boutique',
			phone: '',
			hours: ''
		};
		await tick();
		await ensureMap();
	}

	async function startEdit(point: SalesPoint) {
		editing = { ...point };
		await tick();
		await ensureMap();
	}

	function cancelEdit() {
		editing = null;
		if (map) {
			map.remove();
			map = null;
			marker = null;
		}
	}

	async function ensureMap() {
		if (typeof window === 'undefined' || !editing) return;
		if (!L) {
			L = (await import('leaflet')).default ?? (await import('leaflet'));
			await import('leaflet/dist/leaflet.css');
		}
		const container = document.getElementById('sp-edit-map');
		if (!container) return;
		if (map) {
			map.remove();
			map = null;
			marker = null;
		}
		map = L.map(container).setView([editing.lat, editing.lng], 12);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap'
		}).addTo(map);
		marker = L.marker([editing.lat, editing.lng], { draggable: true }).addTo(map);
			marker.on('dragend', (e: any) => {
			if (!editing) return;
			const pos = e.target.getLatLng();
			editing.lat = Number(pos.lat.toFixed(6));
			editing.lng = Number(pos.lng.toFixed(6));
		});
			map.on('click', (e: any) => {
			if (!editing) return;
			editing.lat = Number(e.latlng.lat.toFixed(6));
			editing.lng = Number(e.latlng.lng.toFixed(6));
			marker.setLatLng(e.latlng);
		});
	}

	function syncMarkerFromInputs() {
		if (!marker || !editing) return;
		marker.setLatLng([editing.lat, editing.lng]);
		if (map) map.setView([editing.lat, editing.lng]);
	}

	async function handleSave() {
		if (!editing) return;
		if (!editing.name.trim() || !editing.address.trim()) {
			message = { type: 'error', text: 'Le nom et l\'adresse sont requis.' };
			return;
		}
		if (!editing.department.trim() || !editing.city.trim()) {
			message = { type: 'error', text: 'Le département et la ville sont requis.' };
			return;
		}
		if (!Number.isFinite(editing.lat) || !Number.isFinite(editing.lng)) {
			message = { type: 'error', text: 'Coordonnées GPS invalides.' };
			return;
		}
		saving = true;
		message = null;
		try {
			const payload = {
				name: editing.name.trim(),
				address: editing.address.trim(),
				department: editing.department.trim(),
				city: editing.city.trim(),
				lat: Number(editing.lat),
				lng: Number(editing.lng),
				type: editing.type,
				phone: (editing.phone || '').trim(),
				hours: (editing.hours || '').trim()
			};
			if (editing.id) {
				await updateSalesPoint(editing.id, payload);
				message = { type: 'success', text: 'Point de vente mis à jour.' };
			} else {
				await createSalesPoint(payload);
				message = { type: 'success', text: 'Point de vente créé.' };
			}
			cancelEdit();
			await refresh();
		} catch (err) {
			message = { type: 'error', text: err instanceof Error ? err.message : 'Erreur' };
		} finally {
			saving = false;
		}
	}

	async function handleDelete(point: SalesPoint) {
		if (!confirm(`Supprimer le point de vente "${point.name}" ?`)) return;
		deletingId = point.id;
		message = null;
		try {
			await deleteSalesPoint(point.id);
			await refresh();
		} catch (err) {
			message = { type: 'error', text: err instanceof Error ? err.message : 'Erreur' };
		} finally {
			deletingId = '';
		}
	}

	function typeLabel(type: string): string {
		return SALES_POINT_TYPES.find((t) => t.value === type)?.label || type;
	}

	function typeBadgeClass(type: string): string {
		switch (type) {
			case 'boutique':
				return 'bg-green-100 text-green-700';
			case 'supermarché':
				return 'bg-amber-100 text-amber-700';
			case 'marché':
				return 'bg-violet-100 text-violet-700';
			case 'pharmacie':
				return 'bg-red-100 text-red-700';
			default:
				return 'bg-neutral-pearl text-neutral-charcoal';
		}
	}

	let filteredPoints = $derived.by(() => {
		const q = search.trim().toLowerCase();
		return points.filter((p) => {
			if (typeFilter !== 'all' && p.type !== typeFilter) return false;
			if (!q) return true;
			return (
				p.name.toLowerCase().includes(q) ||
				p.city.toLowerCase().includes(q) ||
				p.department.toLowerCase().includes(q) ||
				p.address.toLowerCase().includes(q)
			);
		});
	});
</script>

<div>
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-2xl font-bold text-neutral-obsidian">Points de vente</h1>
			<p class="text-neutral-slate text-sm mt-1">{points.length} point(s) de vente</p>
		</div>
		{#if !needsBootstrap && !editing}
			<button
				onclick={startNew}
				class="flex items-center gap-2 bg-primary-green text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-green-vibrant transition-all"
			>
				<Plus class="w-4 h-4" />
				Nouveau point de vente
			</button>
		{/if}
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
			<div
				class="animate-spin w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full"
			></div>
		</div>
	{:else if needsBootstrap}
		<div class="bg-white rounded-2xl p-8 text-center shadow-sm">
			<Zap class="w-10 h-10 text-primary-green mx-auto mb-3" />
			<h2 class="font-semibold text-neutral-obsidian mb-2">Collection non initialisée</h2>
			<p class="text-sm text-neutral-slate max-w-md mx-auto mb-6">
				La collection <code class="bg-neutral-pearl px-1.5 py-0.5 rounded">sales_points</code> n'existe
				pas encore dans PocketBase. Clique pour la créer et importer les points de vente déjà présents
				dans le code.
			</p>
			<button
				onclick={handleBootstrap}
				disabled={bootstrapping}
				class="inline-flex items-center gap-2 bg-primary-green text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-green-vibrant transition-all disabled:opacity-50"
			>
				{bootstrapping ? 'Initialisation…' : 'Initialiser les points de vente'}
			</button>
		</div>
	{:else}
		{#if editing}
			<div class="bg-white rounded-2xl p-6 shadow-sm mb-6">
				<h2 class="font-semibold text-neutral-obsidian mb-4">
					{editing.id ? 'Modifier le point de vente' : 'Nouveau point de vente'}
				</h2>

				<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<!-- Form -->
					<div class="space-y-4">
						<div>
							<label for="sp-name" class="block text-sm font-medium text-neutral-charcoal mb-1"
								>Nom *</label
							>
							<input
								id="sp-name"
								type="text"
								bind:value={editing.name}
								class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
								placeholder="Super U Cadjèhoun"
							/>
						</div>

						<div>
							<label for="sp-address" class="block text-sm font-medium text-neutral-charcoal mb-1"
								>Adresse *</label
							>
							<input
								id="sp-address"
								type="text"
								bind:value={editing.address}
								class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
								placeholder="Boulevard de la Marina, Cadjèhoun"
							/>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div>
								<label
									for="sp-department"
									class="block text-sm font-medium text-neutral-charcoal mb-1">Département *</label
								>
								<input
									id="sp-department"
									type="text"
									bind:value={editing.department}
									class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
									placeholder="Littoral"
								/>
							</div>
							<div>
								<label for="sp-city" class="block text-sm font-medium text-neutral-charcoal mb-1"
									>Ville *</label
								>
								<input
									id="sp-city"
									type="text"
									bind:value={editing.city}
									class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
									placeholder="Cotonou"
								/>
							</div>
						</div>

						<div>
							<label for="sp-type" class="block text-sm font-medium text-neutral-charcoal mb-1"
								>Type *</label
							>
							<select
								id="sp-type"
								bind:value={editing.type}
								class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm bg-white"
							>
								{#each SALES_POINT_TYPES as t}
									<option value={t.value}>{t.label}</option>
								{/each}
							</select>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div>
								<label for="sp-lat" class="block text-sm font-medium text-neutral-charcoal mb-1"
									>Latitude *</label
								>
								<input
									id="sp-lat"
									type="number"
									step="0.000001"
									bind:value={editing.lat}
									onchange={syncMarkerFromInputs}
									class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
								/>
							</div>
							<div>
								<label for="sp-lng" class="block text-sm font-medium text-neutral-charcoal mb-1"
									>Longitude *</label
								>
								<input
									id="sp-lng"
									type="number"
									step="0.000001"
									bind:value={editing.lng}
									onchange={syncMarkerFromInputs}
									class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
								/>
							</div>
						</div>

						<div>
							<label for="sp-phone" class="block text-sm font-medium text-neutral-charcoal mb-1"
								>Téléphone</label
							>
							<input
								id="sp-phone"
								type="text"
								bind:value={editing.phone}
								class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
								placeholder="+229 21 31 45 67"
							/>
						</div>

						<div>
							<label for="sp-hours" class="block text-sm font-medium text-neutral-charcoal mb-1"
								>Horaires</label
							>
							<input
								id="sp-hours"
								type="text"
								bind:value={editing.hours}
								class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
								placeholder="Lun-Sam: 8h-20h"
							/>
						</div>
					</div>

					<!-- Map picker -->
					<div>
						<div class="block text-sm font-medium text-neutral-charcoal mb-1">
							Position sur la carte
						</div>
						<p class="text-xs text-neutral-slate mb-2">
							Clique sur la carte ou fais glisser le marqueur pour ajuster les coordonnées.
						</p>
						<div
							id="sp-edit-map"
							class="w-full h-[420px] rounded-xl border border-neutral-light overflow-hidden"
						></div>
					</div>
				</div>

				<div class="flex items-center gap-2 justify-end mt-6 pt-4 border-t border-neutral-sand">
					<button
						onclick={cancelEdit}
						class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-light text-neutral-charcoal text-sm font-medium hover:bg-neutral-pearl transition-all"
					>
						<X class="w-4 h-4" />
						Annuler
					</button>
					<button
						onclick={handleSave}
						disabled={saving}
						class="flex items-center gap-2 bg-primary-green text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-green-vibrant transition-all disabled:opacity-50"
					>
						<Save class="w-4 h-4" />
						{saving ? 'Sauvegarde…' : 'Sauvegarder'}
					</button>
				</div>
			</div>
		{/if}

		{#if points.length === 0}
			<div class="text-center py-16 bg-white rounded-2xl">
				<MapPin class="w-12 h-12 text-neutral-light mx-auto mb-3" />
				<p class="text-neutral-slate">Aucun point de vente.</p>
				<button
					onclick={startNew}
					class="inline-block mt-4 text-primary-green font-medium text-sm hover:underline"
				>
					Créer le premier
				</button>
			</div>
		{:else}
			<!-- Filters -->
			<div class="bg-white rounded-2xl p-4 shadow-sm mb-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
					<div class="relative">
						<Search
							class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-slate"
						/>
						<input
							type="text"
							bind:value={search}
							placeholder="Rechercher par nom, ville, département…"
							class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm"
						/>
					</div>
					<select
						bind:value={typeFilter}
						class="w-full px-4 py-2.5 rounded-xl border border-neutral-light focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none text-sm bg-white"
					>
						<option value="all">Tous les types</option>
						{#each SALES_POINT_TYPES as t}
							<option value={t.value}>{t.label}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="bg-white rounded-2xl shadow-sm overflow-hidden">
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b border-neutral-light">
								<th
									class="text-left px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider"
									>Nom</th
								>
								<th
									class="text-left px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider"
									>Type</th
								>
								<th
									class="text-left px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider"
									>Ville</th
								>
								<th
									class="text-left px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider"
									>Département</th
								>
								<th
									class="text-left px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider"
									>Téléphone</th
								>
								<th
									class="text-right px-5 py-3 text-xs font-semibold text-neutral-slate uppercase tracking-wider"
									>Actions</th
								>
							</tr>
						</thead>
						<tbody>
							{#each filteredPoints as point}
								<tr
									class="border-b border-neutral-sand last:border-0 hover:bg-neutral-pearl transition-colors"
								>
									<td class="px-5 py-4 text-sm font-medium text-neutral-obsidian">
										{point.name}
										<div class="text-xs text-neutral-slate font-normal">{point.address}</div>
									</td>
									<td class="px-5 py-4">
										<span
											class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium {typeBadgeClass(
												point.type
											)}"
										>
											{typeLabel(point.type)}
										</span>
									</td>
									<td class="px-5 py-4 text-sm text-neutral-charcoal">{point.city}</td>
									<td class="px-5 py-4 text-sm text-neutral-slate">{point.department}</td>
									<td class="px-5 py-4 text-sm text-neutral-slate">{point.phone || '—'}</td>
									<td class="px-5 py-4">
										<div class="flex items-center justify-end gap-1">
											{#if deletingId === point.id}
												<div
													class="animate-spin w-4 h-4 border-2 border-primary-green border-t-transparent rounded-full"
												></div>
											{:else}
												<button
													onclick={() => startEdit(point)}
													class="p-2 rounded-lg text-neutral-slate hover:bg-neutral-sand hover:text-primary-green transition-all"
													title="Modifier"
												>
													<Pencil class="w-4 h-4" />
												</button>
												<button
													onclick={() => handleDelete(point)}
													class="p-2 rounded-lg text-neutral-slate hover:bg-red-50 hover:text-red-600 transition-all"
													title="Supprimer"
												>
													<Trash2 class="w-4 h-4" />
												</button>
											{/if}
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
					{#if filteredPoints.length === 0}
						<div class="px-5 py-10 text-center text-sm text-neutral-slate">
							Aucun résultat pour ces filtres.
						</div>
					{/if}
				</div>
			</div>
		{/if}
	{/if}
</div>
