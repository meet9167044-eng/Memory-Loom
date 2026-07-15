import { useLocation } from 'react-router-dom'
import { Bell, Search, Clock, Shield, User } from 'lucide-react'
import { useState, useEffect } from 'react'

const PAGE_TITLES = {
  '/overview': { label: 'Overview', sub: 'Mission Control · Sector 7-Gamma' },
  '/timelines': { label: 'Timelines', sub: 'Thread Weaver Array' },
  '/memories': { label: 'Memories', sub: 'Fragment Archive' },
  '/paradoxes': { label: 'Paradoxes', sub: 'Anomaly Detection Log' },
  '/universe-map': { label: 'Universe Map', sub: 'Spatial Topology Index' },
  '/settings': { label: 'Settings', sub: 'Archivist Configuration' },
}

function LiveClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const pad = (n) => String(n).padStart(2, '0')
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`
  const dateStr = time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="flex items-center gap-2">
      <Clock size={12} className="text-white/25" />
      <span className="tele text-[11px] text-white/40">
        {dateStr} · <span className="text-thread/70">{timeStr}</span>
      </span>
    </div>
  )
}

export default function Topbar() {
  const { pathname } = useLocation()
  const page = PAGE_TITLES[pathname] || { label: 'Memory Loom', sub: '' }
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header
      style={{ height: 'var(--topbar-h)' }}
      className="flex items-center gap-4 px-5 shrink-0 border-b border-loom-border bg-void-100/80 backdrop-blur-sm"
    >
      {/* Page context */}
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h1 className="display text-sm font-medium text-white leading-none">{page.label}</h1>
          <span className="badge-thread tele text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wide">Live</span>
        </div>
        <span className="tele text-[10px] text-white/30 mt-0.5 truncate">{page.sub}</span>
      </div>

      {/* Live clock */}
      <LiveClock />

      {/* Search */}
      <div className={`relative hidden md:flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all duration-200 ${
        searchFocused
          ? 'bg-white/8 border border-thread/30 w-56'
          : 'bg-white/4 border border-white/6 w-40'
      }`}>
        <Search size={13} className="text-white/30 shrink-0" />
        <input
          type="text"
          placeholder="Search archive…"
          className="bg-transparent text-xs text-white placeholder-white/25 outline-none flex-1 tele"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      {/* Notifications */}
      <button className="relative p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors">
        <Bell size={15} />
        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-decay"
          style={{ boxShadow: '0 0 6px rgba(232,80,106,0.7)' }}
        />
      </button>

      {/* Integrity shield */}
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-decay/20 bg-decay/8">
        <Shield size={12} className="text-decay" />
        <span className="tele text-[10px] text-decay font-medium">42.5% INT</span>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-2 pl-2 border-l border-loom-border">
        <div className="w-7 h-7 rounded-full border border-thread/30 bg-thread/10 flex items-center justify-center">
          <User size={13} className="text-thread/70" />
        </div>
        <div className="hidden sm:flex flex-col">
          <span className="text-xs text-white/60 leading-none font-medium">Sr. Archivist</span>
          <span className="tele text-[9px] text-white/25 mt-0.5">Clearance ΩΩΩ</span>
        </div>
      </div>
    </header>
  )
}
