// One stroke weight (1.75) and a 20px grid for every drawn icon.
const base = { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false }

export const MailIcon = (p) => (
  <svg {...base} {...p}><rect x="2.5" y="4.5" width="15" height="11" rx="1.5" /><path d="m3 5.5 7 5.5 7-5.5" /></svg>
)
export const DownloadIcon = (p) => (
  <svg {...base} {...p}><path d="M10 3v9.5" /><path d="m6 9 4 4 4-4" /><path d="M3.5 13.5v2.5h13v-2.5" /></svg>
)
export const ArrowIcon = (p) => (
  <svg {...base} {...p}><path d="M6 14 14 6" /><path d="M7.5 6H14v6.5" /></svg>
)
export const PauseIcon = (p) => (
  <svg {...base} {...p}><path d="M7.5 5v10M12.5 5v10" /></svg>
)
export const PlayIcon = (p) => (
  <svg {...base} {...p}><path d="M7 5.2v9.6l7.5-4.8z" /></svg>
)
export const GithubIcon = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...p}>
    <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
  </svg>
)
export const LinkedinIcon = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...p}>
    <path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM7.1 20.5H3.5V9h3.6v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z" />
  </svg>
)
// Interchange roundel used as the site mark.
export const Roundel = (p) => (
  <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" focusable="false" {...p}>
    <circle cx="14" cy="14" r="9.5" fill="var(--paper)" stroke="var(--ink)" strokeWidth="4" />
    <rect x="1" y="11.5" width="26" height="5" rx="2.5" fill="var(--line-blue)" />
  </svg>
)
