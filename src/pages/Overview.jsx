import { useState, useEffect, useRef } from 'react'
import { AlertTriangle, Zap, Clock, GitBranch, Brain, Activity, Radio, Heart, MessageSquare, ChevronRight } from 'lucide-react'
import { dashStats, events, mission } from '../data'
import LoomCanvas from '../components/loom-canvas/LoomCanvas'
import EmberBar from '../components/ui/EmberBar'
import { useSimulator } from '../context/SimulatorContext'

/* ══════════════════════════════════════════════════
   ANIMATED COUNTER
══════════════════════════════════════════════════ */
function AnimatedCounter({ to, suffix = '', decimals = 1, duration = 2000 }) {
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

/* ══════════════════════════════════════════════════
   BREATHING INTEGRITY RING
══════════════════════════════════════════════════ */
function IntegrityRing({ value }) {
  const r = 46
  const circ = 2 * Math.PI * r
  const [dash, setDash] = useState(0)
  const [tremor, setTremor] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setDash((value / 100) * circ), 250)
    return () => clearTimeout(t)
  }, [value, circ])

  // Tremor on critical
  useEffect(() => {
    if (value >= 50) return
    const interval = setInterval(() => {
      setTremor((Math.random() - 0.5) * 1.5)
      setTimeout(() => setTremor(0), 180)
    }, 2800)
    return () => clearInterval(interval)
  }, [value])

  const color = value < 35 ? '#C44B6E' : value < 60 ? '#D4923A' : '#4A8FA8'

  return (
    <div className="relative flex items-center justify-center w-28 h-28">
      <svg
        className="absolute inset-0 w-full h-full -rotate-90 integrity-ring-svg"
        viewBox="0 0 112 112"
        style={{
          '--ring-color': color,
          transform: `rotate(-90deg) translate(${tremor}px, ${tremor * 0.5}px)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        {/* Track */}
        <circle cx="56" cy="56" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
        {/* Glow track */}
        <circle
          cx="56" cy="56" r={r}
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.12"
        />
        {/* Fill arc */}
        <circle
          cx="56" cy="56" r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - dash}
          style={{
            transition: 'stroke-dashoffset 2s cubic-bezier(0.4,0,0.2,1)',
            filter: `drop-shadow(0 0 6px ${color}88)`,
          }}
        />
      </svg>

      {/* Centre reading */}
      <div className="flex flex-col items-center z-10">
        <span
          className="display text-xl font-normal"
          style={{ color, letterSpacing: '-0.04em', textShadow: `0 0 20px ${color}60` }}
        >
          <AnimatedCounter to={value} suffix="%" />
        </span>
        <span className="tele text-[8px] mt-0.5 uppercase tracking-widest" style={{ color: 'rgba(255,200,120,0.35)' }}>
          INT
        </span>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   EMOTION BAR
══════════════════════════════════════════════════ */
function EmotionBar({ label, value, color }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 300)
    return () => clearTimeout(t)
  }, [value])

  return (
    <div className="flex items-center gap-3 mb-2.5">
      <span className="display text-[11px] w-14 shrink-0 font-normal" style={{ color: 'rgba(255,220,160,0.5)' }}>
        {label}
      </span>
      <div className="flex-1 relative h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${width}%`,
            background: color,
            boxShadow: `0 0 6px ${color}55`,
            transition: 'width 1.6s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>
      <span className="tele text-[9px] w-7 text-right shrink-0" style={{ color }}>
        {value}
      </span>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   ALERT ITEM — Fade + blur in
══════════════════════════════════════════════════ */
function AlertItem({ type, message, time, index = 0 }) {
  const cfg = {
    critical: { dot: '#C44B6E', badge: 'badge-decay',    label: 'Critical' },
    warn:     { dot: '#D4923A', badge: 'badge-warn',     label: 'Warning' },
    info:     { dot: '#4A8FA8', badge: 'badge-stability', label: 'Restored' },
    anomaly:  { dot: '#7B5EA8', badge: 'badge-paradox',  label: 'Anomaly' },
  }[type] || { dot: '#D4923A', badge: 'badge-thread', label: 'Notice' }

  return (
    <div
      className="alert-entry flex items-start gap-2.5 py-2.5"
      style={{
        borderBottom: '1px solid rgba(212,146,58,0.05)',
        animationDelay: `${index * 80}ms`,
      }}
    >
      <div
        className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
        style={{ background: cfg.dot, boxShadow: `0 0 6px ${cfg.dot}80` }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs leading-snug" style={{ color: 'rgba(255,230,180,0.7)' }}>{message}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="tele text-[9px]" style={{ color: 'rgba(212,146,58,0.3)' }}>{time}</span>
          <span className={`${cfg.badge} tele text-[8px] px-1 py-0.5 rounded ml-auto`}>{cfg.label}</span>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   TIMELINE ROW — Blur-in entry
══════════════════════════════════════════════════ */
function TimelineRow({ time, event: ev, type, sector, index = 0 }) {
  const cfg = {
    breach:   { dot: '#C44B6E', badge: 'badge-decay',    label: 'Breach' },
    restored: { dot: '#4A8FA8', badge: 'badge-stability', label: 'Restored' },
    anomaly:  { dot: '#7B5EA8', badge: 'badge-paradox',  label: 'Anomaly' },
    warn:     { dot: '#D4923A', badge: 'badge-warn',     label: 'Warning' },
  }[type] || {}

  return (
    <div
      className="alert-entry flex items-start gap-3 py-2 border-b"
      style={{
        borderBottomColor: 'rgba(212,146,58,0.04)',
        animationDelay: `${index * 60}ms`,
      }}
    >
      <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: cfg.dot, boxShadow: `0 0 5px ${cfg.dot}70` }} />
      <div className="flex-1 min-w-0">
        <p className="text-xs leading-snug" style={{ color: 'rgba(255,230,180,0.65)' }}>{ev}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="tele text-[9px]" style={{ color: 'rgba(212,146,58,0.28)' }}>{time}</span>
          <span className="tele text-[9px]" style={{ color: 'rgba(212,146,58,0.2)' }}>·</span>
          <span className="tele text-[9px]" style={{ color: 'rgba(212,146,58,0.28)' }}>{sector}</span>
          <span className={`${cfg.badge} tele text-[8px] px-1 py-0.5 rounded ml-auto`}>{cfg.label}</span>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   OVERVIEW PAGE
══════════════════════════════════════════════════ */
export default function Overview() {
  const { state: sim } = useSimulator()
  const completedObjectives = mission.objectives.filter(o => o.done).length
  const totalObjectives = mission.objectives.length

  const INTEGRITY = sim.integrity

  const ALERTS = sim.events
    .filter(e => e.severity === 'critical' || e.severity === 'high' || e.severity === 'warn')
    .slice(0, 6)
    .map(e => ({
      type: e.severity === 'critical' ? 'critical' : e.type,
      message: e.message || e.event,
      time: e.time,
    }))

  const EMOTIONS = [
    { label: 'Despair',  value: mission.emotionIndex.despair,  color: '#C44B6E' },
    { label: 'Hope',     value: mission.emotionIndex.hope,     color: '#4A8FA8' },
    { label: 'Clarity',  value: mission.emotionIndex.clarity,  color: '#7B5EA8' },
    { label: 'Fear',     value: mission.emotionIndex.fear,     color: '#D4923A' },
    { label: 'Resolve',  value: mission.emotionIndex.resolve,  color: '#B8A060' },
  ]

  const TIMELINE_EVENTS = sim.events.slice(0, 8).map(e => ({
    time: e.time,
    event: e.message || e.event,
    type: e.type,
    sector: e.sector,
  }))

  /* Stat cards */
  const statCards = [
    {
      icon: Brain,
      label: 'Fragments',
      value: sim.fragmentsTotal.toLocaleString(),
      sub: `↓ ${sim.fragmentsLost} since sync`,
      color: '#C44B6E',
    },
    {
      icon: GitBranch,
      label: 'Timelines',
      value: sim.timelinesActive.toLocaleString(),
      sub: `${sim.timelinesDivergent} divergent`,
      color: '#D4923A',
    },
    {
      icon: Zap,
      label: 'Paradoxes',
      value: sim.paradoxesActive.toLocaleString(),
      sub: `${sim.paradoxesCritical} critical`,
      color: '#7B5EA8',
    },
    {
      icon: Clock,
      label: 'Time Left',
      value: `${sim.hoursRemaining}h ${sim.minutesRemaining}m`,
      sub: 'Until city erasure',
      color: '#C44B6E',
    },
  ]

  return (
    <div className="p-4 h-full">

      {/* ── Quick-stat bar ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {statCards.map(({ icon: Icon, label, value, sub, color }) => (
          <div
            key={label}
            className="loom-card px-3 py-2.5 flex items-center gap-3 group"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${color}15`, border: `1px solid ${color}25` }}
            >
              <Icon size={13} style={{ color }} />
            </div>
            <div>
              <div
                className="display text-base font-normal"
                style={{ color, letterSpacing: '-0.03em', textShadow: `0 0 12px ${color}40` }}
              >
                {value}
              </div>
              <div className="tele text-[9px]" style={{ color: 'rgba(212,146,58,0.32)' }}>
                {label} · {sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main 3-column grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4" style={{ minHeight: 'calc(100vh - 200px)' }}>

        {/* ─── LEFT — Integrity + Alerts + Emotion ─── */}
        <div className="xl:col-span-3 flex flex-col gap-4">

          {/* Reality Integrity */}
          <div className="loom-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span
                className="display text-xs font-normal uppercase tracking-wide"
                style={{ color: 'rgba(255,220,160,0.55)', letterSpacing: '0.12em' }}
              >
                Reality Integrity
              </span>
              <div className="flex items-center gap-1.5">
                <Radio size={9} style={{ color: '#C44B6E' }} className="animate-pulse" />
                <span className="tele text-[8px] uppercase" style={{ color: '#C44B6E' }}>Critical</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <IntegrityRing value={INTEGRITY} />
              <div className="flex flex-col gap-2.5 flex-1">
                {[
                  { label: 'Target', val: `${sim.integrityTarget}%`,  color: '#4A8FA8' },
                  { label: 'Gap',    val: `−${Math.max(0, sim.integrityTarget - INTEGRITY).toFixed(1)}%`, color: '#C44B6E' },
                  { label: 'Rate',   val: `${sim.decayRate}%/h`, color: '#D4923A' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="tele text-[9px]" style={{ color: 'rgba(212,146,58,0.32)' }}>{label}</span>
                    <span className="tele text-[10px] font-medium" style={{ color }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <EmberBar value={INTEGRITY} height={5} />
              <p className="tele text-[8px] mt-2" style={{ color: 'rgba(196,75,110,0.55)' }}>
                ⚠ Restore before the city vanishes
              </p>
            </div>
          </div>

          {/* Alerts */}
          <div className="loom-card p-4 flex flex-col" style={{ maxHeight: '280px' }}>
            <div className="flex items-center justify-between mb-2 shrink-0">
              <div className="flex items-center gap-2">
                <AlertTriangle size={11} style={{ color: '#C44B6E' }} />
                <span className="display text-xs font-normal uppercase tracking-wide" style={{ color: 'rgba(255,220,160,0.55)', letterSpacing: '0.1em' }}>
                  Alerts
                </span>
              </div>
              <span
                className="tele text-[8px] px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(196,75,110,0.12)', color: '#C44B6E', border: '1px solid rgba(196,75,110,0.22)' }}
              >
                {ALERTS.filter(a => a.type === 'critical').length} critical
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {ALERTS.map((a, i) => <AlertItem key={i} {...a} index={i} />)}
            </div>
          </div>

          {/* Emotion Index */}
          <div className="loom-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Heart size={11} style={{ color: '#7B5EA8' }} />
              <span className="display text-xs font-normal uppercase tracking-wide" style={{ color: 'rgba(255,220,160,0.55)', letterSpacing: '0.1em' }}>
                Emotion Index
              </span>
            </div>
            {EMOTIONS.map(e => <EmotionBar key={e.label} {...e} />)}
            <p className="tele text-[8px] mt-2" style={{ color: 'rgba(212,146,58,0.22)' }}>
              {mission.emotionIndex.description.slice(0, 60)}…
            </p>
          </div>
        </div>

        {/* ─── CENTRE — Living Loom Canvas ─── */}
        <div className="xl:col-span-6 loom-card flex flex-col overflow-hidden">
          {/* Canvas header */}
          <div
            className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0"
            style={{ borderBottom: '1px solid rgba(212,146,58,0.06)' }}
          >
            <div className="flex items-center gap-2">
              <Activity size={12} style={{ color: '#D4923A' }} />
              <span className="display text-xs font-normal uppercase tracking-wide" style={{ color: 'rgba(255,220,160,0.55)', letterSpacing: '0.1em' }}>
                Loom Canvas
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#D4923A' }} />
                <span className="tele text-[9px]" style={{ color: 'rgba(212,146,58,0.5)' }}>Live</span>
              </div>
              <span className="tele text-[8px]" style={{ color: 'rgba(212,146,58,0.2)' }}>
                Thread Integrity Visualization
              </span>
            </div>
          </div>

          {/* The living canvas */}
          <div className="flex-1 min-h-0 loom-canvas-area" style={{ minHeight: '320px' }}>
            <LoomCanvas />
          </div>

          {/* Canvas stats footer */}
          <div
            className="grid grid-cols-3 border-t shrink-0"
            style={{ borderTopColor: 'rgba(212,146,58,0.06)' }}
          >
            {[
              { label: 'Active Threads',  value: dashStats.timelinesActive.toLocaleString(), color: '#D4923A' },
              { label: 'Fragment Nodes',  value: dashStats.fragmentsTotal.toLocaleString(),  color: '#B8A060' },
              { label: 'Paradox Anchors', value: dashStats.paradoxesActive.toLocaleString(), color: '#7B5EA8' },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="flex flex-col items-center py-3 border-r last:border-0"
                style={{ borderRightColor: 'rgba(212,146,58,0.05)' }}
              >
                <span className="display text-sm font-normal" style={{ color, textShadow: `0 0 8px ${color}40` }}>{value}</span>
                <span className="tele text-[8px] mt-0.5" style={{ color: 'rgba(212,146,58,0.25)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── RIGHT — Event feed + Mission ─── */}
        <div className="xl:col-span-3 loom-card p-4 flex flex-col">
          {/* Live event feed */}
          <div className="flex items-center justify-between mb-3 shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare size={11} style={{ color: '#4A8FA8' }} />
              <span className="display text-xs font-normal uppercase tracking-wide" style={{ color: 'rgba(255,220,160,0.55)', letterSpacing: '0.1em' }}>
                Event Feed
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#C44B6E' }} />
              <span className="tele text-[9px]" style={{ color: '#C44B6E' }}>Live</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {TIMELINE_EVENTS.map((ev, i) => <TimelineRow key={i} {...ev} index={i} />)}
          </div>

          {/* Mission progress */}
          <div
            className="mt-3 pt-3 shrink-0"
            style={{ borderTop: '1px solid rgba(212,146,58,0.07)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="tele text-[9px] uppercase tracking-widest" style={{ color: 'rgba(212,146,58,0.32)' }}>
                Mission Progress
              </span>
              <span className="tele text-[9px] font-medium" style={{ color: '#D4923A' }}>
                {completedObjectives} / {totalObjectives}
              </span>
            </div>

            {/* Mission progress bar */}
            <EmberBar value={Math.round((completedObjectives / totalObjectives) * 100)} height={3} />

            {/* Objectives */}
            <div className="space-y-2 mt-3">
              {mission.objectives.slice(0, 4).map(({ task, done }) => (
                <div key={task} className="flex items-start gap-2">
                  <div
                    className="w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background: done ? 'rgba(74,143,168,0.15)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${done ? 'rgba(74,143,168,0.4)' : 'rgba(212,146,58,0.12)'}`,
                    }}
                  >
                    {done && <span style={{ color: '#4A8FA8', fontSize: '7px' }}>✓</span>}
                  </div>
                  <span
                    className="ui-text text-xs leading-snug"
                    style={{ color: done ? 'rgba(255,220,160,0.22)' : 'rgba(255,220,160,0.6)', textDecoration: done ? 'line-through' : 'none' }}
                  >
                    {task}
                  </span>
                </div>
              ))}
            </div>

            {/* View mission button */}
            <button
              className="mt-3 w-full py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 group"
              style={{
                background: 'rgba(212,146,58,0.06)',
                border: '1px solid rgba(212,146,58,0.14)',
                color: 'rgba(212,146,58,0.7)',
              }}
            >
              <span className="display text-xs font-normal" style={{ letterSpacing: '0.04em' }}>
                View Full Mission Brief
              </span>
              <ChevronRight size={10} style={{ color: '#D4923A' }} />
            </button>

            {/* Codex quote */}
            <p
              className="display text-[10px] italic text-center mt-3 leading-relaxed"
              style={{ color: 'rgba(212,146,58,0.22)', fontStyle: 'italic' }}
            >
              "{mission.codex[0]}"
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
