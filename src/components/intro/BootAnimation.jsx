import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

// Boot sequence messages that scroll past one by one
const BOOT_LINES = [
  { delay: 0,    text: 'MEMORY LOOM OS v2.4.1 — Reality Archivist Edition' },
  { delay: 200,  text: 'Initializing quantum thread array…' },
  { delay: 500,  text: 'Loading fragment index: 18,342 records found' },
  { delay: 800,  text: 'Calibrating temporal anchors… OK' },
  { delay: 1100, text: 'Connecting to void core: LINK ESTABLISHED' },
  { delay: 1400, text: 'Scanning for paradox signatures… 3 active anomalies detected' },
  { delay: 1700, text: 'Memory integrity check: 42.5% — WARNING: CRITICAL' },
  { delay: 2000, text: 'Mounting Loom Canvas engine…' },
  { delay: 2300, text: 'Loading dashboard modules… DONE' },
  { delay: 2600, text: '⚠  The Last Forgotten City has 47h 23m before erasure' },
  { delay: 2900, text: 'Archivist clearance confirmed: Level ΩΩΩ' },
  { delay: 3100, text: 'SYSTEM READY — Entering Memory Loom…' },
]

const TOTAL_DURATION = 3600 // ms until onComplete fires

export default function BootAnimation({ onComplete }) {
  const location = useLocation()
  const destination = location.state?.destination || '/overview'
  const [visibleLines, setVisibleLines] = useState([])
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Show each boot line at its scheduled delay
    const timers = BOOT_LINES.map(({ delay, text }) =>
      setTimeout(() => setVisibleLines((prev) => [...prev, text]), delay),
    )

    // Animate progress bar from 0 → 100 over TOTAL_DURATION
    const startTime = Date.now()
    const rafId = { current: null }
    const tick = () => {
      const elapsed = Date.now() - startTime
      const pct = Math.min((elapsed / TOTAL_DURATION) * 100, 100)
      setProgress(pct)
      if (pct < 100) {
        rafId.current = requestAnimationFrame(tick)
      }
    }
    rafId.current = requestAnimationFrame(tick)

    // Fade out then call onComplete
    const fadeTimer = setTimeout(() => setFadeOut(true), TOTAL_DURATION - 300)
    const doneTimer = setTimeout(() => onComplete(destination), TOTAL_DURATION)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [onComplete, destination])

  return (
    <div
      className="fixed inset-0 flex flex-col bg-void font-mono text-white overflow-hidden"
      style={{
        background: '#04020a',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.4s ease',
      }}
    >
      {/* Scan-line overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)',
        }}
      />

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(ellipse, rgba(212,146,58,0.08) 0%, transparent 70%)' }}
      />

      <div className="relative z-20 flex flex-col h-full px-8 md:px-16 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pb-4 border-b" style={{ borderBottomColor: 'rgba(212,146,58,0.12)' }}>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(212,146,58,0.1)', border: '1px solid rgba(212,146,58,0.3)' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L8 15M1 8L15 8M3 3L13 13M13 3L3 13" stroke="#D4923A" strokeWidth="1.2" strokeLinecap="round" opacity="0.8"/>
              <circle cx="8" cy="8" r="2.5" fill="none" stroke="#D4923A" strokeWidth="1.2"/>
            </svg>
          </div>
          <div>
            <p className="tele text-xs font-medium tracking-widest uppercase" style={{ color: '#D4923A' }}>
              Memory Loom OS
            </p>
            <p className="tele text-[10px] text-white/30 mt-0.5">
              Boot Sequence Initiated
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#D4923A' }} />
            <span className="tele text-[10px]" style={{ color: 'rgba(212,146,58,0.5)' }}>BOOTING</span>
          </div>
        </div>

        {/* Scrolling boot log */}
        <div className="flex-1 overflow-hidden">
          <div className="space-y-1.5">
            {visibleLines.map((line, i) => (
              <div
                key={i}
                className="flex items-start gap-3"
                style={{
                  animation: 'fadeSlideIn 0.2s ease forwards',
                }}
              >
                <span className="tele text-[10px] shrink-0 mt-0.5" style={{ color: 'rgba(212,146,58,0.3)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="tele text-[11px] leading-relaxed"
                  style={{
                    color: line.includes('WARNING') || line.includes('⚠')
                      ? '#C44B6E'
                      : line.includes('READY') || line.includes('DONE') || line.includes('OK') || line.includes('ESTABLISHED')
                        ? '#4A8FA8'
                        : 'rgba(255,240,210,0.65)',
                  }}
                >
                  {line}
                </span>
              </div>
            ))}
            {/* Blinking cursor */}
            {visibleLines.length < BOOT_LINES.length && (
              <div className="flex items-center gap-3">
                <span className="tele text-[10px]" style={{ color: 'rgba(212,146,58,0.3)' }}>
                  {String(visibleLines.length + 1).padStart(2, '0')}
                </span>
                <span className="tele text-[11px] animate-pulse" style={{ color: 'rgba(212,146,58,0.4)' }}>█</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-8 space-y-2">
          <div className="flex items-center justify-between">
            <span className="tele text-[10px] text-white/30">Loading Loom Modules</span>
            <span className="tele text-[10px]" style={{ color: '#D4923A' }}>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-none"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #7B5EA8, #4A8FA8, #D4923A)',
                boxShadow: '0 0 12px rgba(212,146,58,0.5)',
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="tele text-[9px] text-white/20">Memory Loom v2.4.1</span>
            <span className="tele text-[9px] text-white/20">Clearance Level ΩΩΩ</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
