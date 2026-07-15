import { useState, useEffect, useRef } from 'react'
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Zap,
  Clock,
  GitBranch,
  Brain,
  Target,
  ChevronRight,
  Activity,
  Radio,
  Eye,
} from 'lucide-react'

/* ── Animated counter ────────────────────────────────── */
function AnimatedCounter({ to, suffix = '', duration = 1800 }) {
  const [val, setVal] = useState(0)
  const start = useRef(null)

  useEffect(() => {
    const animate = (ts) => {
      if (!start.current) start.current = ts
      const progress = Math.min((ts - start.current) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setVal(+(to * ease).toFixed(1))
      if (progress < 1) requestAnimationFrame(animate)
    }
    const id = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(id)
  }, [to, duration])

  return (
    <span>
      {suffix === '%' ? val.toFixed(1) : Math.round(val)}
      {suffix}
    </span>
  )
}

/* ── Integrity ring ─────────────────────────────────── */
function IntegrityRing({ value }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const [dash, setDash] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setDash((value / 100) * circ), 200)
    return () => clearTimeout(t)
  }, [value, circ])

  const color = value < 35 ? '#E8506A' : value < 60 ? '#E8B96A' : '#4C8CFF'

  return (
    <div className="relative flex items-center justify-center w-36 h-36 mx-auto">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
        {/* Track */}
        <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        {/* Progress */}
        <circle
          cx="64" cy="64" r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - dash}
          style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 6px ${color}60)` }}
        />
      </svg>
      <div className="flex flex-col items-center text-center z-10">
        <span className="display text-3xl font-normal" style={{ color, letterSpacing: '-0.04em' }}>
          <AnimatedCounter to={value} suffix="%" />
        </span>
        <span className="tele text-[9px] text-white/30 uppercase tracking-widest mt-0.5">Integrity</span>
      </div>
    </div>
  )
}

/* ── Stat card ─────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, trend, color = 'thread', className = '' }) {
  const colors = {
    thread: { text: 'text-thread', bg: 'bg-thread/10', border: 'border-thread/20' },
    stability: { text: 'text-stability', bg: 'bg-stability/10', border: 'border-stability/20' },
    decay: { text: 'text-decay', bg: 'bg-decay/10', border: 'border-decay/20' },
    paradox: { text: 'text-paradox', bg: 'bg-paradox/10', border: 'border-paradox/20' },
  }
  const c = colors[color]

  return (
    <div className={`loom-card p-4 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-8 h-8 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center`}>
          <Icon size={15} className={c.text} />
        </div>
        {trend && (
          <span className={`tele text-[10px] flex items-center gap-0.5 ${trend > 0 ? 'text-decay' : 'text-stability'}`}>
            {trend > 0 ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="display text-2xl font-normal text-white" style={{ letterSpacing: '-0.03em' }}>
        {value}
      </div>
      <div className="text-xs text-white/50 mt-0.5 font-medium">{label}</div>
      {sub && <div className="tele text-[10px] text-white/25 mt-1">{sub}</div>}
    </div>
  )
}

/* ── Mini sparkline ─────────────────────────────────── */
function Sparkline({ data, color }) {
  const w = 120
  const h = 32
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w
      const y = h - ((v - min) / range) * (h - 4) - 2
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 3px ${color}60)` }}
      />
    </svg>
  )
}

