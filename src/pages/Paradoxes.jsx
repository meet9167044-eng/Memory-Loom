import { useState, useEffect, useRef } from 'react'
import {
  Zap, AlertTriangle, Clock, GitBranch, Shield, CheckCircle2,
  Terminal, Lock, Radio, ChevronRight, RotateCcw, X
} from 'lucide-react'
import { paradoxesMeta } from '../data'
import { useSimulator } from '../context/SimulatorContext'

/* ════════════════════════════════════════════════════════
   PARADOX RESOLUTION LAB — Step 7
   Interactive anomaly sealing with:
   - Animated resolution stepper with confirmation gates
   - Live terminal command feed per step
   - Seal countdown animation
   - Fragment drain counter (ticking down)
   - Status transitions: unresolved → in-progress → sealed
   - Cinematic amber/bruised palette throughout
════════════════════════════════════════════════════════ */

/* Color config per severity */
const SEV = {
  critical: { text: '#C44B6E', bg: 'rgba(196,75,110,0.07)', border: 'rgba(196,75,110,0.22)', badge: 'badge-decay',    icon: AlertTriangle },
  high:     { text: '#D4923A', bg: 'rgba(212,146,58,0.07)',  border: 'rgba(212,146,58,0.22)',  badge: 'badge-thread',   icon: Zap },
  medium:   { text: '#7B5EA8', bg: 'rgba(123,94,168,0.07)', border: 'rgba(123,94,168,0.22)', badge: 'badge-paradox',  icon: Zap },
  low:      { text: '#4A8FA8', bg: 'rgba(74,143,168,0.07)', border: 'rgba(74,143,168,0.22)', badge: 'badge-stability', icon: Shield },
}

const STATUS_CFG = {
  unresolved:    { label: 'Unresolved',   color: '#C44B6E', pulse: true },
  'in-progress': { label: 'In Progress',  color: '#D4923A', pulse: true },
  monitoring:    { label: 'Monitoring',   color: '#7B5EA8', pulse: false },
  resolved:      { label: 'Resolved',     color: '#4A8FA8', pulse: false },
  sealed:        { label: 'SEALED',       color: '#4A8FA8', pulse: false },
}

/* ── Terminal command sequences per step ── */
const TERMINAL_CMDS = [
  ['> Scanning sector matrix…', '> Isolating timeline branches…', '> Branch lock: ACQUIRED', '> Quarantine barrier: ACTIVE'],
  ['> Loading fragment archive…', '> Quantum state verified…', '> Canonical state: LOCKED', '> Fragment MF-2239: ANCHORED'],
  ['> Executing paradox seal…', '> Causal loop: DISRUPTED', '> Subordinate branches: PURGED', '> Seal integrity: 94.2%'],
  ['> Post-resolution monitor: ONLINE', '> Fragment drain: MEASURING…', '> 24h watchdog: ARMED', '> Resolution complete.'],
]

/* ── Terminal Line component with typewriter ── */
function TermLine({ text, delay = 0 }) {
  const [visible, setVisible] = useState(false)
  const [chars, setChars] = useState('')
  const idxRef = useRef(0)

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(true)
      const interval = setInterval(() => {
        idxRef.current++
        setChars(text.slice(0, idxRef.current))
        if (idxRef.current >= text.length) clearInterval(interval)
      }, 20)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(t)
  }, [text, delay])

  if (!visible) return null
  return (
    <div className="tele text-[10px]" style={{ color: 'rgba(212,146,58,0.75)', lineHeight: '1.6' }}>
      {chars}
      {chars.length < text.length && (
        <span className="inline-block w-1 h-3 ml-0.5 animate-pulse" style={{ background: '#D4923A', verticalAlign: 'middle' }} />
      )}
    </div>
  )
}

