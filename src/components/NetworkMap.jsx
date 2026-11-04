import { useEffect, useRef, useState } from 'react'
import { lines, interchanges } from '../data'
import { PauseIcon, PlayIcon } from './Icons'

const W = 16
const H = 9
const pct = ([x, y]) => ({ left: `${(x / W) * 100}%`, top: `${((H - y) / H) * 100}%` })
const svgPts = (path) => path.map(([x, y]) => `${x},${H - y}`).join(' ')

// Everything the 3D scene needs, in map units.
const scene = {
  lines: lines.map((l) => ({ id: l.id, path: l.path })),
  stops: [
    ...lines.flatMap((l) => [
      { key: `${l.id}-o`, line: l.id, at: l.origin.at, kind: 'stop' },
      ...l.stations.map((s) => ({ key: s.id, line: l.id, at: s.at, kind: s.here ? 'here' : 'stop' })),
    ]),
    ...interchanges.map((x) => ({ key: x.id, line: x.lines.join(' '), at: x.at, kind: 'interchange' })),
  ],
}

function Label({ id, at, side, kind, title, sub, href, line, here, dimmed, onFocusLine, labelRef }) {
  return (
    <a
      ref={labelRef}
      href={href}
      className="st-label"
      data-side={side}
      data-kind={here ? 'here' : kind}
      data-dimmed={dimmed || undefined}
      style={pct(at)}
      onMouseEnter={() => onFocusLine(line)}
      onMouseLeave={() => onFocusLine(null)}
      onFocus={() => onFocusLine(line)}
      onBlur={() => onFocusLine(null)}
      id={`map-${id}`}
    >
      {here && <span className="here">You are here</span>}
      <strong>{title}</strong>
      {sub && <span>{sub}</span>}
    </a>
  )
}

export default function NetworkMap() {
  const boxRef = useRef(null)
  const canvasRef = useRef(null)
  const labelRefs = useRef({})
  const apiRef = useRef(null)
  const [mode, setMode] = useState('flat')
  const [active, setActive] = useState(null)
  const [paused, setPaused] = useState(false)

  // Progressive enhancement: the printed (SVG) map is the page; the 3D
  // network replaces it only on wide screens that allow motion and WebGL.
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!wide.matches || still.matches) return
    const probe = document.createElement('canvas')
    if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) return
    let cancelled = false
    const start = () => import('../map3d.js').then(({ createMap3D }) => {
      if (cancelled || !boxRef.current) return
      apiRef.current = createMap3D({
        box: boxRef.current,
        canvas: canvasRef.current,
        scene,
        labels: labelRefs.current,
        onReady: () => setMode('3d'),
      })
    })
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 300))
    const kick = () => idle(start)
    if (document.readyState === 'complete') kick()
    else window.addEventListener('load', kick, { once: true })
    const stop = () => { apiRef.current?.destroy(); apiRef.current = null; setMode('flat') }
    still.addEventListener('change', stop)
    return () => { cancelled = true; still.removeEventListener('change', stop); apiRef.current?.destroy(); apiRef.current = null }
  }, [])

  useEffect(() => { apiRef.current?.setActive(active) }, [active, mode])
  useEffect(() => { apiRef.current?.setPaused(paused) }, [paused, mode])

  const dim = (line) => active !== null && !line.split(' ').includes(active)
  const lineOpacity = (id) => (active !== null && active !== id ? 0.18 : 1)
  const setRef = (key) => (el) => { if (el) labelRefs.current[key] = el }

  return (
    <figure className="m-0">
      <div ref={boxRef} className="map-box" data-mode={mode}>
        <svg className="map-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          {lines.map((l) => (
            <g key={l.id} style={{ opacity: lineOpacity(l.id) }} className={`l-${l.id}`}>
              {l.id === 'yellow' && (
                <polyline points={svgPts(l.path)} fill="none" stroke="var(--line-yellow-casing)" strokeWidth="0.3" strokeLinejoin="round" strokeLinecap="round" />
              )}
              <polyline points={svgPts(l.path)} fill="none" stroke="var(--line)" strokeWidth="0.22" strokeLinejoin="round" strokeLinecap="round" />
            </g>
          ))}
          {scene.stops.map((s) => {
            const [x, y] = s.at
            const r = s.kind === 'interchange' ? 0.27 : 0.17
            const o = s.kind === 'interchange' ? (active && !s.line.includes(active) ? 0.18 : 1) : lineOpacity(s.line)
            return (
              <g key={s.key} style={{ opacity: o }}>
                {s.kind === 'here' && <circle cx={x} cy={H - y} r="0.4" fill="none" stroke="var(--line-blue)" strokeWidth="0.06" />}
                <circle cx={x} cy={H - y} r={r} fill="var(--paper)" stroke="var(--ink)" strokeWidth={s.kind === 'interchange' ? 0.09 : 0.07} />
              </g>
            )
          })}
        </svg>
        <canvas ref={canvasRef} className="map-canvas" aria-hidden="true" />
        {lines.map((l) => (
          <Label key={`${l.id}-o`} labelRef={setRef(`${l.id}-o`)} id={`${l.id}-o`} line={l.id} at={l.origin.at} side={l.origin.side}
            title={l.origin.title} sub={l.origin.sub} href={`#line-${l.id}`} dimmed={dim(l.id)} onFocusLine={setActive} />
        ))}
        {lines.flatMap((l) => l.stations.map((s) => (
          <Label key={s.id} labelRef={setRef(s.id)} id={s.id} line={l.id} at={s.at} side={s.side} title={s.title} sub={s.sub}
            here={s.here} href={`#st-${s.id}`} dimmed={dim(l.id)} onFocusLine={setActive} />
        )))}
        {interchanges.map((x) => (
          <Label key={x.id} labelRef={setRef(x.id)} id={x.id} kind="interchange" line={x.lines.join(' ')} at={x.at} side={x.side} title={x.title} sub={x.sub}
            href={x.href} dimmed={dim(x.lines.join(' '))} onFocusLine={() => setActive(null)} />
        ))}
      </div>
      <figcaption className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-rule pt-4 text-sm text-ink-2">
        <span className="sr-only">Network map of the systems Priyansh has shipped. Each station links to its details.</span>
        {lines.slice().reverse().map((l) => (
          <button key={l.id} type="button" className={`l-${l.id} inline-flex min-h-11 items-center gap-2 rounded-full pr-2 text-ink hover:underline`}
            onMouseEnter={() => setActive(l.id)} onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(l.id)} onBlur={() => setActive(null)}
            onClick={() => document.getElementById(`line-${l.id}`)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}>
            <span className="badge">{l.name}</span>
            <span>{l.company.replace(/ \(.*\)/, '')}, {l.years}</span>
          </button>
        ))}
        <span className="inline-flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="7.5" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" /></svg>
          Interchange: a skill carried to the next job
        </span>
        {mode === '3d' && (
          <button type="button" className="btn btn-secondary ml-auto min-h-11 py-1 text-sm" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
            {paused ? <PlayIcon /> : <PauseIcon />}
            {paused ? 'Run trains' : 'Pause trains'}
          </button>
        )}
      </figcaption>
    </figure>
  )
}
