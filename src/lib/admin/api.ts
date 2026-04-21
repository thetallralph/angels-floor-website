/**
 * Angel's Floor CMS — PocketBase API Client
 *
 * Client admin pour communiquer avec PocketBase.
 */

import PocketBase from 'pocketbase';

let pb: PocketBase | null = null;

export async function initPB(): Promise<PocketBase> {
	if (pb) return pb;

	// Same-origin: nginx proxies /api/ and /_/ to PocketBase on this host.
	pb = new PocketBase(typeof window === 'undefined' ? '/' : window.location.origin);

	// Restore auth from localStorage
	if (typeof window !== 'undefined') {
		const stored = localStorage.getItem('pocketbase_auth');
		if (stored) {
			try {
				const { token, model } = JSON.parse(stored);
				pb.authStore.save(token, model);
			} catch { /* ignore */ }
		}
	}
	return pb;
}

function getPB(): PocketBase {
	if (!pb) {
		pb = new PocketBase(typeof window === 'undefined' ? '/' : window.location.origin);
	}
	return pb;
}

function saveAuth() {
	if (typeof window === 'undefined' || !pb) return;
	const p = pb;
	if (p.authStore.isValid) {
		localStorage.setItem('pocketbase_auth', JSON.stringify({
			token: p.authStore.token,
			model: p.authStore.record
		}));
	} else {
		localStorage.removeItem('pocketbase_auth');
	}
}

// --- Auth ---

export async function login(email: string, password: string) {
	const p = await initPB();
	const auth = await p.collection('_superusers').authWithPassword(email, password);
	saveAuth();
	return {
		token: auth.token,
		user: { email: auth.record.email, name: 'Admin' }
	};
}

export async function verifyToken() {
	const p = await initPB();
	if (!p.authStore.isValid) throw new Error('Token invalide');
	return {
		valid: true,
		user: {
			email: p.authStore.record?.email || '',
			name: 'Admin'
		}
	};
}

export function logout() {
	if (pb) pb.authStore.clear();
	localStorage.removeItem('pocketbase_auth');
	localStorage.removeItem('cms_token');
	localStorage.removeItem('cms_user');
}

export function isLoggedIn(): boolean {
	if (typeof window === 'undefined') return false;
	return getPB().authStore.isValid;
}

export function getUser(): { email: string; name: string } | null {
	if (typeof window === 'undefined' || !pb) return null;
	if (!pb.authStore.isValid) return null;
	return {
		email: pb.authStore.record?.email || '',
		name: 'Admin'
	};
}

// --- Content (generic CRUD) ---

const TYPE_MAP: Record<string, string> = {
	'products': 'products',
	'blog': 'blog',
	'sales-points': 'sales_points',
	'pages': 'pages',
	'settings': 'settings',
	'cms_content': 'cms_content'
};

function getCollection(type: string): string {
	return TYPE_MAP[type] || type;
}

/**
 * Enrich a PocketBase record with derived image URL fields the admin UI expects.
 * PB stores file fields as filenames; admin templates bind to `image` (single URL)
 * and `images` (URL array) for preview.
 */
function enrichRecordImages(p: PocketBase, record: Record<string, unknown>): Record<string, unknown> {
	const files = record.images;
	if (Array.isArray(files) && files.length > 0 && typeof files[0] === 'string') {
		const urls = (files as string[]).map(f => p.files.getURL(record as never, f));
		return { ...record, image: urls[0], images: urls };
	}
	return { ...record };
}

export async function getContentList(type: string) {
	const p = await initPB();
	const collection = getCollection(type);
	const records = await p.collection(collection).getFullList();
	return records.map(r => enrichRecordImages(p, r));
}

/**
 * Resolve an id-or-slug to a PocketBase record id.
 * Admin URLs use the slug for readability; most PB operations need the record id.
 */
