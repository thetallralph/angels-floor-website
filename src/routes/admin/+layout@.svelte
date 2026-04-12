<script lang="ts">
	import '../../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { isLoggedIn, getUser, logout } from '$lib/admin/api';
	import {
		LayoutDashboard,
		Package,
		FileText,
		Layers,
		Image,
		Settings,
		LogOut,
		Eye,
		ChevronLeft
	} from 'lucide-svelte';

	let { children } = $props();

	let user = $state<{ email: string; name: string } | null>(null);
	let sidebarOpen = $state(true);
	let ready = $state(false);

	const navItems = [
		{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/admin/produits', label: 'Produits', icon: Package },
		{ href: '/admin/blog', label: 'Blog', icon: FileText },
		{ href: '/admin/pages', label: 'Pages', icon: Layers },
		{ href: '/admin/medias', label: 'Médias', icon: Image },
		{ href: '/admin/settings', label: 'Paramètres', icon: Settings }
	];

	onMount(() => {
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

	// Page login = pas de sidebar
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
	<div class="h-screen flex items-center justify-center bg-neutral-sand">
		<div class="animate-spin w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full"></div>
	</div>
{:else if $page.url.pathname === '/admin/login'}
	{@render children()}
{:else}
	<div class="min-h-screen bg-neutral-sand flex">
		<!-- Sidebar -->
		<aside
			class="fixed left-0 top-0 h-full bg-white border-r border-neutral-light transition-all duration-300 z-40 flex flex-col"
			class:w-64={sidebarOpen}
			class:w-16={!sidebarOpen}
		>
			<!-- Logo -->
			<div class="p-4 border-b border-neutral-light flex items-center gap-3">
				<div class="w-8 h-8 bg-primary-green rounded-lg flex items-center justify-center flex-shrink-0">
					<span class="text-white font-bold text-sm">AF</span>
				</div>
				{#if sidebarOpen}
					<span class="font-bold text-neutral-obsidian text-sm">Angel's Floor</span>
				{/if}
			</div>

			<!-- Navigation -->
			<nav class="flex-1 py-4 px-2 space-y-1">
				{#each navItems as item}
					<a
						href={item.href}
						class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
						class:bg-primary-green={isActive(item.href)}
						class:text-white={isActive(item.href)}
						class:text-neutral-charcoal={!isActive(item.href)}
						class:hover:bg-neutral-sand={!isActive(item.href)}
						title={item.label}
					>
						<item.icon class="w-5 h-5 flex-shrink-0" />
						{#if sidebarOpen}
							<span>{item.label}</span>
						{/if}
					</a>
				{/each}

				<!-- Preview du site -->
				<a
					href="/"
					target="_blank"
					class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-slate hover:bg-neutral-sand transition-all duration-200"
					title="Voir le site"
				>
					<Eye class="w-5 h-5 flex-shrink-0" />
					{#if sidebarOpen}
						<span>Voir le site</span>
					{/if}
				</a>
			</nav>

			<!-- User + Collapse -->
			<div class="p-3 border-t border-neutral-light space-y-2">
				{#if sidebarOpen && user}
					<div class="px-3 py-2 text-xs text-neutral-slate truncate">
						{user.email}
					</div>
				{/if}
				<button
					onclick={handleLogout}
					class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-all duration-200"
					title="Déconnexion"
				>
					<LogOut class="w-5 h-5 flex-shrink-0" />
					{#if sidebarOpen}
						<span>Déconnexion</span>
					{/if}
				</button>
				<button
					onclick={() => (sidebarOpen = !sidebarOpen)}
					class="flex items-center justify-center w-full py-1.5 rounded-lg text-neutral-slate hover:bg-neutral-sand transition-all duration-200"
				>
					<span
						class="inline-flex transition-transform duration-300"
						style:transform={sidebarOpen ? 'rotate(0)' : 'rotate(180deg)'}
					>
						<ChevronLeft class="w-4 h-4" />
					</span>
				</button>
			</div>
		</aside>

		<!-- Main content -->
		<main
			class="flex-1 transition-all duration-300"
			class:ml-64={sidebarOpen}
			class:ml-16={!sidebarOpen}
		>
			<div class="p-6 lg:p-8 max-w-7xl">
				{@render children()}
			</div>
		</main>
	</div>
{/if}