/* ── Timeline entry ─────────────────────────────────── */
function TimelineEntry({ time, event, type, sector }) {
  const typeConfig = {
    breach: { color: 'text-decay', dot: 'bg-decay', badge: 'badge-decay', label: 'Breach' },
    restored: { color: 'text-stability', dot: 'bg-stability', badge: 'badge-stability', label: 'Restored' },
    anomaly: { color: 'text-paradox', dot: 'bg-paradox', badge: 'badge-paradox', label: 'Anomaly' },
    warn: { color: 'text-thread', dot: 'bg-thread', badge: 'badge-thread', label: 'Warning' },
  }
  const cfg = typeConfig[type] || typeConfig.warn

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-white/4 last:border-0 group">
      <div className="flex flex-col items-center gap-1 shrink-0 mt-1">
        <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`}
          style={{ boxShadow: `0 0 6px currentColor` }}
        />
        <div className="w-px flex-1 bg-white/5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/70 leading-snug group-hover:text-white/90 transition-colors">{event}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="tele text-[9px] text-white/30">{time}</span>
          <span className="tele text-[9px] text-white/20">·</span>
          <span className="tele text-[9px] text-white/30">{sector}</span>
          <span className={`${cfg.badge} tele text-[8px] px-1 py-0.5 rounded uppercase`}>{cfg.label}</span>
        </div>
      </div>
    </div>
  )
}

/* ── Paradox card ───────────────────────────────────── */
function ParadoxCard({ id, desc, severity, age, threads }) {
  const sev = {
    critical: { color: 'text-decay', ring: 'border-decay/30 bg-decay/5' },
    high: { color: 'text-thread', ring: 'border-thread/30 bg-thread/5' },
    medium: { color: 'text-paradox', ring: 'border-paradox/30 bg-paradox/5' },
  }
  const s = sev[severity]

  return (
    <div className={`loom-card p-3 border ${s.ring}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Zap size={12} className={s.color} />
          <span className="tele text-[10px] text-white/40">{id}</span>
        </div>
        <span className={`tele text-[9px] font-medium uppercase ${s.color}`}>{severity}</span>
      </div>
      <p className="text-xs text-white/60 leading-snug mb-2">{desc}</p>
      <div className="flex items-center gap-3">
        <span className="tele text-[9px] text-white/30 flex items-center gap-1">
          <Clock size={9} /> {age}
        </span>
        <span className="tele text-[9px] text-white/30 flex items-center gap-1">
          <GitBranch size={9} /> {threads} threads
        </span>
        <button className="ml-auto tele text-[9px] text-stability hover:text-stability/80 flex items-center gap-0.5 transition-colors">
          Resolve <ChevronRight size={9} />
        </button>
      </div>
    </div>
  )
}

