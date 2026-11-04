import NetworkMap from './components/NetworkMap'
import { ArrowIcon, DownloadIcon, GithubIcon, LinkedinIcon, MailIcon, Roundel } from './components/Icons'
import { profile, lines, interchanges, projects, stationIndex, toolbox, lineNames, education, recognition } from './data'

// Overpass's middle dot sits tight, so separators are spaced in CSS.
const S = (text) => text.split(' · ').flatMap((part, i) => (i ? [' ', <span key={`s${i}`} className="sep">·</span>, ' ', part] : [part]))

const NAV = [
  ['experience', 'Experience'],
  ['projects', 'Projects'],
  ['skills', 'Skills'],
  ['contact', 'Contact'],
]

function Header() {
  return (
    <header className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 pt-3 sm:px-8">
      <a href="#top" className="inline-flex min-h-11 items-center gap-2.5 font-extrabold no-underline">
        <Roundel />
        <span>Priyansh Jain</span>
      </a>
      <nav aria-label="Sections">
        <ul className="-mx-2 flex flex-wrap items-center">
          {NAV.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className="inline-flex min-h-11 items-center px-2 font-semibold text-ink-2 no-underline hover:text-ink hover:underline">
                {label}
              </a>
            </li>
          ))}
          <li className="ml-2 hidden sm:block">
            <a href={profile.resume} className="btn btn-secondary min-h-11 py-1 text-[0.95rem]" type="application/pdf">
              <DownloadIcon /> Resume
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}

function Actions() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a href={`mailto:${profile.email}`} className="btn btn-primary"><MailIcon /> Email me</a>
      <a href={profile.resume} className="btn btn-secondary" type="application/pdf"><DownloadIcon /> Resume (PDF)</a>
      <a href={profile.github} className="btn btn-icon" target="_blank" rel="noreferrer" aria-label="GitHub profile"><GithubIcon /></a>
      <a href={profile.linkedin} className="btn btn-icon" target="_blank" rel="noreferrer" aria-label="LinkedIn profile"><LinkedinIcon /></a>
    </div>
  )
}

