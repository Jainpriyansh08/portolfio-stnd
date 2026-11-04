import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, Vector3,
  BoxGeometry, CylinderGeometry, CapsuleGeometry, TorusGeometry,
  MeshStandardMaterial, HemisphereLight, DirectionalLight, Color,
} from 'three'

const W = 16
const H = 9
const FOV = 30
const LIFT_MS = 1100
const TRAIN_SPEED = 1.1 // map units per second
const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t))

const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()
const palette = () => ({
  paper: css('--paper'), ink: css('--ink'), here: css('--line-blue'),
  casing: css('--line-yellow-casing'),
  red: css('--line-red'), yellow: css('--line-yellow'), blue: css('--line-blue'),
})

// Polyline helpers in map units.
function measure(path) {
  const segs = []
  let total = 0
  for (let i = 1; i < path.length; i++) {
    const [x0, y0] = path[i - 1]
    const [x1, y1] = path[i]
    const len = Math.hypot(x1 - x0, y1 - y0)
    segs.push({ x0, y0, x1, y1, len, start: total, angle: Math.atan2(y1 - y0, x1 - x0) })
    total += len
  }
  return { segs, total }
}
function pointAt({ segs, total }, s) {
  const d = Math.max(0, Math.min(total, s))
  const seg = segs.find((g) => d <= g.start + g.len) || segs[segs.length - 1]
  const t = (d - seg.start) / seg.len
  return { x: seg.x0 + (seg.x1 - seg.x0) * t, y: seg.y0 + (seg.y1 - seg.y0) * t, angle: seg.angle }
}

