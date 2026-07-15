import { useState, useEffect, useRef } from 'react'
import {
  AlertTriangle,
  TrendingDown,
  Zap,
  Clock,
  GitBranch,
  Brain,
  Activity,
  Radio,
  Heart,
  MessageSquare,
  ChevronRight,
} from 'lucide-react'

/* ── Animated counter ──────────────────────────────── */
function AnimatedCounter({ to, suffix = '', decimals = 1, duration = 1800 }) {
  const [val, setVal] = useState(0)
  const start = useRef(null)
  useEffect(() => {
    const animate = (ts) => {
      if (!start.current) start.current = ts
      const p = Math.min((ts - start.current) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(parseFloat((to * ease).toFixed(decimals)))
      if (p < 1) requestAnimationFrame(animate)
    }
    const id = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(id)
  }, [to, duration, decimals])
  return <>{val.toFixed(decimals)}{suffix}</>
}

/* ── Reality Integrity ring ────────────────────────── */
function IntegrityRing({ value }) {
  const r = 48
  const circ = 2 * Math.PI * r
  const [dash, setDash] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setDash((value / 100) * circ), 200)
    return () => clearTimeout(t)
  }, [value, circ])
  const color = value < 40 ? '#E8506A' : value < 65 ? '#E8B96A' : '#4C8CFF'
  return (
    <div className="relative flex items-center justify-center w-28 h-28">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 112 112">
        <circle cx="56" cy="56" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        <circle
          cx="56" cy="56" r={r}
          fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ - dash}
          style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 5px ${color}80)` }}
        />
      </svg>
      <div className="flex flex-col items-center z-10">
        <span className="display text-xl font-normal" style={{ color, letterSpacing: '-0.04em' }}>
          <AnimatedCounter to={value} suffix="%" />
        </span>
        <span className="tele text-[8px] text-white/30 uppercase tracking-widest">INT</span>
      </div>
    </div>
  )
}

/* ── 3D Loom Canvas placeholder ────────────────────── */
// This will be replaced with a real Three.js / R3F scene in Step 6.
function LoomCanvasPlaceholder() {
  const [angle, setAngle] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setAngle((a) => (a + 0.4) % 360), 30)
    return () => clearInterval(id)
  }, [])

  const threads = [0, 60, 120, 180, 240, 300]

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(232,185,106,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(232,185,106,0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Perspective SVG */}
      <svg
        className="relative z-10"
        viewBox="-120 -120 240 240"
        style={{ width: 'min(280px, 80%)', height: 'min(280px, 80%)' }}
      >
        {/* Thread strands */}
        {threads.map((base, i) => {
          const a = ((base + angle) * Math.PI) / 180
          const x1 = Math.cos(a) * 100
          const y1 = Math.sin(a) * 30
          const x2 = Math.cos(a + Math.PI) * 100
          const y2 = Math.sin(a + Math.PI) * 30
          const colors = ['#E8B96A', '#4C8CFF', '#9D6FE0', '#E8506A', '#E8B96A', '#4C8CFF']
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={colors[i]} strokeWidth="0.6" opacity="0.4"
              style={{ filter: `drop-shadow(0 0 3px ${colors[i]}60)` }}
            />
          )
        })}
        {/* Orbit ring */}
        <ellipse cx="0" cy="0" rx="100" ry="32" fill="none" stroke="rgba(232,185,106,0.15)" strokeWidth="0.8" />
        {/* Core */}
        <circle cx="0" cy="0" r="22" fill="none" stroke="rgba(232,185,106,0.4)" strokeWidth="0.8" />
        <circle cx="0" cy="0" r="14" fill="rgba(232,185,106,0.08)" />
        <circle cx="0" cy="0" r="6"
          fill="rgba(232,185,106,0.9)"
          style={{ filter: 'drop-shadow(0 0 8px rgba(232,185,106,0.8))' }}
        />
        {/* Fragment nodes */}
        {[0, 72, 144, 216, 288].map((deg, i) => {
          const rad = (deg + angle * 0.5) * Math.PI / 180
          const cx = Math.cos(rad) * 70
          const cy = Math.sin(rad) * 22
          const nodeColors = ['#E8B96A', '#4C8CFF', '#E8506A', '#9D6FE0', '#4C8CFF']
          return (
            <circle key={i} cx={cx} cy={cy} r="3.5"
              fill={nodeColors[i]} opacity="0.7"
              style={{ filter: `drop-shadow(0 0 4px ${nodeColors[i]}80)` }}
            />
          )
        })}
      </svg>
      {/* Label */}
      <div className="absolute bottom-3 left-0 right-0 text-center">
        <span className="tele text-[9px] text-white/20 uppercase tracking-widest">
          3D Loom Canvas — Three.js coming in Step 6
        </span>
      </div>
    </div>
  )
}

/* ── Alert item ────────────────────────────────────── */
function AlertItem({ type, message, time }) {
  const cfg = {
    critical: { color: 'text-decay', bg: 'bg-decay/8 border-decay/20', icon: AlertTriangle },
    warn:     { color: 'text-thread', bg: 'bg-thread/8 border-thread/20', icon: Zap },
    info:     { color: 'text-stability', bg: 'bg-stability/8 border-stability/20', icon: Radio },
  }[type] || {}
  const Icon = cfg.icon
  return (
    <div className={`flex items-start gap-2.5 p-2.5 rounded-lg border ${cfg.bg} mb-2 last:mb-0`}>
      <Icon size={12} className={`${cfg.color} shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/70 leading-snug">{message}</p>
        <span className="tele text-[9px] text-white/25 mt-0.5 block">{time}</span>
      </div>
    </div>
  )
}

