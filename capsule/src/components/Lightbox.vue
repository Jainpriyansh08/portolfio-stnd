<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { memories } from '../memories.js'

const props = defineProps({ index: Number })
const emit = defineEmits(['close', 'step'])
const m = computed(() => memories[props.index])
const playing = ref(false)
const key = (e) => {
  if (e.key === 'Escape') emit('close')
  else if (e.key === 'ArrowRight') emit('step', 1)
  else if (e.key === 'ArrowLeft') emit('step', -1)
}
onMounted(() => addEventListener('keydown', key))
onBeforeUnmount(() => removeEventListener('keydown', key))
</script>

<template>
  <div class="lb" @click.self="emit('close')" role="dialog" aria-modal="true" :aria-label="m.title">
    <button class="x btn round" @click="emit('close')" aria-label="Close">✕</button>
    <button class="nav l btn round" :disabled="index === 0" @click="emit('step', -1)" aria-label="Previous">‹</button>
    <button class="nav r btn round" :disabled="index === memories.length - 1" @click="emit('step', 1)" aria-label="Next">›</button>
    <figure class="polaroid" :key="index">
      <div class="shot">
        <video v-if="m.kind === 'video'" :src="m.videoUrl" :poster="m.url" controls playsinline autoplay @play="playing = true"></video>
        <img v-else :src="m.url" :alt="m.title" />
      </div>
      <figcaption>
        <h3>{{ m.title }}</h3>
        <p>{{ m.caption }}</p>
      </figcaption>
    </figure>
  </div>
</template>

<style scoped>
.lb { position: fixed; inset: 0; z-index: 60; display: grid; place-items: center; padding: 16px; background: rgba(4, 7, 22, 0.82); backdrop-filter: blur(10px); animation: in 0.3s ease; }
.polaroid { margin: 0; background: var(--cream); color: #2c2748; padding: 14px 14px 18px; border-radius: 6px; max-width: min(92vw, 880px); box-shadow: 0 40px 90px -20px #000; rotate: -1deg; animation: drop 0.55s cubic-bezier(.2, 1.3, .4, 1); display: grid; gap: 12px; }
.shot { display: grid; place-items: center; background: #101534; border-radius: 3px; overflow: hidden; }
.shot img, .shot video { display: block; max-width: 100%; max-height: min(64vh, 700px); width: auto; height: auto; object-fit: contain; }
h3 { font-family: var(--hand); font-size: 2rem; font-weight: 600; line-height: 1; }
p { font-size: 0.95rem; color: #4a4570; max-width: 60ch; }
.x { position: absolute; top: calc(14px + var(--safe-t)); right: 14px; }
.nav { position: absolute; top: 50%; translate: 0 -50%; }
.nav.l { left: 12px; } .nav.r { right: 12px; }
@keyframes in { from { opacity: 0; } }
@keyframes drop { from { transform: translateY(40px) rotate(4deg) scale(.9); opacity: 0; } }
@media (max-width: 700px) { .nav { top: auto; bottom: calc(18px + var(--safe-b)); translate: 0 0; } h3 { font-size: 1.6rem; } }
</style>
