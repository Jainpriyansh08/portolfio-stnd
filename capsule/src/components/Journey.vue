<script setup>
import { computed, ref, watch } from 'vue'
import { memories } from '../memories.js'
import Hiker from './Hiker.vue'

const props = defineProps({ index: Number, webgl: Boolean })
const emit = defineEmits(['nav', 'open', 'finish'])
const m = computed(() => memories[props.index])
const last = computed(() => props.index === memories.length - 1)
const pct = computed(() => (props.index / (memories.length - 1)) * 100)
const walking = ref(false)
let wt
watch(() => props.index, () => {
  walking.value = true
  clearTimeout(wt)
  wt = setTimeout(() => (walking.value = false), 1100)
})
const num = (n) => String(n).padStart(2, '0')
</script>

<template>
  <section class="journey">
    <div class="counter" aria-live="polite">
      <b>{{ num(index + 1) }}</b><span>/ {{ num(memories.length) }}</span>
    </div>

    <Transition name="card" mode="out-in">
      <article class="card glass" :class="index % 2 === 0 ? 'right' : 'left'" :key="index">
        <p class="eyebrow">{{ m.label }}</p>
        <h2 class="display">{{ m.title }}</h2>
        <img v-if="!webgl" class="flat" :src="m.url" :alt="m.title" @click="emit('open', index)" />
        <p class="text">{{ m.caption }}</p>
        <button class="open" @click="emit('open', index)">
          {{ m.kind === 'video' ? '▶ Play the clip' : '⤢ See it bigger' }}
        </button>
      </article>
    </Transition>

    <div class="controls">
      <button class="btn round" :disabled="index === 0" @click="emit('nav', -1)" aria-label="Previous memory">‹</button>
      <div class="trail" role="presentation">
        <div class="path"></div>
        <div class="done" :style="{ width: pct + '%' }"></div>
        <div class="walker" :style="{ left: pct + '%' }"><Hiker :walking="walking" /></div>
        <div class="flag">💌</div>
      </div>
      <button v-if="!last" class="btn round" @click="emit('nav', 1)" aria-label="Next memory">›</button>
      <button v-else class="btn primary go" @click="emit('finish')">One last thing →</button>
    </div>
    <p class="tip">Scroll, swipe, or use ← → · tap a photo to open it</p>
  </section>
</template>

<style scoped>
.journey { position: fixed; inset: 0; z-index: 10; pointer-events: none; }
.counter { position: absolute; right: max(18px, env(safe-area-inset-right)); top: calc(18px + var(--safe-t)); font-family: var(--serif); display: flex; align-items: baseline; gap: 6px; text-shadow: 0 2px 16px rgba(0, 0, 0, 0.7); margin-right: 52px; }
.counter b { font-size: 1.8rem; font-variation-settings: 'SOFT' 100, 'WONK' 1; color: var(--amber); }
.counter span { color: var(--mist-dim); font-size: 0.95rem; }
.card { position: absolute; bottom: calc(120px + var(--safe-b)); width: min(420px, calc(100vw - 32px)); padding: 22px 24px 20px; pointer-events: auto; display: grid; gap: 10px; }
.card.right { right: clamp(16px, 6vw, 90px); }
.card.left { left: clamp(16px, 6vw, 90px); }
@media (min-width: 900px) { .card { bottom: auto; top: 50%; translate: 0 -46%; } }
.card h2 { font-size: clamp(1.5rem, 3vw, 2.1rem); }
.text { color: #dbe1ff; font-size: 1rem; }
.open { justify-self: start; color: var(--amber); font-weight: 800; font-size: 0.9rem; padding: 4px 0; }
.open:hover { text-decoration: underline; text-underline-offset: 4px; }
.flat { width: 100%; max-height: 32vh; object-fit: cover; border-radius: 14px; cursor: zoom-in; }
.controls { position: absolute; left: 0; right: 0; bottom: calc(46px + var(--safe-b)); display: flex; align-items: center; gap: 14px; padding: 0 max(18px, 4vw); pointer-events: auto; }
.trail { position: relative; flex: 1; height: 54px; }
.path { position: absolute; left: 0; right: 0; bottom: 8px; border-bottom: 3px dotted rgba(255, 255, 255, 0.28); }
.done { position: absolute; left: 0; bottom: 8px; border-bottom: 3px solid var(--sage); transition: width 0.9s cubic-bezier(.4, 0, .2, 1); filter: drop-shadow(0 0 6px rgba(168, 200, 180, 0.7)); }
.walker { position: absolute; bottom: 4px; translate: -50% 0; transition: left 0.9s cubic-bezier(.4, 0, .2, 1); }
.flag { position: absolute; right: -4px; bottom: 10px; font-size: 1.4rem; animation: wave 2s ease-in-out infinite; transform-origin: bottom left; }
.go { white-space: nowrap; animation: nudge 1.6s ease-in-out infinite; }
.tip { position: absolute; left: 0; right: 0; bottom: calc(16px + var(--safe-b)); text-align: center; font-size: 0.78rem; color: var(--mist-dim); opacity: 0.8; }
.card-enter-active { transition: opacity 0.5s ease 0.2s, transform 0.55s cubic-bezier(.2, 1.1, .3, 1) 0.2s; }
.card-leave-active { transition: opacity 0.2s; }
.card-enter-from { opacity: 0; transform: translateY(24px) rotate(1.2deg); }
.card-leave-to { opacity: 0; }
@keyframes wave { 50% { transform: rotate(-10deg) scale(1.08); } }
@keyframes nudge { 50% { transform: translateX(4px) scale(1.04); } }
@media (max-width: 899px) { .tip { display: none; } .card { bottom: calc(106px + var(--safe-b)); padding: 16px 18px; } .text { font-size: 0.94rem; } }
@media (max-width: 899px) and (max-height: 700px) { .card { bottom: calc(92px + var(--safe-b)); } .text { display: none; } }
</style>
