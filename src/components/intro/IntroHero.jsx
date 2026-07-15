import FadeIn from '../ui/FadeIn'
import { useState, useEffect, useRef } from 'react'
import { mission } from '../../data'

const NAV_LINKS = [
  { label: 'Timelines',  to: '/timelines' },
  { label: 'Memories',   to: '/memories' },
  { label: 'Paradoxes',  to: '/paradoxes' },
  { label: 'Universe',   to: '/universe-map' },
]

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4'

/* ── Animated 3D Memory Core (SVG) ── */
function MemoryCore() {
  const [t, setT] = useState(0)
  const rafRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts
      setT((ts - startRef.current) / 1000)
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const breathe = 1 + 0.025 * Math.sin(t * 1.4)
  const rotation1 = t * 18
  const rotation2 = -(t * 12)
  const rotation3 = t * 8 + 45

  // Thread particles orbiting
  const particles = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2 + t * (i % 2 === 0 ? 0.6 : -0.4)
    const rx = 80, ry = 25
    const x = 100 + rx * Math.cos(angle)
    const y = 100 + ry * Math.sin(angle)
    const opacity = 0.4 + 0.4 * Math.sin(t * 1.2 + i)
    return { x, y, opacity }
  })

  return (
    <div className="relative flex items-center justify-center w-56 h-56 mx-auto select-none">
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
        {/* Outer slow rings */}
        <g transform={`rotate(${rotation1} 100 100)`}>
          <ellipse cx="100" cy="100" rx="88" ry="28"
            fill="none" stroke="rgba(212,146,58,0.20)" strokeWidth="0.8" strokeDasharray="6 5" />
        </g>
        <g transform={`rotate(${rotation2} 100 100)`}>
          <ellipse cx="100" cy="100" rx="88" ry="28"
            fill="none" stroke="rgba(196,75,110,0.12)" strokeWidth="0.5"
            transform="rotate(60 100 100)" strokeDasharray="4 8" />
        </g>
        <g transform={`rotate(${rotation3} 100 100)`}>
          <ellipse cx="100" cy="100" rx="72" ry="20"
            fill="none" stroke="rgba(123,94,168,0.14)" strokeWidth="0.5"
            transform="rotate(30 100 100)" strokeDasharray="3 10" />
        </g>

        {/* Orbiting thread particles */}
        {particles.map((p, i) => (
          <circle
            key={i}
            cx={p.x} cy={p.y}
            r={i % 3 === 0 ? 2 : 1.2}
            fill="#D4923A"
            opacity={p.opacity}
            style={{ filter: 'drop-shadow(0 0 3px rgba(212,146,58,0.8))' }}
          />
        ))}

        {/* Core glow rings */}
        <circle cx="100" cy="100"
          r={46 * breathe}
          fill="rgba(212,146,58,0.03)"
          style={{ filter: 'blur(2px)' }}
        />
        <circle cx="100" cy="100"
          r={38 * breathe}
          fill="none"
          stroke="rgba(212,146,58,0.35)"
          strokeWidth="1.2"
          style={{ filter: 'drop-shadow(0 0 6px rgba(212,146,58,0.5))' }}
        />
        <circle cx="100" cy="100"
          r={28 * breathe}
          fill="rgba(212,146,58,0.07)"
        />

        {/* Crosshair lines */}
        <line x1="100" y1="64" x2="100" y2="136" stroke="rgba(212,146,58,0.18)" strokeWidth="0.5" />
        <line x1="64"  y1="100" x2="136" y2="100" stroke="rgba(212,146,58,0.18)" strokeWidth="0.5" />
        <line x1="73"  y1="73" x2="127" y2="127" stroke="rgba(212,146,58,0.10)" strokeWidth="0.5" />
        <line x1="127" y1="73" x2="73" y2="127" stroke="rgba(212,146,58,0.10)" strokeWidth="0.5" />

        {/* Cardinal dots */}
        {[[100,65],[135,100],[100,135],[65,100]].map(([cx,cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2"
            fill="rgba(212,146,58,0.7)"
            style={{ filter: `drop-shadow(0 0 4px rgba(212,146,58,${0.5 + 0.3 * Math.sin(t + i)}))` }}
          />
        ))}

        {/* Centre beacon */}
        <circle cx="100" cy="100" r={5 * breathe}
          fill="#D4923A"
          style={{ filter: 'drop-shadow(0 0 10px rgba(212,146,58,0.9))' }}
        />

        {/* Integrity arc indicator */}
        <circle
          cx="100" cy="100" r="38"
          fill="none"
          stroke="#C44B6E"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 38 * (mission.integrityNow / 100)} ${2 * Math.PI * 38}`}
          transform="rotate(-90 100 100)"
          opacity="0.6"
          style={{ filter: 'drop-shadow(0 0 4px rgba(196,75,110,0.6))' }}
        />
      </svg>

      {/* Integrity label */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5">
        <span className="tele text-[10px]" style={{ color: '#C44B6E' }}>
          {mission.integrityNow}% INT
        </span>
      </div>
    </div>
  )
}

/* ── Mission Brief Modal ── */
function MissionBriefModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(3,2,8,0.88)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <div
        className="loom-card max-w-lg w-full p-7"
        style={{ maxHeight: '85vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between mb-5">
          <span className="display text-lg font-normal" style={{ color: '#D4923A' }}>Mission Brief</span>
          <button onClick={onClose} className="tele text-xs" style={{ color: 'rgba(212,146,58,0.35)' }}>✕ Close</button>
        </div>

        <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'rgba(255,220,160,0.6)' }}>
          <p>
            <span style={{ color: '#D4923A', fontWeight: 500 }}>Designation: </span>
            {mission.archivist.designation} — Class {mission.archivist.classLevel}
          </p>
          <p>
            <span style={{ color: '#D4923A', fontWeight: 500 }}>Situation: </span>
            {mission.briefing.slice(0, 180)}…
          </p>
          <p>
            <span style={{ color: '#D4923A', fontWeight: 500 }}>Integrity: </span>
            <span className="tele" style={{ color: '#C44B6E' }}>{mission.integrityNow}%</span>
            {' '}— Target: <span className="tele" style={{ color: '#4A8FA8' }}>{mission.integrityTarget}%</span>
          </p>
          <p>
            <span style={{ color: '#D4923A', fontWeight: 500 }}>Time Remaining: </span>
            <span className="tele" style={{ color: '#C44B6E' }}>
              {mission.deadline.hoursRemaining}h {mission.deadline.minutesRemaining}m
            </span>
          </p>

          <div className="pt-3" style={{ borderTop: '1px solid rgba(212,146,58,0.1)' }}>
            <p className="tele text-[10px] mb-2" style={{ color: 'rgba(212,146,58,0.35)' }}>OBJECTIVES</p>
            {mission.objectives.map((obj) => (
              <div key={obj.id} className="flex items-start gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-sm flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    border: `1px solid ${obj.done ? 'rgba(74,143,168,0.5)' : 'rgba(212,146,58,0.2)'}`,
                    background: obj.done ? 'rgba(74,143,168,0.12)' : 'transparent',
                  }}
                >
                  {obj.done && <span style={{ color: '#4A8FA8', fontSize: '7px' }}>✓</span>}
                </div>
                <p style={{ color: obj.done ? 'rgba(255,220,160,0.25)' : 'rgba(255,220,160,0.65)', textDecoration: obj.done ? 'line-through' : 'none' }}>
                  {obj.task}
                </p>
              </div>
            ))}
          </div>

          <p
            className="display text-[11px] italic text-center pt-3"
            style={{ color: 'rgba(212,146,58,0.3)', borderTop: '1px solid rgba(212,146,58,0.07)' }}
          >
            "{mission.codex[0]}"
          </p>
        </div>

        <button
          className="mt-6 w-full py-3 rounded-xl transition-all duration-200"
          style={{
            background: 'rgba(212,146,58,0.08)',
            border: '1px solid rgba(212,146,58,0.2)',
            color: '#D4923A',
          }}
          onClick={onClose}
        >
          <span className="display text-sm font-normal">Acknowledge &amp; Enter Loom</span>
        </button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   INTRO HERO — Cinematic Landing Page
══════════════════════════════════════════════════ */
export default function IntroHero({ onInitialize }) {
  const [briefOpen, setBriefOpen] = useState(false)

  return (
    <>
      <div
        className="relative flex min-h-svh flex-col overflow-hidden"
        style={{ background: '#03020A', color: 'rgba(255,240,210,0.9)' }}
      >
        {/* ── Video background ── */}
        <video
          autoPlay loop muted playsInline
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          style={{ opacity: 0.85 }}
          src={VIDEO_URL}
        />

        {/* ── Deep gradient overlay ── */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 100% 80% at 50% 110%, rgba(184,113,26,0.25) 0%, transparent 55%),
              radial-gradient(ellipse 60% 50% at 80% 80%, rgba(196,75,110,0.15) 0%, transparent 50%),
              linear-gradient(180deg, rgba(3,2,10,0.35) 0%, rgba(3,2,10,0.12) 40%, rgba(3,2,10,0.55) 100%)
            `,
          }}
        />

        {/* ── Skyline at base ── */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{
            height: '35%',
            backgroundImage: 'url(/skyline.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            opacity: 0.22,
            mixBlendMode: 'screen',
          }}
        />

        {/* ── Content ── */}
        <div className="relative z-10 flex min-h-svh flex-col px-6 pt-6 md:px-14 lg:px-20">

          {/* ── Navbar ── */}
          <header>
            <div
              className="flex items-center justify-between rounded-2xl px-5 py-3"
              style={{
                background: 'rgba(6,4,14,0.55)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(212,146,58,0.12)',
              }}
            >
              {/* Wordmark */}
              <span
                className="display text-xl font-normal tracking-widest"
                style={{ color: '#D4923A', letterSpacing: '0.18em' }}
              >
                MEMORY LOOM
              </span>

              {/* Nav */}
              <nav className="hidden md:flex items-center gap-8">
                {NAV_LINKS.map(({ label, to }) => (
                  <button
                    key={to}
                    type="button"
                    onClick={() => onInitialize(to)}
                    className="display text-sm font-normal transition-colors"
                    style={{ color: 'rgba(212,146,58,0.55)', letterSpacing: '0.04em' }}
                    onMouseEnter={e => e.target.style.color = 'rgba(212,146,58,0.9)'}
                    onMouseLeave={e => e.target.style.color = 'rgba(212,146,58,0.55)'}
                  >
                    {label}
                  </button>
                ))}
              </nav>

              {/* CTA */}
              <button
                type="button"
                onClick={() => onInitialize('/overview')}
                className="display text-sm font-normal px-6 py-2 rounded-xl transition-all duration-200"
                style={{
                  background: 'rgba(212,146,58,0.12)',
                  border: '1px solid rgba(212,146,58,0.28)',
                  color: '#D4923A',
                  letterSpacing: '0.06em',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(212,146,58,0.22)'
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(212,146,58,0.2)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(212,146,58,0.12)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Initialize Loom
              </button>
            </div>
          </header>

          {/* ── Hero ── */}
          <div className="flex flex-1 flex-col items-center justify-center text-center py-12">

            <FadeIn delay={0} duration={900}>
              <p className="tele text-[10px] uppercase tracking-[0.28em] mb-5" style={{ color: 'rgba(212,146,58,0.45)' }}>
                Reality Archivist Dashboard · Class Ω
              </p>
            </FadeIn>

            {/* Main wordmark */}
            <FadeIn delay={200} duration={1200}>
              <h1
                className="display font-normal mb-0"
                style={{
                  fontSize: 'clamp(3.5rem, 9vw, 7.5rem)',
                  letterSpacing: '0.18em',
                  color: 'rgba(255,240,210,0.95)',
                  textShadow: '0 0 60px rgba(212,146,58,0.18)',
                  lineHeight: 1.0,
                }}
              >
                MEMORY LOOM
              </h1>
            </FadeIn>

            {/* Tagline */}
            <FadeIn delay={600} duration={1000}>
              <p
                className="display text-base md:text-lg max-w-xl mx-auto mt-6 mb-2 font-normal italic"
                style={{
                  color: 'rgba(255,220,160,0.55)',
                  letterSpacing: '0.01em',
                  textShadow: '0 1px 20px rgba(212,146,58,0.1)',
                }}
              >
                Reality exists only because someone remembers it.
              </p>
            </FadeIn>

            {/* Integrity warning */}
            <FadeIn delay={800} duration={800}>
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-lg mt-2 mb-6"
                style={{
                  background: 'rgba(196,75,110,0.07)',
                  border: '1px solid rgba(196,75,110,0.15)',
                  display: 'inline-flex',
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#C44B6E' }} />
                <span className="tele text-[10px]" style={{ color: 'rgba(196,75,110,0.8)' }}>
                  Memory Integrity: {mission.integrityNow}% · {mission.deadline.hoursRemaining}h {mission.deadline.minutesRemaining}m remaining
                </span>
              </div>
            </FadeIn>

            {/* 3D Memory Core */}
            <FadeIn delay={900} duration={1000}>
              <MemoryCore />
            </FadeIn>

            {/* CTA buttons */}
            <FadeIn delay={1200} duration={1000}>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => onInitialize('/overview')}
                  className="display text-sm font-normal px-10 py-3.5 rounded-2xl transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(212,146,58,0.25), rgba(212,146,58,0.10))',
                    border: '1px solid rgba(212,146,58,0.35)',
                    color: '#D4923A',
                    letterSpacing: '0.06em',
                    boxShadow: '0 4px 30px rgba(212,146,58,0.12)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212,146,58,0.40), rgba(212,146,58,0.18))'
                    e.currentTarget.style.boxShadow = '0 8px 40px rgba(212,146,58,0.22)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212,146,58,0.25), rgba(212,146,58,0.10))'
                    e.currentTarget.style.boxShadow = '0 4px 30px rgba(212,146,58,0.12)'
                    e.currentTarget.style.transform = 'none'
                  }}
                >
                  Initialize Loom
                </button>

                <button
                  type="button"
                  onClick={() => setBriefOpen(true)}
                  className="display text-sm font-normal px-10 py-3.5 rounded-2xl transition-all duration-300"
                  style={{
                    background: 'rgba(196,75,110,0.06)',
                    border: '1px solid rgba(196,75,110,0.18)',
                    color: 'rgba(196,75,110,0.75)',
                    letterSpacing: '0.06em',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(196,75,110,0.12)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(196,75,110,0.06)'
                    e.currentTarget.style.transform = 'none'
                  }}
                >
                  Mission Brief
                </button>
              </div>
            </FadeIn>

            {/* Bottom tag */}
            <FadeIn delay={1600} duration={1000}>
              <div
                className="mt-10 px-6 py-2.5 rounded-2xl"
                style={{
                  background: 'rgba(6,4,14,0.5)',
                  border: '1px solid rgba(212,146,58,0.08)',
                  backdropFilter: 'blur(10px)',
                  display: 'inline-block',
                }}
              >
                <p className="display text-xs font-normal italic" style={{ color: 'rgba(212,146,58,0.32)', letterSpacing: '0.08em' }}>
                  Integrity · Timelines · Paradoxes · Universe
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {briefOpen && <MissionBriefModal onClose={() => setBriefOpen(false)} />}
    </>
  )
}