export function createMap3D({ box, canvas, scene: data, labels, onReady }) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  const scene = new Scene()
  const camera = new PerspectiveCamera(FOV, W / H, 0.1, 100)

  // Pose A matches the printed SVG map exactly (top-down); pose B is the lift.
  const D = (H / 2) / Math.tan((FOV / 2) * (Math.PI / 180))
  const poseA = { pos: new Vector3(W / 2, H / 2, D), look: new Vector3(W / 2, H / 2, 0) }
  const tilt = 19 * (Math.PI / 180)
  const D2 = D * 1.05
  const poseB = { pos: new Vector3(W / 2, H / 2 - 0.35 - D2 * Math.sin(tilt), D2 * Math.cos(tilt)), look: new Vector3(W / 2, H / 2 - 0.35, 0) }

  scene.add(new HemisphereLight(0xffffff, 0x8a8f99, 2.2))
  const sun = new DirectionalLight(0xffffff, 1.4)
  sun.position.set(-4, -8, 12)
  scene.add(sun)

  const mats = {}
  const mat = (key) => (mats[key] ||= new MeshStandardMaterial({ roughness: 0.75, metalness: 0, transparent: true }))
  const groups = {}
  const geoms = []
  const track = (g) => (geoms.push(g), g)

  // Lines: extruded ribbons with rounded joints.
  const ribbonW = 0.22
  const ribbonH = 0.12
  const joint = track(new CylinderGeometry(ribbonW / 2, ribbonW / 2, ribbonH, 24).rotateX(Math.PI / 2))
  const measured = {}
  for (const line of data.lines) {
    const g = new Group()
    groups[line.id] = g
    const m = measure(line.path)
    measured[line.id] = m
    for (const s of m.segs) {
      if (line.id === 'yellow') {
        const casing = new Mesh(track(new BoxGeometry(s.len, ribbonW + 0.08, ribbonH - 0.02)), mat('casing'))
        casing.position.set((s.x0 + s.x1) / 2, (s.y0 + s.y1) / 2, (ribbonH - 0.02) / 2)
        casing.rotation.z = s.angle
        g.add(casing)
      }
      const seg = new Mesh(track(new BoxGeometry(s.len, ribbonW, ribbonH)), mat(line.id))
      seg.position.set((s.x0 + s.x1) / 2, (s.y0 + s.y1) / 2, ribbonH / 2)
      seg.rotation.z = s.angle
      g.add(seg)
    }
    for (const [x, y] of line.path) {
      const j = new Mesh(joint, mat(line.id))
      j.position.set(x, y, ribbonH / 2)
      g.add(j)
    }
    scene.add(g)
  }

  // Stations: ink ring with a paper top; interchanges are larger.
  const stopGeo = {
    stop: [track(new CylinderGeometry(0.2, 0.2, 0.2, 32).rotateX(Math.PI / 2)), track(new CylinderGeometry(0.13, 0.13, 0.22, 32).rotateX(Math.PI / 2))],
    interchange: [track(new CylinderGeometry(0.31, 0.31, 0.22, 40).rotateX(Math.PI / 2)), track(new CylinderGeometry(0.21, 0.21, 0.24, 40).rotateX(Math.PI / 2))],
  }
  const hereRing = track(new TorusGeometry(0.42, 0.035, 10, 64))
  const stopMeshes = []
  for (const s of data.stops) {
    const [outer, inner] = stopGeo[s.kind === 'interchange' ? 'interchange' : 'stop']
    const g = new Group()
    const a = new Mesh(outer, mat('ink'))
    const b = new Mesh(inner, mat('paper'))
    a.position.z = 0.1
    b.position.z = 0.11
    g.add(a, b)
    if (s.kind === 'here') {
      const r = new Mesh(hereRing, mat('here'))
      r.position.z = 0.12
      g.add(r)
    }
    g.position.set(s.at[0], s.at[1], 0)
    g.userData.line = s.line
    stopMeshes.push(g)
    scene.add(g)
  }

  // Trains: two per line, running end to end and back.
  const trainGeo = track(new CapsuleGeometry(0.075, 0.34, 4, 12).rotateZ(Math.PI / 2))
  const trains = []
  for (const line of data.lines) {
    for (let k = 0; k < 2; k++) {
      const t = new Mesh(trainGeo, mat('ink'))
      t.position.z = 0.2
      t.userData = { line: line.id, phase: k * 0.5 }
      trains.push(t)
      scene.add(t)
    }
  }

  function applyPalette() {
    const p = palette()
    for (const [key, m] of Object.entries(mats)) {
      const c = p[key]
      if (c) m.color = new Color(c)
    }
  }
  applyPalette()

  // Dimming for line focus.
  let active = null
  function applyDim() {
    const op = (lineIds) => (active === null || lineIds.split(' ').includes(active) ? 1 : 0.15)
    for (const [id, g] of Object.entries(groups)) setGroupOpacity(g, op(id))
    for (const g of stopMeshes) setGroupOpacity(g, op(g.userData.line))
    for (const t of trains) setGroupOpacity(t, op(t.userData.line))
  }
  // Shared materials cannot fade per group, so dimmed objects get clones.
  const dimClones = new Map()
  function setGroupOpacity(obj, value) {
    obj.traverse((o) => {
      if (!o.isMesh) return
      if (!o.userData.baseMat) o.userData.baseMat = o.material
      if (value === 1) { o.material = o.userData.baseMat; return }
      let c = dimClones.get(o.userData.baseMat)
      if (!c) { c = o.userData.baseMat.clone(); c.opacity = value; c.depthWrite = false; dimClones.set(o.userData.baseMat, c) }
      o.material = c
    })
  }

  // Sizing and label projection.
  const v = new Vector3()
  const anchors = data.stops.map((s) => ({ key: s.key, at: s.at }))
  for (const l of data.lines) anchors.push({ key: `${l.id}-o`, at: l.path[0] })
  function placeLabels() {
    for (const a of anchors) {
      const el = labels[a.key]
      if (!el) continue
      v.set(a.at[0], a.at[1], 0.2).project(camera)
      el.style.left = `${((v.x + 1) / 2) * 100}%`
      el.style.top = `${((1 - v.y) / 2) * 100}%`
    }
  }
  function resize() {
    const { width, height } = box.getBoundingClientRect()
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    requestRender()
  }

  // Loop control: render only while something moves, the map is on screen,
  // the tab is visible, and the visitor has not paused it.
  let raf = 0
  let onScreen = true
  let paused = false
  let liftStart = null // armed after the cross-fade
  let lifted = false
  let clock = 0
  let last = 0
  const pointer = { x: 0, y: 0, cx: 0, cy: 0 }
  const running = () => onScreen && !document.hidden && !paused

  function setPose(t) {
    const e = easeOutExpo(t)
    camera.position.lerpVectors(poseA.pos, poseB.pos, e)
    const look = new Vector3().lerpVectors(poseA.look, poseB.look, e)
    if (lifted) {
      pointer.cx += (pointer.x - pointer.cx) * 0.06
      pointer.cy += (pointer.y - pointer.cy) * 0.06
      camera.position.x += pointer.cx * 0.6
      camera.position.y += pointer.cy * 0.35
    }
    camera.lookAt(look)
  }

  function frame(now) {
    raf = 0
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0
    last = now
    const t = liftStart === null ? 0 : Math.min(1, (now - liftStart) / LIFT_MS)
    if (t >= 1) lifted = true
    setPose(t)
    if (lifted && !paused) clock += dt
    for (const tr of trains) {
      const m = measured[tr.userData.line]
      const period = (2 * m.total) / TRAIN_SPEED
      const u = (((clock / period) + tr.userData.phase) % 1) * 2
      const s = (u <= 1 ? u : 2 - u) * m.total
      const p = pointAt(m, s)
      tr.position.x = p.x
      tr.position.y = p.y
      tr.rotation.z = p.angle
      tr.visible = lifted
    }
    renderer.render(scene, camera)
    placeLabels()
    if (running() || (liftStart !== null && t < 1)) raf = requestAnimationFrame(frame)
    else last = 0
  }
  function requestRender() { if (!raf) raf = requestAnimationFrame(frame) }

  const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; if (onScreen) requestRender() }, { threshold: 0.05 })
  io.observe(box)
  const ro = new ResizeObserver(resize)
  ro.observe(box)
  const onVis = () => { if (!document.hidden) requestRender() }
  document.addEventListener('visibilitychange', onVis)
  const onMove = (e) => {
    const r = box.getBoundingClientRect()
    pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 2
    pointer.y = -((e.clientY - r.top) / r.height - 0.5) * 2
    if (running()) requestRender()
  }
  box.addEventListener('pointermove', onMove)
  const scheme = window.matchMedia('(prefers-color-scheme: dark)')
  const onScheme = () => { applyPalette(); dimClones.clear(); applyDim(); requestRender() }
  scheme.addEventListener('change', onScheme)

  resize()
  // First frame at pose A, identical to the printed map; then cross-fade and lift.
  setPose(0)
  renderer.render(scene, camera)
  onReady?.()
  const liftTimer = setTimeout(() => { liftStart = performance.now(); requestRender() }, 450)

  return {
    setActive(id) { active = id; applyDim(); requestRender() },
    setPaused(p) { paused = p; requestRender() },
    destroy() {
      cancelAnimationFrame(raf)
      clearTimeout(liftTimer)
      io.disconnect(); ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      box.removeEventListener('pointermove', onMove)
      scheme.removeEventListener('change', onScheme)
      for (const g of geoms) g.dispose()
      for (const m of Object.values(mats)) m.dispose()
      for (const m of dimClones.values()) m.dispose()
      renderer.dispose()
      // Put labels back on the printed map.
      for (const a of anchors) {
        const el = labels[a.key]
        if (!el) continue
        el.style.left = `${(a.at[0] / W) * 100}%`
        el.style.top = `${((H - a.at[1]) / H) * 100}%`
      }
    },
  }
}
