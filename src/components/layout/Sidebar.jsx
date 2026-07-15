import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  GitBranch,
  Brain,
  Zap,
  Globe,
  Settings,
  Activity,
  ChevronRight,
} from 'lucide-react'
import { useState, useEffect } from 'react'

const NAV_ITEMS = [
  {
    to: '/',
    label: 'Overview',
    icon: LayoutDashboard,
    end: true,
    desc: 'Mission Control',
  },
  {
    to: '/timelines',
    label: 'Timelines',
    icon: GitBranch,
    desc: 'Thread Weaving',
  },
  {
    to: '/memories',
    label: 'Memories',
    icon: Brain,
    desc: 'Fragment Archive',
  },
  {
    to: '/paradoxes',
    label: 'Paradoxes',
    icon: Zap,
    desc: 'Anomaly Log',
    badge: 3,
    badgeColor: 'decay',
  },
  {
    to: '/universe-map',
    label: 'Universe Map',
    icon: Globe,
    desc: 'Spatial Index',
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: Settings,
    desc: 'Archivist Prefs',
  },
]

const INTEGRITY_VALUE = 42.5

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation()
  const [pulse, setPulse] = useState(false)

  // Pulse the integrity meter every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true)
      setTimeout(() => setPulse(false), 600)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <aside
      style={{ width: collapsed ? '64px' : 'var(--sidebar-w)', minWidth: collapsed ? '64px' : 'var(--sidebar-w)' }}
      className="relative flex flex-col h-screen bg-void-100 border-r border-loom-border transition-all duration-300 ease-in-out overflow-hidden z-20"
    >
      {/* Ambient glow top */}
      <div
        className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-24 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(ellipse, rgba(232,185,106,0.08) 0%, transparent 70%)' }}
      />

      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-4 border-b border-loom-border shrink-0">
        {/* Loom sigil */}
        <div className="relative shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(232,185,106,0.2), rgba(232,185,106,0.05))', border: '1px solid rgba(232,185,106,0.25)' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1 L8 15 M1 8 L15 8 M3 3 L13 13 M13 3 L3 13" stroke="#E8B96A" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
            <circle cx="8" cy="8" r="2.5" fill="none" stroke="#E8B96A" strokeWidth="1.2" />
          </svg>
          {/* Pulsing ring */}
          <div className={`absolute inset-0 rounded-lg border border-thread/30 transition-all duration-300 ${pulse ? 'scale-125 opacity-0' : 'scale-100 opacity-100'}`} />
        </div>

        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="display text-sm font-medium text-thread leading-none">Memory Loom</span>
            <span className="tele text-[10px] text-white/30 mt-0.5 leading-none">v2.4.1 · SECURE</span>
          </div>
        )}

        <button
          onClick={onToggle}
          className="ml-auto p-1 rounded-md text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors shrink-0"
          aria-label="Toggle sidebar"
        >
          <ChevronRight size={14} className={`transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Integrity meter */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-loom-border shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="tele text-[10px] text-white/40 uppercase tracking-widest">Memory Integrity</span>
            <span className={`tele text-[11px] font-medium transition-colors ${pulse ? 'text-thread' : 'text-decay'}`}>
              {INTEGRITY_VALUE}%
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
              style={{
                width: `${INTEGRITY_VALUE}%`,
                background: INTEGRITY_VALUE < 50
                  ? 'linear-gradient(90deg, #E8506A, #E8B96A)'
                  : 'linear-gradient(90deg, #4C8CFF, #9D6FE0)',
                boxShadow: INTEGRITY_VALUE < 50 ? '0 0 8px rgba(232,80,106,0.4)' : undefined,
              }}
            />
          </div>
          <p className="tele text-[9px] text-decay/70 mt-1.5">⚠ Critical — Restore before collapse</p>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end, desc, badge, badgeColor }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                title={collapsed ? label : undefined}
                className={({ isActive }) =>
                  [
                    'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150 relative',
                    isActive
                      ? 'bg-thread/10 text-thread'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/5',
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active indicator bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-thread"
                        style={{ boxShadow: '0 0 8px rgba(232,185,106,0.6)' }}
                      />
                    )}

                    <Icon
                      size={16}
                      className={`shrink-0 transition-colors ${isActive ? 'text-thread' : 'text-white/30 group-hover:text-white/60'}`}
                    />

                    {!collapsed && (
                      <>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-medium leading-none text-[13px]">{label}</span>
                          {!isActive && (
                            <span className="tele text-[10px] text-white/25 mt-0.5 truncate">{desc}</span>
                          )}
                        </div>

                        {badge != null && (
                          <span className={`badge-${badgeColor} shrink-0 tele text-[10px] px-1.5 py-0.5 rounded-full font-medium`}>
                            {badge}
                          </span>
                        )}
                      </>
                    )}

                    {collapsed && badge != null && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-decay"
                        style={{ boxShadow: '0 0 6px rgba(232,80,106,0.6)' }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* System status footer */}
      <div className="shrink-0 border-t border-loom-border p-3">
        {!collapsed ? (
          <div className="loom-card p-2.5 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={12} className="text-stability" />
              <span className="tele text-[10px] text-white/40 uppercase tracking-widest">System Status</span>
            </div>
            <div className="space-y-1">
              {[
                { label: 'Archivist', status: 'ONLINE', color: 'stability' },
                { label: 'Thread Sync', status: 'ACTIVE', color: 'thread' },
                { label: 'Paradox Log', status: '3 NEW', color: 'decay' },
              ].map(({ label, status, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="tele text-[9px] text-white/30">{label}</span>
                  <span className={`tele text-[9px] font-medium text-${color}`}>{status}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 rounded-full bg-stability animate-pulse" style={{ boxShadow: '0 0 6px rgba(76,140,255,0.6)' }} />
          </div>
        )}
      </div>
    </aside>
  )
}
