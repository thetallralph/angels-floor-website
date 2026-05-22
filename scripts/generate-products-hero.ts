/**
 * Generate the hero image for the Products catalog page.
 *
 * Flat-lay overhead composition showcasing the diversity of Angel's Floor
 * products (fonio, baobab, néré, dried fruits, biscuits) on a rustic
 * Beninese table. Uses fal-ai/flux-pro v1.1-ultra raw mode for documentary
 * feel matching the rest of the site's imagery.
 *
 * Output: static/images/products/hero.jpg
 * Usage:  npx tsx scripts/generate-products-hero.ts
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) {
	console.error('Missing FAL_KEY env var');
	process.exit(1);
}

const OUTPUT_DIR = join(process.cwd(), 'static', 'images', 'products');
const OUTPUT_PATH = join(OUTPUT_DIR, 'hero.jpg');

const PROMPT = `Wide overhead flat-lay documentary photograph of a variety of natural West African food products from Benin arranged organically on a weathered dark-wood plank table: a shallow unglazed clay bowl filled with cream-colored fonio grains, a small wooden bowl of pale beige fonio flour, a hand-carved wooden bowl with broken pieces of white baobab pulp showing dark seeds, a small calabash of golden-brown baobab powder, a halved baobab fruit on a small woven straw mat showing the white interior and dark seeds, a small stack of three or four simple homemade round biscuits, two or three dried mango strips draped naturally across the wood, a few raw fonio stalks with dry pale leaves laid diagonally at one corner for rhythm, a small handful of dark earthy néré seeds scattered loosely, a battered metal calabash on its side with grains spilling out gently, a hand-woven indigo cotton cloth folded at one corner, a small terracotta pestle and mortar partially in frame, soft natural side daylight casting gentle shadows from the upper left, warm earth-tone palette with deep wood, terracotta clay, indigo blue, and golden grain colors, faithful color, natural texture, slight natural grain, no plastic packaging, no modern branding, no text, no logos, no styling artifice, authentic rural Benin food photography, candid composition not perfectly symmetrical.`;

async function callFluxUltra(prompt: string, aspect: '16:9' | '21:9'): Promise<string> {
	const res = await fetch('https://fal.run/fal-ai/flux-pro/v1.1-ultra', {
		method: 'POST',
		headers: {
			Authorization: `Key ${FAL_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			prompt,
			aspect_ratio: aspect,
			num_images: 1,
			raw: true,
			output_format: 'jpeg',
			safety_tolerance: '5',
			enable_safety_checker: false
		})
	});
	if (!res.ok) {
		throw new Error(`flux-pro/v1.1-ultra ${res.status}: ${await res.text()}`);
	}
	const data = (await res.json()) as { images: { url: string }[] };
	return data.images[0].url;
}

async function downloadTo(url: string, path: string): Promise<void> {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`download ${res.status} for ${url}`);
	const buf = Buffer.from(await res.arrayBuffer());
	await writeFile(path, buf);
}

async function main() {
	await mkdir(OUTPUT_DIR, { recursive: true });
	const t0 = Date.now();
	console.log('[start] products/hero (21:9) on flux-pro v1.1-ultra raw mode');
	const url = await callFluxUltra(PROMPT, '21:9');
	await downloadTo(url, OUTPUT_PATH);
	console.log(`[ok]    products/hero → ${OUTPUT_PATH} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
