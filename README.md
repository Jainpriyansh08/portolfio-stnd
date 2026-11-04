# Priyansh Jain — Portfolio

A career drawn as a metro network map: each job is a line, each shipped result is a station, and skills carried between jobs are interchanges.

**Stack:** React 19 + Vite · Three.js (vanilla, lazy-loaded) for the 3D network · Tailwind CSS v4 · Overpass (self-hosted)

## How it works

- The page is **prerendered** at build time (`scripts/prerender.mjs`), so it has full content without JavaScript and in link previews.
- The hero map is an **SVG with HTML labels** first. On screens ≥1024px that allow motion and WebGL, `src/map3d.js` loads Three.js, matches the flat map exactly, lifts it into a tilted 3D network, and runs trains along each line. It renders only while on screen and unpaused; a **Pause trains** button stops all motion. Phones and reduced-motion users never download Three.js.
- Light and dark themes come from CSS variables in `src/index.css`; the 3D scene reads the same variables.

## Edit content

Everything on the page (lines, stations, map positions, projects, skills, links) lives in [`src/data.js`](src/data.js). Map coordinates are on a 16 × 9 grid; every claim should be traceable to the resume in `public/`.

## Run locally

```bash
npm install
npm run dev
```

## Deploy

Pushing to `main` builds and publishes to GitHub Pages via `.github/workflows/deploy.yml` (enable once under **Settings → Pages → Source: GitHub Actions**). The social-preview tags in `index.html` assume `https://jainpriyansh08.github.io/portolfio-stnd/`; update them if the site lives elsewhere.

Design decisions are recorded in [`DESIGN.md`](DESIGN.md) and [`PRODUCT.md`](PRODUCT.md).
