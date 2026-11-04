# Priyansh Jain — Portfolio

Personal portfolio site: an animated 3D hero, scroll-reveal sections, and a tabbed experience timeline.

**Stack:** React 19 + Vite · Three.js via `@react-three/fiber` / `@react-three/drei` · Framer Motion · Tailwind CSS v4

## Run locally

```bash
npm install
npm run dev
```

## Edit content

Everything you see on the page (bio, experience, projects, skills, links) lives in [`src/data.js`](src/data.js).
Replace `public/Priyansh_Jain_Resume.pdf` to update the downloadable resume.

## Deploy

Pushing to `main` builds the site and publishes it to GitHub Pages via `.github/workflows/deploy.yml`
(enable it once under **Settings → Pages → Source: GitHub Actions**).
It's a static build (`dist/`), so Vercel or Netlify work too with zero config.
