<script setup>
defineProps({ caught: Number, goal: Number })
</script>
<template>
  <section class="game">
    <div class="hud glass">
      <p class="eyebrow">Tiny side quest</p>
      <h2 class="display">Catch {{ goal }} runaway hearts</h2>
      <p class="sub">They escaped from the capsule. Tap or click them before they float off.</p>
      <div class="row" aria-label="Hearts caught">
        <span v-for="n in goal" :key="n" class="h" :class="{ on: n <= caught }">{{ n <= caught ? '❤' : '♡' }}</span>
      </div>
    </div>
  </section>
</template>
<style scoped>
.game { position: fixed; inset: 0; z-index: 10; pointer-events: none; display: grid; justify-items: center; align-content: end; padding: 0 16px calc(36px + var(--safe-b)); }
.hud { padding: 18px 26px; text-align: center; display: grid; gap: 6px; justify-items: center; max-width: 440px; }
h2 { font-size: clamp(1.4rem, 4vw, 2rem); }
.sub { color: var(--mist-dim); font-size: 0.92rem; }
.row { display: flex; gap: 8px; margin-top: 6px; }
.h { font-size: 1.7rem; color: var(--mist-dim); transition: transform 0.3s cubic-bezier(.3, 2, .5, 1), color 0.2s; }
.h.on { color: var(--rose); transform: scale(1.25); text-shadow: 0 0 18px rgba(255, 92, 147, 0.8); }
</style>
