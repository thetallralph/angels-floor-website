/**
 * Populate `variants[]` for products that exist in multiple sizes,
 * each with its own price (from PJ1_PRESENTATION DES PRODUITS.docx).
 *
 * For these products, the variant selector on the public page lets the customer
 * choose a size; the price updates accordingly. The product-level `price`
 * remains as the entry-level (smallest size).
 *
 * Idempotent — overwrites variants[] each run.
 *
 * Usage: npm run catalog:fill-variants
 */

import PocketBase from 'pocketbase';

const PB_URL = process.env.POCKETBASE_URL;
const PB_EMAIL = process.env.PB_ADMIN_EMAIL || process.env.PB_EMAIL;
const PB_PASSWORD = process.env.PB_ADMIN_PASSWORD || process.env.PB_PASSWORD;
if (!PB_URL || !PB_EMAIL || !PB_PASSWORD) {
	console.error('Missing env: POCKETBASE_URL, PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD');
	process.exit(1);
}

type Variant = { size?: string; label?: string; price: number };

const VARIANTS: Record<string, Variant[]> = {
	// Fonio
	'fonio-grain': [
		{ size: '500G', price: 1545 },
		{ size: '900G', price: 3000 },
		{ size: '1800G', price: 5950 }
	],
	'farine-de-fonio': [
		{ size: '600G', price: 2500 },
		{ size: '1000G', price: 3510 }
	],
	'couscous-de-fonio': [
		{ size: '350G', price: 2000 },
		{ size: '1000G', price: 5450 }
	],
	'farine-enrichie-de-fonio': [
		{ size: '300G', price: 1500 },
		{ size: '1000G', price: 4500 }
	],
	// Baobab
	'baobab-pulpe': [
		{ size: '250G', price: 1350 },
		{ size: '500G', price: 2500 },
		{ size: '1000G', price: 4700 },
		{ size: '1500G', price: 6700 }
	],
	'bisbab-grand-format': [
		{ size: '500G', price: 4500 },
		{ size: '1000G', price: 9000 }
	],
	// Bisbab dragée 3G ou 5G
	'bisbab-dragee': [
		{ size: '3G', price: 25 },
		{ size: '5G', price: 40 }
	],
	// Néré
	'nere-pulpe': [
		{ size: '100G', price: 1000 },
		{ size: '200G', price: 1800 },
		{ size: '500G', price: 3500 },
		{ size: '1KG', price: 5625 }
	],
	'biscuit-de-nere-petit-format': [
		{ size: '3G', price: 25 },
		{ size: '5G', price: 40 }
	],
	'biscuit-de-nere-grand-format': [
		{ size: '500G', price: 4500 },
		{ size: '1000G', price: 9000 }
	],
	// Tchakpalo — formats individuels et bouteilles
	'tchakpalo-mangue': [
		{ size: '1/4 (verre)', price: 25 },
		{ size: '1/3 (verre)', price: 50 },
		{ size: '1/2 (verre)', price: 250 },
		{ size: '1L', price: 400 },
		{ size: '1,5L', price: 800 },
		{ size: '3L', price: 2000 },
		{ size: '5L', price: 3000 }
	],
	// Autres
	'couscous-igname': [
		{ size: '500G', price: 2196 },
		{ size: '700G', price: 2786 }
	]
};

async function main() {
	const pb = new PocketBase(PB_URL);
	await pb.collection('_superusers').authWithPassword(PB_EMAIL!, PB_PASSWORD!);

	let updated = 0;
	let skipped = 0;

	for (const [slug, variants] of Object.entries(VARIANTS)) {
		let rec;
		try {
			rec = await pb.collection('products').getFirstListItem(`slug = "${slug}"`);
		} catch {
			console.log(`  skipped ${slug} (not found)`);
			skipped++;
			continue;
		}

		const entryPrice = Math.min(...variants.map((v) => v.price));
		await pb.collection('products').update(rec.id, {
			variants,
			price: entryPrice
		});
		console.log(`✓ ${slug}: ${variants.length} variants, entry @ ${entryPrice} FCFA`);
		updated++;
	}

	console.log(`\nDone. Updated: ${updated}, skipped: ${skipped}.`);
}

main().catch((err) => {
	console.error(err);
	if ((err as { response?: unknown })?.response) {
		console.error('Response:', JSON.stringify((err as { response: unknown }).response, null, 2));
	}
	process.exit(1);
});
