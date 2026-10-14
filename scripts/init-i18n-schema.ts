/**
 * i18n Schema Initializer
 *
 * Idempotently adds what the English version of the site needs in PocketBase:
 * - cms_content.locale (select fr|en). Existing records are backfilled to `fr`
 *   and the unique index moves from (key) to (key, locale).
 * - an `en` JSON field on products, categories, trainings and sales_points,
 *   holding the English overrides listed in src/lib/cms/translate.ts.
 *
 * Usage: npm run i18n:init-schema
 * Env:   POCKETBASE_URL, PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD
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
type Collection = { id: string; name: string; fields: AnyField[]; indexes: string[] };

const TRANSLATED_COLLECTIONS = ['products', 'categories', 'trainings', 'sales_points'];
const CMS_INDEX = 'CREATE UNIQUE INDEX idx_cms_key_locale ON cms_content (key, locale)';

async function main() {
	const pb = new PocketBase(PB_URL);
	await pb.collection('_superusers').authWithPassword(PB_EMAIL!, PB_PASSWORD!);

	const collections = (await pb.collections.getFullList()) as unknown as Collection[];
	const byName = (name: string) => {
		const col = collections.find((c) => c.name === name);
		if (!col) throw new Error(`${name} collection not found.`);
		return col;
	};

	// cms_content.locale
	const cms = byName('cms_content');
	const cmsFields = cms.fields.slice();
	let cmsChanged = false;
	if (!cmsFields.some((f) => f.name === 'locale')) {
		cmsFields.push({ name: 'locale', type: 'select', maxSelect: 1, values: ['fr', 'en'] });
		cmsChanged = true;
	}
	const indexes = cms.indexes.filter((i) => !/\bidx_cms_key\b/.test(i));
	if (!indexes.includes(CMS_INDEX)) {
		indexes.push(CMS_INDEX);
		cmsChanged = true;
	}
	if (cmsChanged) {
		await pb.collections.update(cms.id, { fields: cmsFields, indexes });
		console.log('cms_content: locale field + (key, locale) unique index ensured');
	}
	const untagged = await pb.collection('cms_content').getFullList({ filter: 'locale = ""' });
	for (const record of untagged) {
		await pb.collection('cms_content').update(record.id, { locale: 'fr' });
	}
	if (untagged.length) console.log(`cms_content: ${untagged.length} record(s) tagged as fr`);

	// `en` JSON field on translated collections
	for (const name of TRANSLATED_COLLECTIONS) {
		const col = byName(name);
		if (col.fields.some((f) => f.name === 'en')) continue;
		await pb.collections.update(col.id, {
			fields: [...col.fields, { name: 'en', type: 'json', maxSize: 2_000_000 }]
		});
		console.log(`${name}: en JSON field added`);
	}

	console.log('i18n schema up to date.');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
