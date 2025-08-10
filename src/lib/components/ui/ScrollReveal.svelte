<script lang="ts">
	
	interface Props {
		children: any;
		animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'fade';
		delay?: number;
		duration?: number;
		threshold?: number;
		once?: boolean;
		className?: string;
	}
	
	let {
		children,
		animation = 'fade-up',
		delay = 0,
		duration = 600,
		threshold = 0.1,
		once = true,
		className = ''
	}: Props = $props();
	
	let element: HTMLDivElement;
	let isVisible = $state(false);
	
	const animations = {
		'fade-up': {
			initial: 'opacity: 0; transform: translateY(30px);',
			visible: 'opacity: 1; transform: translateY(0);'
		},
		'fade-down': {
			initial: 'opacity: 0; transform: translateY(-30px);',
			visible: 'opacity: 1; transform: translateY(0);'
		},
		'fade-left': {
			initial: 'opacity: 0; transform: translateX(30px);',
			visible: 'opacity: 1; transform: translateX(0);'
		},
		'fade-right': {
			initial: 'opacity: 0; transform: translateX(-30px);',
			visible: 'opacity: 1; transform: translateX(0);'
		},
		'scale': {
			initial: 'opacity: 0; transform: scale(0.9);',
			visible: 'opacity: 1; transform: scale(1);'
		},
		'fade': {
			initial: 'opacity: 0;',
			visible: 'opacity: 1;'
		}
	};
	
	const currentAnimation = animations[animation];
	
	$effect(() => {
		if (!element) return;
		
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		
		if (prefersReducedMotion) {
			isVisible = true;
			return;
		}
		
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						isVisible = true;
						if (once) {
							observer.unobserve(entry.target);
						}
					} else if (!once) {
						isVisible = false;
					}
				});
			},
			{ threshold }
		);
		
		observer.observe(element);
		
		return () => {
			if (element) observer.unobserve(element);
		};
	});
</script>

<div
	bind:this={element}
	class={className}
	style="{isVisible ? currentAnimation.visible : currentAnimation.initial} transition: all {duration}ms cubic-bezier(0.4, 0, 0.2, 1) {delay}ms;"
>
	{@render children()}
</div>