/* ── Seal Countdown ── */
function SealCountdown({ duration = 5, onComplete }) {
  const [left, setLeft] = useState(duration)
  useEffect(() => {
    if (left <= 0) { onComplete?.(); return }
    const t = setTimeout(() => setLeft(l => l - 1), 1000)
    return () => clearTimeout(t)
  }, [left, onComplete])

  const progress = ((duration - left) / duration) * 100
  const r = 22, circ = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(212,146,58,0.08)" strokeWidth="3" />
          <circle
            cx="28" cy="28" r={r}
            fill="none"
            stroke="#D4923A"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ - (progress / 100) * circ}
            style={{ transition: 'stroke-dashoffset 0.9s linear', filter: 'drop-shadow(0 0 4px rgba(212,146,58,0.6))' }}
          />
        </svg>
        <span className="tele text-lg font-medium" style={{ color: '#D4923A' }}>{left}</span>
      </div>
      <p className="tele text-[9px] uppercase tracking-widest" style={{ color: 'rgba(212,146,58,0.45)' }}>
        Seal engaging…
      </p>
    </div>
  )
}

/* ── Fragment Drain Ticker ── */
function DrainTicker({ rate, stopped }) {
  const [total, setTotal] = useState(0)
  useEffect(() => {
    if (stopped || rate <= 0) return
    // Increment ~rate/hr, shown in real-time as rate/3600 per second
    const perSec = rate / 3600
    const t = setInterval(() => setTotal(n => n + perSec), 1000)
    return () => clearInterval(t)
  }, [rate, stopped])

  return (
    <div className="flex flex-col items-center p-3 rounded-xl" style={{ background: 'rgba(196,75,110,0.05)', border: '1px solid rgba(196,75,110,0.15)' }}>
      <span className="tele text-[8px] uppercase tracking-widest mb-1" style={{ color: 'rgba(196,75,110,0.5)' }}>
        {stopped ? 'Drain Stopped' : 'Fragment Drain'}
      </span>
      <span
        className="tele text-lg font-medium"
        style={{
          color: stopped ? '#4A8FA8' : '#C44B6E',
          textShadow: stopped ? '0 0 10px rgba(74,143,168,0.5)' : '0 0 10px rgba(196,75,110,0.5)',
          transition: 'color 0.8s ease'
        }}
      >
        {stopped ? '0' : `-${total.toFixed(1)}`}
      </span>
      {!stopped && (
        <span className="tele text-[8px] mt-0.5" style={{ color: 'rgba(196,75,110,0.45)' }}>/ this session</span>
      )}
      {stopped && (
        <span className="tele text-[8px] mt-0.5" style={{ color: 'rgba(74,143,168,0.55)' }}>✓ Fragment recovery active</span>
      )}
    </div>
  )
}

