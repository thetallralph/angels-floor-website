<script lang="ts">
  import { onMount } from 'svelte';
  
  export let text: string;
  export let className: string = '';
  export let delay: number = 0;
  export let stagger: number = 0.03;
  
  let visible = false;
  let words: string[] = [];
  
  onMount(() => {
    words = text.split(' ');
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