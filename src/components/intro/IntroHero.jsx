import AnimatedHeading from '../ui/AnimatedHeading'
import FadeIn from '../ui/FadeIn'
import { useState } from 'react'

// Nav links map to their dashboard routes
const NAV_LINKS = [
  { label: 'Timelines',  to: '/timelines' },
  { label: 'Memories',   to: '/memories' },
  { label: 'Paradoxes',  to: '/paradoxes' },
  { label: 'Universe',   to: '/universe-map' },
]

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4'

// Minimal 3-D-style Memory Core placeholder (SVG).
// Will be replaced with a real Three.js / R3F canvas in Step 6.
function MemoryCorePlaceholder() {
  return (
    <div className="relative flex items-center justify-center w-52 h-52 mx-auto my-8 select-none">
      {/* Outer slow-spinning ring */}
      <svg
        className="absolute inset-0 w-full h-full animate-spin"
        style={{ animationDuration: '12s' }}
        viewBox="0 0 200 200"
      >
        <ellipse
          cx="100" cy="100" rx="92" ry="30"
          fill="none" stroke="rgba(232,185,106,0.25)" strokeWidth="1"
          strokeDasharray="8 6"
        />
        <ellipse
          cx="100" cy="100" rx="92" ry="30"
          fill="none" stroke="rgba(76,140,255,0.15)" strokeWidth="0.5"
          transform="rotate(60 100 100)"
          strokeDasharray="4 10"
        />
        <ellipse
          cx="100" cy="100" rx="92" ry="30"
          fill="none" stroke="rgba(157,111,224,0.15)" strokeWidth="0.5"
          transform="rotate(120 100 100)"
          strokeDasharray="4 10"
        />
      </svg>

      {/* Inner pulsing core sphere */}
      <svg
        className="absolute inset-0 w-full h-full animate-pulse-slow"
        viewBox="0 0 200 200"
      >
        {/* Glow halo */}
        <circle cx="100" cy="100" r="44" fill="rgba(232,185,106,0.06)" />
        {/* Core */}
        <circle
          cx="100" cy="100" r="36"
          fill="none"
          stroke="rgba(232,185,106,0.5)"
          strokeWidth="1.2"
        />
        <circle cx="100" cy="100" r="28" fill="rgba(232,185,106,0.08)" />
        {/* Crosshair lines */}
        <line x1="100" y1="66" x2="100" y2="134" stroke="rgba(232,185,106,0.2)" strokeWidth="0.6" />
        <line x1="66"  y1="100" x2="134" y2="100" stroke="rgba(232,185,106,0.2)" strokeWidth="0.6" />
        {/* Cardinal dots */}
        {[[100,66],[134,100],[100,134],[66,100]].map(([cx,cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2.5" fill="rgba(232,185,106,0.6)" />
        ))}
        {/* Centre dot */}
        <circle cx="100" cy="100" r="5"
          fill="rgba(232,185,106,0.9)"
          style={{ filter: 'drop-shadow(0 0 6px rgba(232,185,106,0.8))' }}
        />
      </svg>

      {/* "3D MEMORY CORE" label */}
      <span
        className="absolute bottom-0 left-1/2 -translate-x-1/2 tele text-[10px] text-thread/50 uppercase tracking-widest"
      >
        3D Memory Core
      </span>
    </div>
  )
}

// Mission brief modal
function MissionBriefModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(5,4,9,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="loom-card max-w-md w-full p-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="display text-base font-medium text-thread">Mission Brief</span>
          <button onClick={onClose} className="tele text-xs text-white/30 hover:text-white/60">✕ Close</button>
        </div>
        <div className="space-y-3 text-sm text-white/60 leading-relaxed">
          <p>
            <span className="text-thread font-medium">Designation:</span> Senior Reality Archivist — Class Ω
          </p>
          <p>
            <span className="text-thread font-medium">Situation:</span> Memory Integrity has collapsed to{' '}
            <span className="tele text-decay">42.5%</span>. The Last Forgotten City at coordinates Ω-7
            is actively erasing from the historical record.
          </p>
          <p>
            <span className="text-thread font-medium">Objective:</span> Restore integrity to ≥ 85% before the
            city vanishes permanently. Seal all open paradoxes. Restore corrupted timeline fragments.
          </p>
          <p>
            <span className="text-thread font-medium">Time Remaining:</span>{' '}
            <span className="tele text-decay">47h 23m</span>
          </p>
          <p className="tele text-[11px] text-white/30 border-t border-white/8 pt-3">
            Reality exists only because someone remembers it. — Archivist Codex, Vol. I
          </p>
        </div>
        <button
          className="mt-5 w-full py-2.5 rounded-lg bg-thread/10 border border-thread/20 text-sm text-thread hover:bg-thread/15 transition-colors"
          onClick={onClose}
        >
          Acknowledge &amp; Close
        </button>
      </div>
    </div>
  )
}

