/**
 * Studio MVP — generate product images via fal.ai.
 *
 * For each target product:
 * - if it has an existing real photo in PB → image-to-image (FLUX Kontext)
 *   to keep the actual packaging while restyling the scene
 * - else → text-to-image (FLUX dev) using only the product name + brand prompt
 *
 * Outputs are saved to .claude/contexte/generated/{slug}/ alongside the source
 * (if any), so you can A/B them at a glance.
 *
 * Usage:
 *   npm run studio:generate                 # default: 5 hand-picked products
 *   npm run studio:generate -- <slug>...    # restrict to specific slugs
 */

import PocketBase from 'pocketbase';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const PB_URL = process.env.POCKETBASE_URL;
const PB_EMAIL = process.env.PB_ADMIN_EMAIL || process.env.PB_EMAIL;
const PB_PASSWORD = process.env.PB_ADMIN_PASSWORD || process.env.PB_PASSWORD;
const FAL_KEY = process.env.FAL_KEY;
const MODEL = (process.env.STUDIO_MODEL || 'auto').toLowerCase();

if (!PB_URL || !PB_EMAIL || !PB_PASSWORD) {
	console.error('Missing env: POCKETBASE_URL, PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD');
	process.exit(1);
}
if (!FAL_KEY) {
	console.error('Missing env: FAL_KEY');
	process.exit(1);
}

const OUT_ROOT = '.claude/contexte/generated';

const DEFAULT_TARGETS = [
	'farine-de-fonio', // has real photo
	'couscous-de-fonio', // has real photo
	'marmelade-de-mangue', // has real photo
	'bisbab-nature', // no photo, T2I mockup
	'fonio-grain' // no photo, T2I mockup (BPV-rich)
];

const BRAND_STYLE =
	'premium product photography for a Beninese artisanal natural-food brand, ' +
	'warm natural side light, soft shadows, shallow depth of field, ' +
	'on a rustic wooden surface with cream linen and a few dried baobab leaves, ' +
	'deep earth tones, muted greens and warm ochres, magazine editorial feel, ' +
	'centered composition, square framing 1:1';

type Product = {
	id: string;
	slug: string;
	name: string;
	subtitle?: string;
	description?: string;
	category: string;
	images?: string[];
};

async function main() {
	const cliArgs = process.argv.slice(2);
	const wantAll = cliArgs.includes('all') || cliArgs.includes('--all');
	const targetSlugs = wantAll ? null : cliArgs.length > 0 ? cliArgs : DEFAULT_TARGETS;

	const pb = new PocketBase(PB_URL);
	await pb.collection('_superusers').authWithPassword(PB_EMAIL!, PB_PASSWORD!);

	const allProducts = await pb.collection('products').getFullList({ sort: 'order,name' });
	const products: Product[] = allProducts
		.filter((r) => targetSlugs === null || targetSlugs.includes(String(r.slug)))
		.map((r) => ({
			id: r.id,
			slug: r.slug,
			name: r.name,
			subtitle: r.subtitle || '',
			description: r.description || '',
			category: r.category,
			images: Array.isArray(r.images) ? r.images : []
		}));

	if (products.length === 0) {
		console.error('No matching products found for slugs:', targetSlugs);
		process.exit(1);
	}

	await mkdir(OUT_ROOT, { recursive: true });

	console.log(`Generating images for ${products.length} product(s)…\n`);

	for (const product of products) {
		const productDir = join(OUT_ROOT, product.slug);
		await mkdir(productDir, { recursive: true });

		const sourceUrl =
			product.images && product.images.length > 0
				? `${PB_URL!.replace(/\/$/, '')}/api/files/products/${product.id}/${product.images[0]}`
				: null;

		const prompt = buildPrompt(product);
		console.log(`▸ ${product.slug}`);
		console.log(`  prompt: ${prompt.slice(0, 110)}…`);

		try {
			let result: { images: { url: string }[]; mode: string };
			if (MODEL === 'schnell') {
				console.log('  mode:   text-to-image (FLUX schnell, forced)');
				result = await callSchnell(prompt);
				result.mode = 'schnell';
			} else if (MODEL === 'dev') {
				console.log('  mode:   text-to-image (FLUX dev, forced)');
				result = await callFluxDev(prompt);
				result.mode = 'flux-dev';
			} else if (sourceUrl) {
				// auto mode: kontext when we have a real source (preserves real packaging)
				console.log(`  mode:   image-to-image kontext (source: ${product.images?.[0]})`);
				await saveSource(productDir, sourceUrl);
				result = await callKontext(prompt, sourceUrl);
				result.mode = 'kontext';
			} else {
				// auto mode: schnell otherwise (cheap, good for mockups)
				console.log('  mode:   text-to-image (FLUX schnell, auto)');
				result = await callSchnell(prompt);
				result.mode = 'schnell';
			}

			for (let i = 0; i < result.images.length; i++) {
				const outPath = join(productDir, `gen_${result.mode}_${i + 1}.jpg`);
				await downloadTo(result.images[i].url, outPath);
				console.log(`  ✓ saved ${outPath}`);
			}
		} catch (err) {
			console.error(`  ✗ failed: ${err instanceof Error ? err.message : String(err)}`);
		}
		console.log();
	}

	console.log(`Done. Open .claude/contexte/generated/ to review.`);
}

