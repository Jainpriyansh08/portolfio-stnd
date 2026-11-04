---
name: Priyansh Jain — Network Map
description: A career drawn as a metro network map; jobs are lines, shipped results are stations.
colors:
  paper: "#f3f6f7"
  paper-raised: "#ffffff"
  ink: "#15181e"
  ink-2: "#4b5160"
  rule: "#d6d9d1"
  line-red: "#cf2a33"
  line-yellow: "#f2b705"
  line-yellow-casing: "#8a6500"
  line-blue: "#1d5bbf"
  line-green: "#17763f"
  line-violet: "#7b3fa0"
  line-magenta: "#be1a78"
  signage: "#13306b"
  signage-ink: "#ffffff"
  signage-ink-2: "#c9d3ea"
  dark-paper: "#111317"
  dark-ink: "#eceee8"
  dark-ink-2: "#a7adb8"
typography:
  display:
    fontFamily: "Overpass Variable, Overpass, Arial Narrow, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 1rem + 5.2vw, 5.25rem)"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "-0.025em"
  heading:
    fontFamily: "Overpass Variable, Overpass, sans-serif"
    fontSize: "clamp(2rem, 1.4rem + 2vw, 3rem)"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  station-title:
    fontFamily: "Overpass Variable, Overpass, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 900
    lineHeight: 1.3
  body:
    fontFamily: "Overpass Variable, Overpass, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  map-label:
    fontFamily: "Overpass Variable, Overpass, sans-serif"
    fontSize: "clamp(11px, 1.02cqw, 15px)"
    fontWeight: 800
    lineHeight: 1.2
rounded:
  badge: "999px"
  button: "999px"
  tag: "4px"
spacing:
  section: "7rem"
  section-major: "8rem"
  station-gap: "1.75rem"
  gutter-mobile: "1rem"
  gutter-desktop: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.button}"
    padding: "0.55rem 1.1rem 0.45rem"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.line-blue}"
    textColor: "{colors.signage-ink}"
  button-secondary:
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "0.55rem 1.1rem 0.45rem"
    height: "44px"
  line-badge:
    backgroundColor: "{colors.line-blue}"
    textColor: "{colors.signage-ink}"
    rounded: "{rounded.badge}"
    typography: "{typography.map-label}"
  here-tag:
    backgroundColor: "{colors.line-blue}"
    textColor: "{colors.signage-ink}"
    rounded: "{rounded.tag}"
  contact-panel:
    backgroundColor: "{colors.signage}"
    textColor: "{colors.signage-ink}"
---

# Design System: Priyansh Jain — Network Map

## Overview

The portfolio is a transit map of a career. Each employer is a line in the order a city opens its lines (Red, then Yellow, then Blue); each shipped result is a station labelled with its number; a skill carried from one job to the next is an interchange. The visitor reads it like a map on a platform wall: the shape first, then the station they care about, then the strip map for detail. Mode is Experience, so the map leads from the first viewport and the rest of the page keeps its grammar: strip maps for experience, branch lines for projects, a station index for skills, and a signage panel as the terminus.

Light is the default because the scene is a recruiter on a laptop in daylight or on a phone; dark mode is composed separately as a night sheet, not inverted.

## Colors

Strategy: full palette. The six line colours are the palette, each owning one line and its badge; the ground stays quiet so the lines carry the page.

### Primary
- **Blue Line** `#1d5bbf`: the current job, the "You are here" marker, focus rings, primary-button hover.

### Secondary
- **Red Line** `#cf2a33`, **Yellow Line** `#f2b705` (always with the `#8a6500` casing on light ground, because bare yellow is 1.7:1 on paper), **Green** `#17763f`, **Violet** `#7b3fa0`, **Magenta** `#be1a78`.

### Neutral
- **Paper** `#f3f6f7` (cool off-white), **Ink** `#15181e` (16.4:1 on paper), **Ink 2** `#4b5160` (7.3:1), **Rule** `#d6d9d1`.
- **Signage navy** `#13306b` owns the contact panel with white text (12.6:1).

### Named Rules
- **One line, one colour.** A colour means a line everywhere: map, badge, strip, station-index dot. Never use a line colour for decoration.
- **Badge text** is white on every line except Yellow, which takes ink; in dark mode every badge takes the dark paper colour.

## Typography

One family: Overpass, the open-source Highway Gothic, self-hosted (latin subset is the only one downloaded for English). Chosen as a wayfinding face; it is the world's signage, not a costume.

### Hierarchy
- **Display** (name): weight 900, fluid 2.25–5.25rem, tracking −0.025em.
- **Heading** (sections): weight 900, fluid 2–3rem.
- **Station title**: weight 900, 1.25rem — results like "₹150Cr+ a month".
- **Body**: 1.0625rem / 1.6, measure capped near 68ch.
- **Map label**: 11–15px by container width, title 800 + subline 500.
- Numerals are tabular everywhere.

### Named Rules
- **No monospace.** Data is set in the signage face with tabular figures.
- **Middot separators** are spaced with `.sep` because Overpass sets `·` tight on its right.

## Layout

- Max width 90rem; gutters 1rem mobile, 2rem from 640px.
- Hero: at ≥1280px the title block overlays the empty top-left of a 16:9 map; 1024–1279px stacks title above the map; below 1024px the map is replaced by a vertical route diagram of the same network.
- Experience: 5/8 grid at ≥1024px with a sticky line header beside the strip map; single column below.
- Sections open with more space above the heading (7–8rem) than below it.

## Elevation & Depth

Flat by default: no shadows on the page. Depth exists only in the map, where the WebGL lift extrudes lines (0.12 units) and stations under a hemisphere + directional light, and the camera tilts 19°.

## Shapes

Pills for badges and buttons (999px); 4px for the "You are here" tag; circles for stations (paper fill, ink ring) and larger circles for interchanges. Routes run at 0°, 45° and 90° only.

## Components

### Buttons
Primary is ink with paper text, turning Blue on hover. Secondary is a 1.5px ink outline that fills ink on hover. Icon buttons are 44×44px. All targets are at least 44px tall.

### Line badge
Pill in the line's colour with the line name; the only chip on the site.

### Network map (signature)
SVG map with HTML station labels (links into the strip maps). On wide screens with motion allowed, a lazy Three.js scene replaces it: same geometry at a top-down pose, then a 1.1s ease-out-expo lift to a tilted view, then trains (two per line) run end to end. Hovering a label or legend entry isolates that line. The loop renders only while visible, while the tab is visible, and while not paused; a Pause trains button (aria-pressed) stops all motion. Reduced motion keeps the printed map and never downloads Three.js.

### Strip map
The route diagram above a train door: an 8px line in the line colour with ring stations, one per result. Station items are link targets from the map (`#st-…`) and highlight in yellow when targeted.

### Station index
Alphabetical list of technologies with a dot per line that used them; only usage stated on the resume is mapped.

## Do's and Don'ts

### Do:
- Put a number on every station; a station is a result, not a duty.
- Keep every claim traceable to the resume.
- Keep map labels as real links with visible focus.

### Don't:
- Don't add gradient text, glows, blurred blobs, grid backgrounds, kickers above headings, or numbered section labels.
- Don't use a line colour for anything that isn't that line.
- Don't animate anything else on the page; the trains are the one authored motion.
