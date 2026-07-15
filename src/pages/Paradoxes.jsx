import { Zap, AlertTriangle, Clock, GitBranch, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const PARADOXES = [
  {
    id: 'PAR-001',
    severity: 'critical',
    title: 'Verdana Dual-State Paradox',
    desc: 'The Battle of Verdana is simultaneously recorded as both a decisive victory and a catastrophic defeat across 7 conflicting timeline branches, creating a recursive causality loop that is erasing 2,100 fragments per hour.',
    age: '2d 14h',
    threads: 7,
    fragLoss: '2,100/hr',
    sector: 'Sec-1',
    status: 'unresolved',
  },
  {
    id: 'PAR-002',
    severity: 'high',
    title: 'Mira Chen Duplicate Identity',
    desc: 'Subject "Mira Chen" appears with contradictory biographical records across Sector 3 and Sector 9. Quantum identity collapse imminent if not reconciled within 72 hours.',
    age: '5d 6h',
    threads: 3,
    fragLoss: '340/hr',
    sector: 'Sec-3 / Sec-9',
    status: 'in-progress',
  },
  {
    id: 'PAR-003',
    severity: 'medium',
    title: 'Void Core Echo Cascade',
    desc: 'Temporal echo signals from the Core are amplifying a feedback loop in 4 connected thread strands, degrading coherence across adjacent sectors.',
    age: '18h',
    threads: 4,
    fragLoss: '88/hr',
    sector: 'Core',
    status: 'unresolved',
  },
]

const SEV_CONFIG = {
  critical: { color: 'text-decay', border: 'border-decay/25 bg-decay/5', badge: 'badge-decay', icon: AlertTriangle },
  high: { color: 'text-thread', border: 'border-thread/25 bg-thread/5', badge: 'badge-thread', icon: Zap },
  medium: { color: 'text-paradox', border: 'border-paradox/25 bg-paradox/5', badge: 'badge-paradox', icon: Zap },
}

export default function Paradoxes() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="display text-xl text-white font-normal">Anomaly Detection Lab</h2>
          <p className="tele text-[11px] text-white/30 mt-1">3 active paradoxes · 1 critical priority · Total fragment drain: 2,528/hr</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-decay/20 bg-decay/8">
          <AlertTriangle size={13} className="text-decay animate-pulse" />
          <span className="tele text-[10px] text-decay">Drain Rate Critical</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-2 space-y-3">
          {PARADOXES.map((p) => {
            const cfg = SEV_CONFIG[p.severity]
            const Icon = cfg.icon
            const isSelected = selected === p.id
            return (
              <button
                key={p.id}
                onClick={() => setSelected(isSelected ? null : p.id)}
                className={`w-full text-left loom-card p-4 border transition-all ${cfg.border} ${isSelected ? 'ring-1 ring-thread/30' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon size={13} className={cfg.color} />
                    <span className="tele text-[10px] text-white/40">{p.id}</span>
                  </div>
                  <span className={`${cfg.badge} tele text-[9px] px-1.5 py-0.5 rounded-full uppercase`}>{p.severity}</span>
                </div>
                <p className="text-sm text-white/80 font-medium mb-1">{p.title}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="tele text-[9px] text-white/30 flex items-center gap-1"><Clock size={9} />{p.age}</span>
                  <span className="tele text-[9px] text-white/30 flex items-center gap-1"><GitBranch size={9} />{p.threads} threads</span>
                  <span className="tele text-[9px] text-decay ml-auto">-{p.fragLoss}</span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="xl:col-span-3 loom-card p-5 flex flex-col">
          {selected ? (() => {
            const p = PARADOXES.find((x) => x.id === selected)
            const cfg = SEV_CONFIG[p.severity]
            return (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className={`tele text-[10px] ${cfg.color}`}>{p.id} · {p.sector}</span>
                    <h3 className="display text-lg text-white font-normal mt-1">{p.title}</h3>
                  </div>
                  <span className={`${cfg.badge} tele text-[9px] px-2 py-1 rounded-full uppercase`}>{p.severity}</span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed mb-4">{p.desc}</p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Active Since', val: p.age, color: cfg.color },
                    { label: 'Threads Affected', val: `${p.threads}`, color: 'text-paradox' },
                    { label: 'Fragment Drain', val: p.fragLoss, color: 'text-decay' },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="p-3 rounded-lg bg-white/3 border border-white/6 text-center">
                      <span className={`tele text-sm font-medium ${color}`}>{val}</span>
                      <p className="tele text-[9px] text-white/30 mt-1">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-auto">
                  <button className="flex-1 py-2.5 rounded-lg bg-stability/10 border border-stability/20 text-sm text-stability hover:bg-stability/20 transition-colors flex items-center justify-center gap-2">
                    Begin Resolution <ChevronRight size={13} />
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