// Below 1024px the map would be unreadable, so the hero shows the same
// network as a vertical route diagram.
function RouteOverview() {
  const transfer = (a, b) => interchanges.find((x) => x.lines.includes(a) && x.lines.includes(b))
  return (
    <ol className="mt-10 list-none p-0 lg:hidden" aria-label="Career route, most recent first">
      {lines.map((l, i) => {
        const next = lines[i + 1]
        const x = next && transfer(l.id, next.id)
        return (
          <li key={l.id} className={`l-${l.id}`}>
            <a href={`#line-${l.id}`} className="group grid grid-cols-[30px_minmax(0,1fr)] gap-x-4 no-underline">
              <span className="relative flex justify-center" aria-hidden="true">
                <span className="absolute inset-y-0 w-2 rounded bg-[var(--line)]" style={{ boxShadow: '0 0 0 1px var(--line-casing, transparent)' }} />
                <span className="relative mt-1 size-5 rounded-full border-4 border-ink bg-paper" />
              </span>
              <span className="pb-6">
                <span className="badge">{l.name}</span>
                <span className="mt-2 block text-lg font-extrabold group-hover:underline">{l.company}</span>
                <span className="block text-ink-2">{S(`${l.role} · ${l.period}`)}</span>
                <span className="mt-1 block text-ink-2">{S(l.stations.map((s) => s.title).join(' · '))}</span>
              </span>
            </a>
            {x && (
              <div className="grid grid-cols-[30px_minmax(0,1fr)] gap-x-4 pb-6" aria-hidden="true">
                <span className="flex justify-center"><span className="size-7 rounded-full border-[5px] border-ink bg-paper" /></span>
                <span className="self-center text-sm text-ink-2"><strong className="text-ink">{x.title}</strong>: carried from {next.company.replace(/ \(.*\)/, '')} to {l.company}</span>
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}

function Hero() {
  return (
    <section id="top" aria-labelledby="name" className="mx-auto max-w-[90rem] px-4 pt-10 sm:px-8 lg:pt-8">
      <div className="relative">
        <div className="max-w-[36rem] xl:absolute xl:left-0 xl:top-[3%] xl:z-10 xl:w-[39%] xl:max-w-none">
          <h1 id="name" className="text-[clamp(2.25rem,1rem+5.2vw,5.25rem)] font-black leading-[0.95] tracking-[-0.025em] [overflow-wrap:anywhere]">
            {profile.name}
          </h1>
          <p className="mt-4 text-lg font-bold">
            {profile.role} at {profile.company} <span className="font-medium text-ink-2">{S(` · ${profile.location}`)}</span>
          </p>
          <p className="mt-3 max-w-[34rem] text-ink-2">{profile.intro}</p>
          <div className="mt-6"><Actions /></div>
        </div>
        <div className="mt-8 hidden lg:block xl:mt-0">
          <NetworkMap />
        </div>
        <RouteOverview />
      </div>
    </section>
  )
}

function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-h" className="mx-auto max-w-[90rem] px-4 pt-28 sm:px-8">
      <h2 id="experience-h" className="text-[clamp(2rem,1.4rem+2vw,3rem)] font-black">Experience</h2>
      <p className="mt-3 max-w-[60ch] text-ink-2">Three lines, newest first. Each station is something I shipped and what it changed.</p>
      <div className="mt-14 space-y-20">
        {lines.map((l) => (
          <article key={l.id} id={`line-${l.id}`} aria-labelledby={`line-${l.id}-h`} className={`l-${l.id} grid scroll-mt-8 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] lg:gap-16`}>
            <header className="lg:sticky lg:top-8 lg:self-start">
              <span className="badge">{l.name}</span>
              <h3 id={`line-${l.id}-h`} className="mt-3 text-[1.75rem] font-black">{l.company}</h3>
              <p className="mt-1 font-bold">{l.role}</p>
              <p className="text-ink-2">{S(`${l.period} · ${l.location}`)}</p>
              <p className="mt-4 max-w-[46ch] text-ink-2">{l.blurb}</p>
            </header>
            <ol className="strip">
              {l.stations.map((s) => (
                <li key={s.id} id={`st-${s.id}`}>
                  <strong className="text-xl font-black [overflow-wrap:anywhere]">{s.title}</strong>
                  <p className="mt-1 max-w-[68ch] text-ink-2">{s.text}</p>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-h" className="mx-auto max-w-[90rem] px-4 pt-32 sm:px-8">
      <h2 id="projects-h" className="text-[clamp(2rem,1.4rem+2vw,3rem)] font-black">Projects</h2>
      <p className="mt-3 max-w-[60ch] text-ink-2">Branch lines: more systems I designed and built.</p>
      <ul className="mt-10 list-none border-b border-rule p-0">
        {projects.map((p) => (
          <li key={p.title} className={`l-${p.line} grid grid-cols-1 gap-x-10 gap-y-3 border-t border-rule py-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)_auto]`}>
            <div>
              <span className="badge">{lineNames[p.line].split(' · ')[0]}</span>
              <h3 className="mt-3 text-[1.375rem] font-black">{p.title}</h3>
            </div>
            <div>
              <p className="max-w-[68ch] text-ink-2">{p.description}</p>
              <p className="mt-2 text-[0.9375rem] font-semibold">{S(p.stack.join(' · '))}</p>
            </div>
            {p.link ? (
              <a href={p.link} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1.5 self-start font-bold">
                {p.linkLabel || <>View code<span className="sr-only"> for {p.title} on GitHub</span></>} <ArrowIcon />
              </a>
            ) : (
              <span className="inline-flex min-h-11 items-center self-start font-bold text-ink-2">Private repo</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

function Dot({ line }) {
  return <span className={`l-${line} inline-block size-3.5 shrink-0 rounded-full bg-[var(--line)]`} style={{ boxShadow: '0 0 0 1px var(--line-casing, transparent)' }} title={lineNames[line]} />
}

function Skills() {
  const used = ['blue', 'yellow', 'red', 'orange', 'green', 'violet', 'magenta']
  return (
    <section id="skills" aria-labelledby="skills-h" className="mx-auto max-w-[90rem] px-4 pt-32 sm:px-8">
      <h2 id="skills-h" className="text-[clamp(2rem,1.4rem+2vw,3rem)] font-black">Skills, by where I used them</h2>
      <p className="mt-3 max-w-[60ch] text-ink-2">A station index: each technology with the lines it served.</p>
      <ul className="mt-8 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 text-sm text-ink-2" aria-label="Line key">
        {used.map((l) => <li key={l} className="flex min-w-0 items-center gap-2"><Dot line={l} /><span className="min-w-0">{S(lineNames[l])}</span></li>)}
      </ul>
      <ul className="mt-8 list-none columns-1 gap-10 p-0 sm:columns-2 lg:columns-3">
        {stationIndex.map(([name, ls]) => (
          <li key={name} className="flex break-inside-avoid items-baseline gap-3 border-b border-rule py-2.5">
            <span className="min-w-0 font-bold [overflow-wrap:anywhere]">{name}</span>
            <span className="ml-auto inline-flex shrink-0 gap-1.5" aria-hidden="true">{ls.map((l) => <Dot key={l} line={l} />)}</span>
            <span className="sr-only">: {ls.map((l) => lineNames[l]).join(', ')}</span>
          </li>
        ))}
      </ul>
      <p className="mt-8 max-w-[75ch] text-ink-2"><strong className="text-ink">Also in the toolbox:</strong> {toolbox}</p>

      <div className="mt-20 grid gap-10 border-t border-rule pt-10 md:grid-cols-2">
        <div>
          <h3 className="text-xl font-black">Education</h3>
          <p className="mt-2 font-bold">{education.degree}</p>
          <p className="text-ink-2">{S(`${education.school} · ${education.detail}`)}</p>
        </div>
        <div>
          <h3 className="text-xl font-black">Recognition</h3>
          <ul className="mt-2 list-none space-y-3 p-0">
            {recognition.map((r) => (
              <li key={r.title}><span className="block font-bold">{r.title}</span><span className="text-ink-2">{S(`${r.org} · ${r.when}`)}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-h" className="on-signage mt-32 bg-signage text-[var(--signage-ink)]">
      <div className="mx-auto max-w-[90rem] px-4 py-24 sm:px-8">
        <h2 id="contact-h" className="text-[clamp(2rem,1.4rem+2vw,3rem)] font-black">Get in touch</h2>
        <p className="mt-3 max-w-[56ch] text-[var(--signage-ink-2)]">
          Hiring for backend, payments, identity or applied AI work? Email is the fastest way to reach me.
        </p>
        <a href={`mailto:${profile.email}`} className="mt-8 inline-block text-[clamp(1.4rem,0.6rem+3.6vw,3.25rem)] font-black [overflow-wrap:anywhere] underline decoration-2 underline-offset-[0.18em] hover:decoration-4">
          {profile.email}
        </a>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href={profile.resume} className="btn border-[1.5px] border-[var(--signage-ink)] hover:bg-[var(--signage-ink)] hover:text-[var(--signage)]" type="application/pdf"><DownloadIcon /> Resume (PDF)</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn border-[1.5px] border-[var(--signage-ink)] hover:bg-[var(--signage-ink)] hover:text-[var(--signage)]"><LinkedinIcon /> LinkedIn</a>
          <a href={profile.github} target="_blank" rel="noreferrer" className="btn border-[1.5px] border-[var(--signage-ink)] hover:bg-[var(--signage-ink)] hover:text-[var(--signage)]"><GithubIcon /> GitHub</a>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <>
      <a href="#main" className="sr-only rounded bg-ink px-4 py-3 font-bold text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <footer className="mx-auto flex max-w-[90rem] flex-wrap justify-between gap-2 px-4 py-8 text-sm text-ink-2 sm:px-8">
        <span>© 2026 {profile.name}</span>
        <span>The map is a diagram, not to scale. Built with React and Three.js.</span>
      </footer>
    </>
  )
}
