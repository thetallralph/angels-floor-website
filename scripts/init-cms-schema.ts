/**
 * CMS Schema Initializer
 *
 * Ensures the PocketBase `cms_content` collection has the fields and options
 * required by the CMS: type accepts text|richtext|image|gallery, and there is
 * an `images` multi-file field for galleries.
 *
 * Usage: npx tsx scripts/init-cms-schema.ts
 * Env:   POCKETBASE_URL, PB_EMAIL, PB_PASSWORD
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

const REQUIRED_TYPES = ['text', 'richtext', 'image', 'gallery'];

async function main() {
	const pb = new PocketBase(PB_URL);
	await pb.collection('_superusers').authWithPassword(PB_EMAIL, PB_PASSWORD);

	const collections = await pb.collections.getFullList();
	const col = collections.find((c) => c.name === 'cms_content');
	if (!col) {
		throw new Error('cms_content collection not found. Create it in PocketBase admin first.');
	}

	const fields = ((col as unknown as { fields: AnyField[] }).fields ?? []).slice();

	const typeField = fields.find((f) => f.name === 'type');
	let changed = false;

	if (typeField && typeField.type === 'select') {
		const values = ((typeField.values as string[]) ?? []).slice();
		for (const v of REQUIRED_TYPES) {
			if (!values.includes(v)) {
				values.push(v);
				changed = true;
			}
		}
		typeField.values = values;
	}

	const imagesField = fields.find((f) => f.name === 'images');
	if (!imagesField) {
		fields.push({
			name: 'images',
			type: 'file',
			maxSelect: 50,
			maxSize: 5_242_880,
			mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
		});
		changed = true;
	}

	if (!changed) {
		console.log('cms_content schema already up to date.');
		return;
	}

	await pb.collections.update(col.id, { fields });
	console.log('cms_content schema updated:');
	console.log('  - type select now includes:', REQUIRED_TYPES.join(', '));
	console.log('  - images (multi-file) field ensured');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
