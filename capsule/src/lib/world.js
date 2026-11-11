import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

const TAU = Math.PI * 2
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const lerp = (a, b, t) => a + (b - a) * t
const damp = (a, b, k, dt) => lerp(a, b, 1 - Math.exp(-k * dt))
const easeOutBack = (t) => {
  const c1 = 1.70158, c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// ── layout constants ────────────────────────────────────────────
const STEP = 6          // distance between memories along -z
const FIRST_Z = -8      // z of the first memory
const PALETTE = {
  pink: 0xff5c93,
  amber: 0xffc477,
  sage: 0xa8c8b4,
  cream: 0xfff6e6,
}

function glowTexture(inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)') {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, inner)
  grad.addColorStop(0.35, 'rgba(255,255,255,0.35)')
  grad.addColorStop(1, outer)
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function heartGeometry() {
  const shape = new THREE.Shape()
  const N = 72
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * TAU
    const x = 16 * Math.pow(Math.sin(t), 3)
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
    i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)
  }
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: 5, bevelEnabled: true, bevelSize: 1.6, bevelThickness: 2.2, bevelSegments: 4, curveSegments: 18,
  })
  g.center()
  g.scale(0.045, 0.045, 0.045)
  return g
}

// ── particle system (pops, sparkles, fireworks) ────────────────
class Sparks {
  constructor(scene, max = 3000) {
    this.max = max
    this.i = 0
    this.pos = new Float32Array(max * 3).fill(9999)
    this.col = new Float32Array(max * 3)
    this.base = new Float32Array(max * 3)
    this.vel = new Float32Array(max * 3)
    this.life = new Float32Array(max)
    this.maxLife = new Float32Array(max).fill(1)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(this.col, 3))
    this.mat = new THREE.PointsMaterial({
      size: 0.28, map: glowTexture(), vertexColors: true, transparent: true,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true, fog: false,
    })
    this.points = new THREE.Points(geo, this.mat)
    this.points.frustumCulled = false
    this.points.renderOrder = 5
    this.geo = geo
    scene.add(this.points)
  }

  burst(origin, count, colors, speed = 4, life = 1.4, spread = 1) {
    const c = new THREE.Color()
    for (let n = 0; n < count; n++) {
      const k = this.i++ % this.max
      const u = Math.random() * 2 - 1
      const a = Math.random() * TAU
      const r = Math.sqrt(1 - u * u)
      const s = speed * (0.35 + Math.random() * 0.65) * spread
      this.pos[k * 3] = origin.x
      this.pos[k * 3 + 1] = origin.y
      this.pos[k * 3 + 2] = origin.z
      this.vel[k * 3] = r * Math.cos(a) * s
      this.vel[k * 3 + 1] = u * s
      this.vel[k * 3 + 2] = r * Math.sin(a) * s
      c.set(colors[(Math.random() * colors.length) | 0])
      this.base[k * 3] = c.r
      this.base[k * 3 + 1] = c.g
      this.base[k * 3 + 2] = c.b
      this.life[k] = this.maxLife[k] = life * (0.6 + Math.random() * 0.6)
    }
  }

  update(dt) {
    const drag = Math.pow(0.12, dt)
    for (let k = 0; k < this.max; k++) {
      if (this.life[k] <= 0) continue
      this.life[k] -= dt
      const f = clamp(this.life[k] / this.maxLife[k], 0, 1)
      if (this.life[k] <= 0) {
        this.pos[k * 3 + 1] = 9999
        this.col[k * 3] = this.col[k * 3 + 1] = this.col[k * 3 + 2] = 0
        continue
      }
      this.vel[k * 3] *= drag
      this.vel[k * 3 + 1] = this.vel[k * 3 + 1] * drag - 1.6 * dt
      this.vel[k * 3 + 2] *= drag
      this.pos[k * 3] += this.vel[k * 3] * dt
      this.pos[k * 3 + 1] += this.vel[k * 3 + 1] * dt
      this.pos[k * 3 + 2] += this.vel[k * 3 + 2] * dt
      const b = f * f
      this.col[k * 3] = this.base[k * 3] * b
      this.col[k * 3 + 1] = this.base[k * 3 + 1] * b
      this.col[k * 3 + 2] = this.base[k * 3 + 2] * b
    }
    this.geo.attributes.position.needsUpdate = true
    this.geo.attributes.color.needsUpdate = true
  }
}

