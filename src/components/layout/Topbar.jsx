import { useLocation } from 'react-router-dom'
import { Bell, Search, Shield, User, Menu } from 'lucide-react'
import { useState, useEffect } from 'react'
import { mission } from '../../data'
import { useSimulator } from '../../context/SimulatorContext'

const PAGE_TITLES = {
  '/overview':     { label: 'Overview',     sub: 'Mission Control · Sector 7-Gamma' },
  '/timelines':    { label: 'Timelines',    sub: 'Thread Weaver Array' },
  '/memories':     { label: 'Memories',     sub: 'Fragment Archive' },
  '/paradoxes':    { label: 'Paradoxes',    sub: 'Anomaly Detection Log' },
  '/universe-map': { label: 'Universe Map', sub: 'Spatial Topology Index' },
  '/settings':     { label: 'Settings',     sub: 'Archivist Configuration' },
}

/* ── Countdown clock with film-grain shimmer ── */
function CountdownClock({ hoursLeft, minutesLeft }) {
  const [secs, setSecs] = useState(0)
  const [shimmer, setShimmer] = useState(false)

  useEffect(() => {
    const t = setInterval(() => {
      setSecs(s => {
        const next = (s + 1) % 60
        if (next === 0) setShimmer(v => !v)
        return next
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const pad = n => String(n).padStart(2, '0')
  const totalSecs = hoursLeft * 3600 + minutesLeft * 60 - secs
  const h = Math.floor(totalSecs / 3600)
  const m = Math.floor((totalSecs % 3600) / 60)
  const s = totalSecs % 60

  return (
    <div
      className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg overflow-hidden"
      style={{
        background: 'rgba(196,75,110,0.08)',
        border: '1px solid rgba(196,75,110,0.18)',
      }}
    >
      {/* Film-grain overlay */}
      <div className="grain-overlay" />
      <span className="tele text-[9px]" style={{ color: 'rgba(196,75,110,0.55)' }}>T-MINUS</span>
      <span
        className="tele text-[12px] font-medium"
        style={{
          color: '#C44B6E',
          textShadow: shimmer ? '0 0 12px rgba(196,75,110,0.8)' : '0 0 4px rgba(196,75,110,0.3)',
          transition: 'text-shadow 0.6s ease',
        }}
      >
        {pad(h)}:{pad(m)}:{pad(s)}
      </span>
    </div>
  )
}

/* ── Live Archivist timestamp ── */
function LiveTime() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const pad = n => String(n).padStart(2, '0')
  return (
    <span className="tele text-[10px]" style={{ color: 'rgba(212,146,58,0.35)' }}>
      {pad(time.getHours())}:{pad(time.getMinutes())}:{pad(time.getSeconds())}
    </span>
  )
}

export default function Topbar({ onMenuClick }) {
  const { pathname } = useLocation()
  const page = PAGE_TITLES[pathname] || { label: 'Memory Loom', sub: '' }
  const [searchFocused, setSearchFocused] = useState(false)
  const { state: sim } = useSimulator()

  return (
    <header
      style={{
        height: 'var(--topbar-h)',
        background: 'rgba(8, 5, 16, 0.82)',
        borderBottom: '1px solid rgba(212,146,58,0.08)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      className="flex items-center gap-4 px-5 shrink-0 relative z-10"
    >
      {/* Mobile menu trigger */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-lg transition-colors shrink-0 mr-0.5"
        style={{ color: 'rgba(212,146,58,0.7)', border: '1px solid rgba(212,146,58,0.15)', background: 'rgba(212,146,58,0.05)' }}
        aria-label="Open navigation menu"
      >
        <Menu size={14} />
      </button>
      {/* ── Page context ── */}
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h1
            className="display text-sm font-normal leading-none"
            style={{ color: 'rgba(255,240,210,0.9)', letterSpacing: '0.02em' }}
          >
            {page.label}
          </h1>
          <span
            className="tele text-[8px] px-1.5 py-0.5 rounded uppercase tracking-wide"
            style={{
              background: 'rgba(212,146,58,0.1)',
              color: 'rgba(212,146,58,0.7)',
              border: '1px solid rgba(212,146,58,0.18)',
            }}
          >
            Live
          </span>
        </div>
        <span className="tele text-[9px] mt-0.5 truncate" style={{ color: 'rgba(212,146,58,0.28)' }}>
          {page.sub}
        </span>
      </div>

      {/* ── Live time ── */}
      <LiveTime />

      {/* ── Search ── */}
      <div
        className={`relative hidden md:flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all duration-250`}
        style={{
          background: searchFocused ? 'rgba(212,146,58,0.06)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${searchFocused ? 'rgba(212,146,58,0.25)' : 'rgba(212,146,58,0.08)'}`,
          width: searchFocused ? '200px' : '148px',
          transition: 'all 0.25s ease',
        }}
      >
        <Search size={12} style={{ color: 'rgba(212,146,58,0.3)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search archive…"
          className="bg-transparent text-xs outline-none flex-1 tele"
          style={{ color: 'rgba(255,240,210,0.75)', '--placeholder-color': 'rgba(212,146,58,0.25)' }}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      {/* ── Countdown (critical) ── */}
      <CountdownClock
        hoursLeft={sim.hoursRemaining}
        minutesLeft={sim.minutesRemaining}
      />

      {/* ── Notifications ── */}
      <button
        className="relative p-2 rounded-lg transition-all duration-200"
        style={{
          color: sim.newEventFlash ? '#D4923A' : 'rgba(212,146,58,0.4)',
          transform: sim.newEventFlash ? 'scale(1.2)' : 'none',
        }}
      >
        <Bell size={14} className={sim.newEventFlash ? 'animate-bounce' : ''} />
        {(sim.newEventFlash || sim.paradoxesActive > 0) && (
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{
              background: '#C44B6E',
              boxShadow: '0 0 6px rgba(196,75,110,0.8)',
            }}
          />
        )}
      </button>

      {/* ── Integrity shield ── */}
      <div
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-300"
        style={{
          border: `1px solid ${sim.recoveryFlash ? 'rgba(74,143,168,0.3)' : 'rgba(196,75,110,0.2)'}`,
          background: sim.recoveryFlash ? 'rgba(74,143,168,0.12)' : 'rgba(196,75,110,0.07)',
          transform: sim.recoveryFlash ? 'scale(1.05)' : 'none',
        }}
      >
        <Shield size={11} style={{ color: sim.recoveryFlash ? '#4A8FA8' : '#C44B6E' }} />
        <span
          className="tele text-[10px] font-medium"
          style={{
            color: sim.recoveryFlash ? '#4A8FA8' : '#C44B6E',
            textShadow: sim.recoveryFlash ? '0 0 8px rgba(74,143,168,0.6)' : 'none',
          }}
        >
          {sim.integrity}%
        </span>
      </div>

      {/* ── Avatar ── */}
      <div
        className="flex items-center gap-2 pl-3"
        style={{ borderLeft: '1px solid rgba(212,146,58,0.08)' }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(212,146,58,0.18), rgba(212,146,58,0.05))',
            border: '1px solid rgba(212,146,58,0.28)',
          }}
        >
          <User size={12} style={{ color: 'rgba(212,146,58,0.7)' }} />
        </div>
        <div className="hidden sm:flex flex-col">
          <span className="ui-text text-xs leading-none font-medium" style={{ color: 'rgba(255,240,210,0.65)' }}>
            {mission.archivist.designation.split(' ')[0]} {mission.archivist.designation.split(' ')[1]}
          </span>
          <span className="tele text-[9px] mt-0.5" style={{ color: 'rgba(212,146,58,0.3)' }}>
            Clearance {mission.archivist.clearance}
          </span>
        </div>
      </div>
    </header>
  )
}
