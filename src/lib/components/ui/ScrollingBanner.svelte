<script lang="ts">
  import { onMount } from 'svelte';
  
  let bannerOffset = 0;
  let animationFrame: number;
  let rotation = 0;
  
  const taglines = [
    "100% NATUREL",
    "FIÈREMENT BÉNINOIS",
    "SANS ADDITIFS",
    "CULTIVÉ AVEC AMOUR",
    "DIRECTEMENT DES PRODUCTEURS",
    "CERTIFIÉ BIOLOGIQUE",
    "SAVEURS ANCESTRALES",
    "IMPACT SOCIAL POSITIF",
    "500+ FEMMES AUTONOMISÉES",
    "QUALITÉ ARTISANALE"
  ];
  
  // Duplicate taglines for seamless loop
  const bannerContent = [...taglines, ...taglines, ...taglines];
  
  onMount(() => {
    const baseSpeed = 0.05; // Slow constant speed
    
    const animate = () => {
      // Update banner offset with constant speed
      bannerOffset -= baseSpeed;
      
      // Rotate separator based on movement
      rotation -= baseSpeed * 10; // Rotation speed proportional to movement
      
      // Reset when banner has scrolled enough
      if (Math.abs(bannerOffset) > 33.33) {
        bannerOffset += 33.33;
      }
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  });
</script>

<div class="banner-container">
  <div 
    class="banner-track"
    style="transform: translateX({bannerOffset}%)"
  >
    {#each bannerContent as tagline, _i}
      <span class="banner-item">
        {tagline}
        <span class="separator" style="transform: rotate({rotation}deg);">✦</span>
      </span>
    {/each}
  </div>
</div>

<style>
  .banner-container {
    position: relative;
    width: 100%;
    height: 60px;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    transform: rotate(-2deg) scale(1.1);
    overflow: hidden;
    margin: 2rem 0;
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.15),
      0 8px 40px rgba(255, 215, 0, 0.4),
      0 12px 60px rgba(255, 165, 0, 0.3);
  }
  
  .banner-track {
    display: flex;
    align-items: center;
    height: 100%;
    white-space: nowrap;
    will-change: transform;
  }
  
  .banner-item {
    display: inline-flex;
    align-items: center;
    font-size: 1.125rem;
    font-weight: 700;
    color: #2B7A0B;
    padding: 0 2rem;
    letter-spacing: 0.05em;
  }
  
  .separator {
    margin-left: 2rem;
    color: #2B7A0B;
    opacity: 0.8;
    font-size: 1.5rem;
    vertical-align: middle;
    display: inline-block;
    transition: transform 0.1s linear;
  }
  
  @media (max-width: 768px) {
    .banner-container {
      height: 50px;
    }
    
    .banner-item {
      font-size: 0.875rem;
      padding: 0 1.5rem;
    }
    
    .separator {
      margin-left: 1.5rem;
    }
  }
</style>