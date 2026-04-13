/**
 * CMS Sync Script
 *
 * Scans all .svelte files for <CmsText>, <CmsRichText>, <CmsImage> components,
 * extracts their keys and default values, and syncs them to PocketBase.
 *
 * Usage: npx tsx scripts/sync-cms.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PocketBase from 'pocketbase';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PB_URL = process.env.POCKETBASE_URL || 'http://pb.82.165.163.62.nip.io';
const PB_EMAIL = process.env.PB_EMAIL || 'admin@angelsfloor.bj';
const PB_PASSWORD = process.env.PB_PASSWORD || 'Coolify@2026!';
const SRC_DIR = path.resolve(__dirname, '../src');

interface CmsEntry {
	key: string;
	type: 'text' | 'richtext' | 'image';
	page: string;
	label: string;
	default_value: string;
	source_file: string;
}

function extractPageFromPath(filePath: string): string {
	// src/routes/+page.svelte → home
	// src/routes/a-propos/+page.svelte → a-propos
	// src/routes/produits/+page.svelte → produits
	const relative = path.relative(path.join(SRC_DIR, 'routes'), filePath);
	const dir = path.dirname(relative);
	if (dir === '.' || dir === '') return 'home';
	return dir.replace(/\\/g, '/').replace(/^\(.*?\)\//, '');
}

function extractLabelFromKey(key: string): string {
	// home.hero.title → Hero Title
	const parts = key.split('.');
	const label = parts.slice(1).join(' ');
	return label
		.replace(/[._-]/g, ' ')
		.replace(/\b\w/g, c => c.toUpperCase());
}

function scanFile(filePath: string): CmsEntry[] {
	const content = fs.readFileSync(filePath, 'utf-8');
	const entries: CmsEntry[] = [];
	const page = extractPageFromPath(filePath);
	const relPath = path.relative(SRC_DIR, filePath);

	// Match <CmsText key="..." ...>default text</CmsText>
	const textRegex = /<CmsText\s+key="([^"]+)"[^>]*>([\s\S]*?)<\/CmsText>/g;
	let match;
	while ((match = textRegex.exec(content)) !== null) {
		entries.push({
			key: match[1],
			type: 'text',
			page,
			label: extractLabelFromKey(match[1]),
			default_value: match[2].trim(),
			source_file: relPath
		});
	}

	// Match <CmsRichText key="..." ...>default</CmsRichText>
	const richRegex = /<CmsRichText\s+key="([^"]+)"[^>]*>([\s\S]*?)<\/CmsRichText>/g;
	while ((match = richRegex.exec(content)) !== null) {
		entries.push({
			key: match[1],
			type: 'richtext',
			page,
			label: extractLabelFromKey(match[1]),
			default_value: match[2].trim(),
			source_file: relPath
		});
	}

	// Match <CmsImage key="..." src="..." ... />
	const imgRegex = /<CmsImage\s+key="([^"]+)"\s+src="([^"]+)"[^/]*\/>/g;
	while ((match = imgRegex.exec(content)) !== null) {
		entries.push({
			key: match[1],
			type: 'image',
			page,
			label: extractLabelFromKey(match[1]),
			default_value: match[2],
			source_file: relPath
		});
	}

	return entries;
}

function scanDirectory(dir: string): CmsEntry[] {
	const entries: CmsEntry[] = [];
	const items = fs.readdirSync(dir, { withFileTypes: true });

	for (const item of items) {
		const fullPath = path.join(dir, item.name);
		if (item.isDirectory()) {
			// Skip node_modules, admin routes, .svelte-kit
			if (['node_modules', '.svelte-kit', 'admin'].includes(item.name)) continue;
			entries.push(...scanDirectory(fullPath));
		} else if (item.name.endsWith('.svelte')) {
			entries.push(...scanFile(fullPath));
		}
	}

	return entries;
}

async function syncToPocketBase(entries: CmsEntry[]) {
	const pb = new PocketBase(PB_URL);
	await pb.collection('_superusers').authWithPassword(PB_EMAIL, PB_PASSWORD);

	// Get existing records
	const existing = await pb.collection('cms_content').getFullList();
	const existingKeys = new Map(existing.map(r => [r.key, r]));

	let created = 0;
	let updated = 0;
	let unchanged = 0;

	for (const entry of entries) {
		const existingRecord = existingKeys.get(entry.key);

		if (!existingRecord) {
			// Create new record
			await pb.collection('cms_content').create({
				key: entry.key,
				type: entry.type,
				page: entry.page,
				label: entry.label,
				default_value: entry.default_value,
				value: '', // Empty = use default from code
				source_file: entry.source_file
			});
			console.log(`  + Created: ${entry.key} (${entry.page})`);
			created++;
		} else if (
			existingRecord.default_value !== entry.default_value ||
			existingRecord.source_file !== entry.source_file ||
			existingRecord.label !== entry.label
		) {
			// Update metadata (don't touch value — that's the admin's override)
			await pb.collection('cms_content').update(existingRecord.id, {
				default_value: entry.default_value,
				source_file: entry.source_file,
				label: entry.label
			});
			console.log(`  ~ Updated: ${entry.key}`);
			updated++;
		} else {
			unchanged++;
		}

		existingKeys.delete(entry.key);
	}

	// Warn about orphaned records (keys in PB but not in code anymore)
	for (const [key] of existingKeys) {
		console.log(`  ? Orphaned: ${key} (no longer in code)`);
	}

	console.log(`\nDone: ${created} created, ${updated} updated, ${unchanged} unchanged`);
}

async function main() {
	console.log('Scanning .svelte files for CMS components...\n');
	const entries = scanDirectory(path.join(SRC_DIR, 'routes'));

	if (entries.length === 0) {
		console.log('No CMS components found. Add <CmsText>, <CmsRichText>, or <CmsImage> to your pages.');
		return;
	}

	console.log(`Found ${entries.length} CMS entries:\n`);
	const byPage = entries.reduce((acc, e) => {
		if (!acc[e.page]) acc[e.page] = [];
		acc[e.page].push(e);
		return acc;
	}, {} as Record<string, CmsEntry[]>);

	for (const [page, pageEntries] of Object.entries(byPage)) {
		console.log(`  ${page}/`);
		for (const e of pageEntries) {
			console.log(`    ${e.type.padEnd(8)} ${e.key}`);
		}
	}

	console.log('\nSyncing to PocketBase...\n');
	await syncToPocketBase(entries);
}

main().catch(console.error);
