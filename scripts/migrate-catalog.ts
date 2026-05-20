/**
 * Catalog migration — categories + products.
 *
 * Idempotent. Brings PocketBase to the 6-category / variant-aware schema:
 *
 * categories collection:
 *   + image (file, single)
 *   + published (bool)
 *
 * categories records:
 *   - fonio    → name "Fonio",        order 1
 *   - baobab   → name "Baobab",       order 2
 *   - nere-fagara → slug "nere", name "Néré", order 3
 *   - mangue   → name "Mangue",       order 4
 *   - bisbab   → deleted (was a Baobab subcategory; Bisbab becomes a product)
 *   + papaye   (Papaye, order 5)
 *   + autres   (Autres produits, order 6)
 *
 * products collection:
 *   + variants (json)
 *   + tags (json)
 *   + published (bool)
 *   ~ category select values → [fonio,baobab,nere,mangue,papaye,autres]
 *
 * Usage: npm run catalog:migrate
 */

import PocketBase from 'pocketbase';

const PB_URL = process.env.POCKETBASE_URL;
const PB_EMAIL = process.env.PB_ADMIN_EMAIL || process.env.PB_EMAIL;
const PB_PASSWORD = process.env.PB_ADMIN_PASSWORD || process.env.PB_PASSWORD;

if (!PB_URL || !PB_EMAIL || !PB_PASSWORD) {
	console.error('Missing env: POCKETBASE_URL, PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD');
	process.exit(1);
}

type AnyField = Record<string, unknown> & { name: string; type: string };

const IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

const CATEGORY_TARGET: Array<{ slug: string; name: string; order: number; description: string }> = [
	{ slug: 'fonio', name: 'Fonio', order: 1, description: '' },
	{ slug: 'baobab', name: 'Baobab', order: 2, description: '' },
	{ slug: 'nere', name: 'Néré', order: 3, description: '' },
	{ slug: 'mangue', name: 'Mangue', order: 4, description: '' },
	{ slug: 'papaye', name: 'Papaye', order: 5, description: '' },
	{ slug: 'autres', name: 'Autres produits', order: 6, description: '' }
];

const CATEGORY_SLUGS = CATEGORY_TARGET.map((c) => c.slug);

async function main() {
	const pb = new PocketBase(PB_URL);
	await pb.collection('_superusers').authWithPassword(PB_EMAIL!, PB_PASSWORD!);

	await migrateCategoriesSchema(pb);
	await migrateCategoryRecords(pb);
	await migrateProductsSchema(pb);

	console.log('\n✓ Catalog migration complete.');
}

async function migrateCategoriesSchema(pb: PocketBase) {
	const coll = await pb.collections.getOne('categories');
	const fields = ((coll as unknown as { fields: AnyField[] }).fields ?? []).slice();
	let changed = false;

	if (!fields.find((f) => f.name === 'image')) {
		fields.push({
			name: 'image',
			type: 'file',
			maxSelect: 1,
			maxSize: 5_242_880,
			mimeTypes: IMAGE_MIME
		});
		changed = true;
	}
	if (!fields.find((f) => f.name === 'published')) {
		fields.push({ name: 'published', type: 'bool' });
		changed = true;
	}

	if (changed) {
		await pb.collections.update(coll.id, { fields });
		console.log('✓ categories schema: added image + published');
	} else {
		console.log('• categories schema: already up to date');
	}
}

async function migrateCategoryRecords(pb: PocketBase) {
	const existing = await pb.collection('categories').getFullList();
	const bySlug = new Map(existing.map((r) => [String(r.slug), r]));

	// Rename nere-fagara → nere (preserves any product references via re-mapping later).
	const oldNere = bySlug.get('nere-fagara');
	if (oldNere && !bySlug.has('nere')) {
		await pb.collection('categories').update(oldNere.id, { slug: 'nere', name: 'Néré', order: 3 });
		console.log('✓ categories: renamed nere-fagara → nere');
		bySlug.delete('nere-fagara');
		bySlug.set('nere', { ...oldNere, slug: 'nere', name: 'Néré', order: 3 });
	}

	// Delete bisbab (only if no product still references it).
	const bisbab = bySlug.get('bisbab');
	if (bisbab) {
		const refs = await pb.collection('products').getFullList({ filter: 'category = "bisbab"' });
		if (refs.length > 0) {
			console.warn(`⚠ categories: bisbab kept — ${refs.length} product(s) still reference it`);
		} else {
			await pb.collection('categories').delete(bisbab.id);
			console.log('✓ categories: deleted bisbab');
			bySlug.delete('bisbab');
		}
	}

	for (const target of CATEGORY_TARGET) {
		const cur = bySlug.get(target.slug);
		if (!cur) {
			await pb.collection('categories').create({
				slug: target.slug,
				name: target.name,
				description: target.description,
				order: target.order,
				published: true
			});
			console.log(`✓ categories: created ${target.slug}`);
		} else {
			const patch: Record<string, unknown> = {};
			if (cur.name !== target.name) patch.name = target.name;
			if (cur.order !== target.order) patch.order = target.order;
			if (cur.published === undefined || cur.published === null) patch.published = true;
			if (Object.keys(patch).length > 0) {
				await pb.collection('categories').update(cur.id, patch);
				console.log(`✓ categories: updated ${target.slug} (${Object.keys(patch).join(', ')})`);
			}
		}
	}
}