/* ── Resolution Stepper Detail Panel ── */
function ResolutionPanel({ paradox, onClose, onSealed }) {
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState('steps')   // 'steps' | 'countdown' | 'sealed'
  const [termKey, setTermKey] = useState(0)      // Force re-mount terminal on new step
  const [confirming, setConfirming] = useState(false)

  const p = paradox
  const cfg = SEV[p.severity]
  const Icon = cfg.icon
  const totalSteps = p.resolutionSteps.length
  const isLastStep = step === totalSteps - 1
  const cmds = TERMINAL_CMDS[Math.min(step, TERMINAL_CMDS.length - 1)]
  const isSealed = phase === 'sealed'

  const handleNext = () => {
    if (isLastStep) {
      setPhase('countdown')
    } else {
      setStep(s => s + 1)
      setTermKey(k => k + 1)
      setConfirming(false)
    }
  }

  const handleReset = () => {
    setStep(0)
    setPhase('steps')
    setTermKey(k => k + 1)
    setConfirming(false)
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* ── Panel header ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Icon size={13} style={{ color: cfg.text }} />
            <span className="tele text-[10px]" style={{ color: cfg.text }}>{p.id}</span>
            <span className="tele text-[9px]" style={{ color: 'rgba(255,220,160,0.3)' }}>·</span>
            <span className="tele text-[9px]" style={{ color: 'rgba(255,220,160,0.35)' }}>{p.sector}</span>
          </div>
          <h3 className="display text-lg font-normal" style={{ color: 'rgba(255,240,210,0.92)' }}>{p.title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {isSealed && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl" style={{ background: 'rgba(74,143,168,0.10)', border: '1px solid rgba(74,143,168,0.25)' }}>
              <Lock size={11} style={{ color: '#4A8FA8' }} />
              <span className="tele text-[9px] font-medium" style={{ color: '#4A8FA8' }}>SEALED</span>
            </div>
          )}
          <button onClick={onClose}>
            <X size={14} style={{ color: 'rgba(255,220,160,0.28)' }} />
          </button>
        </div>
      </div>

      {/* ── Description ── */}
      <p className="ui-text text-sm leading-relaxed" style={{ color: 'rgba(255,220,160,0.6)' }}>{p.description}</p>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Active Since', val: p.age,                        color: cfg.text },
          { label: 'Threads',      val: `${p.threads}`,              color: '#7B5EA8' },
          { label: 'Est. Time',    val: p.estimatedResolutionTime,   color: '#D4923A' },
        ].map(({ label, val, color }) => (
          <div key={label} className="rounded-xl text-center p-2.5" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(212,146,58,0.06)' }}>
            <span className="tele text-[11px] font-medium block" style={{ color }}>{val}</span>
            <p className="tele text-[8px] mt-0.5" style={{ color: 'rgba(212,146,58,0.3)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* ── Fragment drain ── */}
      <DrainTicker rate={p.fragLossRate} stopped={isSealed} />

      {/* ── Stepper or countdown ── */}
      {phase === 'steps' && (
        <>
          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="tele text-[9px] uppercase tracking-widest" style={{ color: 'rgba(212,146,58,0.4)' }}>Resolution Progress</span>
              <span className="tele text-[9px]" style={{ color: '#D4923A' }}>{step + 1} / {totalSteps}</span>
            </div>
            <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${((step + 1) / totalSteps) * 100}%`,
                  background: 'linear-gradient(90deg, #D4923A, #B8711A)',
                  boxShadow: '0 0 8px rgba(212,146,58,0.5)',
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
          </div>

          {/* Steps list */}
          <div className="flex-1 space-y-2 min-h-0 overflow-y-auto">
            {p.resolutionSteps.map((s, i) => {
              const isDone = i < step
              const isActive = i === step
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-all duration-300"
                  style={{
                    background: isActive
                      ? 'rgba(212,146,58,0.07)'
                      : isDone ? 'rgba(74,143,168,0.04)' : 'transparent',
                    border: isActive
                      ? '1px solid rgba(212,146,58,0.20)'
                      : isDone ? '1px solid rgba(74,143,168,0.12)' : '1px solid transparent',
                    opacity: (!isActive && !isDone) ? 0.4 : 1,
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background: isDone ? 'rgba(74,143,168,0.15)' : isActive ? 'rgba(212,146,58,0.12)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isDone ? 'rgba(74,143,168,0.4)' : isActive ? 'rgba(212,146,58,0.35)' : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    {isDone
                      ? <CheckCircle2 size={11} style={{ color: '#4A8FA8' }} />
                      : <span className="tele text-[9px]" style={{ color: isActive ? '#D4923A' : 'rgba(255,255,255,0.25)' }}>{i + 1}</span>
                    }
                  </div>
                  <p className="ui-text text-xs leading-relaxed" style={{ color: isActive ? 'rgba(255,240,210,0.85)' : isDone ? 'rgba(255,220,160,0.35)' : 'rgba(255,220,160,0.45)' }}>
                    {s}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Terminal feed */}
          <div
            className="rounded-xl p-3"
            style={{ background: 'rgba(4,2,10,0.7)', border: '1px solid rgba(212,146,58,0.08)', minHeight: '88px' }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Terminal size={9} style={{ color: 'rgba(212,146,58,0.5)' }} />
              <span className="tele text-[8px] uppercase tracking-widest" style={{ color: 'rgba(212,146,58,0.4)' }}>
                Terminal · Step {step + 1}
              </span>
            </div>
            <div key={termKey}>
              {cmds.map((cmd, i) => <TermLine key={cmd} text={cmd} delay={i * 520} />)}
            </div>
          </div>

          {/* Technical note */}
          <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(196,75,110,0.04)', border: '1px solid rgba(196,75,110,0.10)' }}>
            <p className="tele text-[8px] uppercase tracking-widest mb-1" style={{ color: 'rgba(196,75,110,0.45)' }}>Risk if unresolved</p>
            <p className="ui-text text-xs" style={{ color: 'rgba(255,200,160,0.5)' }}>{p.riskIfUnresolved}</p>
          </div>

          {/* Action buttons */}
          {!confirming ? (
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => isLastStep ? setConfirming(true) : handleNext()}
                className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
                style={{
                  background: isLastStep ? 'rgba(212,146,58,0.14)' : 'rgba(212,146,58,0.08)',
                  border: `1px solid ${isLastStep ? 'rgba(212,146,58,0.35)' : 'rgba(212,146,58,0.18)'}`,
                  color: '#D4923A',
                  boxShadow: isLastStep ? '0 0 16px rgba(212,146,58,0.12)' : 'none',
                }}
              >
                <span className="display text-xs font-normal" style={{ letterSpacing: '0.04em' }}>
                  {isLastStep ? 'Initiate Final Seal' : 'Execute Step'}
                </span>
                <ChevronRight size={12} />
              </button>
              {step > 0 && (
                <button
                  onClick={handleReset}
                  className="px-3 py-3 rounded-xl transition-colors"
                  style={{ border: '1px solid rgba(212,146,58,0.08)', color: 'rgba(212,146,58,0.35)' }}
                >
                  <RotateCcw size={13} />
                </button>
              )}
            </div>
          ) : (
            /* Confirm seal gate */
            <div className="rounded-xl p-4" style={{ background: 'rgba(196,75,110,0.06)', border: '1px solid rgba(196,75,110,0.20)' }}>
              <p className="display text-sm font-normal mb-1" style={{ color: '#C44B6E' }}>Confirm Final Seal</p>
              <p className="ui-text text-xs mb-3" style={{ color: 'rgba(255,200,160,0.55)' }}>
                This action is irreversible. The paradox will be permanently sealed and all related branches purged.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleNext}
                  className="flex-1 py-2.5 rounded-xl transition-all duration-200"
                  style={{ background: 'rgba(196,75,110,0.18)', border: '1px solid rgba(196,75,110,0.4)', color: '#C44B6E' }}
                >
                  <span className="display text-xs font-normal">Confirm Seal</span>
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  className="flex-1 py-2.5 rounded-xl transition-all duration-200"
                  style={{ border: '1px solid rgba(212,146,58,0.12)', color: 'rgba(255,220,160,0.4)' }}
                >
                  <span className="display text-xs font-normal">Cancel</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Countdown phase ── */}
      {phase === 'countdown' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <Radio size={12} style={{ color: '#D4923A' }} className="animate-pulse" />
            <span className="tele text-[10px] uppercase tracking-widest" style={{ color: 'rgba(212,146,58,0.6)' }}>
              Paradox Seal Engaging
            </span>
          </div>
          <SealCountdown
            duration={6}
            onComplete={() => { setPhase('sealed'); onSealed?.(p.id) }}
          />
          <p className="tele text-[9px] text-center max-w-xs" style={{ color: 'rgba(212,146,58,0.3)' }}>
            All conflicting branches are being purged. Do not interrupt the seal process.
          </p>
        </div>
      )}

      {/* ── Sealed phase ── */}
      {phase === 'sealed' && (
        <div className="flex-1 flex flex-col gap-4">
          {/* Success banner */}
          <div
            className="rounded-xl p-5 flex flex-col items-center text-center gap-3"
            style={{ background: 'rgba(74,143,168,0.07)', border: '1px solid rgba(74,143,168,0.20)' }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(74,143,168,0.12)', border: '1px solid rgba(74,143,168,0.30)' }}
            >
              <Lock size={22} style={{ color: '#4A8FA8', filter: 'drop-shadow(0 0 8px rgba(74,143,168,0.6))' }} />
            </div>
            <div>
              <p className="display text-base font-normal mb-1" style={{ color: '#4A8FA8' }}>Paradox Sealed</p>
              <p className="tele text-[10px]" style={{ color: 'rgba(74,143,168,0.6)' }}>{p.id} · {p.sector}</p>
            </div>
          </div>

          {/* Recovery stats */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Steps Completed', val: `${totalSteps}/${totalSteps}`, color: '#4A8FA8' },
              { label: 'Drain Stopped',   val: p.fragLossRate > 0 ? p.fragLoss : 'None', color: '#4A8FA8' },
              { label: 'Threads Freed',   val: `${p.threads}`, color: '#D4923A' },
              { label: 'Status',          val: 'SEALED',       color: '#4A8FA8' },
            ].map(({ label, val, color }) => (
              <div key={label} className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(74,143,168,0.04)', border: '1px solid rgba(74,143,168,0.10)' }}>
                <span className="tele text-[11px] font-medium block" style={{ color }}>{val}</span>
                <p className="tele text-[8px] mt-0.5" style={{ color: 'rgba(255,220,160,0.28)' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Final terminal */}
          <div
            className="rounded-xl p-3 flex-1"
            style={{ background: 'rgba(4,2,10,0.7)', border: '1px solid rgba(74,143,168,0.10)' }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <CheckCircle2 size={9} style={{ color: '#4A8FA8' }} />
              <span className="tele text-[8px] uppercase tracking-widest" style={{ color: 'rgba(74,143,168,0.5)' }}>Resolution Log</span>
            </div>
            {[
              `> ${p.id} paradox seal: COMPLETE`,
              `> ${p.threads} thread branches: PURGED`,
              p.fragLossRate > 0 ? `> Fragment drain ${p.fragLoss}: STOPPED` : `> No active drain: STABLE`,
              '> Memory Loom integrity: RECOVERING…',
              '> Watchdog monitor: ARMED',
            ].map((cmd, i) => (
              <TermLine key={cmd} text={cmd} delay={i * 300} />
            ))}
          </div>

          <button
            onClick={handleReset}
            className="py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
            style={{ border: '1px solid rgba(212,146,58,0.12)', color: 'rgba(212,146,58,0.5)' }}
          >
            <RotateCcw size={12} />
            <span className="display text-xs font-normal">Reset for Re-simulation</span>
          </button>
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   MAIN PARADOXES PAGE
════════════════════════════════════════════════════════ */
export default function Paradoxes() {
  const { state: sim, sealParadox } = useSimulator()
  const [selected, setSelected]   = useState(null)

  const selParadox = selected ? sim.paradoxes.find(p => p.id === selected) : null

  const handleSealed = (id) => {
    sealParadox(id)
  }

  return (
    <div className="p-5 space-y-4">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="display text-xl font-normal" style={{ color: 'rgba(255,240,210,0.9)' }}>
            Anomaly Detection Lab
          </h2>
          <p className="tele text-[10px] mt-1" style={{ color: 'rgba(212,146,58,0.38)' }}>
            {sim.paradoxesActive} active paradoxes · {sim.paradoxesCritical} critical · {sim.totalFragDrain ? sim.totalFragDrain.toLocaleString() : '2,528'} frags/hr total drain
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: 'rgba(196,75,110,0.07)', border: '1px solid rgba(196,75,110,0.18)' }}
        >
          <AlertTriangle size={11} style={{ color: '#C44B6E' }} className="animate-pulse" />
          <span className="tele text-[10px]" style={{ color: '#C44B6E' }}>Drain Rate Critical</span>
        </div>
      </div>

      {/* ── Severity summary ── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Critical', count: sim.paradoxesCritical, sev: 'critical' },
          { label: 'High',     count: paradoxesMeta.high,     sev: 'high' },
          { label: 'Medium',   count: paradoxesMeta.medium,   sev: 'medium' },
          { label: 'Low',      count: paradoxesMeta.low,      sev: 'low' },
        ].map(({ label, count, sev }) => {
          const cfg = SEV[sev]
          return (
            <div
              key={label}
              className="loom-card p-3 text-center"
              style={{ borderColor: cfg.border }}
            >
              <p className="display text-xl font-normal" style={{ color: cfg.text }}>{count}</p>
              <p className="tele text-[9px] mt-0.5" style={{ color: 'rgba(255,220,160,0.3)' }}>{label}</p>
            </div>
          )
        })}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

        {/* ── Paradox list ── */}
        <div className="xl:col-span-2 space-y-2">
          {sim.paradoxes.map(p => {
            const cfg = SEV[p.severity]
            const Icon = cfg.icon
            const isSelected = selected === p.id
            const isSessionSealed = sim.sealedParadoxes.has(p.id)
            const statusCfg = STATUS_CFG[isSessionSealed ? 'sealed' : p.status]

            return (
              <button
                key={p.id}
                onClick={() => setSelected(isSelected ? null : p.id)}
                className="w-full text-left loom-card p-4 transition-all duration-200"
                style={{
                  borderColor: isSelected ? cfg.border : 'rgba(212,146,58,0.1)',
                  background: isSelected
                    ? cfg.bg
                    : isSessionSealed ? 'rgba(74,143,168,0.03)' : 'rgba(16,10,26,0.72)',
                  boxShadow: isSelected ? `0 0 20px ${cfg.text}12` : undefined,
                }}
              >
                {/* Row 1: ID + badge */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon size={12} style={{ color: isSessionSealed ? '#4A8FA8' : cfg.text }} />
                    <span className="tele text-[10px]" style={{ color: 'rgba(255,220,160,0.4)' }}>{p.id}</span>
                    <div className="flex items-center gap-1">
                      {statusCfg.pulse && !isSessionSealed && (
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: statusCfg.color, display: 'inline-block' }} />
                      )}
                      <span className="tele text-[9px]" style={{ color: isSessionSealed ? '#4A8FA8' : statusCfg.color }}>
                        {statusCfg.label}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`${cfg.badge} tele text-[8px] px-1.5 py-0.5 rounded-full uppercase`}
                    style={isSessionSealed ? { background: 'rgba(74,143,168,0.10)', color: '#4A8FA8', border: '1px solid rgba(74,143,168,0.20)' } : undefined}
                  >
                    {isSessionSealed ? 'sealed' : p.severity}
                  </span>
                </div>

                {/* Row 2: Title */}
                <p
                  className="ui-text text-sm font-medium mb-2"
                  style={{ color: isSessionSealed ? 'rgba(255,220,160,0.35)' : 'rgba(255,240,210,0.85)', textDecoration: isSessionSealed ? 'line-through' : 'none' }}
                >
                  {p.title}
                </p>

                {/* Row 3: Meta */}
                <div className="flex items-center gap-3">
                  <span className="tele text-[9px] flex items-center gap-1" style={{ color: 'rgba(212,146,58,0.35)' }}>
                    <Clock size={8} />{p.age}
                  </span>
                  <span className="tele text-[9px] flex items-center gap-1" style={{ color: 'rgba(212,146,58,0.35)' }}>
                    <GitBranch size={8} />{p.threads} threads
                  </span>
                  <span
                    className="tele text-[9px] ml-auto"
                    style={{ color: p.fragLossRate > 0 && !isSessionSealed ? '#C44B6E' : 'rgba(255,220,160,0.25)' }}
                  >
                    {isSessionSealed ? '0/hr' : p.fragLossRate > 0 ? `-${p.fragLoss}` : 'Stable'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* ── Detail / Resolution Panel ── */}
        <div className="xl:col-span-3 loom-card p-5 flex flex-col" style={{ minHeight: '600px' }}>
          {selParadox ? (
            <ResolutionPanel
              key={selParadox.id}
              paradox={selParadox}
              onClose={() => setSelected(null)}
              onSealed={handleSealed}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(123,94,168,0.08)', border: '1px solid rgba(123,94,168,0.15)' }}
              >
                <Zap size={24} style={{ color: 'rgba(123,94,168,0.4)' }} />
              </div>
              <div>
                <p className="display text-sm font-normal mb-1" style={{ color: 'rgba(255,220,160,0.45)' }}>
                  Select a paradox to begin
                </p>
                <p className="tele text-[10px]" style={{ color: 'rgba(212,146,58,0.25)' }}>
                  Resolution Lab · Ω-Level Access Required
                </p>
              </div>
              {sim.sealedParadoxes.size > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: 'rgba(74,143,168,0.07)', border: '1px solid rgba(74,143,168,0.15)' }}>
                  <CheckCircle2 size={12} style={{ color: '#4A8FA8' }} />
                  <span className="tele text-[10px]" style={{ color: 'rgba(74,143,168,0.75)' }}>
                    {sim.sealedParadoxes.size} paradox{sim.sealedParadoxes.size > 1 ? 'es' : ''} sealed this session
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
