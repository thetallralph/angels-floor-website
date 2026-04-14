/**
 * Angel's Floor CMS — PocketBase API Client
 *
 * Client admin pour communiquer avec PocketBase.
 */

import PocketBase from 'pocketbase';

let pb: PocketBase | null = null;
let pbUrlPromise: Promise<string> | null = null;

async function fetchPBUrl(): Promise<string> {
	try {
		const res = await fetch('/api/config');
		const data = await res.json();
		return data.pocketbaseUrl;
	} catch {
		return 'http://localhost:8090';
	}
}

export async function initPB(): Promise<PocketBase> {
	if (pb) return pb;

	if (!pbUrlPromise) {
		pbUrlPromise = fetchPBUrl();
	}
	const url = await pbUrlPromise;
	pb = new PocketBase(url);

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
		// Sync fallback — initPB() should be called first
		pb = new PocketBase('http://localhost:8090');
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

export async function getContentList(type: string) {
	const p = await initPB();
	const collection = getCollection(type);
	const records = await p.collection(collection).getFullList();
	return records.map(r => ({ ...r }));
}

export async function getContent(type: string, id: string, _status: 'draft' | 'live' = 'draft') {
	const p = await initPB();
	const collection = getCollection(type);
	const record = await p.collection(collection).getOne(id);
	return { ...record };
}

export async function getLiveContent(type: string, id?: string) {
	const p = await initPB();
	const collection = getCollection(type);
	if (id) {
		const record = await p.collection(collection).getOne(id);
		return { ...record };
	}
	const records = await p.collection(collection).getFullList({ sort: '-created' });
	return records.map(r => ({ ...r }));
}

export async function saveContent(type: string, id: string, data: Record<string, unknown>) {
	const p = await initPB();
	const collection = getCollection(type);

	// Remove PocketBase system fields from data
	const cleanData = { ...data };
	delete cleanData.id;
	delete cleanData.created;
	delete cleanData.updated;
	delete cleanData.collectionId;
	delete cleanData.collectionName;

	try {
		// Try update first
		const record = await p.collection(collection).update(id, cleanData);
		return { success: true, id: record.id };
	} catch {
		// If not found, create
		const record = await p.collection(collection).create({ ...cleanData, id });
		return { success: true, id: record.id };
	}
}

export async function publishContent(type: string, id: string) {
	const p = await initPB();
	const collection = getCollection(type);
	await p.collection(collection).update(id, { published: true });
	return { success: true };
}

export async function unpublishContent(type: string, id: string) {
	const p = await initPB();
	const collection = getCollection(type);
	await p.collection(collection).update(id, { published: false });
	return { success: true };
}

export async function deleteContent(type: string, id: string) {
	const p = await initPB();
	const collection = getCollection(type);
	await p.collection(collection).delete(id);
	return { success: true };
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
