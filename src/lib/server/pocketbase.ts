import PocketBase from 'pocketbase';
import { POCKETBASE_URL } from '$env/static/private';

export function createPB(): PocketBase {
	return new PocketBase(POCKETBASE_URL || 'http://127.0.0.1:8090');
}
