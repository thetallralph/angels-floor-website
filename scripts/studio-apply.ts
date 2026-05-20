/**
 * Apply generated studio images to the catalog.
 *
 * For each product slug found in .claude/contexte/generated/, append the
 * best-mode generated images to the product's `images` file field in PB.
 *
 * Mode preference (in this order):
 *   1. kontext  — preserves the real packaging on the 3 products that already
 *                 have a real photo. Appended *after* the existing photo so the
 *                 real shot stays primary.
 *   2. schnell  — T2I mockup for products without a real photo. Becomes the primary.
 *   3. flux-dev — fallback if no schnell/kontext exists.
 *
 * Idempotent-ish: re-running uploads the same files again. Strip generated
 * images via the admin if needed.
 *
 * Usage: npm run studio:apply
 *        npm run studio:apply -- <slug>...
 */

import PocketBase from 'pocketbase';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const PB_URL = process.env.POCKETBASE_URL;
const PB_EMAIL = process.env.PB_ADMIN_EMAIL || process.env.PB_EMAIL;
const PB_PASSWORD = process.env.PB_ADMIN_PASSWORD || process.env.PB_PASSWORD;
if (!PB_URL || !PB_EMAIL || !PB_PASSWORD) {
	console.error('Missing env: POCKETBASE_URL, PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD');
	process.exit(1);
}

const ROOT = '.claude/contexte/generated';
const MAX_PER_PRODUCT = 2;

const MODE_PRIORITY = ['kontext', 'schnell', 'flux-dev'] as const;

async function main() {
	const cliSlugs = process.argv.slice(2);

	const pb = new PocketBase(PB_URL);
	await pb.collection('_superusers').authWithPassword(PB_EMAIL!, PB_PASSWORD!);

	const allDirs = readdirSync(ROOT).filter((d) => {
		try {
			return statSync(join(ROOT, d)).isDirectory();
		} catch {
			return false;
		}
	});
	const targetDirs = cliSlugs.length > 0 ? allDirs.filter((d) => cliSlugs.includes(d)) : allDirs;

	if (targetDirs.length === 0) {
		console.error('No matching product folders.');
		process.exit(1);
	}

	let applied = 0;
	let skipped = 0;
	let failed = 0;

	for (const slug of targetDirs) {
		const dir = join(ROOT, slug);
		const allFiles = readdirSync(dir).filter((f) => f.startsWith('gen_') && f.endsWith('.jpg'));
		if (allFiles.length === 0) {
			console.log(`  - ${slug}: no generated files`);
			skipped++;
			continue;
		}

		// Pick best mode available
		let pickedMode: string | null = null;
		for (const mode of MODE_PRIORITY) {
			if (allFiles.some((f) => f.startsWith(`gen_${mode}_`))) {
				pickedMode = mode;
				break;
			}
		}
		if (!pickedMode) {
			console.log(`  - ${slug}: no recognized mode`);
			skipped++;
			continue;
		}

		const picked = allFiles
			.filter((f) => f.startsWith(`gen_${pickedMode}_`))
			.sort()
			.slice(0, MAX_PER_PRODUCT);

		let record;
		try {
			record = await pb.collection('products').getFirstListItem(`slug = "${slug}"`);
		} catch {
			console.log(`  ✗ ${slug}: not found in PB`);
			failed++;
			continue;
		}

		const fd = new FormData();
		for (const filename of picked) {
			const buffer = readFileSync(join(dir, filename));
			const blob = new Blob([new Uint8Array(buffer)], { type: 'image/jpeg' });
			fd.append('images+', blob, filename);
		}

		try {
			await pb.collection('products').update(record.id, fd);
			console.log(`✓ ${slug} (${pickedMode}): +${picked.length} image(s)`);
			applied++;
		} catch (err) {
			console.log(`  ✗ ${slug}: ${err instanceof Error ? err.message : String(err)}`);
			if ((err as { response?: unknown })?.response) {
				console.log('    response:', JSON.stringify((err as { response: unknown }).response));
			}
			failed++;
		}
	}

	console.log(`\nDone. Applied: ${applied}, skipped: ${skipped}, failed: ${failed}.`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
