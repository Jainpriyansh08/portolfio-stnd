<script setup>
import { ref, nextTick, watch, onMounted, onBeforeUnmount } from 'vue'
import WorldCanvas from './components/WorldCanvas.vue'
import Mascot from './components/Mascot.vue'
import Intro from './components/Intro.vue'
import Journey from './components/Journey.vue'
import Lightbox from './components/Lightbox.vue'
import Game from './components/Game.vue'
import Ask from './components/Ask.vue'
import Yes from './components/Yes.vue'
import { memories } from './memories.js'
import { sfx } from './lib/sfx.js'

const GOAL = 5
const stage = ref('intro')       // intro → journey → game → ask → yes
const unlocked = ref(false)
const charge = ref(0)
const index = ref(0)
const caught = ref(0)
const box = ref(null)            // lightbox index
const webgl = ref(true)
const muted = ref(false)
const world = ref(null)
const say = ref('Psst! Hold the glowing seal. I dare you. 😏')
const mood = ref('smirk')

const quip = (t, m = 'happy') => { say.value = t; mood.value = m }

const onUnlock = () => {
  unlocked.value = true
  quip('It’s opening!! Okay act natural.', 'wow')
  world.value?.open()
  if (!webgl.value) setTimeout(onOpened, 800)
}
const onOpened = () => {
  stage.value = 'journey'
  index.value = 0
  quip(memories[0].quip, 'happy')
}
const nav = (d) => {
  if (stage.value !== 'journey' || box.value !== null) return
  const n = Math.max(0, Math.min(memories.length - 1, index.value + d))
  if (n === index.value) return
  index.value = n
  sfx.play('page')
}
watch(index, (i) => { if (stage.value === 'journey') quip(memories[i].quip, i % 3 === 0 ? 'smirk' : 'happy') })

const openBox = (i) => { index.value = i; box.value = i; sfx.play('tick') }
const stepBox = (d) => {
  const n = Math.max(0, Math.min(memories.length - 1, box.value + d))
  box.value = n; index.value = n
}

const finish = () => {
  sfx.play('chime')
  if (!webgl.value) return goAsk()
  stage.value = 'game'
  caught.value = 0
  quip('Side quest! The hearts escaped. Catch them!', 'wow')
}
const onHeart = () => {
  caught.value++
  const lines = ['Got one!', 'Nice reflexes 😳', 'Halfway there!', 'Almost…', 'ALL CAUGHT!']
  quip(lines[Math.min(caught.value - 1, lines.length - 1)], 'wow')
  if (caught.value >= GOAL) setTimeout(goAsk, 1100)
}
const goAsk = () => { stage.value = 'ask'; quip('…', 'nervous') }
const onYes = async () => {
  stage.value = 'yes'
  await nextTick()
  world.value?.celebrate()
}
const replay = () => { stage.value = 'journey'; index.value = 0; caught.value = 0; quip('Round two! Hi again.', 'happy') }

const toggleMute = () => { muted.value = !muted.value; sfx.setMuted(muted.value); if (!muted.value) sfx.play('tick') }

const keys = (e) => {
  if (box.value !== null || stage.value !== 'journey') return
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') nav(1)
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') nav(-1)
  else if (e.key === 'Enter' && !(e.target instanceof HTMLButtonElement)) openBox(index.value)
}
onMounted(() => addEventListener('keydown', keys))
onBeforeUnmount(() => removeEventListener('keydown', keys))
</script>

<template>
  <WorldCanvas
    ref="world" :stage="stage" :charge="charge" :target="index"
    @nav="nav" @pick="openBox" @opened="onOpened" @heart="onHeart" @fail="webgl = false"
  />
  <div class="vignette" aria-hidden="true"></div>

  <Mascot :say="say" :mood="mood" />
  <button class="mute btn round" @click="toggleMute" :aria-label="muted ? 'Unmute sound' : 'Mute sound'">{{ muted ? '🔇' : '🔊' }}</button>

  <Transition name="fade">
    <Intro v-if="stage === 'intro' && !unlocked" @charge="(v) => (charge = v)" @unlock="onUnlock" @quip="quip" />
  </Transition>
  <Transition name="fade">
    <Journey v-if="stage === 'journey'" :index="index" :webgl="webgl" @nav="nav" @open="openBox" @finish="finish" />
  </Transition>
  <Transition name="fade"><Game v-if="stage === 'game'" :caught="caught" :goal="GOAL" /></Transition>
  <Transition name="fade"><Ask v-if="stage === 'ask'" @yes="onYes" @quip="quip" /></Transition>
  <Transition name="fade"><Yes v-if="stage === 'yes'" @replay="replay" @quip="quip" /></Transition>

  <Transition name="fade">
    <Lightbox v-if="box !== null" :index="box" @close="box = null" @step="stepBox" />
  </Transition>
</template>

<style scoped>
.vignette { position: fixed; inset: 0; pointer-events: none; z-index: 5; background: radial-gradient(ellipse at center, transparent 55%, rgba(3, 5, 18, 0.55) 100%); }
.mute { position: fixed; z-index: 40; top: calc(12px + var(--safe-t)); right: max(14px, env(safe-area-inset-right)); width: 2.6rem; height: 2.6rem; font-size: 1.05rem; backdrop-filter: blur(10px); }
</style>
