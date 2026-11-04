import { lazy, Suspense, useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ArrowUpRight, Download, Mail, MapPin, Menu, X, GraduationCap, Trophy } from 'lucide-react'
import { profile, stats, experience, projects, skills, education, achievements } from './data'

const HeroScene = lazy(() => import('./components/HeroScene'))

const GithubIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" {...p}>
    <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
  </svg>
)
const LinkedinIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" {...p}>
    <path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM7.1 20.5H3.5V9h3.6v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z" />
  </svg>
)

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
}

function Reveal({ children, i = 0, className = '' }) {
  return (
    <motion.div className={className} variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
      {children}
    </motion.div>
  )
}

function SectionTitle({ index, title }) {
  return (
    <Reveal className="mb-12 flex items-center gap-4">
      <span className="font-mono text-sm text-accent">{index}.</span>
      <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      <span className="h-px flex-1 bg-line" />
    </Reveal>
  )
}

function Socials({ className = '' }) {
  const links = [
    profile.github && { href: profile.github, label: 'GitHub', Icon: GithubIcon },
    profile.linkedin && { href: profile.linkedin, label: 'LinkedIn', Icon: LinkedinIcon },
    { href: `mailto:${profile.email}`, label: 'Email', Icon: (p) => <Mail size={18} {...p} /> },
  ].filter(Boolean)
  return (
    <div className={`flex gap-3 ${className}`}>
      {links.map(({ href, label, Icon }) => (
        <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
          className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition hover:border-accent hover:text-ink">
          <Icon />
        </a>
      ))}
    </div>
  )
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition ${scrolled ? 'border-b border-line bg-bg/75 backdrop-blur-xl' : ''}`}>
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="font-mono text-lg font-semibold">
          <span className="text-accent">&lt;</span>PJ<span className="text-accent"> /&gt;</span>
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {NAV.map((n, i) => (
            <li key={n.id}>
              <a href={`#${n.id}`} className="text-sm text-muted transition hover:text-ink">
                <span className="mr-1 font-mono text-xs text-accent">0{i + 1}.</span>{n.label}
              </a>
            </li>
          ))}
          <li>
            <a href={profile.resume} target="_blank" rel="noreferrer"
              className="rounded-lg border border-accent px-4 py-2 font-mono text-sm text-accent transition hover:bg-accent/10">
              Resume
            </a>
          </li>
        </ul>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <motion.ul initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="space-y-1 border-b border-line bg-bg/95 px-5 pb-5 backdrop-blur-xl md:hidden">
          {[...NAV, { id: 'resume', label: 'Resume' }].map((n) => (
            <li key={n.id}>
              <a href={n.id === 'resume' ? profile.resume : `#${n.id}`} onClick={() => setOpen(false)}
                className="block py-2 text-muted hover:text-ink">{n.label}</a>
            </li>
          ))}
        </motion.ul>
      )}
    </header>
  )
}

function Typewriter({ words }) {
  const [i, setI] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    const word = words[i % words.length]
    const done = !deleting && text === word
    const empty = deleting && text === ''
    const t = setTimeout(() => {
      if (done) return setDeleting(true)
      if (empty) { setDeleting(false); setI((x) => x + 1); return }
      setText(word.slice(0, text.length + (deleting ? -1 : 1)))
    }, done ? 1600 : deleting ? 35 : 70)
    return () => clearTimeout(t)
  }, [text, deleting, i, words])
  return (
    <span className="font-mono text-accent-2">
      {text}<span className="ml-0.5 inline-block w-2 animate-pulse bg-accent-2">&nbsp;</span>
    </span>
  )
}

