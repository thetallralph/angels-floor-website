export interface SalesPoint {
	id: string;
	name: string;
	address: string;
	department: string;
	city: string;
	coordinates: {
		lat: number;
		lng: number;
	};
	phone?: string;
	hours?: string;
	type: 'boutique' | 'supermarché' | 'marché' | 'pharmacie';
}

export const salesPoints: SalesPoint[] = [
	// Littoral - Cotonou
	{
		id: 'sp-1',
		name: 'Super U Cadjèhoun',
		address: 'Boulevard de la Marina, Cadjèhoun',
		department: 'Littoral',
		city: 'Cotonou',
		coordinates: { lat: 6.3670, lng: 2.4180 },
		phone: '+229 21 31 45 67',
		hours: 'Lun-Sam: 8h-20h, Dim: 9h-14h',
		type: 'supermarché'
	},
	{
		id: 'sp-2',
		name: 'Erevan Akpakpa',
		address: 'Carrefour Agontikon, Akpakpa',
		department: 'Littoral',
		city: 'Cotonou',
		coordinates: { lat: 6.3550, lng: 2.4650 },
		phone: '+229 21 32 88 90',
		hours: 'Lun-Sam: 8h30-21h, Dim: 9h-20h',
		type: 'supermarché'
	},
	{
		id: 'sp-3',
		name: 'Marché Dantokpa - Stand Angel\'s Floor',
		address: 'Marché International de Dantokpa, Hall des Céréales',
		department: 'Littoral',
		city: 'Cotonou',
		coordinates: { lat: 6.3612, lng: 2.4305 },
		phone: '+229 97 12 34 56',
		hours: 'Tous les jours: 7h-19h',
		type: 'marché'
	},
	{
		id: 'sp-4',
		name: 'Pharmacie de la Vie Saine',
		address: 'Rue des Palmiers, Haie Vive',
		department: 'Littoral',
		city: 'Cotonou',
		coordinates: { lat: 6.3856, lng: 2.4123 },
		phone: '+229 21 30 12 34',
		hours: 'Lun-Sam: 8h-20h',
		type: 'pharmacie'
	},
	{
		id: 'sp-5',
		name: 'Boutique Bio Gbégamey',
		address: 'Carrefour Gbégamey, près de SOBEBRA',
		department: 'Littoral',
		city: 'Cotonou',
		coordinates: { lat: 6.3745, lng: 2.3912 },
		phone: '+229 96 45 67 89',
		hours: 'Lun-Sam: 9h-19h',
		type: 'boutique'
	},
	{
		id: 'sp-6',
		name: 'Champion Fidjrossè',
		address: 'Boulevard de France, Fidjrossè',
		department: 'Littoral',
		city: 'Cotonou',
		coordinates: { lat: 6.3592, lng: 2.3856 },
		phone: '+229 21 31 00 00',
		hours: 'Lun-Sam: 8h30-20h30, Dim: 9h-14h',
		type: 'supermarché'
	},
	
	// Atlantique - Abomey-Calavi
	{
		id: 'sp-7',
		name: 'Super U Calavi',
		address: 'Carrefour Kpota, Abomey-Calavi',
		department: 'Atlantique',
		city: 'Abomey-Calavi',
		coordinates: { lat: 6.4456, lng: 2.3534 },
		phone: '+229 21 36 45 67',
		hours: 'Lun-Sam: 8h-20h, Dim: 9h-14h',
		type: 'supermarché'
	},
	{
		id: 'sp-8',
		name: 'Marché Sékou',
		address: 'Marché Central de Sékou, Godomey',
		department: 'Atlantique',
		city: 'Abomey-Calavi',
		coordinates: { lat: 6.4023, lng: 2.3389 },
		phone: '+229 97 89 01 23',
		hours: 'Tous les jours: 6h-19h',
		type: 'marché'
	},
	{
		id: 'sp-9',
		name: 'Boutique Naturelle Cocotomey',
		address: 'Route de Ouidah, Cocotomey',
		department: 'Atlantique',
		city: 'Abomey-Calavi',
		coordinates: { lat: 6.3789, lng: 2.2456 },
		phone: '+229 95 67 89 01',
		hours: 'Lun-Sam: 8h30-19h30',
		type: 'boutique'
	},
	
	// Atlantique - Ouidah
	{
		id: 'sp-10',
		name: 'Marché Central Ouidah',
		address: 'Centre-ville, Place du Marché',
		department: 'Atlantique',
		city: 'Ouidah',
		coordinates: { lat: 6.3634, lng: 2.0878 },
		phone: '+229 96 78 90 12',
		hours: 'Tous les jours: 6h-18h',
		type: 'marché'
	},
	{
		id: 'sp-11',
		name: 'Pharmacie du Fort',
		address: 'Route des Esclaves, Ouidah',
		department: 'Atlantique',
		city: 'Ouidah',
		coordinates: { lat: 6.3612, lng: 2.0834 },
		phone: '+229 21 34 12 34',
		hours: 'Lun-Sam: 8h-20h',
		type: 'pharmacie'
	},
	
	// Ouémé - Porto-Novo
	{
		id: 'sp-12',
		name: 'Songhaï Store',
		address: 'Centre Songhaï, Porto-Novo',
		department: 'Ouémé',
		city: 'Porto-Novo',
		coordinates: { lat: 6.4968, lng: 2.6289 },
		phone: '+229 20 24 61 24',
		hours: 'Lun-Sam: 8h-18h',
		type: 'boutique'
	},
	{
		id: 'sp-13',
		name: 'Marché Ouando',
		address: 'Quartier Ouando, Porto-Novo',
		department: 'Ouémé',
		city: 'Porto-Novo',
		coordinates: { lat: 6.4923, lng: 2.6156 },
		phone: '+229 97 34 56 78',
		hours: 'Tous les jours: 6h-19h',
		type: 'marché'
	},
	{
		id: 'sp-14',
		name: 'Boutique Bio Avakpa',
		address: 'Quartier Avakpa, Porto-Novo',
		department: 'Ouémé',
		city: 'Porto-Novo',
		coordinates: { lat: 6.4812, lng: 2.6423 },
		phone: '+229 95 12 34 56',
		hours: 'Lun-Sam: 9h-19h',
		type: 'boutique'
	},
	
	// Mono - Lokossa
	{
		id: 'sp-15',
		name: 'Marché Central Lokossa',
		address: 'Centre-ville, Lokossa',
		department: 'Mono',
		city: 'Lokossa',
		coordinates: { lat: 6.6389, lng: 1.7189 },
		phone: '+229 96 90 12 34',
		hours: 'Tous les jours: 6h-18h',
		type: 'marché'
	},
	
	// Zou - Abomey
	{
		id: 'sp-16',
		name: 'Boutique Royale Abomey',
		address: 'Quartier Hounli, Abomey',
		department: 'Zou',
		city: 'Abomey',
		coordinates: { lat: 7.1853, lng: 1.9910 },
		phone: '+229 95 45 67 89',
		hours: 'Lun-Sam: 8h-19h',
		type: 'boutique'
	},
	{
		id: 'sp-17',
		name: 'Marché Houndjro',
		address: 'Marché Central Houndjro, Abomey',
		department: 'Zou',
		city: 'Abomey',
		coordinates: { lat: 7.1789, lng: 1.9856 },
		phone: '+229 97 67 89 01',
		hours: 'Tous les jours: 6h-18h',
		type: 'marché'
	}
];

