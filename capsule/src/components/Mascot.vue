<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'

const props = defineProps({
  say: { type: String, default: '' },
  mood: { type: String, default: 'happy' }, // happy | smirk | shy | wow | nervous
})

const root = ref(null)
const look = ref({ x: 0, y: 0 })
const bubbleKey = ref(0)

const onMove = (e) => {
  const el = root.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const dx = e.clientX - (r.left + r.width / 2)
  const dy = e.clientY - (r.top + r.height / 2)
  const d = Math.hypot(dx, dy) || 1
  const k = Math.min(1, d / 220)
  look.value = { x: (dx / d) * 3.2 * k, y: (dy / d) * 2.6 * k }
}
onMounted(() => addEventListener('pointermove', onMove, { passive: true }))
onBeforeUnmount(() => removeEventListener('pointermove', onMove))
watch(() => props.say, () => bubbleKey.value++)

const mouth = computed(() => ({
  happy: 'M 40 63 Q 50 72 60 63',
  smirk: 'M 41 65 Q 52 71 62 61',
  shy: 'M 44 66 Q 50 69 56 66',
  wow: 'M 46 65 Q 50 74 54 65 Q 50 62 46 65',
  nervous: 'M 41 68 Q 45 63 50 68 Q 55 73 60 66',
}[props.mood] || 'M 40 63 Q 50 72 60 63'))
</script>

<template>
  <div class="mascot" ref="root" :class="'mood-' + mood" aria-live="polite">
    <svg viewBox="0 0 100 90" class="body" aria-hidden="true">
      <defs>
        <radialGradient id="mg" cx="40%" cy="30%" r="80%">
          <stop offset="0" stop-color="#ffffff" />
          <stop offset="1" stop-color="#c9d3ff" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="84" rx="26" ry="3.4" fill="rgba(0,0,0,.28)" class="shadow" />
      <g class="puff">
        <circle cx="30" cy="52" r="20" fill="url(#mg)" />
        <circle cx="52" cy="38" r="26" fill="url(#mg)" />
        <circle cx="74" cy="53" r="19" fill="url(#mg)" />
        <rect x="26" y="50" width="50" height="22" rx="11" fill="url(#mg)" />
        <ellipse cx="32" cy="62" rx="6" ry="3.4" fill="#ff8fb4" opacity=".55" />
        <ellipse cx="70" cy="62" rx="6" ry="3.4" fill="#ff8fb4" opacity=".55" />
        <g class="eyes">
          <g v-for="cx in [41, 61]" :key="cx" class="eye">
            <ellipse :cx="cx" cy="51" rx="6" ry="7" fill="#fff" stroke="#8d9ad6" stroke-width=".8" />
            <circle :cx="cx + look.x" :cy="51 + look.y" r="3.6" fill="#1b2150" />
            <circle :cx="cx + look.x - 1.1" :cy="51 + look.y - 1.3" r="1.1" fill="#fff" />
          </g>
        </g>
        <path :d="mouth" fill="none" stroke="#3b4280" stroke-width="2.2" stroke-linecap="round" />
        <path v-if="mood === 'smirk'" d="M 36 41 Q 41 38 47 40" fill="none" stroke="#3b4280" stroke-width="1.8" stroke-linecap="round" />
      </g>
    </svg>
    <Transition name="bubble" mode="out-in">
      <p v-if="say" class="bubble" :key="bubbleKey">{{ say }}</p>
    </Transition>
  </div>
</template>

<style scoped>
.mascot {
  position: fixed; z-index: 30; left: max(14px, env(safe-area-inset-left)); top: calc(12px + var(--safe-t));
  display: flex; align-items: flex-start; gap: 6px; pointer-events: none;
  max-width: min(78vw, 360px);
}
.body { width: 74px; flex: none; filter: drop-shadow(0 8px 18px rgba(130, 150, 255, 0.35)); animation: bob 4.2s ease-in-out infinite; }
.eye { transform-box: fill-box; transform-origin: center; animation: blink 5s infinite; }
.eye:nth-child(2) { animation-delay: 0.02s; }
.mood-wow .body, .mood-nervous .body { animation: bob 4.2s ease-in-out infinite, shiver 0.35s linear infinite; }
.mood-nervous .puff { animation: sweat 1.2s ease-in-out infinite; }
.bubble {
  margin-top: 6px; padding: 0.6em 0.95em; border-radius: 18px 18px 18px 4px;
  background: rgba(255, 255, 255, 0.95); color: #1f2559; font-weight: 700; font-size: 0.92rem; line-height: 1.3;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.55); position: relative;
}
.bubble-enter-active { animation: pop 0.45s cubic-bezier(.3, 1.7, .5, 1); }
.bubble-leave-active { transition: opacity 0.15s; }
.bubble-leave-to { opacity: 0; }
@keyframes pop { from { transform: scale(0.3) translateX(-10px); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes bob { 50% { transform: translateY(-6px) rotate(-2deg); } }
@keyframes blink { 0%, 94%, 100% { transform: scaleY(1); } 97% { transform: scaleY(0.08); } }
@keyframes shiver { 25% { translate: 1.5px 0; } 75% { translate: -1.5px 0; } }
@keyframes sweat { 50% { transform: translateY(-1px); } }
@media (max-width: 600px) { .body { width: 58px; } .bubble { font-size: 0.84rem; } }
</style>
