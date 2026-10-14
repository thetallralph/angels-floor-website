import type { Reroute } from '@sveltejs/kit';
import { delocalizePath } from '$lib/i18n/routing';

/** Serve `/en/...` URLs from the French route tree (see `$lib/i18n/routing`). */
export const reroute: Reroute = ({ url }) => delocalizePath(url.pathname);