// ── the world ───────────────────────────────────────────────────
export class World {
  constructor(canvas, memories, handlers = {}) {
    this.canvas = canvas
    this.memories = memories
    this.h = handlers
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    this.stage = 'intro'
    this.last = performance.now()
    this.t = 0
    this.pointer = new THREE.Vector2(0, 0)
    this.pointerSmooth = new THREE.Vector2(0, 0)
    this.pointerMoved = false
    this.raycaster = new THREE.Raycaster()
    this.charge = 0
    this.chargeSmooth = 0
    this.openT = -1
    this.openFired = false
    this.target = 0       // desired memory index
    this.current = 0      // smoothed memory index
    this.hover = -1
    this.hearts = []
    this.heartsPickable = false
    this.fireworksUntil = 0
    this.nextFirework = 0
    this.orbit = false
    this.orbitT = 0
    this.alive = true
    this.camBlend = 0
    this.clearZ = FIRST_Z - (memories.length - 1) * STEP - 16

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05

    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.Fog(0x1a2250, 16, 78)
    const pmrem = new THREE.PMREMGenerator(this.renderer)
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    this.scene.environmentIntensity = 0.85

    this.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 500)
    this.camPos = new THREE.Vector3(0, 0.3, 8)
    this.camLook = new THREE.Vector3(0, 0, 0)
    this.camera.position.copy(this.camPos)

    this.glowTex = glowTexture()
    this.buildSky()
    this.buildClouds()
    this.buildFireflies()
    this.buildCapsule()
    this.buildPolaroids()
    this.sparks = new Sparks(this.scene, this.reduced ? 1200 : 3200)

    const key = new THREE.DirectionalLight(0xdfe6ff, 0.8)
    key.position.set(3, 5, 6)
    this.scene.add(key)
    this.scene.add(new THREE.HemisphereLight(0x9fb4ff, 0x2a1c3a, 0.5))

