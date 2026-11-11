<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { you, nick } from '../config.js'
import { sfx } from '../lib/sfx.js'

const emit = defineEmits(['yes', 'quip'])

const lines = [
  'Okay. Deep breath.',
  'You walked through the fog with me. You caught the hearts. You read all my terrible captions.',
  `So, ${you === 'you' ? 'I have to ask' : you + (nick ? ' (my favourite ' + nick + ')' : '') + ', I have to ask'}…`,
]
const step = ref(0)         // how many intro lines are visible
const showAsk = ref(false)
const timers = []
onMounted(() => {
  lines.forEach((_, i) => timers.push(setTimeout(() => { step.value = i + 1; sfx.play('tick') }, 500 + i * 1900)))
  timers.push(setTimeout(() => { showAsk.value = true; sfx.play('chime'); emit('quip', 'Eeeee here we go!', 'nervous') }, 500 + lines.length * 1900))
})
onBeforeUnmount(() => timers.forEach(clearTimeout))

// ── the shy "No" button ───────────────────────────────────────
const noMsgs = [
  'Hmm, let me think…',
  'Are you sure? 🥺',
  'The fog is watching…',
  'Think of the stars ✨',
  'I will bring snacks!',
  ...(nick ? ['Not very chutta saand of you 🐂'] : []),
  'Last chance to say yes 😌',
  'You are running out of Nos',
  'The No button is exhausted.',
]
const nos = ref(0)
const pos = reactive({ x: 0, y: 0 })
const noBtn = ref(null)
const yesBtn = ref(null)
const pointer = { x: -999, y: -999 }
const tired = computed(() => nos.value >= noMsgs.length - 1)
const noLabel = computed(() => (tired.value ? 'Fine… yes 😌' : noMsgs[Math.min(nos.value, noMsgs.length - 1)]))
const yesScale = computed(() => Math.min(1 + nos.value * 0.13, 1.9))
const reactions = [
  ['Nope, it ran away!', 'smirk'], ['Hehe, too slow.', 'smirk'], ['I would not do that if I were you…', 'nervous'],
  ['Pssst. The yes button is right there.', 'shy'], ['It is literally sprinting.', 'wow'], ['You are making it dizzy.', 'shy'], ['Okay okay, it gave up.', 'happy'],
]

const dodge = async () => {
  if (tired.value) return
  const el = noBtn.value
  if (!el) return
  // measure where the button naturally sits (no offset)
  const cur = el.getBoundingClientRect()
  const homeX = cur.left - pos.x, homeY = cur.top - pos.y
  const w = cur.width, h = cur.height
  const vw = innerWidth, vh = innerHeight, m = 14
  const yes = yesBtn.value?.getBoundingClientRect()
  let best = null, bestScore = -1
  for (let i = 0; i < 14; i++) {
    const x = m + Math.random() * (vw - w - m * 2)
    const y = m + 70 + Math.random() * (vh - h - m * 2 - 130)
    const overlapsYes = yes && x < yes.right + 16 && x + w > yes.left - 16 && y < yes.bottom + 16 && y + h > yes.top - 16
    if (overlapsYes) continue
    const dist = Math.hypot(x + w / 2 - pointer.x, y + h / 2 - pointer.y)
    if (dist > bestScore) { bestScore = dist; best = { x, y } }
  }
  if (!best) best = { x: m, y: 90 }
  pos.x = best.x - homeX
  pos.y = best.y - homeY
  const [msg, mood] = reactions[Math.min(nos.value, reactions.length - 1)]
  nos.value++
  emit('quip', msg, mood)
  sfx.play('nope')
  await nextTick()
}

const onNo = () => { if (tired.value) yes(); else dodge() }
const yes = () => emit('yes')
const track = (e) => { pointer.x = e.clientX; pointer.y = e.clientY }
onMounted(() => addEventListener('pointermove', track, { passive: true }))
onBeforeUnmount(() => removeEventListener('pointermove', track))

// ── terms & conditions (because of course) ───────────────────
const terms = ref(false)
const termsList = [
  'Flirting will be mild, sincere, and occasionally terrible (puns included).',
  'Compliments may arrive without warning. Blushing is not a refund-eligible side effect.',
  'You may say “okay, stop” at any time and I will, instantly, with respect.',
  'Snack-sharing is encouraged. Fog is optional.',
  'This permission is valid until revoked, or until the next hill, whichever comes first.',
]
</script>