async function migrateProductsSchema(pb: PocketBase) {
	const coll = await pb.collections.getOne('products');
	const fields = ((coll as unknown as { fields: AnyField[] }).fields ?? []).slice();
	let changed = false;

	if (!fields.find((f) => f.name === 'variants')) {
		fields.push({ name: 'variants', type: 'json', maxSize: 0 });
		changed = true;
	}
	if (!fields.find((f) => f.name === 'tags')) {
		fields.push({ name: 'tags', type: 'json', maxSize: 0 });
		changed = true;
	}
	if (!fields.find((f) => f.name === 'published')) {
		fields.push({ name: 'published', type: 'bool' });
		changed = true;
	}

	// BPV label fields — sourced from the "Bon Pour Validation" template used to design every label.
	if (!fields.find((f) => f.name === 'subtitle')) {
		fields.push({ name: 'subtitle', type: 'text' });
		changed = true;
	}
	if (!fields.find((f) => f.name === 'tagline')) {
		fields.push({ name: 'tagline', type: 'text' });
		changed = true;
	}
	if (!fields.find((f) => f.name === 'special_mention')) {
		fields.push({ name: 'special_mention', type: 'text' });
		changed = true;
	}
	if (!fields.find((f) => f.name === 'quality_claims')) {
		fields.push({ name: 'quality_claims', type: 'json', maxSize: 0 });
		changed = true;
	}
	if (!fields.find((f) => f.name === 'preparation')) {
		fields.push({ name: 'preparation', type: 'json', maxSize: 0 });
		changed = true;
	}
	if (!fields.find((f) => f.name === 'conservation')) {
		fields.push({ name: 'conservation', type: 'text' });
		changed = true;
	}

	// Drafts may not have a price set yet — relax the required constraint.
	const priceField = fields.find((f) => f.name === 'price');
	if (priceField && priceField.required) {
		priceField.required = false;
		changed = true;
	}

	const categoryField = fields.find((f) => f.name === 'category');
	if (categoryField && categoryField.type === 'select') {
		const currentValues = Array.isArray(categoryField.values) ? (categoryField.values as string[]) : [];

		// Migrate any product still referencing nere-fagara → nere before pruning the value.
		if (currentValues.includes('nere-fagara')) {
			const stale = await pb.collection('products').getFullList({ filter: 'category = "nere-fagara"' });
			for (const p of stale) {
				await pb.collection('products').update(p.id, { category: 'nere' });
				console.log(`✓ products: migrated ${p.slug} category nere-fagara → nere`);
			}
		}

		// Build the final allowed list: target slugs + any legacy slug still in use by a product.
		const stillUsed = new Set<string>();
		for (const slug of currentValues) {
			if (CATEGORY_SLUGS.includes(slug)) continue;
			if (slug === 'nere-fagara') continue;
			const refs = await pb.collection('products').getFullList({ filter: `category = "${slug}"` });
			if (refs.length > 0) {
				stillUsed.add(slug);
				console.warn(`⚠ products.category: keeping legacy "${slug}" — ${refs.length} product(s) still use it`);
			}
		}
		const finalValues = [...CATEGORY_SLUGS, ...stillUsed];
		if (
			finalValues.length !== currentValues.length ||
			finalValues.some((v, i) => v !== currentValues[i])
		) {
			categoryField.values = finalValues;
			changed = true;
		}
	}

	if (changed) {
		await pb.collections.update(coll.id, { fields });
		console.log('✓ products schema: updated (variants/tags/published + category values)');
	} else {
		console.log('• products schema: already up to date');
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