async function resolvePBId(collection: string, idOrSlug: string): Promise<string> {
	const p = await initPB();
	try {
		const rec = await p.collection(collection).getOne(idOrSlug);
		return rec.id;
	} catch {
		const rec = await p.collection(collection).getFirstListItem(`slug = "${idOrSlug}"`);
		return rec.id;
	}
}

export async function getContent(type: string, id: string, _status: 'draft' | 'live' = 'draft') {
	const p = await initPB();
	const collection = getCollection(type);
	try {
		const record = await p.collection(collection).getOne(id);
		return enrichRecordImages(p, record);
	} catch {
		const record = await p.collection(collection).getFirstListItem(`slug = "${id}"`);
		return enrichRecordImages(p, record);
	}
}

export async function getLiveContent(type: string, id?: string) {
	const p = await initPB();
	const collection = getCollection(type);
	if (id) {
		try {
			const record = await p.collection(collection).getOne(id);
			return enrichRecordImages(p, record);
		} catch {
			const record = await p.collection(collection).getFirstListItem(`slug = "${id}"`);
			return enrichRecordImages(p, record);
		}
	}
	const records = await p.collection(collection).getFullList({ sort: '-created' });
	return records.map(r => enrichRecordImages(p, r));
}

export async function saveContent(type: string, id: string, data: Record<string, unknown>) {
	const p = await initPB();
	const collection = getCollection(type);

	// Remove PocketBase system fields + virtual image URL fields added by enrichRecordImages
	const cleanData = { ...data };
	delete cleanData.id;
	delete cleanData.created;
	delete cleanData.updated;
	delete cleanData.collectionId;
	delete cleanData.collectionName;
	delete cleanData.image;
	delete cleanData.images;

	// Try update via direct id or via slug lookup; fall back to create
	try {
		const pbId = await resolvePBId(collection, id);
		const record = await p.collection(collection).update(pbId, cleanData);
		return { success: true, id: record.id };
	} catch {
		const record = await p.collection(collection).create(cleanData);
		return { success: true, id: record.id };
	}
}

export async function publishContent(type: string, id: string) {
	const p = await initPB();
	const collection = getCollection(type);
	const pbId = await resolvePBId(collection, id);
	await p.collection(collection).update(pbId, { published: true });
	return { success: true };
}

export async function unpublishContent(type: string, id: string) {
	const p = await initPB();
	const collection = getCollection(type);
	const pbId = await resolvePBId(collection, id);
	await p.collection(collection).update(pbId, { published: false });
	return { success: true };
}

export async function deleteContent(type: string, id: string) {
	const p = await initPB();
	const collection = getCollection(type);
	const pbId = await resolvePBId(collection, id);
	await p.collection(collection).delete(pbId);
	return { success: true };
}

// --- CMS Content (key-value overrides per page) ---

export type CmsOverrideType = 'text' | 'richtext' | 'image' | 'gallery';

export type CmsOverride = {
	id?: string;
	type: CmsOverrideType;
	value: string;
	imageUrl?: string;
	galleryUrls?: string[];
};

export async function getCmsOverrides(page: string): Promise<Record<string, CmsOverride>> {
	const p = await initPB();
	try {
		const records = await p.collection('cms_content').getFullList({
			filter: `page = "${page}"`
		});
		const overrides: Record<string, CmsOverride> = {};
		for (const r of records) {
			const type = (r.type || 'text') as CmsOverrideType;
			const entry: CmsOverride = { id: r.id, type, value: r.value || '' };
			if (type === 'image' && r.image) {
				entry.imageUrl = p.files.getURL(r, r.image);
			}
			if (type === 'gallery' && Array.isArray(r.images)) {
				entry.galleryUrls = r.images.map((f: string) => p.files.getURL(r, f));
			}
			overrides[r.key] = entry;
		}
		return overrides;
	} catch {
		return {};
	}
}

async function findOrCreate(page: string, key: string, type: CmsOverrideType) {
	const p = await initPB();
	try {
		return await p.collection('cms_content').getFirstListItem(
			`page = "${page}" && key = "${key}"`
		);
	} catch {
		return await p.collection('cms_content').create({
			page,
			key,
			type,
			value: ''
		});
	}
}

