<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { initPB, isLoggedIn, getUser, logout } from '$lib/admin/api';
	import {
		LayoutDashboard,
		Package,
		Tag,
		FileText,
		Type,
		Image,
		MapPin,
		GraduationCap,
		Settings,
		LogOut,
		ChevronLeft,
		ChevronRight,
		Menu,
		X
	} from 'lucide-svelte';
	import { cn } from '$lib/utils';

	let { children } = $props();

	let user = $state<{ email: string; name: string } | null>(null);
	let collapsed = $state(false);
	let mobileOpen = $state(false);
	let ready = $state(false);

	const navItems = [
		{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/admin/produits', label: 'Produits', icon: Package },
		{ href: '/admin/categories', label: 'Catégories', icon: Tag },
		{ href: '/admin/formations', label: 'Formations', icon: GraduationCap },
		{ href: '/admin/blog', label: 'Blog', icon: FileText },
		{ href: '/admin/pages', label: 'Contenu', icon: Type },
		{ href: '/admin/medias', label: 'Médias', icon: Image },
		{ href: '/admin/points-de-vente', label: 'Points de vente', icon: MapPin },
		{ href: '/admin/settings', label: 'Paramètres', icon: Settings }
	];

	onMount(async () => {
		await initPB();
		const isLogin = $page.url.pathname === '/admin/login';

		if (!isLoggedIn() && !isLogin) {
			goto('/admin/login');
			return;
		}

		user = getUser();
		ready = true;
	});

	function handleLogout() {
		logout();
		goto('/admin/login');
	}

	function isActive(href: string): boolean {
		if (href === '/admin') return $page.url.pathname === '/admin';
		return $page.url.pathname.startsWith(href);
	}

	$effect(() => {
		if ($page.url.pathname === '/admin/login') {
			ready = true;
		}
	});
</script>

<svelte:head>
	<title>Admin — Angel's Floor</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if !ready}
	<div class="h-screen flex items-center justify-center bg-zinc-50">
		<div class="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
	</div>
{:else if $page.url.pathname === '/admin/login'}
	{@render children()}
{:else}
	<div class="min-h-screen bg-zinc-50">
		<!-- Mobile header -->
		<div class="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-zinc-200 flex items-center px-4 z-50">
			<button onclick={() => mobileOpen = !mobileOpen} class="p-2 rounded-lg hover:bg-zinc-100">
				{#if mobileOpen}
					<X class="w-5 h-5" />
				{:else}
					<Menu class="w-5 h-5" />
				{/if}
			</button>
			<div class="flex items-center gap-2 ml-3">
				<div class="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
					<span class="text-white font-bold text-xs">AF</span>
				</div>
				<span class="font-semibold text-sm text-zinc-900">Angel's Floor</span>
			</div>
		</div>

		<!-- Overlay -->
		{#if mobileOpen}
			<button
				class="fixed inset-0 bg-black/50 z-40 lg:hidden"
				onclick={() => mobileOpen = false}
				aria-label="Fermer le menu"
			></button>
		{/if}

		<!-- Sidebar -->
		<aside class={cn(
			"fixed top-0 left-0 h-full bg-white border-r border-zinc-200 z-50 flex flex-col transition-all duration-200",
			collapsed ? "w-16" : "w-60",
			mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
		)}>
			<!-- Logo -->
			<div class={cn("h-14 flex items-center border-b border-zinc-200 shrink-0", collapsed ? "px-3 justify-center" : "px-4")}>
				<div class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shrink-0">
					<span class="text-white font-bold text-sm">AF</span>
				</div>
				{#if !collapsed}
					<span class="font-semibold text-zinc-900 ml-3 truncate">Angel's Floor</span>
				{/if}
			</div>

			<!-- Nav -->
			<nav class="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
				{#each navItems as item}
					<a
						href={item.href}
						onclick={() => mobileOpen = false}
						class={cn(
							"flex items-center gap-3 rounded-lg text-sm font-medium transition-colors",
							collapsed ? "px-3 py-2.5 justify-center" : "px-3 py-2.5",
							isActive(item.href)
								? "bg-emerald-50 text-emerald-700"
								: "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
						)}
						title={collapsed ? item.label : undefined}
					>
						<item.icon class="w-4 h-4 shrink-0" />
						{#if !collapsed}
							<span>{item.label}</span>
						{/if}
					</a>
				{/each}
			</nav>

			<!-- Footer -->
			<div class="border-t border-zinc-200 p-2 space-y-0.5">
				{#if user && !collapsed}
					<div class="px-3 py-2 text-xs text-zinc-400 truncate">{user.email}</div>
				{/if}
				<button
					onclick={handleLogout}
					class={cn(
						"flex items-center gap-3 rounded-lg text-sm font-medium text-zinc-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full",
						collapsed ? "px-3 py-2.5 justify-center" : "px-3 py-2.5"
					)}
					title="Déconnexion"
				>
					<LogOut class="w-4 h-4 shrink-0" />
					{#if !collapsed}
						<span>Déconnexion</span>
					{/if}
				</button>

				<!-- Collapse toggle (desktop only) -->
				<button
					onclick={() => collapsed = !collapsed}
					class="hidden lg:flex items-center justify-center w-full py-2 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
				>
					{#if collapsed}
						<ChevronRight class="w-4 h-4" />
					{:else}
						<ChevronLeft class="w-4 h-4" />
					{/if}
				</button>
			</div>
		</aside>

		<!-- Main content -->
		<main class={cn(
			"transition-all duration-200 min-h-screen pt-14 lg:pt-0",
			collapsed ? "lg:ml-16" : "lg:ml-60"
		)}>
			<div class="p-6 max-w-6xl mx-auto">
				{@render children()}
			</div>
		</main>
	</div>
{/if}
