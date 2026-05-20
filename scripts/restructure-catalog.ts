/**
 * Restructure the catalog to the canonical product list:
 *
 * - Bisbab is decomposed into 9 separate products (one per flavor/size combo).
 * - Biscuit de Néré is decomposed into 3 separate products (3G/5G, Super 50G, 500G/1KG).
 * - All other products are renamed in place to the canonical "Nom de Catégorie" form.
 * - No variants anywhere — sizes/flavors live in the product name.
 *
 * Idempotent.
 *
 * Usage: npm run catalog:restructure
 */

import PocketBase from 'pocketbase';

const PB_URL = process.env.POCKETBASE_URL;
const PB_EMAIL = process.env.PB_ADMIN_EMAIL || process.env.PB_EMAIL;
const PB_PASSWORD = process.env.PB_ADMIN_PASSWORD || process.env.PB_PASSWORD;

if (!PB_URL || !PB_EMAIL || !PB_PASSWORD) {
	console.error('Missing env: POCKETBASE_URL, PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD');
	process.exit(1);
}

const RENAMES: Array<{ slug: string; name: string }> = [
	{ slug: 'fonio-grain', name: 'Grains de Fonio' },
	{ slug: 'farine-de-fonio', name: 'Farine de Fonio' },
	{ slug: 'couscous-de-fonio', name: 'Couscous de Fonio' },
	{ slug: 'fonio-biscuit', name: 'Biscuit de Fonio' },
	{ slug: 'fonio-galette', name: 'Galette de Fonio' },
	{ slug: 'fonio-chips', name: 'Chips de Fonio' },
	{ slug: 'baobab-pulpe', name: 'Pulpe de baobab' },
	{ slug: 'baobab-huile', name: 'Huile de baobab' },
	{ slug: 'nere-pulpe', name: 'Pulpe de Néré' },
	{ slug: 'marmelade-de-mangue', name: 'Marmelade de Mangue (90 ML / 370ML)' },
	{ slug: 'mangue-sechee', name: 'Mangue séchée' },
	{ slug: 'tchakpalo-mangue', name: 'Tchakpalo de Mangue (YEP-YEP)' },
	{ slug: 'papaye-sechee', name: 'Papaye Séchée' },
	{ slug: 'papaye-compote', name: 'Compote de papaye (90 ML / 370ML)' },
	{ slug: 'couscous-igname', name: 'Couscous d’igname' },
	{ slug: 'couscous-patate', name: 'Couscous de patate' },
	{ slug: 'chips-manioc', name: 'Chips de manioc' },
	{ slug: 'chips-riz', name: 'Chips de riz' },
	{ slug: 'poudre-curcuma', name: 'Poudre de curcuma' },
	{ slug: 'pur-miel', name: 'Pur miel' },
	{ slug: 'tomate-entiere', name: 'Tomate entière' },
	{ slug: 'puree-tomate', name: 'Purée de tomate' },
	{ slug: 'concentre-tomate', name: 'Concentré de tomate' }
];

const DELETES = ['bisbab', 'nere-biscuit', 'fonio-farine-instantanee'];

const CREATES: Array<{ slug: string; name: string; category: string; order: number }> = [
	// Fonio
	{ slug: 'farine-enrichie-de-fonio', name: 'Farine enrichie de Fonio', category: 'fonio', order: 3 },
	// Baobab — Bisbab as 9 products
	{ slug: 'bisbab-dragee', name: 'Bisbab Dragée', category: 'baobab', order: 100 },
	{ slug: 'bisbab-nature', name: 'Bisbab Nature (50G)', category: 'baobab', order: 101 },
	{ slug: 'bisbab-bissap', name: 'Bisbab Bissap (50G)', category: 'baobab', order: 102 },
	{ slug: 'bisbab-nere', name: 'Bisbab Néré (50G)', category: 'baobab', order: 103 },
	{ slug: 'bisbab-gingembre', name: 'Bisbab Gingembre (50G)', category: 'baobab', order: 104 },
	{ slug: 'bisbab-curcuma', name: 'Bisbab Curcuma (50G)', category: 'baobab', order: 105 },
	{ slug: 'bisbab-artemisia', name: 'Bisbab Artemisia (50G)', category: 'baobab', order: 106 },
	{ slug: 'bisbab-fagara', name: 'Bisbab Fagara (50G)', category: 'baobab', order: 107 },
	{ slug: 'bisbab-grand-format', name: 'Bisbab (250G/500G/1KG)', category: 'baobab', order: 108 },
	// Néré — biscuit as 3 products
	{ slug: 'biscuit-de-nere-petit-format', name: 'Biscuit de Néré (3G / 5G)', category: 'nere', order: 200 },
	{ slug: 'super-biscuit-de-nere', name: 'Super biscuit de Néré (50G)', category: 'nere', order: 201 },
	{ slug: 'biscuit-de-nere-grand-format', name: 'Biscuit de Néré (500G/1KG)', category: 'nere', order: 202 }
];

async function main() {
	const pb = new PocketBase(PB_URL);
	await pb.collection('_superusers').authWithPassword(PB_EMAIL!, PB_PASSWORD!);

	let renamed = 0;
	let cleared = 0;
	let deleted = 0;
	let created = 0;
	let skipped = 0;

	// 1. Rename + clear variants
	for (const r of RENAMES) {
		try {
			const rec = await pb.collection('products').getFirstListItem(`slug = "${r.slug}"`);
			const patch: Record<string, unknown> = {};
			if (rec.name !== r.name) patch.name = r.name;
			if (Array.isArray(rec.variants) && rec.variants.length > 0) {
				patch.variants = [];
				cleared++;
			}
			if (Object.keys(patch).length > 0) {
				await pb.collection('products').update(rec.id, patch);
				if (patch.name) {
					console.log(`✓ renamed ${r.slug} → "${r.name}"`);
					renamed++;
				}
			}
		} catch {
			console.log(`  skipped rename ${r.slug} (not found)`);
		}
	}

	// 2. Delete obsolete products
	for (const slug of DELETES) {
		try {
			const rec = await pb.collection('products').getFirstListItem(`slug = "${slug}"`);
			await pb.collection('products').delete(rec.id);
			console.log(`✓ deleted ${slug}`);
			deleted++;
		} catch {
			console.log(`  skipped delete ${slug} (already gone)`);
		}
	}

	// 3. Create the new products
	for (const c of CREATES) {
		try {
			await pb.collection('products').getFirstListItem(`slug = "${c.slug}"`);
			skipped++;
			continue;
		} catch {
			// not found — create it
		}
		await pb.collection('products').create({
			slug: c.slug,
			name: c.name,
			category: c.category,
			description: '',
			detailed_description: '',
			featured: false,
			published: false,
			order: c.order,
			variants: [],
			tags: [],
			benefits: [],
			quality_claims: []
		});
		console.log(`✓ created ${c.slug} ("${c.name}")`);
		created++;
	}

	console.log(
		`\nDone. Renamed: ${renamed}, variants cleared: ${cleared}, deleted: ${deleted}, created: ${created}, skipped (already present): ${skipped}.`
	);
}

main().catch((err) => {
	console.error(err);
	if ((err as { response?: unknown })?.response) {
		console.error('Response:', JSON.stringify((err as { response: unknown }).response, null, 2));
	}
	process.exit(1);
});
