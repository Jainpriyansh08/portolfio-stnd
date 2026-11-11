<script setup>
import { ref, onBeforeUnmount, computed } from 'vue'
import { you, nick } from '../config.js'
import { sfx } from '../lib/sfx.js'

const emit = defineEmits(['charge', 'unlock', 'quip'])
const progress = ref(0)
const done = ref(false)
let raf = 0, holding = false, last = 0, tickAt = 0
const HOLD_MS = 1900

const quips = [
  [0.08, 'Ooh. It’s humming…', 'wow'],
  [0.35, 'Keep holding! Don’t you dare let go.', 'nervous'],
  [0.65, 'It’s getting warm. Is that the capsule or me?', 'shy'],
  [0.9, 'Aaaand… ready?!', 'wow'],
]
let qi = 0

const step = (now) => {
  const dt = now - last
  last = now
  progress.value = Math.max(0, Math.min(1, progress.value + (holding ? dt / HOLD_MS : -dt / 500)))
  emit('charge', progress.value)
  while (qi < quips.length && progress.value >= quips[qi][0]) { emit('quip', quips[qi][1], quips[qi][2]); qi++ }
  if (holding && now - tickAt > 190) { tickAt = now; sfx.play('hold') }
  if (progress.value >= 1) { done.value = true; holding = false; emit('unlock'); return }
  if (holding || progress.value > 0) raf = requestAnimationFrame(step)
  else raf = 0
}
const start = () => {
  if (done.value) return
  sfx.resume()
  holding = true
  last = performance.now()
  if (!raf) raf = requestAnimationFrame(step)
}
const stop = () => {
  if (done.value || !holding) return
  holding = false
  if (progress.value > 0.12) emit('quip', 'Too gentle! Hold it longer 😏', 'smirk')
  qi = 0
}
onBeforeUnmount(() => cancelAnimationFrame(raf))

const circ = 2 * Math.PI * 54
const dash = computed(() => circ * (1 - progress.value))
</script>

<template>
  <section class="intro">
    <div class="copy">
      <p class="eyebrow">Time Capsule · Nº 001</p>
      <h1 class="display">Something was <em>sealed</em> for {{ you }}.</h1>
      <p v-if="nick" class="aka">a.k.a. {{ nick }} 🐂</p>
      <p class="sub">A handful of memories, a little mist, and one very important question waiting at the bottom.</p>
    </div>

    <button
      class="seal"
      :class="{ holding: progress > 0, done }"
      @pointerdown.prevent="start"
      @pointerup="stop" @pointerleave="stop" @pointercancel="stop"
      @keydown.space.prevent="!$event.repeat && start()" @keyup.space="stop"
      @keydown.enter.prevent="!$event.repeat && start()" @keyup.enter="stop"
      @contextmenu.prevent
      aria-label="Press and hold to unseal the time capsule"
    >
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="54" class="track" />
        <circle cx="60" cy="60" r="54" class="bar" :stroke-dasharray="circ" :stroke-dashoffset="dash" transform="rotate(-90 60 60)" />
      </svg>
      <span class="label"><b>{{ done ? 'Unsealed' : 'Hold' }}</b><small>{{ done ? '✨' : 'to unseal' }}</small></span>
    </button>
    <p class="hint">Press &amp; hold the seal. Headphones optional, but fun.</p>
  </section>
</template>

<style scoped>
.intro {
  position: fixed; inset: 0; z-index: 10; display: grid; justify-items: center; align-content: end; gap: 14px;
  padding: 0 20px calc(28px + var(--safe-b)); text-align: center; pointer-events: none;
}
.copy { position: absolute; top: clamp(76px, 10vh, 120px); left: 0; right: 0; padding: 0 24px; display: grid; gap: 14px; justify-items: center; }
h1 { font-size: clamp(2.2rem, 6.4vw, 4.6rem); max-width: 14ch; text-shadow: 0 6px 40px rgba(5, 8, 25, 0.9); }
h1 em { font-style: italic; color: var(--rose-soft); }
.aka { font-family: var(--hand); font-size: clamp(1.5rem, 3.6vw, 2rem); color: var(--amber); margin-top: -6px; rotate: -2deg; text-shadow: 0 2px 20px rgba(5, 8, 25, 0.95); }
.sub { max-width: 44ch; color: var(--mist-dim); text-shadow: 0 2px 20px rgba(5, 8, 25, 0.95); }
.seal { pointer-events: auto; position: relative; width: 132px; height: 132px; border-radius: 50%; display: grid; place-items: center; touch-action: none; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; transition: transform 0.2s cubic-bezier(.3, 1.6, .5, 1); }
.seal svg { position: absolute; inset: 0; overflow: visible; }
.seal::before { content: ''; position: absolute; inset: 10px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #ff8fb4, #ff3d7d 70%); box-shadow: 0 0 40px rgba(255, 92, 147, 0.6); animation: beat 1.6s ease-in-out infinite; }
.seal.holding { transform: scale(0.92); }
.seal.holding::before { animation-duration: 0.35s; }
.track { fill: none; stroke: rgba(255, 255, 255, 0.18); stroke-width: 4; }
.bar { fill: none; stroke: var(--amber); stroke-width: 5; stroke-linecap: round; filter: drop-shadow(0 0 8px rgba(255, 196, 119, 0.9)); }
.label { position: relative; display: grid; line-height: 1.05; color: #fff; text-shadow: 0 2px 8px rgba(120, 0, 50, 0.5); }
.label b { font-family: var(--serif); font-size: 1.5rem; font-variation-settings: 'SOFT' 100, 'WONK' 1; }
.label small { font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 800; opacity: 0.9; }
.hint { font-size: 0.82rem; color: var(--mist-dim); opacity: 0.85; }
@keyframes beat { 0%, 100% { transform: scale(1); } 12% { transform: scale(1.07); } 24% { transform: scale(1); } 36% { transform: scale(1.05); } }
@media (max-height: 640px) { .copy { top: 70px; } .seal { width: 104px; height: 104px; } }
</style>
