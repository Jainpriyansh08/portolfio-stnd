// Tiny synthesized sound effects (no audio files). Starts after the first user gesture.
let ctx = null
let muted = false
let master = null

function ensure() {
  if (ctx) return ctx
  const AC = globalThis.AudioContext || globalThis.webkitAudioContext
  if (!AC) return null
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0.5
  master.connect(ctx.destination)
  return ctx
}

function tone(freq, start, dur, { type = 'sine', gain = 0.18, glideTo = null } = {}) {
  const c = ensure()
  if (!c || muted) return
  const t0 = c.currentTime + start
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t0)
  if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  o.connect(g).connect(master)
  o.start(t0)
  o.stop(t0 + dur + 0.05)
}

function noise(start, dur, from, to, gain = 0.14) {
  const c = ensure()
  if (!c || muted) return
  const len = Math.floor(c.sampleRate * dur)
  const buf = c.createBuffer(1, len, c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  const src = c.createBufferSource()
  src.buffer = buf
  const f = c.createBiquadFilter()
  f.type = 'bandpass'
  const t0 = c.currentTime + start
  f.frequency.setValueAtTime(from, t0)
  f.frequency.exponentialRampToValueAtTime(to, t0 + dur)
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + dur * 0.4)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  src.connect(f).connect(g).connect(master)
  src.start(t0)
}

const notes = { c5: 523.25, e5: 659.25, g5: 783.99, b5: 987.77, c6: 1046.5, e6: 1318.5, g6: 1567.98 }

export const sfx = {
  resume() { ensure()?.resume?.() },
  get muted() { return muted },
  setMuted(v) { muted = v },
  play(name) {
    const c = ensure()
    if (!c || muted) return
    c.resume?.()
    switch (name) {
      case 'tick': tone(880, 0, 0.07, { type: 'triangle', gain: 0.07 }); break
      case 'hold': tone(180, 0, 0.25, { type: 'sine', gain: 0.05, glideTo: 320 }); break
      case 'whoosh': noise(0, 1.4, 300, 4200, 0.16); break
      case 'chime': [notes.c5, notes.e5, notes.g5, notes.c6, notes.e6].forEach((f, i) => tone(f, i * 0.09, 1.1, { gain: 0.12 })); break
      case 'page': noise(0, 0.35, 900, 2600, 0.07); tone(660, 0, 0.12, { type: 'triangle', gain: 0.05 }); break
      case 'pop': tone(520, 0, 0.18, { type: 'sine', gain: 0.2, glideTo: 1200 }); tone(1560, 0.04, 0.2, { gain: 0.08 }); break
      case 'giggle': [740, 880, 988, 880].forEach((f, i) => tone(f, i * 0.06, 0.12, { type: 'triangle', gain: 0.07 })); break
      case 'nope': tone(300, 0, 0.14, { type: 'square', gain: 0.04, glideTo: 180 }); break
      case 'yes': [notes.c5, notes.e5, notes.g5, notes.c6, notes.g5, notes.c6, notes.e6, notes.g6].forEach((f, i) => tone(f, i * 0.1, 0.9, { gain: 0.14 })); noise(0.5, 1.2, 1200, 6000, 0.08); break
      case 'stamp': tone(110, 0, 0.25, { type: 'sine', gain: 0.35, glideTo: 55 }); noise(0, 0.12, 2000, 400, 0.15); break
    }
  },
}