function buildPrompt(p: Product): string {
	const subtitle = p.subtitle ? ` (${p.subtitle.toLowerCase()})` : '';
	const desc = p.description ? `. ${p.description}` : '';
	const form = inferForm(p);
	const formHint = form ? ` Presented as ${form}.` : '';
	return `${p.name}${subtitle}, a Beninese natural product${desc}.${formHint} ${BRAND_STYLE}.`;
}

/**
 * Best-effort guess of the physical form to nudge the AI toward the right composition.
 * Falls back to nothing if the slug/name doesn't match — the description carries the rest.
 */
function inferForm(p: Product): string | null {
	const s = `${p.slug} ${p.name}`.toLowerCase();
	if (/chips/.test(s)) return 'a small open craft-paper bag with chips spilling out next to it';
	if (/marmelade|compote|miel/.test(s)) return 'a small glass jar with a metal lid';
	if (/tchakpalo/.test(s)) return 'a glass bottle of golden amber liquid, condensation on the glass';
	if (/poudre|pulpe/.test(s)) return 'a small wooden bowl filled with fine natural powder';
	if (/dragee|biscuit|galette/.test(s)) return 'small round artisanal confections piled on a ceramic plate';
	if (/farine/.test(s)) return 'a kraft-paper pouch of flour, partially open, with flour spilled around';
	if (/couscous/.test(s)) return 'a wooden bowl filled with golden couscous grains';
	if (/grains?$|grain /.test(s) || /grains de/.test(s)) return 'a wooden bowl heaped with whole cereal grains, a few grains scattered around';
	if (/huile/.test(s)) return 'a clear glass bottle of golden oil';
	if (/tomate/.test(s)) return 'a small tin can or glass jar of tomato product';
	if (/sechee|séchée/.test(s)) return 'pieces of dried fruit arranged on a slate or wooden board';
	if (/bisbab/.test(s)) return 'a small kraft pouch with a label, and a few round confections beside it';
	return null;
}

async function callSchnell(prompt: string): Promise<{ images: { url: string }[]; mode: string }> {
	const res = await fetch('https://fal.run/fal-ai/flux/schnell', {
		method: 'POST',
		headers: {
			Authorization: `Key ${FAL_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			prompt,
			image_size: 'square_hd',
			num_inference_steps: 4,
			num_images: 2,
			enable_safety_checker: false
		})
	});
	if (!res.ok) {
		throw new Error(`flux/schnell ${res.status}: ${await res.text()}`);
	}
	return { ...((await res.json()) as { images: { url: string }[] }), mode: 'schnell' };
}

async function callFluxDev(prompt: string): Promise<{ images: { url: string }[]; mode: string }> {
	const res = await fetch('https://fal.run/fal-ai/flux/dev', {
		method: 'POST',
		headers: {
			Authorization: `Key ${FAL_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			prompt,
			image_size: 'square_hd',
			num_inference_steps: 28,
			num_images: 2,
			enable_safety_checker: false
		})
	});
	if (!res.ok) {
		throw new Error(`flux/dev ${res.status}: ${await res.text()}`);
	}
	return { ...((await res.json()) as { images: { url: string }[] }), mode: 'flux-dev' };
}

async function callKontext(
	prompt: string,
	imageUrl: string
): Promise<{ images: { url: string }[]; mode: string }> {
	const res = await fetch('https://fal.run/fal-ai/flux-pro/kontext', {
		method: 'POST',
		headers: {
			Authorization: `Key ${FAL_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			prompt,
			image_url: imageUrl,
			num_images: 2,
			output_format: 'jpeg',
			safety_tolerance: '5'
		})
	});
	if (!res.ok) {
		throw new Error(`kontext ${res.status}: ${await res.text()}`);
	}
	return { ...((await res.json()) as { images: { url: string }[] }), mode: 'kontext' };
}

async function downloadTo(url: string, path: string): Promise<void> {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`download ${res.status} for ${url}`);
	const buf = Buffer.from(await res.arrayBuffer());
	await writeFile(path, buf);
}

async function saveSource(productDir: string, sourceUrl: string): Promise<void> {
	const outPath = join(productDir, 'source.jpg');
	try {
		await downloadTo(sourceUrl, outPath);
	} catch (err) {
		console.error(`  (could not save source: ${err instanceof Error ? err.message : err})`);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