export default function IntroHero({ onInitialize }) {
  const [briefOpen, setBriefOpen] = useState(false)

  return (
    <>
      <div className="relative flex min-h-svh flex-col bg-black font-sans text-white">
        {/* ── Full-screen video background ── */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          src={VIDEO_URL}
        />

        {/* ── All content sits above the video ── */}
        <div className="relative z-10 flex min-h-svh flex-col px-6 pt-6 md:px-12 lg:px-16">

          {/* ── Navbar ── */}
          <header>
            <div className="liquid-glass flex items-center justify-between rounded-xl px-4 py-2">
              {/* Logo */}
              <span className="text-2xl font-semibold tracking-tight">MEMORY LOOM</span>

              {/* Nav links — each goes to a specific dashboard route after boot */}
              <nav className="hidden items-center gap-8 md:flex">
                {NAV_LINKS.map(({ label, to }) => (
                  <button
                    key={to}
                    type="button"
                    onClick={() => onInitialize(to)}
                    className="text-sm text-white transition-colors hover:text-gray-300"
                  >
                    {label}
                  </button>
                ))}
              </nav>

              {/* Primary CTA */}
              <button
                type="button"
                onClick={() => onInitialize('/overview')}
                className="rounded-lg bg-white px-6 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-100"
              >
                Initialize Loom
              </button>
            </div>
          </header>

          {/* ── Hero content — centred vertically ── */}
          <div className="flex flex-1 flex-col items-center justify-center text-center py-12">

            {/* Tagline */}
            <FadeIn delay={0} duration={900}>
              <p className="tele text-xs text-thread/70 uppercase tracking-[0.25em] mb-4">
                Reality Archivist Dashboard
              </p>
            </FadeIn>

            {/* Main heading */}
            <AnimatedHeading
              text={'MEMORY LOOM'}
              className="display text-5xl md:text-7xl lg:text-8xl font-normal mb-3 text-white"
            />

            {/* Sub-tagline */}
            <FadeIn delay={600} duration={1000}>
              <p className="text-base md:text-lg text-gray-300 max-w-xl mx-auto mb-2"
                style={{ letterSpacing: '-0.01em' }}
              >
                Reality exists only because someone remembers it.
              </p>
            </FadeIn>

            {/* 3D Memory Core placeholder */}
            <FadeIn delay={900} duration={1000}>
              <MemoryCorePlaceholder />
            </FadeIn>

            {/* Action buttons */}
            <FadeIn delay={1200} duration={1000}>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => onInitialize('/overview')}
                  className="rounded-lg bg-white px-10 py-3.5 font-medium text-black transition-colors hover:bg-gray-100 text-sm"
                >
                  Initialize Loom
                </button>
                <button
                  type="button"
                  onClick={() => setBriefOpen(true)}
                  className="liquid-glass rounded-lg border border-white/20 px-10 py-3.5 font-medium text-white transition-colors hover:bg-white hover:text-black text-sm"
                >
                  Mission Brief
                </button>
              </div>
            </FadeIn>

            {/* Bottom tag */}
            <FadeIn delay={1600} duration={1000}>
              <div className="mt-10 liquid-glass border border-white/20 px-6 py-2.5 rounded-xl">
                <p className="text-sm font-light text-white/70">
                  Integrity. Timelines. Paradoxes. Universe.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Mission brief modal */}
      {briefOpen && <MissionBriefModal onClose={() => setBriefOpen(false)} />}
    </>
  )
}
