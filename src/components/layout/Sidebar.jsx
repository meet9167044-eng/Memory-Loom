import { Link, NavLink } from 'react-router-dom'
import {
  LayoutDashboard, GitBranch, Brain, Zap, Globe, Settings, Activity, ChevronRight,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { mission } from '../../data'
import EmberBar from '../ui/EmberBar'
import { useSimulator } from '../../context/SimulatorContext'

const NAV_ITEMS = [
  { to: '/overview',     label: 'Overview',     icon: LayoutDashboard, end: true, desc: 'Mission Control' },
  { to: '/timelines',    label: 'Timelines',    icon: GitBranch,  desc: 'Thread Weaving' },
  { to: '/memories',     label: 'Memories',     icon: Brain,      desc: 'Fragment Archive' },
  { to: '/paradoxes',    label: 'Paradoxes',    icon: Zap,        desc: 'Anomaly Log', badgeColor: 'decay' },
  { to: '/universe-map', label: 'Universe',     icon: Globe,      desc: 'Spatial Index' },
  { to: '/settings',     label: 'Settings',     icon: Settings,   desc: 'Archivist Prefs' },
]

export default function Sidebar({ collapsed, onToggle }) {
  const { state: sim } = useSimulator()
  const INTEGRITY = sim.integrity
  const [pulse, setPulse] = useState(false)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true)
      setTick(t => t + 1)
      setTimeout(() => setPulse(false), 700)
    }, 4200)
    return () => clearInterval(interval)
  }, [])

  const sysItems = [
    { label: 'Archivist',   status: mission.systemStatus.archivist,   color: '#4A8FA8' },
    { label: 'Thread Sync', status: mission.systemStatus.threadSync,   color: '#D4923A' },
    { label: 'Paradox Log', status: mission.systemStatus.paradoxLog,   color: '#C44B6E' },
    { label: 'Void Core',   status: mission.systemStatus.voidCore,     color: '#7B5EA8' },
  ]

  return (
    <aside
      style={{
        width: collapsed ? '64px' : 'var(--sidebar-w)',
        minWidth: collapsed ? '64px' : 'var(--sidebar-w)',
      }}
      className="sidebar-surface relative flex flex-col h-screen transition-all duration-300 ease-in-out overflow-hidden z-20"
    >
      {/* Top ambient glow */}
      <div
        className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-52 h-28 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(ellipse, rgba(212,146,58,0.06) 0%, transparent 70%)' }}
      />

      {/* ── Brand ── */}
      <div
        className="flex items-center gap-3 px-4 pt-5 pb-4 shrink-0"
        style={{ borderBottom: '1px solid rgba(212,146,58,0.08)' }}
      >
        <Link to="/" className="flex items-center gap-3 group hover:opacity-85 transition-opacity">
          {/* Loom Sigil */}
          <div
            className="relative shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(212,146,58,0.22), rgba(212,146,58,0.05))',
              border: '1px solid rgba(212,146,58,0.28)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              {/* Woven cross threads */}
              <path d="M8 1 L8 15" stroke="#D4923A" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
              <path d="M1 8 L15 8" stroke="#D4923A" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
              <path d="M3 3 L13 13" stroke="#D4923A" strokeWidth="0.6" strokeLinecap="round" opacity="0.4" />
              <path d="M13 3 L3 13" stroke="#D4923A" strokeWidth="0.6" strokeLinecap="round" opacity="0.4" />
              <circle cx="8" cy="8" r="3" fill="none" stroke="#D4923A" strokeWidth="1" opacity="0.9" />
              <circle cx="8" cy="8" r="1" fill="#D4923A" opacity="0.95" />
            </svg>
            {/* Pulse ring */}
            <div
              className="absolute inset-0 rounded-lg border"
              style={{
                borderColor: 'rgba(212,146,58,0.35)',
                transform: pulse ? 'scale(1.3)' : 'scale(1)',
                opacity: pulse ? 0 : 1,
                transition: 'all 0.6s ease-out',
              }}
            />
          </div>

          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span
                className="display text-sm font-normal leading-none"
                style={{ color: '#D4923A', letterSpacing: '0.08em' }}
              >
                Memory Loom
              </span>
              <span className="tele text-[9px] mt-0.5 leading-none" style={{ color: 'rgba(212,146,58,0.35)' }}>
                v2.4.1 · SECURE
              </span>
            </div>
          )}
        </Link>

        <button
          onClick={onToggle}
          className="ml-auto p-1 rounded-md transition-colors shrink-0"
          style={{ color: 'rgba(212,146,58,0.35)' }}
          aria-label="Toggle sidebar"
        >
          <ChevronRight
            size={13}
            style={{
              transform: collapsed ? 'none' : 'rotate(180deg)',
              transition: 'transform 0.3s ease',
              color: 'rgba(212,146,58,0.4)',
            }}
          />
        </button>
      </div>

      {/* ── Integrity Meter ── */}
      {!collapsed && (
        <div
          className="px-4 py-3 shrink-0"
          style={{ borderBottom: '1px solid rgba(212,146,58,0.06)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className="tele text-[9px] uppercase tracking-widest"
              style={{ color: 'rgba(212,146,58,0.45)' }}
            >
              Memory Integrity
            </span>
            <span
              className="tele text-[11px] font-medium"
              style={{
                color: pulse ? '#D4923A' : '#C44B6E',
                transition: 'color 0.5s ease',
                textShadow: pulse ? '0 0 8px rgba(212,146,58,0.6)' : 'none',
              }}
            >
              {INTEGRITY}%
            </span>
          </div>
          <EmberBar value={INTEGRITY} height={3} />
          <p className="tele text-[8px] mt-2" style={{ color: 'rgba(196,75,110,0.65)' }}>
            ⚠ Critical — restore before collapse
          </p>
        </div>
      )}

      {/* ── Nav Items ── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end, desc, badgeColor }) => {
            const badge = to === '/paradoxes' ? sim.paradoxesActive : null
            return (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  title={collapsed ? label : undefined}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150 relative"
                style={({ isActive }) => ({
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(212,146,58,0.10) 0%, rgba(212,146,58,0.04) 100%)'
                    : 'transparent',
                  color: isActive
                    ? '#D4923A'
                    : 'rgba(240,210,160,0.42)',
                  borderRight: isActive ? '2px solid #D4923A' : '2px solid transparent',
                })}
              >
                {({ isActive }) => (
                  <>
                    {/* Gold indicator dot */}
                    {isActive && (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full"
                        style={{
                          background: '#D4923A',
                          boxShadow: '0 0 10px rgba(212,146,58,0.7)',
                        }}
                      />
                    )}

                    <Icon
                      size={15}
                      style={{
                        color: isActive ? '#D4923A' : 'rgba(212,146,58,0.28)',
                        flexShrink: 0,
                        transition: 'color 0.2s ease',
                      }}
                    />

                    {!collapsed && (
                      <>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span
                            className="ui-text font-medium leading-none text-[13px]"
                            style={{ color: isActive ? '#D4923A' : 'rgba(240,210,160,0.7)' }}
                          >
                            {label}
                          </span>
                          {!isActive && (
                            <span className="tele text-[9px] mt-0.5 truncate" style={{ color: 'rgba(212,146,58,0.25)' }}>
                              {desc}
                            </span>
                          )}
                        </div>

                        {badge != null && (
                          <span
                            className={`badge-${badgeColor} shrink-0 tele text-[9px] px-1.5 py-0.5 rounded-full font-medium`}
                          >
                            {badge}
                          </span>
                        )}
                      </>
                    )}

                    {collapsed && badge != null && (
                      <span
                        className="absolute top-1 right-1 w-2 h-2 rounded-full"
                        style={{ background: '#C44B6E', boxShadow: '0 0 6px rgba(196,75,110,0.7)' }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          )})}
        </ul>
      </nav>

      {/* ── System Status Footer ── */}
      <div
        className="shrink-0 p-3"
        style={{ borderTop: '1px solid rgba(212,146,58,0.06)' }}
      >
        {!collapsed ? (
          <div
            className="rounded-xl p-3"
            style={{
              background: 'rgba(10,6,18,0.6)',
              border: '1px solid rgba(212,146,58,0.08)',
            }}
          >
            <div className="flex items-center gap-2 mb-2.5">
              <Activity size={11} style={{ color: '#4A8FA8' }} />
              <span className="tele text-[9px] uppercase tracking-widest" style={{ color: 'rgba(212,146,58,0.4)' }}>
                System Status
              </span>
            </div>
            <div className="space-y-1.5">
              {sysItems.map(({ label, status, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="tele text-[9px]" style={{ color: 'rgba(240,210,160,0.3)' }}>{label}</span>
                  <span className="tele text-[9px] font-medium" style={{ color }}>{status}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: '#4A8FA8', boxShadow: '0 0 6px rgba(74,143,168,0.6)' }}
            />
          </div>
        )}
      </div>
    </aside>
  )
}
