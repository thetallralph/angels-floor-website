/**
 * Catalog seed — products.
 *
 * Idempotent. Creates the missing products from the canonical catalog list.
 * Matches by slug; existing products are left untouched (the user may have
 * edited their description, images, or price).
 *
 * All seeded products start as drafts (published: false) with placeholder
 * pricing, so the admin can fill them in.
 *
 * Usage: npm run catalog:seed
 */

import PocketBase from 'pocketbase';

const PB_URL = process.env.POCKETBASE_URL;
const PB_EMAIL = process.env.PB_ADMIN_EMAIL || process.env.PB_EMAIL;
const PB_PASSWORD = process.env.PB_ADMIN_PASSWORD || process.env.PB_PASSWORD;

if (!PB_URL || !PB_EMAIL || !PB_PASSWORD) {
	console.error('Missing env: POCKETBASE_URL, PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD');
	process.exit(1);
}

type Variant = { size?: string; flavor?: string; label?: string };

type SeedProduct = {
	slug: string;
	name: string;
	category: string;
	description?: string;
	variants?: Variant[];
	tags?: string[];
	/** Legacy slugs that represent the same product. Skip seeding if any of these exist. */
	aliases?: string[];
};

const SEED: SeedProduct[] = [
	// === FONIO ===
	{ slug: 'fonio-grain', name: 'Fonio en grain', category: 'fonio' },
	{ slug: 'fonio-farine', name: 'Farine de fonio', category: 'fonio', aliases: ['farine-de-fonio'] },
	{ slug: 'fonio-farine-instantanee', name: 'Farine de fonio instantanée', category: 'fonio' },
	{ slug: 'fonio-couscous', name: 'Couscous de fonio', category: 'fonio', aliases: ['couscous-de-fonio'] },
	{ slug: 'fonio-biscuit', name: 'Biscuit de fonio', category: 'fonio' },
	{ slug: 'fonio-galette', name: 'Galette de fonio', category: 'fonio' },
	{ slug: 'fonio-chips', name: 'Chips de fonio', category: 'fonio' },

	// === BAOBAB ===
	{ slug: 'baobab-pulpe', name: 'Pulpe de baobab', category: 'baobab' },
	{
		slug: 'bisbab',
		name: 'Bisbab',
		category: 'baobab',
		description: 'Confiserie de baobab Angel’s Floor, déclinée en plusieurs tailles et parfums.',
		variants: [
			{ size: '3G', label: 'Dragée' },
			{ size: '5G', label: 'Dragée' },
			{ size: '50G', flavor: 'Nature' },
			{ size: '50G', flavor: 'Bissap' },
			{ size: '50G', flavor: 'Au Néré' },
			{ size: '50G', flavor: 'Gingembre' },
			{ size: '50G', flavor: 'Curcuma' },
			{ size: '50G', flavor: 'Artémisia' },
			{ size: '50G', flavor: 'Au Fagara' },
			{ size: '250G' },
			{ size: '500G' },
			{ size: '1KG' }
		]
	},
	{ slug: 'baobab-huile', name: 'Huile de baobab', category: 'baobab' },

	// === NÉRÉ ===
	{ slug: 'nere-pulpe', name: 'Pulpe de néré', category: 'nere' },
	{
		slug: 'nere-biscuit',
		name: 'Biscuit de néré',
		category: 'nere',
		variants: [
			{ size: '3G' },
			{ size: '5G' },
			{ size: '50G', label: 'Super biscuit' },
			{ size: '500G' },
			{ size: '1KG' }
		]
	},

	// === MANGUE ===
	{ slug: 'mangue-sechee', name: 'Mangue séchée', category: 'mangue' },
	{
		slug: 'mangue-marmelade',
		name: 'Marmelade de mangue',
		category: 'mangue',
		variants: [{ size: '90ML' }, { size: '370ML' }],
		aliases: ['marmelade-de-mangue']
	},
	{
		slug: 'tchakpalo-mangue',
		name: 'Tchakpalo de mangue (YEP-YEP)',
		category: 'mangue',
		description: 'Boisson traditionnelle béninoise à base de mangue.'
	},

	// === PAPAYE ===
	{ slug: 'papaye-sechee', name: 'Papaye séchée', category: 'papaye' },
	{
		slug: 'papaye-compote',
		name: 'Compote de papaye',
		category: 'papaye',
		variants: [{ size: '90ML' }, { size: '370ML' }]
	},

	// === AUTRES ===
	{ slug: 'couscous-igname', name: 'Couscous d’igname', category: 'autres', tags: ['couscous', 'igname'] },
	{ slug: 'couscous-patate', name: 'Couscous de patate', category: 'autres', tags: ['couscous', 'patate'] },
	{ slug: 'chips-manioc', name: 'Chips de manioc', category: 'autres', tags: ['chips', 'manioc'] },
	{ slug: 'chips-riz', name: 'Chips de riz', category: 'autres', tags: ['chips', 'riz'] },
	{ slug: 'poudre-curcuma', name: 'Poudre de curcuma', category: 'autres', tags: ['condiment', 'curcuma'] },
	{ slug: 'pur-miel', name: 'Pur miel', category: 'autres', tags: ['miel'] },
	{ slug: 'tomate-entiere', name: 'Tomate entière', category: 'autres', tags: ['tomate'] },
	{ slug: 'puree-tomate', name: 'Purée de tomate', category: 'autres', tags: ['tomate'] },
	{ slug: 'concentre-tomate', name: 'Concentré de tomate', category: 'autres', tags: ['tomate'] }
];

async function main() {
	const pb = new PocketBase(PB_URL);
	await pb.collection('_superusers').authWithPassword(PB_EMAIL!, PB_PASSWORD!);

	const existing = await pb.collection('products').getFullList();
	const existingSlugs = new Set(existing.map((r) => String(r.slug)));

	let created = 0;
	let skipped = 0;
	let order = existing.length;

	for (const p of SEED) {
		const conflictsWith = [p.slug, ...(p.aliases ?? [])].find((s) => existingSlugs.has(s));
		if (conflictsWith) {
			console.log(`  skipped ${p.slug} (already present as "${conflictsWith}")`);
			skipped++;
			continue;
		}
		await pb.collection('products').create({
			slug: p.slug,
			name: p.name,
			category: p.category,
			description: p.description ?? '',
			detailed_description: '',
			price: 0,
			featured: false,
			published: false,
			order: ++order,
			variants: p.variants ?? [],
			tags: p.tags ?? [],
			benefits: []
		});
		console.log(`✓ created ${p.slug} (${p.category})`);
		created++;
	}

	console.log(`\nDone. Created: ${created}, skipped (already present): ${skipped}, total seed: ${SEED.length}.`);
}

main().catch((err) => {
	console.error(err);
	if ((err as { response?: unknown })?.response) {
		console.error('Response:', JSON.stringify((err as { response: unknown }).response, null, 2));
	}
	process.exit(1);
});
