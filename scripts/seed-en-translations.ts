/**
 * English Catalogue Seeder
 *
 * Writes the translations in scripts/data/en-translations.json into the `en` JSON
 * field of products, categories, trainings (matched by slug) and sales_points
 * (matched by id). By default only English fields that are still empty are filled,
 * so edits made in the admin are kept; object fields (preparation, nutritional_info)
 * are filled key by key.
 *
 * Usage: npm run i18n:seed-en [-- --dry-run] [-- --force]
 *   --dry-run  print what would change, write nothing
 *   --force    overwrite English values that are already set
 * Env:   POCKETBASE_URL, PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PocketBase from 'pocketbase';
import { TRANSLATABLE_FIELDS, type TranslatableCollection } from '../src/lib/cms/translate';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.resolve(__dirname, 'data/en-translations.json');

const PB_URL = process.env.POCKETBASE_URL;
const PB_EMAIL = process.env.PB_ADMIN_EMAIL || process.env.PB_EMAIL;
const PB_PASSWORD = process.env.PB_ADMIN_PASSWORD || process.env.PB_PASSWORD;

if (!PB_URL || !PB_EMAIL || !PB_PASSWORD) {
  console.error('Missing env: POCKETBASE_URL, PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD');
  process.exit(1);
}

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const FORCE = args.includes('--force');

type Json = Record<string, unknown>;

function hasContent(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
}

function isPlainObject(value: unknown): value is Json {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

/** Merge one translated field into the existing English value, respecting --force. */
function mergeField(current: unknown, incoming: unknown): unknown {
  if (isPlainObject(incoming) && isPlainObject(current)) {
    const next: Json = { ...current };
    for (const [key, value] of Object.entries(incoming)) {
      if (FORCE || !hasContent(current[key])) next[key] = value;
    }
    return next;
  }
  return FORCE || !hasContent(current) ? incoming : current;
}

async function main() {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) as Record<
    string,
    Record<string, Json>
  >;

  const pb = new PocketBase(PB_URL);
  await pb.collection('_superusers').authWithPassword(PB_EMAIL!, PB_PASSWORD!);

  if (DRY_RUN) console.log('Dry run: nothing will be written.\n');

  for (const [name, entries] of Object.entries(data)) {
    if (!(name in TRANSLATABLE_FIELDS)) {
      console.warn(`! ${name}: not a translatable collection, skipped`);
      continue;
    }
    const allowed: readonly string[] = TRANSLATABLE_FIELDS[name as TranslatableCollection];
    const keyField = name === 'sales_points' ? 'id' : 'slug';

    const records = await pb.collection(name).getFullList({ fields: `id,${keyField},en` });
    if (records.length && !('en' in records[0])) {
      throw new Error(`${name} has no \`en\` field. Run npm run i18n:init-schema first.`);
    }
    const byKey = new Map(records.map((r) => [String(r[keyField]), r]));

    let updated = 0;
    let fieldsSet = 0;
    let upToDate = 0;
    const missing: string[] = [];

    for (const [key, translation] of Object.entries(entries)) {
      const record = byKey.get(key);
      if (!record) {
        missing.push(key);
        continue;
      }
      const current: Json = isPlainObject(record.en) ? record.en : {};
      const next: Json = { ...current };
      const changed: string[] = [];
      const kept: string[] = [];

      for (const [field, value] of Object.entries(translation)) {
        if (!allowed.includes(field)) {
          console.warn(`! ${name}/${key}: field "${field}" is not translatable, skipped`);
          continue;
        }
        const merged = mergeField(current[field], value);
        if (JSON.stringify(merged) === JSON.stringify(current[field])) {
          if (JSON.stringify(value) !== JSON.stringify(current[field])) kept.push(field);
          continue;
        }
        next[field] = merged;
        changed.push(field);
      }

      if (!changed.length) {
        upToDate++;
        continue;
      }
      const keptNote = kept.length ? ` (kept: ${kept.join(', ')})` : '';
      console.log(`  ${DRY_RUN ? '~' : '+'} ${name}/${key}: ${changed.join(', ')}${keptNote}`);
      if (!DRY_RUN) await pb.collection(name).update(record.id, { en: next });
      updated++;
      fieldsSet += changed.length;
    }

    for (const key of missing) console.warn(`! ${name}: no record with ${keyField} "${key}"`);
    console.log(
      `${name}: ${Object.keys(entries).length} in file, ${updated} ${DRY_RUN ? 'to update' : 'updated'} ` +
        `(${fieldsSet} fields), ${upToDate} unchanged, ${missing.length} not found\n`
    );
  }

  console.log(DRY_RUN ? 'Dry run complete.' : 'English translations seeded.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