/* ── Sector health bar ──────────────────────────────── */
function SectorBar({ name, integrity, fragments }) {
  const color = integrity < 40 ? '#E8506A' : integrity < 70 ? '#E8B96A' : '#4C8CFF'
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setWidth(integrity), 300)
    return () => clearTimeout(t)
  }, [integrity])

  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="tele text-[10px] text-white/40 w-20 shrink-0 truncate">{name}</span>
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${width}%`, background: color, boxShadow: `0 0 6px ${color}50` }}
        />
      </div>
      <span className="tele text-[10px] w-8 text-right" style={{ color }}>{integrity}%</span>
      <span className="tele text-[9px] text-white/25 w-16 text-right">{fragments} frags</span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════ */
/*  OVERVIEW PAGE                                         */
/* ═══════════════════════════════════════════════════════ */
const INTEGRITY = 42.5

const STATS = [
  { icon: Brain, label: 'Memory Fragments', value: '18,342', sub: '↓ 412 since last sync', trend: 2.2, color: 'decay' },
  { icon: GitBranch, label: 'Active Timelines', value: '247', sub: '12 divergent branches', trend: null, color: 'stability' },
  { icon: Zap, label: 'Open Paradoxes', value: '3', sub: '1 critical priority', trend: 50, color: 'paradox' },
  { icon: Target, label: 'Integrity Score', value: '42.5%', sub: 'Target: ≥ 85%', trend: 8.1, color: 'thread' },
]

const SPARKLINES = {
  integrity: [65, 61, 57, 53, 50, 47, 44, 43, 42.5],
  fragments: [18800, 18720, 18650, 18580, 18510, 18440, 18380, 18342],
  paradoxes: [1, 1, 2, 2, 2, 3, 3, 3],
}

const TIMELINE_EVENTS = [
  { time: '14:22:07', event: 'Memory cluster Δ-7 breach detected in Sector 9', type: 'breach', sector: 'SEC-9' },
  { time: '14:18:33', event: 'Timeline thread TL-182 partially restored after paradox seal', type: 'restored', sector: 'SEC-4' },
  { time: '14:05:11', event: 'Anomaly signature PAR-003 expanding — immediate attention required', type: 'anomaly', sector: 'CORE' },
  { time: '13:57:44', event: 'Fragment batch #2241 archived successfully', type: 'restored', sector: 'SEC-2' },
  { time: '13:41:20', event: 'Cascade risk detected in memory strands 441–460', type: 'warn', sector: 'SEC-6' },
  { time: '13:28:09', event: 'Routine scan completed — 3 new threads flagged', type: 'warn', sector: 'SCAN' },
]

const PARADOXES = [
  { id: 'PAR-001', desc: 'The Battle of Verdana exists simultaneously as a victory and defeat causing a causal loop in 7 timelines.', severity: 'critical', age: '2d 14h', threads: 7 },
  { id: 'PAR-002', desc: 'Architect Mira Chen appears in contradictory records across sectors 3 and 9.', severity: 'high', age: '5d 6h', threads: 3 },
  { id: 'PAR-003', desc: 'Temporal echo cascade expanding near void core — 4 strands entangled.', severity: 'medium', age: '18h', threads: 4 },
]

const SECTORS = [
  { name: 'Sector 1', integrity: 78, fragments: 2140 },
  { name: 'Sector 2', integrity: 65, fragments: 1832 },
  { name: 'Sector 3', integrity: 34, fragments: 3201 },
  { name: 'Sector 4', integrity: 55, fragments: 1644 },
  { name: 'Sector 5', integrity: 89, fragments: 980 },
  { name: 'Sector 6', integrity: 29, fragments: 2755 },
  { name: 'Core', integrity: 12, fragments: 5790 },
]

export default function Overview() {
  const [activeTab, setActiveTab] = useState('events')

  return (
    <div className="p-5 space-y-5 min-h-full">

      {/* ── Alert banner ── */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-decay/25 bg-decay/8"
        style={{ boxShadow: '0 0 20px rgba(232,80,106,0.06)' }}
      >
        <AlertTriangle size={14} className="text-decay shrink-0 animate-pulse" />
        <p className="text-sm text-decay/90 flex-1">
          <span className="font-semibold">Critical Alert:</span>{' '}
          Memory Integrity at <span className="tele font-medium">42.5%</span> — The Last Forgotten City will cease to exist in approximately{' '}
          <span className="tele text-thread">47h 23m</span> unless restoration targets are met.
        </p>
        <button className="shrink-0 tele text-[10px] text-white/40 hover:text-white/70 flex items-center gap-1 transition-colors">
          View mission <ChevronRight size={10} />
        </button>
      </div>

      {/* ── Row 1: Integrity ring + stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

        {/* Integrity ring card */}
        <div className="loom-card p-5 md:col-span-2 flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-4">
            <span className="display text-sm font-medium text-white/70">Reality Integrity</span>
            <div className="flex items-center gap-1.5">
              <Radio size={10} className="text-decay animate-pulse" />
              <span className="tele text-[9px] text-decay uppercase tracking-wide">Critical</span>
            </div>
          </div>
          <IntegrityRing value={INTEGRITY} />
          <div className="w-full mt-4 pt-4 border-t border-white/5 grid grid-cols-3 gap-2">
            {[
              { label: 'Target', val: '85%', color: 'text-stability' },
              { label: 'Gap', val: '42.5%', color: 'text-decay' },
              { label: 'Rate', val: '-0.3%/h', color: 'text-thread' },
            ].map(({ label, val, color }) => (
              <div key={label} className="flex flex-col items-center">
                <span className={`tele text-[11px] font-medium ${color}`}>{val}</span>
                <span className="tele text-[9px] text-white/30 mt-0.5">{label}</span>
              </div>
            ))}
          </div>
          {/* Trend sparkline */}
          <div className="w-full mt-3 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="tele text-[9px] text-white/30">7-day integrity trend</span>
              <span className="tele text-[9px] text-decay">↓ Declining</span>
            </div>
            <div className="flex justify-center">
              <Sparkline data={SPARKLINES.integrity} color="#E8506A" />
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="md:col-span-3 grid grid-cols-2 gap-3">
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>

      {/* ── Row 2: Timeline feed + Paradoxes ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Event log */}
        <div className="loom-card p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-thread" />
              <span className="display text-sm font-medium text-white/70">Live Event Feed</span>
            </div>
            <div className="flex items-center gap-3">
              {['events', 'threads'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`tele text-[10px] uppercase tracking-wide px-2 py-1 rounded transition-colors ${
                    activeTab === tab ? 'text-thread bg-thread/10' : 'text-white/30 hover:text-white/60'
                  }`}
                >
                  {tab}
                </button>
              ))}
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-decay animate-pulse" />
                <span className="tele text-[9px] text-decay">Live</span>
              </div>
            </div>
          </div>
          <div>
            {TIMELINE_EVENTS.map((ev, i) => (
              <TimelineEntry key={i} {...ev} />
            ))}
          </div>
          <button className="w-full mt-3 py-2 tele text-[10px] text-white/25 hover:text-white/50 flex items-center justify-center gap-1 transition-colors">
            Load more events <ChevronRight size={10} />
          </button>
        </div>

        {/* Open Paradoxes */}
        <div className="loom-card p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-paradox" />
              <span className="display text-sm font-medium text-white/70">Open Paradoxes</span>
            </div>
            <span className="badge-decay tele text-[9px] px-1.5 py-0.5 rounded-full">3 active</span>
          </div>
          <div className="space-y-2.5">
            {PARADOXES.map((p) => (
              <ParadoxCard key={p.id} {...p} />
            ))}
          </div>
          <button className="w-full mt-3 py-2 text-xs text-paradox/70 hover:text-paradox flex items-center justify-center gap-1.5 transition-colors border border-paradox/15 rounded-lg hover:bg-paradox/5">
            View all in Paradox Lab <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* ── Row 3: Sector health + Mission summary ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Sector health */}
        <div className="loom-card p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-stability" />
              <span className="display text-sm font-medium text-white/70">Sector Health Map</span>
            </div>
            <span className="tele text-[10px] text-white/30">7 sectors monitored</span>
          </div>
          <div className="space-y-0.5">
            {SECTORS.map((s) => (
              <SectorBar key={s.name} {...s} />
            ))}
          </div>
        </div>

        {/* Mission brief */}
        <div className="loom-card p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Target size={14} className="text-thread" />
            <span className="display text-sm font-medium text-white/70">Mission Brief</span>
          </div>
          <div className="flex-1 space-y-3">
            <div className="p-3 rounded-lg bg-white/3 border border-white/6">
              <p className="tele text-[9px] text-white/30 uppercase tracking-widest mb-1.5">Primary Objective</p>
              <p className="text-xs text-white/70 leading-relaxed">
                Restore Memory Integrity to ≥ 85% before the Last Forgotten City at coordinates Ω-7 vanishes from the historical record permanently.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-thread/5 border border-thread/15">
              <p className="tele text-[9px] text-thread/60 uppercase tracking-widest mb-1.5">Deadline</p>
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-thread" />
                <span className="tele text-sm font-medium text-thread">47h 23m remaining</span>
              </div>
            </div>
            <div className="space-y-1.5">
              {[
                { task: 'Seal PAR-001 causal loop', done: false, color: 'decay' },
                { task: 'Restore Sector 3 fragments', done: false, color: 'thread' },
                { task: 'Stabilize Core timeline', done: false, color: 'paradox' },
                { task: 'Archive Fragment batch #2241', done: true, color: 'stability' },
              ].map(({ task, done, color }) => (
                <div key={task} className="flex items-center gap-2">
                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    done ? `bg-stability/20 border-stability/40` : `bg-white/5 border-white/15`
                  }`}>
                    {done && <span className="text-stability text-[8px]">✓</span>}
                  </div>
                  <span className={`text-xs ${done ? 'text-white/30 line-through' : 'text-white/60'}`}>{task}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="mt-4 w-full py-2.5 rounded-lg bg-thread/10 border border-thread/20 text-sm text-thread font-medium hover:bg-thread/15 transition-colors">
            Open Full Brief
          </button>
        </div>
      </div>

    </div>
  )
}