<template>
  <section class="ask" @click="step < lines.length && (step = lines.length)">
    <div class="stack">
      <TransitionGroup name="line" tag="div" class="lines">
        <p v-for="(l, i) in lines.slice(0, step)" :key="l" class="line" :class="{ big: i === lines.length - 1 }">{{ l }}</p>
      </TransitionGroup>

      <Transition name="fade">
        <div v-if="showAsk" class="q">
          <h1 class="display">
            May I have your <span class="u">permission</span> to <em>flirt</em> with you?
          </h1>
          <p v-if="nick" class="nick">yes, you, {{ nick }} 🐂</p>
          <div class="row">
            <button ref="yesBtn" class="btn primary yes" :style="{ scale: yesScale }" @click="yes">
              Yes, permission granted 💌
            </button>
            <button
              ref="noBtn" class="btn no" :class="{ tired }"
              :style="{ translate: `${pos.x}px ${pos.y}px` }"
              @pointerenter="!tired && dodge()" @pointerdown.prevent="!tired && dodge()" @focus="!tired && dodge()"
              @click="onNo"
            >{{ noLabel }}</button>
          </div>
          <button class="terms-link" @click="terms = true">📜 Read the (very serious) terms &amp; conditions</button>
        </div>
      </Transition>
    </div>

    <Transition name="fade">
      <div v-if="terms" class="terms-wrap" @click.self="terms = false">
        <div class="terms glass" role="dialog" aria-label="Terms and conditions">
          <p class="eyebrow">Official fine print</p>
          <h2 class="display">Flirting Permission · T&amp;Cs</h2>
          <ol><li v-for="t in termsList" :key="t">{{ t }}</li></ol>
          <button class="btn primary" @click="terms = false">Sounds fair 🤝</button>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.ask { position: fixed; inset: 0; z-index: 10; display: grid; place-items: center; padding: 70px 20px 30px; pointer-events: none; }
.stack { pointer-events: auto; display: grid; gap: 22px; justify-items: center; text-align: center; max-width: 760px; }
.lines { display: grid; gap: 12px; justify-items: center; min-height: 6rem; }
.line { font-size: clamp(1.05rem, 2.6vw, 1.35rem); color: #e2e7ff; max-width: 34ch; text-shadow: 0 2px 24px rgba(4, 7, 22, 0.95); }
.line.big { font-family: var(--hand); font-size: clamp(1.9rem, 5vw, 2.8rem); color: var(--amber); line-height: 1.1; }
.line-enter-active { transition: opacity 0.7s, transform 0.7s cubic-bezier(.2, 1, .3, 1); }
.line-enter-from { opacity: 0; transform: translateY(18px); filter: blur(6px); }
.q { display: grid; gap: 22px; justify-items: center; }
h1 { font-size: clamp(2.1rem, 6.2vw, 4.2rem); max-width: 16ch; text-shadow: 0 6px 40px rgba(5, 8, 25, 0.95); }
h1 em { color: var(--rose-soft); }
.nick { font-family: var(--hand); font-size: 1.7rem; color: var(--amber); margin-top: -14px; rotate: -2deg; }
.u { background: linear-gradient(transparent 70%, rgba(255, 92, 147, 0.55) 70%); padding: 0 0.1em; }
.row { display: flex; flex-wrap: wrap; gap: 18px; justify-content: center; align-items: center; min-height: 82px; }
.yes { font-size: 1.1rem; padding: 1em 1.8em; animation: pulse 1.6s ease-in-out infinite; transition: scale 0.35s cubic-bezier(.3, 1.8, .5, 1), transform 0.18s; }
.no { transition: translate 0.45s cubic-bezier(.3, 1.6, .5, 1), transform 0.18s, background 0.2s; position: relative; z-index: 40; }
.no.tired { background: linear-gradient(135deg, #ff5c93, #ff8a5c); border-color: transparent; color: #fff; }
.terms-link { color: var(--mist-dim); font-size: 0.86rem; text-decoration: underline; text-underline-offset: 4px; }
.terms-link:hover { color: var(--amber); }
.terms-wrap { position: fixed; inset: 0; z-index: 50; display: grid; place-items: center; padding: 20px; background: rgba(4, 7, 22, 0.7); backdrop-filter: blur(6px); pointer-events: auto; }
.terms { padding: 26px; max-width: 520px; display: grid; gap: 14px; }
.terms h2 { font-size: 1.7rem; }
.terms ol { margin: 0; padding-left: 1.2em; display: grid; gap: 8px; color: #dbe1ff; font-size: 0.96rem; }
.terms .btn { justify-self: start; }
@keyframes pulse { 50% { box-shadow: 0 10px 54px -4px rgba(255, 92, 147, 0.95); } }
</style>