export async function saveCmsText(
	page: string,
	key: string,
	value: string,
	type: 'text' | 'richtext' = 'text'
) {
	const p = await initPB();
	const record = await findOrCreate(page, key, type);
	await p.collection('cms_content').update(record.id, { value, type });
}

/** Legacy alias — keeps old admin code working. `key` must be the full `page.section.field` form. */
export async function saveCmsOverride(page: string, key: string, value: string) {
	const fullKey = key.startsWith(`${page}.`) ? key : `${page}.${key}`;
	return saveCmsText(page, fullKey, value, 'text');
}

export async function saveCmsImage(page: string, key: string, file: File) {
	const p = await initPB();
	const record = await findOrCreate(page, key, 'image');
	const formData = new FormData();
	formData.append('image', file);
	formData.append('type', 'image');
	await p.collection('cms_content').update(record.id, formData);
}

export async function saveCmsGallery(page: string, key: string, files: File[]) {
	const p = await initPB();
	const record = await findOrCreate(page, key, 'gallery');
	const formData = new FormData();
	formData.append('type', 'gallery');
	// Replace the whole images list with the provided files.
	formData.append('images', '');
	for (const file of files) {
		formData.append('images', file);
	}
	await p.collection('cms_content').update(record.id, formData);
}

export async function appendCmsGalleryImages(page: string, key: string, files: File[]) {
	const p = await initPB();
	const record = await findOrCreate(page, key, 'gallery');
	const formData = new FormData();
	formData.append('type', 'gallery');
	for (const file of files) {
		formData.append('images+', file);
	}
	await p.collection('cms_content').update(record.id, formData);
}

export async function removeCmsGalleryImage(page: string, key: string, filename: string) {
	const p = await initPB();
	const record = await findOrCreate(page, key, 'gallery');
	await p.collection('cms_content').update(record.id, {
		'images-': [filename]
	});
}

export async function reorderCmsGallery(page: string, key: string, filenames: string[]) {
	const p = await initPB();
	const record = await findOrCreate(page, key, 'gallery');
	await p.collection('cms_content').update(record.id, { images: filenames });
}

export async function getCmsGalleryFilenames(page: string, key: string): Promise<string[]> {
	const p = await initPB();
	try {
		const record = await p.collection('cms_content').getFirstListItem(
			`page = "${page}" && key = "${key}"`
		);
		return Array.isArray(record.images) ? (record.images as string[]) : [];
	} catch {
		return [];
	}
}

export async function clearCmsOverride(page: string, key: string) {
	const p = await initPB();
	try {
		const record = await p.collection('cms_content').getFirstListItem(
			`page = "${page}" && key = "${key}"`
		);
		await p.collection('cms_content').delete(record.id);
	} catch {
		// already missing
	}
}

// --- Upload ---

export async function uploadFile(file: File) {
	const p = await initPB();
	const formData = new FormData();
	formData.append('file', file);
	formData.append('name', file.name);

	// Upload to a generic "media" collection or use PocketBase files API
	// For now, we create a record in a media collection
	try {
		const record = await p.collection('media').create(formData);
		const url = p.files.getURL(record, record.file);
		return { success: true, url, filename: record.file };
	} catch {
		// Fallback: return a placeholder
		return { success: false, url: '', filename: '' };
	}
}

export async function listFiles() {
	const p = await initPB();
	try {
		const records = await p.collection('media').getFullList({ sort: '-created' });
		return records.map(r => ({
			filename: r.file,
			url: p.files.getURL(r, r.file),
			size: r.size || 0,
			modified: r.updated
		}));
	} catch {
		return [];
	}
}

export async function deleteFile(filename: string) {
	const p = await initPB();
	try {
		const record = await p.collection('media').getFirstListItem(`file = "${filename}"`);
		await p.collection('media').delete(record.id);
		return { success: true };
	} catch {
		return { success: false };
	}
}
