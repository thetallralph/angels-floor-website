<script lang="ts">
	import ScrollReveal from './ScrollReveal.svelte';
	import { CmsText, CmsImage } from '$lib/components/cms';

	type Props = {
		imageKey: string;
		defaultImage: string;
		overline?: string;
		overlineKey?: string;
		title: string;
		titleKey: string;
		subtitle?: string;
		subtitleKey?: string;
		align?: 'center' | 'left';
	};

	let {
		imageKey,
		defaultImage,
		overline,
		overlineKey,
		title,
		titleKey,
		subtitle,
		subtitleKey,
		align = 'center'
	}: Props = $props();

	const alignClass = $derived(align === 'left' ? 'text-left' : 'text-center mx-auto');
</script>

<section class="relative isolate overflow-hidden py-24 lg:py-32">
	<!-- Background image -->
	<div class="absolute inset-0 -z-10">
		<CmsImage
			key={imageKey}
			src={defaultImage}
			alt=""
			class="h-full w-full object-cover"
			loading="eager"
		/>
		<!-- Layered overlays for legibility + brand tone -->
		<div
			class="absolute inset-0 bg-gradient-to-br from-primary-green/95 via-primary-green/85 to-primary-green/95"
		></div>
		<div
			class="absolute inset-0 bg-gradient-to-t from-footer-green/70 via-transparent to-transparent"
		></div>
		<!-- Decorative blurs -->
		<div class="absolute -top-24 -left-24 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
		<div
			class="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] bg-accent-gold/15 rounded-full blur-3xl"
		></div>
	</div>

	<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
		<div class="max-w-3xl {alignClass}">
			<ScrollReveal animation="fade-down">
				{#if overlineKey}
					<div
						class="inline-flex items-center gap-3 mb-6 {align === 'center'
							? 'justify-center'
							: ''}"
					>
						<span class="block w-10 h-px bg-accent-gold"></span>
						<CmsText
							key={overlineKey}
							tag="p"
							class="text-xs md:text-sm font-semibold text-accent-gold uppercase tracking-[0.3em]"
							>{overline ?? ''}</CmsText
						>
						<span class="block w-10 h-px bg-accent-gold"></span>
					</div>
				{/if}

				<CmsText
					key={titleKey}
					tag="h1"
					class="text-5xl md:text-6xl lg:text-6xl font-bold leading-tight mb-6"
					>{title}</CmsText
				>

				{#if subtitleKey}
					<CmsText
						key={subtitleKey}
						tag="p"
						class="text-lg md:text-xl text-white/85 leading-relaxed {align === 'center'
							? 'mx-auto'
							: ''}">{subtitle ?? ''}</CmsText
					>
				{/if}
			</ScrollReveal>
		</div>
	</div>

	<!-- Bottom soft fade for smoother transition into next section -->
	<div
		class="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-white/10"
	></div>
</section>