// Fonction pour obtenir les points de vente par département
export function getSalesPointsByDepartment(): Record<string, SalesPoint[]> {
	return salesPoints.reduce((acc, point) => {
		if (!acc[point.department]) {
			acc[point.department] = [];
		}
		acc[point.department].push(point);
		return acc;
	}, {} as Record<string, SalesPoint[]>);
}

// Fonction pour obtenir les points de vente les plus proches
export function getNearestSalesPoints(
	lat: number,
	lng: number,
	limit: number = 3
): SalesPoint[] {
	// Calcul de la distance entre deux points GPS (formule de Haversine simplifiée)
	const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
		const R = 6371; // Rayon de la Terre en km
		const dLat = (lat2 - lat1) * Math.PI / 180;
		const dLng = (lng2 - lng1) * Math.PI / 180;
		const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
			Math.sin(dLng/2) * Math.sin(dLng/2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		return R * c;
	};
	
	return salesPoints
		.map(point => ({
			...point,
			distance: calculateDistance(lat, lng, point.coordinates.lat, point.coordinates.lng)
		}))
		.sort((a, b) => a.distance - b.distance)
		.slice(0, limit)
		.map(({ distance: _distance, ...point }) => point);
}

// Points de vente par défaut à Cotonou (centre)
export const defaultCoordinates = { lat: 6.3703, lng: 2.3912 };