/* ── Emotion readout ───────────────────────────────── */
function EmotionBar({ label, value, color }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(value), 400); return () => clearTimeout(t) }, [value])
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="tele text-[9px] text-white/35 w-16 shrink-0">{label}</span>
      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1200"
          style={{ width: `${w}%`, background: color, boxShadow: `0 0 5px ${color}50` }} />
      </div>
      <span className="tele text-[9px] w-6 text-right" style={{ color }}>{value}%</span>
    </div>
  )
}

/* ── Timeline event row ────────────────────────────── */
function TimelineRow({ time, event, type, sector }) {
  const cfg = {
    breach:   { dot: 'bg-decay',     badge: 'badge-decay',     label: 'Breach' },
    restored: { dot: 'bg-stability', badge: 'badge-stability', label: 'Restored' },
    anomaly:  { dot: 'bg-paradox',   badge: 'badge-paradox',   label: 'Anomaly' },
    warn:     { dot: 'bg-thread',    badge: 'badge-thread',    label: 'Warning' },
  }[type] || {}
  return (
    <div className="flex items-start gap-3 py-2 border-b border-white/4 last:border-0">
      <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot} mt-1.5 shrink-0`} />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/65 leading-snug">{event}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="tele text-[9px] text-white/25">{time}</span>
          <span className="tele text-[9px] text-white/20">·</span>
          <span className="tele text-[9px] text-white/25">{sector}</span>
          <span className={`${cfg.badge} tele text-[8px] px-1 py-0.5 rounded ml-auto`}>{cfg.label}</span>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════ */
/*  DATA                                              */
/* ═══════════════════════════════════════════════════ */
const INTEGRITY = 42.5

const ALERTS = [
  { type: 'critical', message: 'Memory cluster Δ-7 breach — Sector 9 approaching collapse', time: '14:22:07' },
  { type: 'critical', message: 'PAR-001 causal loop expanding — fragment drain 2,100/hr', time: '14:05:11' },
  { type: 'warn',     message: 'Cascade risk in memory strands 441–460, Sector 6', time: '13:41:20' },
  { type: 'info',     message: 'Thread TL-182 partially restored after paradox seal', time: '14:18:33' },
]

const EMOTIONS = [
  { label: 'Despair',  value: 72, color: '#E8506A' },
  { label: 'Hope',     value: 28, color: '#4C8CFF' },
  { label: 'Clarity',  value: 18, color: '#9D6FE0' },
  { label: 'Fear',     value: 65, color: '#E8B96A' },
  { label: 'Resolve',  value: 43, color: '#4C8CFF' },
]

const TIMELINE_EVENTS = [
  { time: '14:22:07', event: 'Memory cluster Δ-7 breach detected in Sector 9', type: 'breach', sector: 'SEC-9' },
  { time: '14:18:33', event: 'Timeline TL-182 partially restored after paradox seal', type: 'restored', sector: 'SEC-4' },
  { time: '14:05:11', event: 'Anomaly PAR-003 expanding — immediate attention', type: 'anomaly', sector: 'CORE' },
  { time: '13:57:44', event: 'Fragment batch #2241 archived successfully', type: 'restored', sector: 'SEC-2' },
  { time: '13:41:20', event: 'Cascade risk in memory strands 441–460', type: 'warn', sector: 'SEC-6' },
]

/* ═══════════════════════════════════════════════════ */
/*  OVERVIEW PAGE                                     */
/* ═══════════════════════════════════════════════════ */
export default function Overview() {
  return (
    <div className="p-4 h-full">
      {/* ── Top quick-stats bar ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { icon: Brain,    label: 'Fragments',  value: '18,342', sub: '↓ 412 since sync',       color: 'text-decay' },
          { icon: GitBranch,label: 'Timelines',  value: '247',    sub: '12 divergent',             color: 'text-stability' },
          { icon: Zap,      label: 'Paradoxes',  value: '3',      sub: '1 critical',               color: 'text-paradox' },
          { icon: Clock,    label: 'Time Left',  value: '47h 23m', sub: 'Until city erasure',      color: 'text-decay' },
        ].map(({ icon: Icon, label, value, sub, color }) => (
          <div key={label} className="loom-card px-3 py-2.5 flex items-center gap-3">
            <Icon size={14} className={color} />
            <div>
              <div className={`display text-base font-normal ${color}`} style={{ letterSpacing: '-0.03em' }}>{value}</div>
              <div className="tele text-[9px] text-white/30">{label} · {sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main layout grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 h-[calc(100%-80px)]">

        {/* ── LEFT COLUMN (Reality Integrity + Alerts + Emotion) ── */}
        <div className="xl:col-span-3 flex flex-col gap-4">

          {/* Reality Integrity */}
          <div className="loom-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="display text-xs font-medium text-white/60 uppercase tracking-wide">Reality Integrity</span>
              <div className="flex items-center gap-1.5">
                <Radio size={10} className="text-decay animate-pulse" />
                <span className="tele text-[9px] text-decay uppercase">Critical</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <IntegrityRing value={INTEGRITY} />
              <div className="flex flex-col gap-2 flex-1">
                {[
                  { label: 'Target', val: '85%',    color: 'text-stability' },
                  { label: 'Gap',    val: '−42.5%', color: 'text-decay' },
                  { label: 'Rate',   val: '−0.3%/h', color: 'text-thread' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="tele text-[9px] text-white/30">{label}</span>
                    <span className={`tele text-[10px] font-medium ${color}`}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="progress-bar">
                <div className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${INTEGRITY}%`, background: 'linear-gradient(90deg,#E8506A,#E8B96A)', transition: 'width 1.5s ease', boxShadow: '0 0 8px rgba(232,80,106,0.4)' }}
                />
              </div>
              <p className="tele text-[9px] text-decay/60 mt-1.5">⚠ Restore before city vanishes</p>
            </div>
          </div>

          {/* Alerts */}
          <div className="loom-card p-4 flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={12} className="text-decay" />
                <span className="display text-xs font-medium text-white/60 uppercase tracking-wide">Alerts</span>
              </div>
              <span className="badge-decay tele text-[9px] px-1.5 py-0.5 rounded-full">
                {ALERTS.filter(a => a.type === 'critical').length} critical
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {ALERTS.map((a, i) => <AlertItem key={i} {...a} />)}
            </div>
          </div>

          {/* Emotion readout */}
          <div className="loom-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Heart size={12} className="text-paradox" />
              <span className="display text-xs font-medium text-white/60 uppercase tracking-wide">Emotion Index</span>
            </div>
            <div>
              {EMOTIONS.map((e) => <EmotionBar key={e.label} {...e} />)}
            </div>
            <p className="tele text-[9px] text-white/20 mt-3">
              Derived from archived memory fragments — Sector 1–6
            </p>
          </div>
        </div>

        {/* ── CENTRE (3D Loom Canvas) ── */}
        <div className="xl:col-span-6 loom-card flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
            <div className="flex items-center gap-2">
              <Activity size={13} className="text-thread" />
              <span className="display text-xs font-medium text-white/60 uppercase tracking-wide">Loom Canvas</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-thread animate-pulse" />
                <span className="tele text-[9px] text-thread/60">Live</span>
              </div>
              <span className="tele text-[9px] text-white/20">Step 6: Three.js</span>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <LoomCanvasPlaceholder />
          </div>

          {/* Canvas bottom stats */}
          <div className="grid grid-cols-3 gap-0 border-t border-white/5 shrink-0">
            {[
              { label: 'Active Threads',   value: '247',    color: '#4C8CFF' },
              { label: 'Fragment Nodes',   value: '18,342', color: '#E8B96A' },
              { label: 'Paradox Anchors',  value: '3',      color: '#9D6FE0' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex flex-col items-center py-3 border-r border-white/5 last:border-0">
                <span className="tele text-sm font-medium" style={{ color }}>{value}</span>
                <span className="tele text-[9px] text-white/25 mt-0.5">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN (Timeline feed) ── */}
        <div className="xl:col-span-3 loom-card p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare size={12} className="text-stability" />
              <span className="display text-xs font-medium text-white/60 uppercase tracking-wide">Timeline</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-decay animate-pulse" />
              <span className="tele text-[9px] text-decay">Live</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {TIMELINE_EVENTS.map((ev, i) => <TimelineRow key={i} {...ev} />)}
          </div>

          {/* Mission progress */}
          <div className="mt-3 pt-3 border-t border-white/5 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="tele text-[9px] text-white/30 uppercase tracking-widest">Mission Progress</span>
              <span className="tele text-[9px] text-thread">1 / 4</span>
            </div>
            <div className="space-y-1.5">
              {[
                { task: 'Archive Fragment batch #2241', done: true },
                { task: 'Seal PAR-001 causal loop',    done: false },
                { task: 'Restore Sector 3 fragments',  done: false },
                { task: 'Stabilize Core timeline',     done: false },
              ].map(({ task, done }) => (
                <div key={task} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded border flex items-center justify-center shrink-0 ${done ? 'bg-stability/20 border-stability/40' : 'bg-white/4 border-white/12'}`}>
                    {done && <span className="text-stability text-[7px]">✓</span>}
                  </div>
                  <span className={`text-xs ${done ? 'text-white/25 line-through' : 'text-white/55'}`}>{task}</span>
                </div>
              ))}
            </div>
            <button className="mt-3 w-full py-2 rounded-lg bg-thread/8 border border-thread/15 tele text-[10px] text-thread hover:bg-thread/15 transition-colors flex items-center justify-center gap-1.5">
              View Full Mission Brief <ChevronRight size={10} />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
