<script lang="ts">
	import { onMount } from 'svelte';
	import { MapPin, Phone, Clock, Search, Filter } from 'lucide-svelte';
	import { salesPoints, getSalesPointsByDepartment, type SalesPoint } from '$lib/data/salesPoints';
	
	let selectedDepartment = 'Tous';
	let selectedType = 'Tous';
	let searchQuery = '';
	let map: any;
	let markers: any[] = [];
	let L: any;
	
	$: departments = ['Tous', ...Object.keys(getSalesPointsByDepartment())];
	$: types = ['Tous', 'boutique', 'supermarché', 'marché', 'pharmacie'];
	
	$: filteredSalesPoints = salesPoints.filter(point => {
		const matchesDepartment = selectedDepartment === 'Tous' || point.department === selectedDepartment;
		const matchesType = selectedType === 'Tous' || point.type === selectedType;
		const matchesSearch = searchQuery === '' || 
			point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			point.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
			point.city.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesDepartment && matchesType && matchesSearch;
	});
	
	$: salesPointsByDepartment = filteredSalesPoints.reduce((acc, point) => {
		if (!acc[point.department]) {
			acc[point.department] = [];
		}
		acc[point.department].push(point);
		return acc;
	}, {} as Record<string, SalesPoint[]>);
	
	onMount(async () => {
		if (typeof window !== 'undefined') {
			// @ts-ignore
			L = await import('leaflet');
			await import('leaflet/dist/leaflet.css');
			
			// Fix pour les icônes Leaflet
			delete (L.Icon.Default.prototype as any)._getIconUrl;
			L.Icon.Default.mergeOptions({
				iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
				iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
				shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
			});
			
			// Initialiser la carte
			map = L.map('map').setView([6.3703, 2.3912], 11);
			
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '© OpenStreetMap contributors'
			}).addTo(map);
			
			updateMarkers();
		}
	});
	
	function updateMarkers() {
		if (!map || !L) return;
		
		// Supprimer les anciens marqueurs
		markers.forEach(marker => map.removeLayer(marker));
		markers = [];
		
		// Ajouter les nouveaux marqueurs
		filteredSalesPoints.forEach(point => {
			const iconColor = getMarkerColor(point.type);
			const icon = L.divIcon({
				html: `<div style="background-color: ${iconColor}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
				className: 'custom-marker',
				iconSize: [30, 30],
				iconAnchor: [15, 30]
			});
			
			const marker = L.marker([point.coordinates.lat, point.coordinates.lng], { icon })
				.addTo(map)
				.bindPopup(`
					<div style="min-width: 200px;">
						<h3 style="margin: 0 0 8px 0; font-weight: bold;">${point.name}</h3>
						<p style="margin: 4px 0; font-size: 14px; color: #666;">${point.address}</p>
						${point.phone ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Tél:</strong> ${point.phone}</p>` : ''}
						${point.hours ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Horaires:</strong> ${point.hours}</p>` : ''}
						<span style="display: inline-block; margin-top: 8px; padding: 4px 8px; background: ${iconColor}; color: white; border-radius: 4px; font-size: 12px;">${getTypeLabel(point.type)}</span>
					</div>
				`);
			markers.push(marker);
		});
		
		// Ajuster la vue si des marqueurs sont présents
		if (markers.length > 0) {
			const group = L.featureGroup(markers);
			map.fitBounds(group.getBounds().pad(0.1));
		}
	}
	
	function getMarkerColor(type: string) {
		switch(type) {
			case 'boutique': return '#4ADE80';
			case 'supermarché': return '#F59E0B';
			case 'marché': return '#8B5CF6';
			case 'pharmacie': return '#EF4444';
			default: return '#6B7280';
		}
	}
	
	function getTypeLabel(type: string) {
		switch(type) {
			case 'boutique': return 'Boutique';
			case 'supermarché': return 'Supermarché';
			case 'marché': return 'Marché';
			case 'pharmacie': return 'Pharmacie';
			default: return type;
		}
	}
	
	function focusOnPoint(point: SalesPoint) {
		if (!map || !L) return;
		map.setView([point.coordinates.lat, point.coordinates.lng], 15);
		
		// Ouvrir le popup du marqueur correspondant
		const marker = markers.find(m => {
			const latlng = m.getLatLng();
			return latlng.lat === point.coordinates.lat && latlng.lng === point.coordinates.lng;
		});
		if (marker) {
			marker.openPopup();
		}
	}
	
	$: if (map && L) {
		updateMarkers();
	}
</script>

<div class="min-h-screen bg-neutral-sand">
	<!-- Hero Section -->
	<section class="relative bg-primary-green text-white py-16 lg:py-24 overflow-hidden">
		<div class="absolute inset-0 bg-gradient-to-br from-primary-green via-primary-green to-green-800"></div>
		<div class="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
		<div class="absolute bottom-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
		
		<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center">
				<h1 class="text-5xl md:text-6xl font-bold mb-6 leading-tight">
					Nos Points de Vente
				</h1>
				<p class="text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
					Trouvez nos produits dans plus de {salesPoints.length} points de vente à travers le Bénin
				</p>
			</div>
		</div>
	</section>
	
	<!-- Filtres -->
	<section class="bg-white border-b sticky top-0 z-40 shadow-sm">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
				<!-- Recherche -->
				<div class="relative">
					<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-slate" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Rechercher un point de vente..."
						class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green"
					/>
				</div>
				
				<!-- Filtre Département -->
				<div class="relative">
					<Filter class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-slate" />
					<select
						bind:value={selectedDepartment}
						class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green appearance-none bg-white"
					>
						{#each departments as dept}
							<option value={dept}>{dept}</option>
						{/each}
					</select>
				</div>
				
				<!-- Filtre Type -->
				<div class="relative">
					<MapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-slate" />
					<select
						bind:value={selectedType}
						class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green appearance-none bg-white"
					>
						{#each types as type}
							<option value={type}>{getTypeLabel(type)}</option>
						{/each}
					</select>
				</div>
				
				<!-- Résultats -->
				<div class="flex items-center justify-center md:justify-end">
					<span class="text-neutral-charcoal font-semibold">
						{filteredSalesPoints.length} point{filteredSalesPoints.length > 1 ? 's' : ''} de vente
					</span>
				</div>
			</div>
		</div>
	</section>
	
	<!-- Carte et Liste -->
	<section class="py-12">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<!-- Carte -->
				<div class="bg-white rounded-2xl shadow-lg overflow-hidden h-[500px] lg:h-[700px]">
					<div id="map" class="w-full h-full"></div>
				</div>
				
				<!-- Liste des points de vente -->
				<div class="bg-white rounded-2xl shadow-lg p-6 h-[500px] lg:h-[700px] overflow-y-auto">
					{#if Object.keys(salesPointsByDepartment).length === 0}
						<div class="text-center py-12">
							<MapPin class="w-12 h-12 text-neutral-slate mx-auto mb-4" />
							<p class="text-lg text-neutral-charcoal">Aucun point de vente trouvé</p>
							<p class="text-sm text-neutral-slate mt-2">Essayez de modifier vos filtres</p>
						</div>
					{:else}
						{#each Object.entries(salesPointsByDepartment) as [department, points]}
							<div class="mb-8">
								<h2 class="text-2xl font-bold text-primary-green mb-4 pb-2 border-b-2 border-primary-green/20">
									{department}
								</h2>
								<div class="space-y-4">
									{#each points as point}
										<button
											on:click={() => focusOnPoint(point)}
											class="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-primary-green hover:shadow-md transition-all duration-300 group"
										>
											<div class="flex items-start justify-between">
												<div class="flex-1">
													<h3 class="font-semibold text-lg text-neutral-obsidian group-hover:text-primary-green transition-colors">
														{point.name}
													</h3>
													<p class="text-sm text-neutral-charcoal mt-1 flex items-center">
														<MapPin class="w-4 h-4 mr-1" />
														{point.address}, {point.city}
													</p>
													{#if point.phone}
														<p class="text-sm text-neutral-slate mt-2 flex items-center">
															<Phone class="w-4 h-4 mr-1" />
															{point.phone}
														</p>
													{/if}
													{#if point.hours}
														<p class="text-sm text-neutral-slate mt-1 flex items-center">
															<Clock class="w-4 h-4 mr-1" />
															{point.hours}
														</p>
													{/if}
												</div>
												<span 
													class="px-3 py-1 rounded-full text-xs font-semibold text-white"
													style="background-color: {getMarkerColor(point.type)}"
												>
													{getTypeLabel(point.type)}
												</span>
											</div>
										</button>
									{/each}
								</div>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	</section>
	
	<!-- Légende -->
	<section class="pb-12">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="bg-white rounded-2xl shadow-lg p-6">
				<h3 class="text-lg font-semibold text-neutral-obsidian mb-4">Légende</h3>
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div class="flex items-center">
						<div class="w-6 h-6 rounded-full mr-3" style="background-color: #4ADE80;"></div>
						<span class="text-sm text-neutral-charcoal">Boutique</span>
					</div>
					<div class="flex items-center">
						<div class="w-6 h-6 rounded-full mr-3" style="background-color: #F59E0B;"></div>
						<span class="text-sm text-neutral-charcoal">Supermarché</span>
					</div>
					<div class="flex items-center">
						<div class="w-6 h-6 rounded-full mr-3" style="background-color: #8B5CF6;"></div>
						<span class="text-sm text-neutral-charcoal">Marché</span>
					</div>
					<div class="flex items-center">
						<div class="w-6 h-6 rounded-full mr-3" style="background-color: #EF4444;"></div>
						<span class="text-sm text-neutral-charcoal">Pharmacie</span>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	:global(.custom-marker) {
		background: transparent !important;
		border: none !important;
	}
</style>