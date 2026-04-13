import PocketBase from 'pocketbase';
import { env } from '$env/dynamic/private';

const POCKETBASE_URL = env.POCKETBASE_URL || 'http://127.0.0.1:8090';

export function createPB(): PocketBase {
	return new PocketBase(POCKETBASE_URL);
}
