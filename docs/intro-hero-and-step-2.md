# Memory Loom — Intro Hero + Step 2 (Upgraded Plan)

This document upgrades the original build plan with a **cinematic entry experience** before the dashboard shell. Use the prompts below in Cursor when implementing each phase.

---

## When the intro plays

- First visit each browser session: full-screen **IntroHero** with video background
- After clicking **Enter the Loom** (or nav links): session persists via `sessionStorage`, dashboard loads
- To replay intro during demo: open DevTools → Application → Session Storage → delete `loom-entered`, refresh

---

## Step 1.5 — Intro Hero (DONE)

**Goal:** Match the liquid-glass landing layout from the reference, themed for The Memory Loom universe.

### Memory Loom copy (replaces VEX)

| Element | VEX (reference) | Memory Loom |
|---|---|---|
| Logo | VEX | LOOM |
| Nav links | Story, Investing, Building, Advisory | Timelines, Fragments, Paradoxes, Repair |
| Heading | Shaping tomorrow / with vision and action. | Weaving reality / from forgotten memory. |
| Subheading | We back visionaries… | Senior Reality Archivist mission copy (42.5% integrity) |
| Primary CTA | Start a Chat | Enter the Loom |
| Secondary CTA | Explore Now | View Mission Brief |
| Tag card | Investing. Building. Advisory. | Integrity. Timelines. Paradoxes. |

### Technical spec (unchanged from reference)

- Full-screen video, `object-cover`, no overlay/dimming
- Inter font globally via `index.html` link + body CSS + Tailwind `font-sans`
- `.liquid-glass` class in global CSS
- `FadeIn` wrapper (delay + duration via state)
- `AnimatedHeading` character stagger: 30ms per char, 200ms initial delay, 500ms transition
- Subheading fade: 800ms delay; buttons: 1200ms; tag: 1400ms

### Files

- [`src/components/intro/IntroHero.jsx`](../src/components/intro/IntroHero.jsx)
- [`src/components/ui/FadeIn.jsx`](../src/components/ui/FadeIn.jsx)
- [`src/components/ui/AnimatedHeading.jsx`](../src/components/ui/AnimatedHeading.jsx)

---

## Step 2 — Design tokens + dashboard shell (NEXT)

**Prompt for Cursor:**

> Set up the Memory Loom design system in `index.css` and `tailwind.config.js`:
>
> - Background: `#0A0912` (near-black, violet undertone)
> - Thread gold: `#E8B96A` (Loom canvas highlights)
> - Stability blue: `#4C8CFF` (healthy timelines)
> - Decay red: `#E8506A` (collapsing timelines)
> - Paradox violet: `#9D6FE0` (paradox alerts)
> - Void black: `#050409` (erased regions)
>
> Fonts: **Fraunces** for narrative headers, **JetBrains Mono** for telemetry numbers. Keep **Inter** for the intro hero only, or use Fraunces inside the dashboard.
>
> Build `DashboardShell`, `Sidebar`, and `Topbar`:
> - Sidebar: LOOM logo, nav to Overview / Timelines / Memories / Paradoxes / Universe Map / Settings
> - Topbar: Active Sectors, Thread Count, System Health
> - Replace the temporary top nav in `App.jsx` with the shell
> - Dashboard pages use `#0A0912` background — visually distinct from the intro's raw video
>
> Do not remove IntroHero — it stays as the session entry gate.

---

## Step 10 update — "Loom powering up" intro

The cinematic video intro **replaces** a separate boot animation. Optional polish after Step 2:

- Brief crossfade from IntroHero video → dashboard (`opacity` transition, 600ms)
- Subtle thread-gold pulse on Reality Integrity bar when dashboard first mounts

---

## Judging walkthrough (60 seconds)

1. Open live link — **IntroHero** plays (heading animates, tag fades in)
2. Click **Enter the Loom** — dashboard shell appears
3. Resolve a paradox / reweave a fragment (Steps 5–8)
4. Show Loom canvas reacting to integrity change (Step 6)

---

## Full intro hero prompt (Memory Loom version)

Copy-paste this if rebuilding the hero from scratch:

> Recreate a full-screen intro hero for **The Memory Loom** hackathon project.
>
> **Universe:** The player is a Senior Reality Archivist operating a quantum dashboard. Reality is woven from collective human memory; forgotten things vanish from maps and history. Current mission: restore Memory Integrity from 42.5% before the Last Forgotten City hits 0%.
>
> **Video background:** Full viewport, absolutely positioned, `object-cover`. URL: `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4`. Autoplay, loop, muted, playsInline. **No overlay, no gradient, no dimming.**
>
> **Typography:** Inter via Google Fonts in `index.html`. Body: `'Inter', sans-serif` with antialiasing. Tailwind `fontFamily.sans: ['Inter', 'sans-serif']`.
>
> **Navbar:** `px-6 md:px-12 lg:px-16 pt-6`. Bar uses `.liquid-glass`, `rounded-xl px-4 py-2`. Logo **LOOM**. Center links (md+): Timelines, Fragments, Paradoxes, Repair. Right button: **Enter the Loom** (white pill).
>
> **Hero bottom:** Same horizontal padding, `flex-1 flex flex-col justify-end pb-12 lg:pb-16`. `lg:grid lg:grid-cols-2 lg:items-end`.
>
> **Heading:** `Weaving reality\nfrom forgotten memory.` — responsive `text-4xl` through `xl:text-7xl`, `font-normal`, `letterSpacing: '-0.04em'`. Character animation: opacity 0 → 1, translateX -18px → 0, 30ms stagger, 200ms initial delay, 500ms transition. Spaces as `\u00A0`.
>
> **Subheading:** Mission copy about 42.5% integrity. `text-gray-300`, fade in at 800ms.
>
> **Buttons:** Enter the Loom (white solid), View Mission Brief (liquid-glass). Fade in at 1200ms.
>
> **Tag card:** `Integrity. Timelines. Paradoxes.` — liquid-glass, bottom-right on lg. Fade in at 1400ms.
>
> **Liquid glass CSS** and **FadeIn** / **AnimatedHeading** components as specified. Colors: black bg, white text, gray-300 secondary, white/20 borders. No purple/indigo UI accents.
>
> **Entry flow:** Show intro on first session visit; `sessionStorage` key `loom-entered`; CTA enters the dashboard router.
