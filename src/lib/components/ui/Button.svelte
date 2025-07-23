<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'outline' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let href: string | undefined = undefined;
  export let disabled = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  
  const variants = {
    primary: 'bg-accent-orange text-white hover:bg-orange-600 hover:shadow-lg',
    secondary: 'bg-primary-green text-white hover:bg-green-600 hover:shadow-lg',
    outline: 'border-2 border-primary-green text-primary-green hover:bg-primary-green hover:text-white bg-transparent'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5';
  
  $: classes = `${baseClasses} ${variants[variant]} ${sizes[size]}`;
  $: focusRing = variant === 'primary' ? 'focus:ring-accent-orange' : 'focus:ring-primary-green';
</script>

{#if href}
  <a 
    {href} 
    class="{classes} {focusRing}"
    role="button"
    tabindex={disabled ? -1 : 0}
    aria-disabled={disabled}
  >
    <slot />
  </a>
{:else}
  <button 
    {type}
    {disabled}
    class="{classes} {focusRing}"
    on:click
  >
    <slot />
  </button>
{/if}