function Hero() {
  return (
    <section id="top" className="relative flex min-h-svh items-center overflow-hidden pt-16">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-accent/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-accent-2/10 blur-[120px]" />
      <div className="absolute inset-0 opacity-30 md:left-[42%] md:opacity-100">
        <Suspense fallback={null}><HeroScene /></Suspense>
      </div>
      <div className="relative mx-auto w-full max-w-6xl px-5">
        <motion.p initial="hidden" animate="show" variants={fadeUp} custom={0} className="mb-5 font-mono text-sm text-accent">
          Hi, my name is
        </motion.p>
        <motion.h1 initial="hidden" animate="show" variants={fadeUp} custom={1}
          className="font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl">
          {profile.name}.
        </motion.h1>
        <motion.h2 initial="hidden" animate="show" variants={fadeUp} custom={2}
          className="mt-3 font-display text-2xl font-semibold text-muted sm:text-4xl">
          I build systems that <span className="grad-text">scale</span>.
        </motion.h2>
        <motion.p initial="hidden" animate="show" variants={fadeUp} custom={3} className="mt-6 max-w-xl text-base text-muted sm:text-lg">
          {profile.tagline}
        </motion.p>
        <motion.div initial="hidden" animate="show" variants={fadeUp} custom={4} className="mt-5 text-sm sm:text-base">
          <span className="text-muted">Currently focused on → </span>
          <Typewriter words={profile.roles} />
        </motion.div>
        <motion.div initial="hidden" animate="show" variants={fadeUp} custom={5} className="mt-10 flex flex-wrap items-center gap-4">
          <a href="#projects" className="group inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-white shadow-lg shadow-accent/25 transition hover:-translate-y-0.5">
            View my work <ArrowUpRight size={18} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a href={profile.resume} download className="inline-flex items-center gap-2 rounded-lg border border-line bg-bg/60 px-6 py-3 font-medium backdrop-blur transition hover:border-accent">
            <Download size={18} /> Resume
          </a>
          <Socials />
        </motion.div>
      </div>
      <a href="#about" aria-label="Scroll down" className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block">
        <div className="flex h-10 w-6 justify-center rounded-full border border-muted/50 pt-2">
          <motion.span animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 1.6 }} className="h-2 w-1 rounded-full bg-accent" />
        </div>
      </a>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-28">
      <SectionTitle index="01" title="About me" />
      <div className="grid gap-12 lg:grid-cols-5">
        <div className="space-y-5 text-lg leading-relaxed text-muted lg:col-span-3">
          <Reveal><p>{profile.summary}</p></Reveal>
          <Reveal i={1}>
            <p>
              Right now I'm a <span className="text-ink">{profile.role}</span> at <span className="text-ink">{profile.company}</span>,
              leading architecture for contractor lifecycle and compliance platforms, and owning API reliability. Before that I
              built identity infrastructure and GenAI automation at MoEngage, and payments and marketplace systems at Betterhalf.ai (YC W’21).
            </p>
          </Reveal>
          <Reveal i={2} className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm">
            <span className="inline-flex items-center gap-2"><MapPin size={16} className="text-accent" />{profile.location}</span>
            <span className="inline-flex items-center gap-2"><GraduationCap size={16} className="text-accent" />{education.degree}, {education.school}</span>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          {stats.map((s, i) => (
            <Reveal key={s.label} i={i} className="card p-5">
              <div className="font-display text-3xl font-bold grad-text">{s.value}</div>
              <div className="mt-2 text-sm text-muted">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Experience() {
  const [active, setActive] = useState(0)
  const job = experience[active]
  return (
    <section id="experience" className="mx-auto max-w-6xl px-5 py-28">
      <SectionTitle index="02" title="Where I've worked" />
      <Reveal className="flex flex-col gap-8 md:flex-row">
        <div className="flex overflow-x-auto md:w-64 md:shrink-0 md:flex-col" role="tablist">
          {experience.map((e, i) => (
            <button key={e.company} role="tab" aria-selected={active === i} onClick={() => setActive(i)}
              className={`whitespace-nowrap border-b-2 px-5 py-3 text-left font-mono text-sm transition md:border-b-0 md:border-l-2 ${
                active === i ? 'border-accent bg-accent/10 text-accent' : 'border-line text-muted hover:bg-white/5 hover:text-ink'}`}>
              {e.company}
            </button>
          ))}
        </div>
        <motion.div key={active} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className="flex-1">
          <h3 className="font-display text-2xl font-semibold">
            {job.role} <span className="text-accent">@ {job.company}</span>
          </h3>
          <p className="mt-1 font-mono text-sm text-muted">{job.period} · {job.location}</p>
          <p className="mt-4 italic text-muted">{job.blurb}</p>
          <ul className="mt-5 space-y-4">
            {job.points.map((p) => (
              <li key={p} className="relative pl-6 leading-relaxed text-muted">
                <span className="absolute left-0 top-1 text-accent">▹</span>{p}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            {job.tags.map((t) => (
              <span key={t} className="rounded-full bg-accent/10 px-3 py-1 font-mono text-xs text-accent">{t}</span>
            ))}
          </div>
        </motion.div>
      </Reveal>
    </section>
  )
}

function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-5 py-28">
      <SectionTitle index="03" title="Things I've built" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.title} i={i}>
            <motion.a href={p.link} target="_blank" rel="noreferrer" whileHover={{ y: -6 }}
              className="card group flex h-full flex-col p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-accent-2">{p.kind}</span>
                <ArrowUpRight className="text-muted transition group-hover:text-accent" size={20} />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold transition group-hover:text-accent">{p.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{p.description}</p>
              <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted">
                {p.stack.map((s) => <span key={s}>{s}</span>)}
              </div>
            </motion.a>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10 text-center">
        <a href={profile.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-sm text-accent hover:underline">
          More on GitHub <ArrowUpRight size={16} />
        </a>
      </Reveal>
    </section>
  )
}

function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-5 py-28">
      <SectionTitle index="04" title="Toolbox" />
      <div className="grid gap-6 md:grid-cols-2">
        {skills.map((g, i) => (
          <Reveal key={g.group} i={i} className="card p-6">
            <h3 className="mb-4 font-display text-lg font-semibold">{g.group}</h3>
            <div className="flex flex-wrap gap-2">
              {g.items.map((s) => (
                <span key={s} className="rounded-md border border-line px-3 py-1.5 text-sm text-muted transition hover:border-accent hover:text-ink">{s}</span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Reveal className="card p-6">
          <GraduationCap className="text-accent" />
          <h3 className="mt-3 font-display text-lg font-semibold">{education.degree}</h3>
          <p className="text-sm text-muted">{education.school} · {education.detail}</p>
        </Reveal>
        {achievements.map((a, i) => (
          <Reveal key={a.title} i={i + 1} className="card p-6">
            <Trophy className="text-accent-2" />
            <h3 className="mt-3 font-display text-lg font-semibold">{a.title}</h3>
            <p className="text-sm text-muted">{a.org} · {a.when}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-3xl px-5 py-32 text-center">
      <Reveal><p className="font-mono text-sm text-accent">05. What's next?</p></Reveal>
      <Reveal i={1}><h2 className="mt-4 font-display text-4xl font-bold sm:text-6xl">Let's build something.</h2></Reveal>
      <Reveal i={2}>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
          I'm always up for conversations about distributed systems, payments, or putting AI agents into production.
          My inbox is open — I'll get back to you.
        </p>
      </Reveal>
      <Reveal i={3} className="mt-10 flex flex-col items-center gap-6">
        <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 rounded-lg border border-accent px-8 py-4 font-mono text-accent transition hover:bg-accent/10">
          <Mail size={18} /> Say hello
        </a>
        <Socials />
      </Reveal>
    </section>
  )
}

export default function App() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return (
    <>
      <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-accent to-accent-2" />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <footer className="border-t border-line py-8 text-center font-mono text-xs text-muted">
        Designed &amp; built by {profile.name} · React · Three.js · Framer Motion
      </footer>
    </>
  )
}
