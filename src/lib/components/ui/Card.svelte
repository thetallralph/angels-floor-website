<script lang="ts">
  export let padding: 'sm' | 'md' | 'lg' = 'md';
  export let shadow: boolean = true;
  export let rounded: boolean = true;
  export let hover: boolean = false;
  export let className: string = '';
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  $: baseClasses = [
    'bg-white',
    shadow ? 'shadow-lg' : '',
    rounded ? 'rounded-2xl' : '',
    hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300' : '',
    paddingClasses[padding],
    className
  ].filter(Boolean).join(' ');
</script>

<div class={baseClasses}>
  <slot />
</div>