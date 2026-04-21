import { getContext, setContext } from 'svelte';

export type CmsData = {
	text: Record<string, string>;
	image: Record<string, string>;
	gallery: Record<string, string[]>;
};

const KEY = Symbol('cms-overrides');

const empty: CmsData = { text: {}, image: {}, gallery: {} };

/**
 * Provide reactive CMS overrides to descendants.
 * Pass a getter so the context stays in sync when layout data updates (navigation).
 */
export function provideCms(get: () => CmsData) {
	setContext(KEY, {
		get text() {
			return get()?.text ?? empty.text;
		},
		get image() {
			return get()?.image ?? empty.image;
		},
		get gallery() {
			return get()?.gallery ?? empty.gallery;
		}
	});
}

export function useCms(): CmsData {
	return getContext<CmsData>(KEY) ?? empty;
}
