import { writable, derived, type Readable } from 'svelte/store';
import { browser } from '$app/environment';

export type CartItem = {
	productId: string;
	productSlug: string;
	productName: string;
	productImage?: string;
	/** Stable key per (product, variant) for de-duplication. */
	variantKey: string;
	/** Human-readable variant label, e.g. "500G" or "—" when no variant. */
	variantLabel: string;
	unitPrice: number;
	quantity: number;
};

const STORAGE_KEY = 'angelsfloor:cart:v1';

function loadInitial(): CartItem[] {
	if (!browser) return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

export const cart = writable<CartItem[]>(loadInitial());

if (browser) {
	cart.subscribe((items) => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
		} catch {
			// quota or private mode — ignore
		}
	});
}

export const cartCount: Readable<number> = derived(cart, (items) =>
	items.reduce((sum, it) => sum + it.quantity, 0)
);

export const cartTotal: Readable<number> = derived(cart, (items) =>
	items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0)
);

function itemKey(slug: string, variantKey: string): string {
	return `${slug}::${variantKey}`;
}

export function addItem(item: Omit<CartItem, 'quantity'>, qty = 1) {
	cart.update((items) => {
		const key = itemKey(item.productSlug, item.variantKey);
		const idx = items.findIndex((it) => itemKey(it.productSlug, it.variantKey) === key);
		if (idx >= 0) {
			const next = [...items];
			next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
			return next;
		}
		return [...items, { ...item, quantity: qty }];
	});
}

export function removeItem(productSlug: string, variantKey: string) {
	cart.update((items) =>
		items.filter((it) => itemKey(it.productSlug, it.variantKey) !== itemKey(productSlug, variantKey))
	);
}

export function setQuantity(productSlug: string, variantKey: string, qty: number) {
	if (qty <= 0) {
		removeItem(productSlug, variantKey);
		return;
	}
	cart.update((items) =>
		items.map((it) =>
			itemKey(it.productSlug, it.variantKey) === itemKey(productSlug, variantKey)
				? { ...it, quantity: qty }
				: it
		)
	);
}

export function clearCart() {
	cart.set([]);
}

export function formatPrice(amount: number): string {
	return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

/** Assemble a multi-line WhatsApp order message in French. */
export function buildOrderMessage(items: CartItem[]): string {
	if (items.length === 0) return '';
	const lines: string[] = [];
	lines.push("Bonjour Angel's Floor, je souhaite passer une commande :");
	lines.push('');
	for (const it of items) {
		const lineTotal = it.unitPrice * it.quantity;
		lines.push(`• ${it.productName} — ${it.variantLabel} × ${it.quantity} = ${formatPrice(lineTotal)}`);
	}
	const total = items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
	lines.push('');
	lines.push(`Total : ${formatPrice(total)}`);
	lines.push('');
	lines.push('Merci de me confirmer les modalités de retrait ou de livraison.');
	return lines.join('\n');
}
