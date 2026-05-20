/**
 * Fill the "Super Fonio de Boukoumbé" product with the BPV (Bon Pour Validation) content
 * extracted from .claude/BPV_TEXTES ETIQUETTE SUPER FONIO_GRAINS 19.05.26.docx.
 *
 * This is the canonical example of how every product should be populated end-to-end:
 * subtitle, tagline, benefits, special_mention, quality_claims, preparation recipes,
 * nutritional info, conservation.
 *
 * Idempotent — overwrites the same fields on every run.
 *
 * Usage: npm run catalog:fill-fonio
 */

import PocketBase from 'pocketbase';

const PB_URL = process.env.POCKETBASE_URL;
const PB_EMAIL = process.env.PB_ADMIN_EMAIL || process.env.PB_EMAIL;
const PB_PASSWORD = process.env.PB_ADMIN_PASSWORD || process.env.PB_PASSWORD;

if (!PB_URL || !PB_EMAIL || !PB_PASSWORD) {
	console.error('Missing env: POCKETBASE_URL, PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD');
	process.exit(1);
}

const SLUG = 'fonio-grain';

const PAYLOAD = {
	name: 'Super Fonio de Boukoumbé',
	subtitle: 'PURS GRAINS DE FONIO',
	tagline: 'Optez pour votre bien-être !',
	special_mention: 'SANS GLUTEN',
	description: 'Purs grains de fonio de Boukoumbé. Énergétique, facile à digérer, riche en fibres et acides aminés.',
	detailed_description:
		"Le fonio de Boukoumbé, cultivé dans les terres de l'Atacora au nord-Bénin, est une céréale ancestrale aux multiples vertus. Sans gluten et facile à digérer, il est riche en fibres, acides gras essentiels, acides aminés et sucres lents — un allié de choix pour une alimentation équilibrée.",
	benefits: [
		"Peut synthétiser l'insuline",
		'Recommandé aux personnes atteintes du diabète',
		'Énergétique',
		'Facile à digérer',
		'Riche en fibres, acides gras essentiels, acides aminés et sucres lents'
	],
	quality_claims: ['100% Naturel', 'Sans conservateur', 'Produit selon les normes HACCP'],
	preparation: {
		ratio: "1 mesure de fonio = 8 mesures d'eau",
		recipes: [
			{
				name: 'Bouillie de grains de fonio',
				steps: [
					"Faites bouillir de l'eau, puis y verser la quantité de fonio souhaitée.",
					'Remuez le mélange pendant une durée de 3 minutes.',
					'Refermez le couvercle et laissez cuire pendant 10 à 13 minutes.',
					"Ajoutez de l'eau si la consistance vous semble excessivement épaisse, puis laissez cuire 2 à 4 minutes.",
					'Ajoutez de la pulpe de baobab ou de la poudre de néré et une quantité modérée de sucre.'
				]
			},
			{
				name: 'Pâte de grains de fonio',
				steps: [
					"Faites bouillir de l'eau, puis y verser la quantité de fonio souhaitée.",
					"Remuez à l'aide d'une spatule afin d'obtenir un mélange homogène puis refermez.",
					'Laissez cuire 5 à 10 minutes et remuez à nouveau. Vous obtiendrez un mélange épais et consistant comme la pâte de maïs.',
					"Pour la pâte rouge, remplacez l'eau par la sauce de tomate et suivez le même processus."
				]
			}
		]
	},
	nutritional_info: {
		per: '100g',
		energy: '352 kCal',
		carbs: '80g',
		protein: '8g',
		fiber: '2,4g',
		minerals: ['Fer', 'Magnésium', 'Phosphore', 'Zinc'],
		vitamins: ['B']
	},
	conservation:
		"Refermer hermétiquement l'emballage après utilisation. Conserver dans un endroit sec, frais et à l'abri de l'humidité. À consommer de préférence avant la Date de Durabilité Minimale.",
	packaging: 'Sachet de 500g / 1kg',
	origin: 'Boukoumbé, Atacora, Bénin',
	certification: 'HACCP',
	featured: true,
	published: true
};

async function main() {
	const pb = new PocketBase(PB_URL);
	await pb.collection('_superusers').authWithPassword(PB_EMAIL!, PB_PASSWORD!);

	const record = await pb.collection('products').getFirstListItem(`slug = "${SLUG}"`);
	await pb.collection('products').update(record.id, PAYLOAD);
	console.log(`✓ filled "${SLUG}" with BPV content`);
}

main().catch((err) => {
	console.error(err);
	if ((err as { response?: unknown })?.response) {
		console.error('Response:', JSON.stringify((err as { response: unknown }).response, null, 2));
	}
	process.exit(1);
});
