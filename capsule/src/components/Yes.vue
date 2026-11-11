<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { you, config } from '../config.js'
import { sfx } from '../lib/sfx.js'
import { startConfetti } from '../lib/confetti.js'

const emit = defineEmits(['replay', 'quip'])
const canvas = ref(null)
const copied = ref(false)
const stamped = ref(false)
let confetti, timer

const message = `✅ PERMISSION GRANTED 😌💌\nYou may now flirt with me. Terms: be sweet, be silly, keep the puns coming.\n— ${config.herName || 'signed, the girl from the fog'}`

onMounted(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  confetti = startConfetti(canvas.value, { reduced })
  sfx.play('yes')
  timer = setTimeout(() => { stamped.value = true; sfx.play('stamp') }, 1500)
  emit('quip', 'SHE SAID YES!! (I am a cloud, I am crying rain.)', 'wow')
})
onBeforeUnmount(() => { confetti?.stop(); clearTimeout(timer) })

const replyHref = () => {
  const { whatsapp, sms, email } = config.reply
  const body = encodeURIComponent(message)
  if (whatsapp) return `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${body}`
  if (sms) return `sms:${sms}?&body=${body}`
  if (email) return `mailto:${email}?subject=${encodeURIComponent('Permission granted 💌')}&body=${body}`
  return ''
}
const send = async () => {
  const href = replyHref()
  if (href) return window.open(href, '_blank', 'noopener')
  try {
    if (navigator.share) return await navigator.share({ text: message })
    await navigator.clipboard.writeText(message)
    copied.value = true
    setTimeout(() => (copied.value = false), 2600)
  } catch { /* user cancelled */ }
}
const pop = (e) => { confetti?.burst(e.clientX, e.clientY, 40); sfx.play('pop') }
</script>

<template>
  <section class="yes" @pointerdown="pop">
    <canvas ref="canvas" class="confetti"></canvas>
    <div class="card" @pointerdown.stop>
      <p class="eyebrow">Official document</p>
      <h1 class="display">Flirting Permission Slip</h1>
      <dl>
        <div><dt>Granted by</dt><dd>{{ you === 'you' ? 'The girl from the fog' : you }}</dd></div>
        <div><dt>Valid</dt><dd>From right now, until further notice</dd></div>
        <div><dt>Terms</dt><dd>Be sweet. Be silly. Keep the puns coming.</dd></div>
      </dl>
      <div class="stamp" :class="{ on: stamped }" aria-hidden="true">APPROVED</div>
      <div class="actions">
        <button class="btn primary" @click="send">{{ copied ? 'Copied! Paste it to me 💌' : 'Send me your answer 💌' }}</button>
        <button class="btn" @click="emit('replay')">↺ Replay the memories</button>
      </div>
      <p class="fine">Psst, tap anywhere for more confetti.</p>
    </div>
  </section>
</template>

<style scoped>
.yes { position: fixed; inset: 0; z-index: 10; display: grid; place-items: end center; padding: 0 16px calc(24px + var(--safe-b)); }
.confetti { position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }
.card { position: relative; z-index: 2; background: var(--cream); color: #2c2748; width: min(480px, 100%); padding: 22px 24px 18px; border-radius: 10px; display: grid; gap: 10px; rotate: -1.2deg; box-shadow: 0 40px 80px -20px #000; animation: rise 0.9s cubic-bezier(.2, 1.2, .3, 1) 0.4s backwards; overflow: hidden; }
.card::before { content: ''; position: absolute; inset: 8px; border: 2px dashed rgba(44, 39, 72, 0.25); border-radius: 6px; pointer-events: none; }
.eyebrow { color: #c2456f; }
h1 { font-size: clamp(1.6rem, 5vw, 2.1rem); color: #2c2748; padding-right: 7.4em; }
dl { margin: 4px 0; display: grid; gap: 6px; }
dl div { display: grid; grid-template-columns: 6.5em 1fr; gap: 10px; align-items: baseline; border-bottom: 1px dotted rgba(44, 39, 72, 0.3); padding-bottom: 5px; }
dt { font-size: 0.7rem; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 800; color: #7a7499; }
dd { margin: 0; font-family: var(--hand); font-size: 1.35rem; line-height: 1.1; color: #2c2748; }
.stamp { position: absolute; right: 16px; top: 46px; font-family: var(--serif); font-weight: 800; font-size: 1.25rem; letter-spacing: 0.12em; color: #d6335f; border: 4px solid #d6335f; padding: 0.12em 0.5em; border-radius: 8px; rotate: 14deg; opacity: 0; scale: 3; mix-blend-mode: multiply; }
.stamp.on { opacity: 0.9; scale: 1; transition: scale 0.28s cubic-bezier(.5, 0, 1, .6), opacity 0.12s; }
.actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 6px; }
.actions .btn:not(.primary) { background: rgba(44, 39, 72, 0.08); border-color: rgba(44, 39, 72, 0.18); color: #2c2748; }
.fine { font-size: 0.76rem; color: #7a7499; }
@keyframes rise { from { transform: translateY(120%) rotate(6deg); opacity: 0; } }
@media (max-width: 520px) { dl div { grid-template-columns: 1fr; gap: 0; } .stamp { top: 40px; font-size: 1rem; right: 12px; } h1 { padding-right: 5.6em; font-size: 1.5rem; } }
</style>
