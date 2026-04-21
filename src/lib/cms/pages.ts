/**
 * Registry of CMS-editable pages.
 * `id` is the value stored in cms_content.page and used as the key prefix.
 * `path` is the public URL that the admin scraper fetches to discover fields.
 */
export type CmsPage = {
	id: string;
	path: string;
	label: string;
};

export const CMS_PAGES: CmsPage[] = [
	{ id: 'home', path: '/', label: 'Accueil' },
	{ id: 'about', path: '/a-propos', label: 'À propos' },
	{ id: 'impact', path: '/impact', label: 'Impact' },
	{ id: 'contact', path: '/contact', label: 'Contact' },
	{ id: 'sales-points', path: '/points-de-vente', label: 'Points de vente' },
	{ id: 'wholesale', path: '/grossistes', label: 'Grossistes' },
	{ id: 'terms', path: '/cgv', label: 'CGV' },
	{ id: 'legal', path: '/mentions-legales', label: 'Mentions légales' }
];

export function pageIdFromPath(pathname: string): string | null {
	const normalized = pathname.replace(/\/$/, '') || '/';
	const match = CMS_PAGES.find((p) => p.path === normalized);
	return match?.id ?? null;
}
