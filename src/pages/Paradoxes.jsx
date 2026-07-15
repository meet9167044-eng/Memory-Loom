import { useState } from 'react'
import { Zap, AlertTriangle, Clock, GitBranch, ChevronRight, Shield } from 'lucide-react'
import { paradoxes, paradoxesMeta, getFragment, getTimeline } from '../data'

const SEV_CONFIG = {
  critical: { color: 'text-decay',    border: 'border-decay/25 bg-decay/5',    badge: 'badge-decay',    icon: AlertTriangle },
  high:     { color: 'text-thread',   border: 'border-thread/25 bg-thread/5',  badge: 'badge-thread',   icon: Zap },
  medium:   { color: 'text-paradox',  border: 'border-paradox/25 bg-paradox/5',badge: 'badge-paradox',  icon: Zap },
  low:      { color: 'text-stability',border: 'border-stability/20 bg-stability/3',badge: 'badge-stability',icon: Shield },
}

const STATUS_LABEL = {
  unresolved:  { label: 'Unresolved',  color: 'text-decay' },
  'in-progress': { label: 'In Progress', color: 'text-thread' },
  monitoring:  { label: 'Monitoring',  color: 'text-paradox' },
  resolved:    { label: 'Resolved',    color: 'text-stability' },
}

export default function Paradoxes() {
  const [selected, setSelected] = useState(null)
  const [step, setStep]         = useState(0)

  const selParadox = selected ? paradoxes.find((p) => p.id === selected) : null

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="display text-xl text-white font-normal">Anomaly Detection Lab</h2>
          <p className="tele text-[11px] text-white/30 mt-1">
            {paradoxesMeta.total} active paradoxes · {paradoxesMeta.critical} critical priority · Total fragment drain: {paradoxesMeta.totalFragDrain.toLocaleString()}/hr
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-decay/20 bg-decay/8">
          <AlertTriangle size={13} className="text-decay animate-pulse" />
          <span className="tele text-[10px] text-decay">Drain Rate Critical</span>
        </div>
      </div>

      {/* Severity summary row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Critical', count: paradoxesMeta.critical, color: 'text-decay',    border: 'border-decay/20 bg-decay/5' },
          { label: 'High',     count: paradoxesMeta.high,     color: 'text-thread',   border: 'border-thread/20 bg-thread/5' },
          { label: 'Medium',   count: paradoxesMeta.medium,   color: 'text-paradox',  border: 'border-paradox/20 bg-paradox/5' },
          { label: 'Low',      count: paradoxesMeta.low,      color: 'text-stability',border: 'border-stability/20 bg-stability/5' },
        ].map(({ label, count, color, border }) => (
          <div key={label} className={`loom-card p-3 text-center border ${border}`}>
            <p className={`display text-xl font-normal ${color}`}>{count}</p>
            <p className="tele text-[9px] text-white/30 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* List */}
        <div className="xl:col-span-2 space-y-3">
          {paradoxes.map((p) => {
            const cfg = SEV_CONFIG[p.severity]
            const Icon = cfg.icon
            const isSelected = selected === p.id
            const st = STATUS_LABEL[p.status]
            return (
              <button
                key={p.id}
                onClick={() => { setSelected(isSelected ? null : p.id); setStep(0) }}
                className={`w-full text-left loom-card p-4 border transition-all ${cfg.border} ${isSelected ? 'ring-1 ring-thread/30' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon size={13} className={cfg.color} />
                    <span className="tele text-[10px] text-white/40">{p.id}</span>
                    <span className={`tele text-[9px] ${st.color}`}>· {st.label}</span>
                  </div>
                  <span className={`${cfg.badge} tele text-[9px] px-1.5 py-0.5 rounded-full uppercase`}>{p.severity}</span>
                </div>
                <p className="text-sm text-white/80 font-medium mb-1">{p.title}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="tele text-[9px] text-white/30 flex items-center gap-1"><Clock size={9} />{p.age}</span>
                  <span className="tele text-[9px] text-white/30 flex items-center gap-1"><GitBranch size={9} />{p.threads} threads</span>
                  <span className={`tele text-[9px] ml-auto ${p.fragLossRate > 0 ? 'text-decay' : 'text-white/30'}`}>
                    {p.fragLossRate > 0 ? `-${p.fragLoss}` : 'Stable'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Detail panel */}
        <div className="xl:col-span-3 loom-card p-5 flex flex-col">
          {selParadox ? (() => {
            const p = selParadox
            const cfg = SEV_CONFIG[p.severity]
            return (
              <>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className={`tele text-[10px] ${cfg.color}`}>{p.id} · {p.sector}</span>
                    <h3 className="display text-lg text-white font-normal mt-1">{p.title}</h3>
                  </div>
                  <span className={`${cfg.badge} tele text-[9px] px-2 py-1 rounded-full uppercase`}>{p.severity}</span>
                </div>

                {/* Description */}
                <p className="text-sm text-white/60 leading-relaxed mb-4">{p.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Active Since',     val: p.age,      color: cfg.color },
                    { label: 'Threads Affected', val: `${p.threads}`, color: 'text-paradox' },
                    { label: 'Fragment Drain',   val: p.fragLossRate > 0 ? p.fragLoss : 'None', color: p.fragLossRate > 0 ? 'text-decay' : 'text-stability' },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="p-3 rounded-lg bg-white/3 border border-white/6 text-center">
                      <span className={`tele text-sm font-medium ${color}`}>{val}</span>
                      <p className="tele text-[9px] text-white/30 mt-1">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Technical note */}
                <div className="p-3 rounded-lg bg-white/3 border border-white/6 mb-4">
                  <p className="tele text-[9px] text-white/30 uppercase tracking-widest mb-1">Technical Analysis</p>
                  <p className="text-xs text-white/55 leading-relaxed">{p.technicalNote}</p>
                </div>

                {/* Resolution steps */}
                <div className="flex-1 mb-4">
                  <p className="tele text-[9px] text-white/30 uppercase tracking-widest mb-2">Resolution Steps</p>
                  <div className="space-y-1.5">
                    {p.resolutionSteps.map((s, i) => (
                      <div key={i} className={`flex items-start gap-2.5 p-2 rounded-lg ${i === step ? 'bg-thread/8 border border-thread/20' : 'opacity-50'}`}>
                        <span className={`tele text-[9px] w-4 shrink-0 mt-0.5 ${i === step ? 'text-thread' : 'text-white/25'}`}>{i + 1}</span>
                        <p className="text-xs text-white/65">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk */}
                <div className="p-2.5 rounded-lg bg-decay/5 border border-decay/15 mb-4">
                  <p className="tele text-[9px] text-decay/60 mb-0.5">Risk if Unresolved</p>
                  <p className="text-xs text-decay/80">{p.riskIfUnresolved}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setStep((s) => Math.min(s + 1, p.resolutionSteps.length - 1))}
                    className="flex-1 py-2.5 rounded-lg bg-stability/10 border border-stability/20 text-sm text-stability hover:bg-stability/20 transition-colors flex items-center justify-center gap-2"
                  >
                    {step < p.resolutionSteps.length - 1 ? 'Next Step' : 'Finalise Seal'}
                    <ChevronRight size={13} />
                  </button>
                  <button className="px-4 py-2.5 rounded-lg border border-white/8 text-sm text-white/40 hover:text-white/60 transition-colors">
                    Defer
                  </button>
                </div>
              </>
            )
          })() : (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
              <Zap size={32} className="text-white/10" />
              <p className="text-sm text-white/25">Select a paradox to view details and begin resolution</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