    this.bind()
    this.resize()
    this.loop = this.loop.bind(this)
    this.renderer.setAnimationLoop(this.loop)
  }

  // ── builders ─────────────────────────────────────────────────
  buildSky() {
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(200, 32, 24),
      new THREE.ShaderMaterial({
        side: THREE.BackSide, depthWrite: false, fog: false,
        uniforms: { moon: { value: new THREE.Vector3(0.38, 0.5, -0.78).normalize() } },
        vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
        fragmentShader: `
          varying vec3 vP; uniform vec3 moon;
          void main(){
            float h = vP.y;
            vec3 top = vec3(0.016,0.024,0.07);
            vec3 mid = vec3(0.075,0.10,0.26);
            vec3 hor = vec3(0.27,0.33,0.58);
            vec3 col = mix(hor, mid, smoothstep(0.0,0.45,h));
            col = mix(col, top, smoothstep(0.35,1.0,h));
            col = mix(col, vec3(0.10,0.13,0.30), smoothstep(0.0,-0.35,h));
            float m = max(dot(normalize(vP), moon), 0.0);
            col += vec3(1.0,0.92,0.88) * (pow(m, 900.0)*2.2 + pow(m, 60.0)*0.22 + pow(m, 8.0)*0.07);
            gl_FragColor = vec4(col,1.0);
          }`,
      }),
    )
    dome.renderOrder = -10
    this.dome = dome
    this.scene.add(dome)

    const N = this.reduced ? 700 : 1600
    const p = new Float32Array(N * 3), s = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      const u = Math.random() * 0.96 + 0.04      // keep stars above the horizon
      const a = Math.random() * TAU
      const r = Math.sqrt(1 - u * u) * 170
      p[i * 3] = Math.cos(a) * r
      p[i * 3 + 1] = u * 170
      p[i * 3 + 2] = Math.sin(a) * r
      s[i] = Math.random()
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(p, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(s, 1))
    this.starMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
      uniforms: { uTime: { value: 0 }, uPx: { value: 1 } },
      vertexShader: `
        attribute float aSeed; uniform float uTime; uniform float uPx; varying float vA;
        void main(){
          vA = 0.35 + 0.65*(0.5+0.5*sin(uTime*(0.8+aSeed*2.0)+aSeed*60.0));
          gl_PointSize = (1.2 + aSeed*2.6) * uPx;
          gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.);
        }`,
      fragmentShader: `
        varying float vA;
        void main(){ float d = length(gl_PointCoord-0.5); if(d>0.5) discard; gl_FragColor = vec4(vec3(0.85,0.9,1.0), vA*smoothstep(0.5,0.0,d)); }`,
    })
    this.stars = new THREE.Points(g, this.starMat)
    this.stars.frustumCulled = false
    this.stars.renderOrder = -9
    this.scene.add(this.stars)
  }

  buildClouds() {
    const tex = glowTexture('rgba(255,255,255,0.9)')
    this.clouds = []
    const N = this.reduced ? 26 : 56
    const zMin = this.clearZ - 30
    for (let i = 0; i < N; i++) {
      const m = new THREE.SpriteMaterial({
        map: tex, color: i % 5 === 0 ? 0xb9a4d8 : 0x8fa4e0, transparent: true,
        opacity: 0.1 + Math.random() * 0.14, depthWrite: false,
      })
      const s = new THREE.Sprite(m)
      const sc = 9 + Math.random() * 16
      s.scale.set(sc * 1.6, sc, 1)
      s.position.set((Math.random() - 0.5) * 34, -4 + Math.random() * 7, lerp(14, zMin, Math.random()))
      s.userData = { vx: (Math.random() - 0.5) * 0.25, base: m.opacity }
      this.clouds.push(s)
      this.scene.add(s)
    }
  }

  buildFireflies() {
    const N = this.reduced ? 120 : 280
    const p = new Float32Array(N * 3), s = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      p[i * 3] = (Math.random() - 0.5) * 22
      p[i * 3 + 1] = (Math.random() - 0.5) * 8
      p[i * 3 + 2] = lerp(10, this.clearZ - 10, Math.random())
      s[i] = Math.random()
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(p, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(s, 1))
    this.flyMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPx: { value: 1 } },
      vertexShader: `
        attribute float aSeed; uniform float uTime; uniform float uPx; varying float vA;
        void main(){
          vec3 p = position + vec3(sin(uTime*0.4+aSeed*6.0), sin(uTime*0.5+aSeed*11.0)*0.6, cos(uTime*0.3+aSeed*9.0))*0.9;
          vec4 mv = modelViewMatrix*vec4(p,1.0);
          vA = 0.25 + 0.75*pow(0.5+0.5*sin(uTime*(1.2+aSeed)+aSeed*40.0), 3.0);
          gl_PointSize = (3.0+aSeed*5.0) * uPx * (9.0 / -mv.z);
          gl_Position = projectionMatrix*mv;
        }`,
      fragmentShader: `
        varying float vA;
        void main(){ float d = length(gl_PointCoord-0.5); if(d>0.5) discard;
          gl_FragColor = vec4(vec3(1.0,0.78,0.42), vA*pow(1.0-d*2.0,2.0)); }`,
    })
    this.fireflies = new THREE.Points(g, this.flyMat)
    this.fireflies.frustumCulled = false
    this.scene.add(this.fireflies)
  }

  buildCapsule() {
    const cap = new THREE.Group()
    const top = new THREE.Group()
    const bottom = new THREE.Group()
    const R = 0.9, H = 0.8

    const silver = new THREE.MeshStandardMaterial({ color: 0xdfe7f5, metalness: 1, roughness: 0.22 })
    const navy = new THREE.MeshStandardMaterial({ color: 0x25306b, metalness: 0.9, roughness: 0.3 })
    const gold = new THREE.MeshStandardMaterial({ color: 0xf0b98a, metalness: 1, roughness: 0.18 })
    this.heartMat = new THREE.MeshStandardMaterial({
      color: PALETTE.pink, emissive: 0xff2e74, emissiveIntensity: 0.7, metalness: 0.2, roughness: 0.3,
    })

    const mk = (geo, mat, parent, fn) => { const m = new THREE.Mesh(geo, mat); fn?.(m); parent.add(m); return m }
    mk(new THREE.CylinderGeometry(R, R, H, 56, 1, true), silver, top, (m) => (m.position.y = H / 2))
    mk(new THREE.SphereGeometry(R, 56, 28, 0, TAU, 0, Math.PI / 2), silver, top, (m) => (m.position.y = H))
    mk(new THREE.CylinderGeometry(R, R, H, 56, 1, true), navy, bottom, (m) => (m.position.y = -H / 2))
    mk(new THREE.SphereGeometry(R, 56, 28, 0, TAU, 0, Math.PI / 2), navy, bottom, (m) => {
      m.position.y = -H
      m.rotation.x = Math.PI
    })
    // inner glow disc visible when it opens
    const inner = new THREE.Mesh(
      new THREE.CircleGeometry(R * 0.96, 48),
      new THREE.MeshBasicMaterial({ color: 0xffe3b0, side: THREE.DoubleSide, fog: false }),
    )
    inner.rotation.x = -Math.PI / 2
    bottom.add(inner)
    this.innerDisc = inner

    mk(new THREE.TorusGeometry(R + 0.005, 0.05, 16, 72), gold, bottom, (m) => (m.rotation.x = Math.PI / 2))
    mk(new THREE.TorusGeometry(R * 0.55, 0.035, 12, 48), gold, top, (m) => { m.rotation.x = Math.PI / 2; m.position.y = H + 0.62 })

    // sealed-with-love heart
    const heart = mk(heartGeometry(), this.heartMat, top, (m) => {
      m.scale.setScalar(0.42)
      m.position.set(0, 0.42, R + 0.02)
    })
    heart.scale.z = 0.5
    this.sealHeart = heart

    // glass window band on the bottom half
    for (let i = 0; i < 3; i++) {
      const a = (i - 1) * 0.55
      const win = new THREE.Mesh(
        new THREE.CircleGeometry(0.12, 24),
        new THREE.MeshBasicMaterial({ color: 0xffd9a0, fog: false }),
      )
      win.position.set(Math.sin(a) * (R + 0.01), -0.4, Math.cos(a) * (R + 0.01))
      win.rotation.y = a
      bottom.add(win)
    }

    cap.add(bottom, top)
    this.top = top
    this.bottom = bottom

    // halo + orbit rings
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.glowTex, color: 0xffb27a, transparent: true, opacity: 0.55,
      blending: THREE.AdditiveBlending, depthWrite: false, fog: false,
    }))
    halo.scale.setScalar(7)
    cap.add(halo)
    this.halo = halo

    this.rings = []
    ;[[2.0, 0.55, 0xffc477], [2.5, -0.35, 0xff7ea8], [3.0, 1.05, 0xa8c8b4]].forEach(([r, tilt, color], i) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.012, 8, 160),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.55, fog: false }),
      )
      ring.rotation.set(Math.PI / 2 + tilt, 0, i)
      // a bead that rides the ring
      const bead = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), new THREE.MeshBasicMaterial({ color, fog: false }))
      ring.add(bead)
      ring.userData = { bead, r, speed: 0.4 + i * 0.22 }
      cap.add(ring)
      this.rings.push(ring)
    })

    this.capLight = new THREE.PointLight(0xffc88a, 0, 14, 1.6)
    cap.add(this.capLight)

    this.capsule = cap
    this.scene.add(cap)
  }

  buildPolaroids() {
    this.polaroids = []
    const loader = new THREE.TextureLoader()
    const maxAniso = this.renderer.capabilities.getMaxAnisotropy()
    const playTex = (() => {
      const c = document.createElement('canvas'); c.width = c.height = 128
      const g = c.getContext('2d')
      g.fillStyle = 'rgba(255,255,255,0.92)'; g.beginPath(); g.arc(64, 64, 58, 0, TAU); g.fill()
      g.fillStyle = '#e04a7d'; g.beginPath(); g.moveTo(50, 36); g.lineTo(50, 92); g.lineTo(96, 64); g.closePath(); g.fill()
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t
    })()

    this.memories.forEach((mem, i) => {
      const side = i % 2 === 0 ? -1 : 1
      const group = new THREE.Group()
      const inner = new THREE.Group()
      group.add(inner)

      const photoMat = new THREE.MeshBasicMaterial({ color: 0x1a2040, fog: false })
      const frameMat = new THREE.MeshBasicMaterial({ color: PALETTE.cream, fog: false })
      const base = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), frameMat)
      const photo = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), photoMat)
      const back = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: 0xe8dcc6, side: THREE.BackSide, fog: false }))
      const labelMat = new THREE.MeshBasicMaterial({ transparent: true, fog: false, opacity: 0 })
      const label = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), labelMat)
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({
        map: this.glowTex, color: i % 2 ? PALETTE.pink : PALETTE.amber, transparent: true,
        opacity: 0.0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false,
      }))
      glow.scale.set(6.5, 7.5, 1)
      glow.position.z = -0.04
      inner.add(glow, back, base, photo, label)
      photo.position.z = 0.012
      label.position.z = 0.016
      base.userData.index = i
      photo.userData.index = i

      let play = null
      if (mem.kind === 'video') {
        play = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8), new THREE.MeshBasicMaterial({ map: playTex, transparent: true, fog: false }))
        play.position.z = 0.03
        inner.add(play)
      }

      const place = (aspect) => {
        const maxW = 2.35, maxH = 2.8
        let w = maxW, h = maxW / aspect
        if (h > maxH) { h = maxH; w = h * aspect }
        const pad = 0.16, bar = 0.62
        base.scale.set(w + pad * 2, h + pad + bar, 1)
        base.position.y = (-bar + pad) / 2
        back.scale.copy(base.scale); back.position.copy(base.position)
        photo.scale.set(w, h, 1)
        const photoTop = (h + pad + bar) / 2 + base.position.y
        photo.position.y = photoTop - pad - h / 2
        label.scale.set(w + pad, bar * 0.8, 1)
        label.position.y = base.position.y - (h + pad + bar) / 2 + bar / 2 + 0.02
        glow.scale.set((w + pad * 2) * 2.6, (h + 1) * 2.4, 1)
        group.userData.size = { w, h }
        if (play) play.position.y = photo.position.y
      }
      place(0.75)

      loader.load(mem.url, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = Math.min(8, maxAniso)
        photoMat.map = tex
        photoMat.color.set(0xffffff)
        photoMat.needsUpdate = true
        place(tex.image.width / tex.image.height)
      })

      const px = this.portrait ? 0 : side * 2.7
      group.userData = {
        ...group.userData, i, side, home: new THREE.Vector3(px, 0.1 * Math.sin(i * 1.7), FIRST_Z - i * STEP),
        tilt: (Math.sin(i * 2.3) * 0.06), scale: 0, hoverT: 0, activeT: 0, spawnAt: 0, label: labelMat, inner, photoMat, glow,
        wob: Math.random() * TAU, play,
      }
      group.position.set(0, 0, 0)
      group.scale.setScalar(0.001)
      group.visible = false
      this.scene.add(group)
      this.polaroids.push(group)
    })

    // handwritten captions, once the font is ready
    const drawLabels = () => {
      this.polaroids.forEach((g, i) => {
        const c = document.createElement('canvas')
        c.width = 640; c.height = 130
        const x = c.getContext('2d')
        const text = this.memories[i].title
        let size = 58
        x.font = `${size}px Caveat, cursive`
        while (x.measureText(text).width > 590 && size > 28) { size -= 2; x.font = `${size}px Caveat, cursive` }
        x.fillStyle = '#3a3358'
        x.textAlign = 'center'; x.textBaseline = 'middle'
        x.fillText(text, 320, 68)
        const t = new THREE.CanvasTexture(c)
        t.colorSpace = THREE.SRGBColorSpace
        t.anisotropy = 4
        g.userData.label.map = t
        g.userData.label.opacity = 1
        g.userData.label.needsUpdate = true
      })
    }
    const fonts = document.fonts
    if (fonts?.load) Promise.all([fonts.load('58px Caveat'), fonts.ready]).then(drawLabels, drawLabels)
    else drawLabels()
  }

  // ── hearts mini-game ─────────────────────────────────────────
  spawnHearts(n, pickable) {
    this.clearHearts()
    this.heartsPickable = pickable
    const geo = this.heartGeo ||= heartGeometry()
    for (let i = 0; i < n; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: i % 3 === 0 ? 0xff7ea8 : PALETTE.pink, emissive: 0xff2e74, emissiveIntensity: 0.55,
        metalness: 0.25, roughness: 0.28, fog: false,
      })
      const m = new THREE.Mesh(geo, mat)
      m.userData = {
        heart: true, phase: Math.random() * TAU, speed: 0.25 + Math.random() * 0.4,
        size: pickable ? 0.9 + Math.random() * 0.5 : (0.5 + Math.random() * 0.7) * (this.portrait ? 0.55 : 1),
        ax: Math.random(), ay: Math.random(), az: Math.random(), appear: -i * 0.12, vis: 0,
        side: i % 2 ? 1 : -1, mag: Math.random(),
      }
      m.scale.setScalar(0.001)
      this.scene.add(m)
      this.hearts.push(m)
    }
  }

  clearHearts() {
    this.hearts.forEach((h) => { this.scene.remove(h); h.material.dispose() })
    this.hearts = []
  }

  updateHearts(dt) {
    if (!this.hearts.length) return
    const cam = this.camera
    const halfH = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2))
    const dist = 9
    const hh = halfH * dist, hw = hh * cam.aspect
    this.hearts.forEach((m, i) => {
      const u = m.userData
      u.appear += dt
      u.vis = clamp(u.appear / 0.6, 0, 1)
      const t = this.t * u.speed + u.phase
      const x = (this.heartsPickable ? (u.ax * 2 - 1) * hw * 0.78 : u.side * (0.42 + u.mag * 0.5) * hw) + Math.sin(t * 1.1) * 0.6
      const y = (u.ay * 2 - 1) * hh * 0.62 + Math.sin(t * 0.9) * 0.7
      const d = dist + (u.az - 0.5) * 4
      const local = new THREE.Vector3(x, y, -d).applyMatrix4(cam.matrixWorld)
      m.position.copy(local)
      m.rotation.y = Math.sin(t) * 0.6
      m.rotation.z = Math.sin(t * 0.7) * 0.2
      const hov = this.heartsPickable && this.hoverHeart === m ? 1.25 : 1
      const target = u.size * u.vis * hov * (0.9 + 0.06 * Math.sin(this.t * 4 + u.phase))
      m.scale.setScalar(lerp(m.scale.x, Math.max(target, 0.001), 1 - Math.exp(-dt * 10)))
    })
  }

  // ── public api ───────────────────────────────────────────────
  setStage(stage) {
    const prev = this.stage
    this.stage = stage
    if (stage === 'journey' && prev === 'intro') return
    if (stage === 'journey') {
      this.orbit = false
      this.clearHearts()
    }
    if (stage === 'game') this.spawnHearts(this.reduced ? 6 : 8, true)
    if (stage === 'ask') this.spawnHearts(this.reduced ? 8 : 16, false)
    if (stage === 'intro') {
      this.openT = -1
      this.openFired = false
      this.orbit = false
      this.clearHearts()
      this.polaroids.forEach((g) => { g.visible = false; g.userData.scale = 0; g.scale.setScalar(0.001) })
    }
  }

  setCharge(v) { this.charge = clamp(v, 0, 1) }
  setTarget(i) { this.target = clamp(i, 0, this.memories.length - 1) }

  open() {
    if (this.openT >= 0) return
    this.openT = 0
    this.sound?.('whoosh')
  }

  celebrate() {
    this.orbit = true
    this.orbitT = 0
    this.fireworksUntil = this.t + (this.reduced ? 7 : 14)
    this.nextFirework = this.t
    this.clearHearts()
    this.spawnHearts(this.reduced ? 10 : 22, false)
  }

  // ── input ────────────────────────────────────────────────────
  bind() {
    const c = this.canvas
    this.onResize = () => this.resize()
    window.addEventListener('resize', this.onResize)

    this.down = null
    this.lastNav = 0
    this.wheelAcc = 0

    c.addEventListener('pointermove', (e) => {
      const r = c.getBoundingClientRect()
      this.pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
      this.pointerMoved = true
    })
    c.addEventListener('pointerdown', (e) => {
      const r = c.getBoundingClientRect()
      this.pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
      this.down = { x: e.clientX, y: e.clientY, t: performance.now() }
      if (this.stage === 'game') this.tryPopHeart()
    })
    c.addEventListener('pointerup', (e) => {
      if (!this.down) return
      const dx = e.clientX - this.down.x, dy = e.clientY - this.down.y
      const dt = performance.now() - this.down.t
      this.down = null
      if (this.stage !== 'journey') return
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.2) return this.h.onNav?.(dx < 0 ? 1 : -1)
      if (Math.abs(dy) > 55) return this.h.onNav?.(dy < 0 ? 1 : -1)
      if (Math.hypot(dx, dy) < 10 && dt < 600) {
        const idx = this.pickPolaroid()
        if (idx >= 0) this.h.onPick?.(idx)
      }
    })
    c.addEventListener('pointerleave', () => { this.down = null; this.hover = -1 })
    c.addEventListener('wheel', (e) => {
      if (this.stage !== 'journey') return
      e.preventDefault()
      this.wheelAcc += e.deltaY
      const now = performance.now()
      if (Math.abs(this.wheelAcc) > 40 && now - this.lastNav > 520) {
        this.h.onNav?.(this.wheelAcc > 0 ? 1 : -1)
        this.lastNav = now
        this.wheelAcc = 0
      }
      if (now - this.lastNav > 520) this.wheelAcc *= 0.5
    }, { passive: false })
  }

  pickPolaroid() {
    this.raycaster.setFromCamera(this.pointer, this.camera)
    const meshes = this.polaroids.filter((g) => g.visible).flatMap((g) => [g.userData.inner.children[2], g.userData.inner.children[3]])
    const hit = this.raycaster.intersectObjects(meshes, false)[0]
    return hit ? hit.object.userData.index : -1
  }

  tryPopHeart() {
    if (!this.heartsPickable) return
    this.raycaster.setFromCamera(this.pointer, this.camera)
    const hit = this.raycaster.intersectObjects(this.hearts, false)[0]
    if (!hit) return
    const m = hit.object
    this.sparks.burst(m.position, this.reduced ? 30 : 70, [0xff5c93, 0xffc477, 0xffffff, 0xff9ec0], 3.6, 1.1)
    this.scene.remove(m)
    m.material.dispose()
    this.hearts = this.hearts.filter((h) => h !== m)
    this.hoverHeart = null
    this.h.onHeart?.()
    this.sound?.('pop')
  }

  resize() {
    const w = this.canvas.clientWidth || innerWidth
    const h = this.canvas.clientHeight || innerHeight
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.portrait = this.camera.aspect < 0.9
    this.camera.fov = this.portrait ? 66 : 55
    this.camera.updateProjectionMatrix()
    const px = this.renderer.getPixelRatio()
    if (this.starMat) { this.starMat.uniforms.uPx.value = px; this.flyMat.uniforms.uPx.value = px }
    this.polaroids?.forEach((g) => { g.userData.home.x = this.portrait ? 0 : g.userData.side * 2.7 })
  }

  // ── frame loop ───────────────────────────────────────────────
  loop() {
    if (!this.alive) return
    const now = performance.now()
    const dt = Math.min((now - this.last) / 1000, 0.05)
    this.last = now
    this.t += dt
    const t = this.t

    this.starMat.uniforms.uTime.value = t
    this.flyMat.uniforms.uTime.value = t
    this.pointerSmooth.x = damp(this.pointerSmooth.x, this.pointer.x, 3, dt)
    this.pointerSmooth.y = damp(this.pointerSmooth.y, this.pointer.y, 3, dt)

    this.updateCapsule(dt)
    this.updatePolaroids(dt)
    this.updateCamera(dt)
    this.updateHover()
    this.updateHearts(dt)
    this.updateFireworks()
    this.sparks.update(dt)

    this.clouds.forEach((c) => {
      c.position.x += c.userData.vx * dt
      if (c.position.x > 20) c.position.x = -20
      if (c.position.x < -20) c.position.x = 20
    })
    this.dome.position.copy(this.camera.position)
    this.stars.position.copy(this.camera.position)

    this.renderer.render(this.scene, this.camera)
  }

  updateCapsule(dt) {
    const t = this.t
    this.chargeSmooth = damp(this.chargeSmooth, this.charge, 6, dt)
    const ch = this.chargeSmooth
    const cap = this.capsule
    const shake = this.reduced ? 0 : ch * ch * 0.07

    // opening animation
    let open = 0
    if (this.openT >= 0) {
      this.openT += dt
      open = easeInOut(clamp((this.openT - 0.25) / 1.5, 0, 1))
      if (this.openT > 0.25 && !this.spawned) {
        this.spawned = true
        this.polaroids.forEach((g, i) => { g.visible = true; g.userData.spawnAt = this.openT + i * 0.1 })
        this.sparks.burst(cap.position, this.reduced ? 80 : 240, [0xffc477, 0xff7ea8, 0xffffff, 0xa8c8b4], 5, 1.8)
        this.sound?.('chime')
      }
      if (this.openT > 1.9 && !this.openFired) {
        this.openFired = true
        this.stage = 'journey'
        this.h.onOpened?.()
      }
    } else {
      this.spawned = false
    }
    this.openAmt = open

    cap.position.set(
      (Math.random() - 0.5) * shake,
      Math.sin(t * 1.1) * 0.14 + (Math.random() - 0.5) * shake,
      (Math.random() - 0.5) * shake,
    )
    cap.rotation.y = t * 0.35 + ch * t * 2
    cap.rotation.x = Math.sin(t * 0.6) * 0.06
    cap.rotation.z = 0.18 + Math.sin(t * 0.45) * 0.04

    this.top.position.y = open * 1.5
    this.top.rotation.z = open * 0.45
    this.top.rotation.x = open * -0.2
    this.bottom.position.y = -open * 0.25
    this.capLight.intensity = (ch * 3 + open * 14) * (1 + Math.sin(t * 20) * 0.04)
    this.heartMat.emissiveIntensity = 0.55 + ch * 1.8 + Math.sin(t * 3) * 0.12
    this.halo.material.opacity = 0.38 + ch * 0.5 + open * 0.3 + Math.sin(t * 2) * 0.05
    this.halo.scale.setScalar(6.4 + ch * 3 + open * 4)
    this.rings.forEach((r, i) => {
      r.rotation.z += dt * (0.25 + ch * 3) * (i % 2 ? -1 : 1)
      const a = t * r.userData.speed * (1 + ch * 2)
      r.userData.bead.position.set(Math.cos(a) * r.userData.r, Math.sin(a) * r.userData.r, 0)
    })
    cap.visible = this.camera.position.z > -16
  }

  updatePolaroids(dt) {
    const t = this.t
    this.current = damp(this.current, this.target, 3.2, dt)
    if (this.orbit) this.orbitT += dt
    const n = this.polaroids.length
    const capPos = new THREE.Vector3(0, 0, 0)

    this.polaroids.forEach((g, i) => {
      const u = g.userData
      if (!g.visible) return
      const age = this.openT - u.spawnAt
      const sp = clamp(age / 1.5, 0, 1)
      const e = sp <= 0 ? 0 : easeOutBack(sp)
      const wob = Math.sin(t * 0.8 + u.wob)

      let tx, ty, tz, ry, rz = u.tilt
      if (this.orbit) {
        const a = (i / n) * TAU + this.orbitT * 0.22
        const R = 7.2
        tx = Math.sin(a) * R
        tz = this.clearZ + Math.cos(a) * R
        ty = 1.2 + Math.sin(a * 2 + i) * 0.6
        ry = a
        const k = clamp(this.orbitT / 2.2, 0, 1)
        const ease = easeInOut(k)
        const hx = lerp(u.home.x, tx, ease), hz = lerp(u.home.z, tz, ease)
        g.position.set(hx, lerp(u.home.y, ty, ease), hz)
        g.rotation.set(0, lerp(0, ry, ease), rz)
      } else {
        tx = u.home.x; ty = u.home.y + wob * 0.08; tz = u.home.z
        ry = this.portrait ? 0 : -u.side * 0.32
        g.position.set(lerp(capPos.x, tx, e), lerp(capPos.y, ty, e), lerp(capPos.z, tz, e))
        g.rotation.set(0, ry * e + (1 - e) * TAU * 0.5, rz * e + (1 - e) * 1.2)
      }

      const active = this.stage === 'journey' && Math.abs(this.current - i) < 0.5 ? 1 : 0
      u.activeT = damp(u.activeT, active, 6, dt)
      u.hoverT = damp(u.hoverT, this.hover === i ? 1 : 0, 10, dt)
      const passed = this.orbit ? 1 : clamp((this.camPos.z - g.position.z - 0.5) / 1.6, 0, 1)
      const s = (0.9 + u.activeT * 0.14 + u.hoverT * 0.06) * (this.orbit ? 0.85 : 1) * Math.max(e, this.orbit ? 1 : 0) * passed
      g.scale.setScalar(Math.max(s, 0.001))
      const dim = this.orbit ? 1 : 0.72 + u.activeT * 0.28 + u.hoverT * 0.1
      u.photoMat.color.setScalar(u.photoMat.map ? dim : 0.1)
      u.glow.material.opacity = (0.1 + u.activeT * 0.32 + u.hoverT * 0.1) * e
      if (u.play) u.play.scale.setScalar(1 + Math.sin(t * 3) * 0.06)
    })
  }

  updateCamera(dt) {
    const px = this.pointerSmooth.x, py = this.pointerSmooth.y
    const want = new THREE.Vector3()
    const look = new THREE.Vector3()
    let k = 1.6

    if (this.stage === 'intro' && this.openT < 0.3) {
      const d = this.portrait ? 14 : 11.5
      const lift = this.portrait ? 1.8 : 1.25
      want.set(px * 0.6, lift + py * 0.3, d)
      look.set(0, lift, 0)
    } else if (this.stage === 'intro') {
      want.set(0, 0.3, 4.2); look.set(0, 0.2, 0); k = 3
    } else if (this.stage === 'journey' || (this.openFired && this.stage === 'journey')) {
      const i0 = Math.floor(clamp(this.current, 0, this.polaroids.length - 1))
      const i1 = Math.min(i0 + 1, this.polaroids.length - 1)
      const f = this.current - i0
      const hx = lerp(this.polaroids[i0].userData.home.x, this.polaroids[i1].userData.home.x, f)
      const z = FIRST_Z + 5.2 - this.current * STEP
      want.set(hx * 0.12 + px * 0.7, 0.2 + py * 0.35, z)
      look.set(hx * 0.12 + px * 0.2, this.portrait ? -0.35 : 0, z - 8)
      k = 2.6
    } else if (this.stage === 'game' || this.stage === 'ask') {
      want.set(px * 0.5, py * 0.3, this.clearZ + 12)
      look.set(0, 0, this.clearZ)
      k = 1.2
    } else if (this.stage === 'yes') {
      const a = this.t * 0.07
      want.set(Math.sin(a) * 2.2 + px, 2.4 + py * 0.4, this.clearZ + 15)
      look.set(0, 1.2, this.clearZ)
      k = 1.2
    }

    if (this.stage === 'journey' && !this.openFired) k = 2.6
    this.camPos.x = damp(this.camPos.x, want.x, k, dt)
    this.camPos.y = damp(this.camPos.y, want.y, k, dt)
    this.camPos.z = damp(this.camPos.z, want.z, k, dt)
    this.camLook.x = damp(this.camLook.x, look.x, k, dt)
    this.camLook.y = damp(this.camLook.y, look.y, k, dt)
    this.camLook.z = damp(this.camLook.z, look.z, k, dt)
    this.camera.position.copy(this.camPos)
    this.camera.lookAt(this.camLook)
    this.camera.updateMatrixWorld()
  }

  updateHover() {
    if (!this.pointerMoved) return
    this.pointerMoved = false
    if (this.stage === 'journey') {
      this.hover = this.pickPolaroid()
      this.canvas.style.cursor = this.hover >= 0 ? 'pointer' : 'grab'
    } else if (this.stage === 'game' && this.heartsPickable) {
      this.raycaster.setFromCamera(this.pointer, this.camera)
      const hit = this.raycaster.intersectObjects(this.hearts, false)[0]
      this.hoverHeart = hit ? hit.object : null
      this.canvas.style.cursor = hit ? 'pointer' : 'default'
    } else {
      this.canvas.style.cursor = 'default'
    }
  }

  updateFireworks() {
    if (this.t > this.fireworksUntil) return
    if (this.t >= this.nextFirework) {
      this.nextFirework = this.t + 0.28 + Math.random() * 0.4
      const cz = this.clearZ
      const o = new THREE.Vector3((Math.random() - 0.5) * 16, 2.5 + Math.random() * 5, cz - 3 - Math.random() * 6)
      const palettes = [
        [0xff5c93, 0xffc0d6, 0xffffff],
        [0xffc477, 0xfff0c8, 0xffffff],
        [0xa8c8b4, 0xdff5e6, 0xffffff],
        [0x9bb3ff, 0xdbe4ff, 0xff9ec0],
      ]
      this.sparks.burst(o, this.reduced ? 50 : 130, palettes[(Math.random() * palettes.length) | 0], 6.5, 2.2)
    }
  }

  dispose() {
    this.alive = false
    this.renderer.setAnimationLoop(null)
    window.removeEventListener('resize', this.onResize)
    this.renderer.dispose()
  }
}
