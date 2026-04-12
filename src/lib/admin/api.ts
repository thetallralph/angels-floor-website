/**
 * Angel's Floor CMS — API Client
 *
 * Client pour communiquer avec l'API PHP.
 * Toutes les requêtes admin passent par ce module.
 */

const API_BASE = '/api';

function getToken(): string | null {
	if (typeof window === 'undefined') return null;
	return localStorage.getItem('cms_token');
}

async function request<T = unknown>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const token = getToken();
	const headers: Record<string, string> = {
		...(options.headers as Record<string, string>)
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	// Ne pas définir Content-Type pour FormData (multipart)
	if (!(options.body instanceof FormData)) {
		headers['Content-Type'] = 'application/json';
	}

	const res = await fetch(`${API_BASE}/${endpoint}`, {
		...options,
		headers
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.error || `Erreur ${res.status}`);
	}

	return data as T;
}

// --- Auth ---

export async function login(email: string, password: string) {
	const data = await request<{ token: string; user: { email: string; name: string } }>(
		'auth.php?action=login',
		{
			method: 'POST',
			body: JSON.stringify({ email, password })
		}
	);
	localStorage.setItem('cms_token', data.token);
	localStorage.setItem('cms_user', JSON.stringify(data.user));
	return data;
}

export async function verifyToken() {
	return request<{ valid: boolean; user: { email: string; name: string } }>(
		'auth.php?action=verify'
	);
}

export function logout() {
	localStorage.removeItem('cms_token');
	localStorage.removeItem('cms_user');
}

export function isLoggedIn(): boolean {
	return !!getToken();
}

export function getUser(): { email: string; name: string } | null {
	if (typeof window === 'undefined') return null;
	const raw = localStorage.getItem('cms_user');
	return raw ? JSON.parse(raw) : null;
}

// --- Content ---

export async function getContentList(type: string) {
	return request<Array<Record<string, unknown>>>(`content.php?type=${type}&action=list-all`);
}

export async function getContent(type: string, id: string, status: 'draft' | 'live' = 'draft') {
	return request<Record<string, unknown>>(`content.php?type=${type}&id=${id}&status=${status}`);
}

export async function getLiveContent(type: string, id?: string) {
	const params = id ? `type=${type}&id=${id}` : `type=${type}`;
	return request<Record<string, unknown> | Array<Record<string, unknown>>>(
		`content.php?${params}`
	);
}

export async function saveContent(type: string, id: string, data: Record<string, unknown>) {
	return request<{ success: boolean; id: string }>(
		`content.php?type=${type}&id=${id}`,
		{
			method: 'POST',
			body: JSON.stringify(data)
		}
	);
}

export async function publishContent(type: string, id: string) {
	return request<{ success: boolean }>(
		`content.php?type=${type}&id=${id}&action=publish`,
		{ method: 'POST' }
	);
}

export async function unpublishContent(type: string, id: string) {
	return request<{ success: boolean }>(
		`content.php?type=${type}&id=${id}&action=unpublish`,
		{ method: 'POST' }
	);
}

export async function deleteContent(type: string, id: string) {
	return request<{ success: boolean }>(
		`content.php?type=${type}&id=${id}`,
		{ method: 'DELETE' }
	);
}

// --- Upload ---

export async function uploadFile(file: File) {
	const formData = new FormData();
	formData.append('file', file);

	return request<{ success: boolean; url: string; filename: string }>(
		'upload.php',
		{
			method: 'POST',
			body: formData
		}
	);
}

export async function listFiles() {
	return request<Array<{ filename: string; url: string; size: number; modified: string }>>(
		'upload.php'
	);
}

export async function deleteFile(filename: string) {
	return request<{ success: boolean }>(
		`upload.php?file=${encodeURIComponent(filename)}`,
		{ method: 'DELETE' }
	);
}
