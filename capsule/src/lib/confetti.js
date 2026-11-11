// Lightweight 2D confetti: hearts, sparkles and paper bits.
export function startConfetti(canvas, { duration = 9000, reduced = false } = {}) {
  const ctx = canvas.getContext('2d')
  const dpr = Math.min(devicePixelRatio || 1, 2)
  let W = 0, H = 0
  const fit = () => {
    W = canvas.clientWidth; H = canvas.clientHeight
    canvas.width = W * dpr; canvas.height = H * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  fit()
  addEventListener('resize', fit)

  const colors = ['#ff5c93', '#ffc477', '#a8c8b4', '#ffe3ef', '#9bb3ff', '#ffffff']
  const bits = []
  const emit = (n, x, y, spread = 1) => {
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2 * spread
      const s = 6 + Math.random() * 11
      bits.push({
        x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
        r: 6 + Math.random() * 9, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
        c: colors[(Math.random() * colors.length) | 0],
        kind: Math.random() < 0.5 ? 'heart' : Math.random() < 0.5 ? 'rect' : 'star',
        life: 1,
      })
    }
  }
  const heart = (s) => {
    ctx.beginPath()
    ctx.moveTo(0, s * 0.35)
    ctx.bezierCurveTo(-s, -s * 0.3, -s * 0.5, -s, 0, -s * 0.45)
    ctx.bezierCurveTo(s * 0.5, -s, s, -s * 0.3, 0, s * 0.35)
    ctx.fill()
  }

  const n = reduced ? 40 : 110
  emit(n, W * 0.15, H * 0.95, 0.9)
  emit(n, W * 0.85, H * 0.95, 0.9)
  emit(n, W * 0.5, H * 0.9, 1.1)

  const t0 = performance.now()
  let raf = 0, last = t0, rain = 0
  const tick = (now) => {
    const dt = Math.min((now - last) / 16.7, 3)
    last = now
    ctx.clearRect(0, 0, W, H)
    if (now - t0 < duration * 0.7 && (rain += dt) > 5) { rain = 0; emit(reduced ? 1 : 3, Math.random() * W, -20, 0.1); bits[bits.length - 1].vy = 2 }
    for (let i = bits.length - 1; i >= 0; i--) {
      const b = bits[i]
      b.vy += 0.32 * dt; b.vx *= 0.992; b.vy *= 0.992
      b.x += b.vx * dt; b.y += b.vy * dt; b.rot += b.vr * dt
      if (b.y > H + 40) { bits.splice(i, 1); continue }
      ctx.save()
      ctx.translate(b.x, b.y); ctx.rotate(b.rot)
      ctx.globalAlpha = 0.95
      ctx.fillStyle = b.c
      if (b.kind === 'heart') heart(b.r)
      else if (b.kind === 'rect') ctx.fillRect(-b.r / 2, -b.r / 4, b.r, b.r / 2)
      else { ctx.beginPath(); for (let k = 0; k < 8; k++) { const rr = k % 2 ? b.r * 0.35 : b.r * 0.8; const a = (k / 8) * Math.PI * 2; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) } ctx.fill() }
      ctx.restore()
    }
    if (bits.length || now - t0 < duration) raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
  return {
    burst(x, y, n2 = 60) { emit(n2, x, y, 1.4); if (!raf) raf = requestAnimationFrame(tick) },
    stop() { cancelAnimationFrame(raf); removeEventListener('resize', fit); ctx.clearRect(0, 0, W, H) },
  }
}
