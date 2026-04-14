import { json } from '@sveltejs/kit';
import { POCKETBASE_URL } from '$env/static/private';

export function GET() {
	return json({
		pocketbaseUrl: POCKETBASE_URL || 'http://localhost:8090'
	});
}
