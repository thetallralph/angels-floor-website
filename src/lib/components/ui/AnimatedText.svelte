<script lang="ts">
  import { onMount } from 'svelte';

  type Props = {
    text: string;
    className?: string;
    delay?: number;
    stagger?: number;
  };

  let { text, className = '', delay = 0, stagger = 0.03 }: Props = $props();

  let visible = $state(false);
  let mounted = $state(false);
  // Derived from `text` so a translated string updates when the language switches
  const words = $derived(mounted ? text.split(' ') : []);

  onMount(() => {
    mounted = true;
    setTimeout(() => {
      visible = true;
    }, delay);
  });

  function splitIntoChars(word: string) {
    return word.split('');
  }
</script>

<span class={className}>
  {#each words as word, wordIndex}
    <div style="position:relative;display:inline-block;">
      {#each splitIntoChars(word) as char, charIndex}
        <div
          class="char"
          style="
            position: relative;
            display: inline-block;
            opacity: {visible ? 1 : 0};
            transform: translateY({visible ? '0' : '20px'});
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            transition-delay: {(wordIndex * word.length + charIndex) * stagger}s;
          "
        >
          {char}
        </div>
      {/each}
    </div>
    {#if wordIndex < words.length - 1}
      <span> </span>
    {/if}
  {/each}
</span>