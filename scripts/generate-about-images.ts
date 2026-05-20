/**
 * Generate documentary photos for the About page.
 *
 * 4 hero images + 7 timeline images, depicting the women's cooperative
 * in northern Benin (Atacora department: Otammari/Bariba/Waama context).
 *
 * Uses fal-ai/flux-pro v1.1-ultra with `raw: true` for the most photographic
 * (least AI-stylized) output. Every prompt describes a specific individual
 * (age, complexion, clothing, expression) to force visual diversity and
 * avoid the "same face / same wax-print" cliché.
 *
 * Output: static/images/about/{hero,timeline}-*.jpg
 * Usage:  npm run images:about
 *         npm run images:about hero
 *         npm run images:about timeline
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) {
	console.error('Missing FAL_KEY env var');
	process.exit(1);
}

const OUTPUT_DIR = join(process.cwd(), 'static', 'images', 'about');

type AspectRatio = '21:9' | '16:9' | '4:3' | '3:2' | '1:1' | '2:3' | '3:4' | '9:16' | '9:21';

type GenJob = {
	name: string;
	prompt: string;
	aspect: AspectRatio;
};

// Reusable directive — avoids "editorial / magazine / premium" trigger words
// that push flux toward an over-polished AI look. Emphasizes authenticity
// and natural skin texture.
const REAL_DOC =
	'Candid unposed documentary photograph from northern Benin, natural skin texture and pores visible, real wear on clothing, no glamorization, no beauty retouching, no decorative styling, no text, no logos, slight natural grain, faithful color, ordinary daily reality.';

const HERO_JOBS: GenJob[] = [
	{
		name: 'hero-portrait',
		aspect: '3:4',
		prompt: `Close-up portrait of an Otammari elder woman from Boukombé in northern Benin Atacora region, late 60s, deep mahogany skin with visible age, soft wrinkles around the eyes and mouth, subtle horizontal scarification lines on both temples (cultural marker), short closely-cropped gray-flecked hair, calm contemplative expression looking just past the camera (not directly at lens), wearing a worn indigo-dyed cotton wrap tied at one shoulder and two simple wooden bead necklaces, holding a small unglazed clay bowl of raw cream-colored fonio grains close to her chest with weathered hands, sitting on a low carved wooden stool in the doorway of a Tata Somba mud-brick dwelling, soft late afternoon side light, terracotta wall in background, no makeup, no jewelry beyond the beads. ${REAL_DOC}`
	},
	{
		name: 'hero-cooperative',
		aspect: '4:3',
		prompt: `Wide candid documentary photograph of four Bariba women of clearly different ages working together inside a covered open-sided rural workshop in Natitingou northern Benin: one woman in her early 20s with rich dark brown skin and short braided cornrows wearing a worn green t-shirt and a faded wax-print wrap skirt, one woman in her early 40s with warm medium-brown skin in a plain navy cotton dress and a faded red headscarf, one elder woman in her late 50s with deep ebony skin in earth-tone pagne fabric with a yellow geometric pattern, and one teenage girl about 16 in jeans and a simple white t-shirt with a small wrap over her hair; they are sorting and winnowing golden fonio grains on a large woven straw mat between them, each focused on her own task in quiet conversation rather than smiling at the camera, varied hand positions and expressions, woven baskets and dented metal calabashes scattered around, sunlight filtering through the corrugated metal roof creating soft patches of light, raw mud-brick wall in background. ${REAL_DOC}`
	},
	{
		name: 'hero-hands',
		aspect: '1:1',
		prompt: `Intimate overhead close-up photograph of two pairs of West African women's hands working together on a rough wooden table to sort fonio grains, one pair belonging to an elder with prominent veins, knobbly knuckles and calloused palms, the other pair younger with smoother skin but fingertips faintly stained from grain dust, both with short unpolished fingernails, a few cream-colored fonio grains scattered across the wood grain, a small woven basket partially visible at the edge of frame, no faces, soft natural daylight from a side window, real grit visible on the wood, gentle shadow, faithful color, no stylization, no decorative composition. ${REAL_DOC}`
	},
	{
		name: 'hero-packaging',
		aspect: '3:4',
		prompt: `Documentary photograph of two Beninese women working together at a simple wooden workbench in a small rural workshop in Atacora region, the first woman in her early thirties with warm dark brown skin and a relaxed natural expression (small smile not posed for camera), wearing a faded blue ankara shirt with sleeves rolled up and a plain dark green head wrap, the second woman in her late forties with deep ebony skin and short cropped hair, wearing a worn olive-green cotton dress with a beige apron tied at the waist, both carefully filling small undecorated kraft paper bags with golden fonio grains using a hand-held scoop, a hanging single lightbulb visible above, wooden shelves with mismatched glass jars and a small handwritten ledger book in the background, mid-morning natural daylight from a side window, no decorative composition, real workplace authenticity. ${REAL_DOC}`
	}
];

const TIMELINE_JOBS: GenJob[] = [
	{
		name: 'timeline-2015',
		aspect: '4:3',
		prompt: `Five Beninese women of clearly different ages and complexions seated together on the bare earth floor around a small woven mat with a modest pile of raw fonio grain spread out, inside a humble single-room mud-walled house with a small high window letting in soft light, the eldest woman (around 65, deep ebony skin, gray short hair) gesturing with her hands while explaining something, the others (in their 20s, 30s, 40s) listening with attentive serious expressions, mixed simple everyday clothing (worn cotton wraps and faded printed dresses in muted colors), no coordinated outfits, no smiling at camera, intimate beginnings, low warm side light, slight visible dust. ${REAL_DOC}`
	},
	{
		name: 'timeline-2016',
		aspect: '4:3',
		prompt: `A Beninese woman in her late thirties with rich dark brown skin and a small geometric scarification pattern on her right cheek, sitting at a small wooden table writing in a school exercise notebook with a blue ballpoint pen, several small kraft paper bags of fonio neatly arranged beside her and a simple metal hand-held kitchen scale, plain dark navy dress, head wrapped in a faded yellow scarf, focused concentrated expression looking down at the page, simple workshop background with a wooden shelf and a calendar pinned to the wall, late morning natural daylight from a side window. ${REAL_DOC}`
	},
	{
		name: 'timeline-2018',
		aspect: '4:3',
		prompt: `Wide candid group photograph of approximately fifteen Beninese women of clearly varied ages from late teens to late sixties and varied complexions (from warm medium brown to deep ebony), gathered casually in front of a low cement-block community building in rural Atacora, no coordinated outfits — some in plain cotton wraps, some in faded wax-print, a few in t-shirts with skirts, several with simple head scarves in different muted colors, some seated on a low bench and some standing behind, mixed natural expressions of quiet pride and seriousness rather than coordinated smiles for the camera, a baobab tree visible behind the building, dusty bare-earth courtyard, midday natural light. ${REAL_DOC}`
	},
	{
		name: 'timeline-2020',
		aspect: '4:3',
		prompt: `A Beninese woman in her early forties with medium-dark brown skin wearing a clean white food-grade hygienic apron over a faded green cotton dress and a white head covering with hair tucked away, carefully inspecting a clear glass jar of cream-colored fonio held up to the light, in a simple small production room with a stainless-steel work table, a few plastic crates stacked nearby and several clipboards with checklists hanging on the painted concrete wall, bare ceiling lightbulb providing clean cool overhead light, focused calm professional expression, no decorative composition, real food-safety workplace. ${REAL_DOC}`
	},
	{
		name: 'timeline-2022',
		aspect: '4:3',
		prompt: `A Beninese man in his early thirties and a Beninese woman in her late twenties (both with medium dark brown skin) loading several stacked cardboard boxes labeled with handwritten product names into the open back of a small dusty white delivery van outside a modest single-story warehouse with corrugated metal walls in northern Benin, he in faded jeans and a plain dark gray polo shirt, she in a long dark blue cotton skirt and a yellow t-shirt with a small wrap over her hair, both focused on the work, mid-afternoon dusty light, bare earth ground with a few tire tracks. ${REAL_DOC}`
	},
	{
		name: 'timeline-2023',
		aspect: '4:3',
		prompt: `A Beninese woman in her early fifties with warm dark brown skin and closely cropped gray-flecked natural hair, wearing a modest dark navy cotton dress with a simple woven gold-trim shawl draped over one shoulder, holding a small wooden plaque award with both hands at chest level, slight dignified relaxed smile (not exaggerated for camera), soft warm event lighting from above, blurred suggestion of an audience and event banner behind her, modest national women-entrepreneurship ceremony atmosphere in a community hall, indoor incandescent lighting. ${REAL_DOC}`
	},
	{
		name: 'timeline-2025',
		aspect: '4:3',
		prompt: `Wide candid group photograph of roughly twenty-five Beninese women of widely varied ages (teenagers to women in their seventies) and complexions, gathered loosely in three rows in front of a modest single-story cooperative building with painted blue trim in rural Atacora, holding small bowls of cream-colored fonio at chest level (not raised high overhead, no celebration cliché), no coordinated dress code — each woman wears her own everyday clothing including cotton wraps, simple dresses, t-shirts, varied head coverings, mixed natural expressions including some quiet smiles, some serious neutral faces, a few absent-minded glances aside, late afternoon warm side light, dusty courtyard ground, sense of real community rather than staged celebration. ${REAL_DOC}`
	}
];

async function callFluxUltra(prompt: string, aspect: AspectRatio): Promise<string> {
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

async function runJob(job: GenJob): Promise<{ name: string; ok: boolean; err?: string }> {
	const t0 = Date.now();
	console.log(`[start] ${job.name} (${job.aspect})`);
	try {
		const url = await callFluxUltra(job.prompt, job.aspect);
		const outPath = join(OUTPUT_DIR, `${job.name}.jpg`);
		await downloadTo(url, outPath);
		const ms = Date.now() - t0;
		console.log(`[ok]    ${job.name} → ${outPath} (${(ms / 1000).toFixed(1)}s)`);
		return { name: job.name, ok: true };
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		console.error(`[fail]  ${job.name}: ${message}`);
		return { name: job.name, ok: false, err: message };
	}
}

async function runBatch(jobs: GenJob[], concurrency: number) {
	const queue = [...jobs];
	const results: Array<{ name: string; ok: boolean; err?: string }> = [];
	const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
		while (queue.length > 0) {
			const job = queue.shift();
			if (!job) break;
			results.push(await runJob(job));
		}
	});
	await Promise.all(workers);
	return results;
}

async function main() {
	await mkdir(OUTPUT_DIR, { recursive: true });
	console.log(`Output: ${OUTPUT_DIR}`);

	const set = (process.argv[2] || 'all') as 'hero' | 'timeline' | 'all';
	const jobs: GenJob[] = [];
	if (set === 'hero' || set === 'all') jobs.push(...HERO_JOBS);
	if (set === 'timeline' || set === 'all') jobs.push(...TIMELINE_JOBS);

	console.log(`Running ${jobs.length} jobs (set: ${set}) on flux-pro v1.1-ultra raw mode`);
	const results = await runBatch(jobs, 3);

	const failed = results.filter((r) => !r.ok);
	if (failed.length) {
		console.error(`\n${failed.length} job(s) failed:`);
		for (const f of failed) console.error(`  - ${f.name}: ${f.err}`);
		process.exit(1);
	}
	console.log(`\nAll ${results.length} images generated successfully.`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
