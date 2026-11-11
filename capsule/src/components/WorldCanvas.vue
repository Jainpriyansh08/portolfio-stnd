<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { World } from '../lib/world.js'
import { memories } from '../memories.js'
import { sfx } from '../lib/sfx.js'

const props = defineProps({
  stage: String,
  charge: { type: Number, default: 0 },
  target: { type: Number, default: 0 },
})
const emit = defineEmits(['nav', 'pick', 'opened', 'heart', 'fail', 'ready'])

const canvas = ref(null)
let world = null

onMounted(() => {
  try {
    world = new World(canvas.value, memories, {
      onNav: (d) => emit('nav', d),
      onPick: (i) => emit('pick', i),
      onOpened: () => emit('opened'),
      onHeart: () => emit('heart'),
    })
    world.sound = (n) => sfx.play(n)
    if (import.meta.env.DEV) globalThis.__capsule = world
    emit('ready')
  } catch (err) {
    console.warn('WebGL unavailable, using the 2D fallback.', err)
    emit('fail')
  }
})
onBeforeUnmount(() => world?.dispose())

watch(() => props.stage, (s) => world?.setStage(s))
watch(() => props.charge, (v) => world?.setCharge(v))
watch(() => props.target, (v) => world?.setTarget(v))

defineExpose({
  open: () => world?.open(),
  celebrate: () => world?.celebrate(),
})
</script>

<template>
  <canvas ref="canvas" class="world" aria-hidden="true"></canvas>
</template>

<style scoped>
.world { position: fixed; inset: 0; width: 100%; height: 100%; display: block; touch-action: none; background: radial-gradient(120% 90% at 70% 10%, #26306b, #0a0f26 70%); }
</style>
