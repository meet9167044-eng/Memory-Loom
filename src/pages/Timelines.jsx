import { GitBranch, Clock, Zap, ChevronRight } from 'lucide-react'

const TIMELINES = [
  { id: 'TL-001', name: 'The Great War of Verdana', branches: 7, integrity: 78, status: 'stable', modified: '2h ago' },
  { id: 'TL-002', name: 'Architect Chen\'s Ascent', branches: 3, integrity: 34, status: 'critical', modified: '14m ago' },
  { id: 'TL-003', name: 'The Forgetting Plague', branches: 12, integrity: 55, status: 'divergent', modified: '1d ago' },
  { id: 'TL-004', name: 'Foundation of the Last City', branches: 5, integrity: 89, status: 'stable', modified: '3d ago' },
  { id: 'TL-005', name: 'Void Core Awakening', branches: 2, integrity: 12, status: 'critical', modified: '47m ago' },
]

const STATUS = {
  stable: { label: 'Stable', class: 'badge-stability' },
  critical: { label: 'Critical', class: 'badge-decay' },
  divergent: { label: 'Divergent', class: 'badge-paradox' },
}

export default function Timelines() {
  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="display text-xl text-white font-normal">Thread Weaver Array</h2>
          <p className="tele text-[11px] text-white/30 mt-1">247 active threads · 12 divergent branches detected</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-thread/10 border border-thread/20 text-sm text-thread hover:bg-thread/20 transition-colors flex items-center gap-2">
          <GitBranch size={14} /> New Branch
        </button>
      </div>

      <div className="loom-card overflow-hidden">
        <div className="grid grid-cols-[1fr_80px_100px_80px_100px_40px] gap-4 px-4 py-2 border-b border-white/5">
          {['Timeline', 'Branches', 'Integrity', 'Status', 'Modified', ''].map((h) => (
            <span key={h} className="tele text-[9px] text-white/30 uppercase tracking-widest">{h}</span>
          ))}
        </div>
        {TIMELINES.map((tl) => {
          const intColor = tl.integrity < 40 ? 'text-decay' : tl.integrity < 70 ? 'text-thread' : 'text-stability'
          const s = STATUS[tl.status]
          return (
            <div key={tl.id} className="grid grid-cols-[1fr_80px_100px_80px_100px_40px] gap-4 px-4 py-3.5 border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors group items-center">
              <div>
                <p className="text-sm text-white/80 font-medium group-hover:text-white transition-colors">{tl.name}</p>
                <span className="tele text-[9px] text-white/25">{tl.id}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <GitBranch size={10} className="text-white/25" />
                <span className="tele text-[11px] text-white/50">{tl.branches}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-white/5 rounded-full">
                  <div className="h-full rounded-full" style={{ width: `${tl.integrity}%`, background: tl.integrity < 40 ? '#E8506A' : tl.integrity < 70 ? '#E8B96A' : '#4C8CFF' }} />
                </div>
                <span className={`tele text-[10px] ${intColor} w-8 text-right`}>{tl.integrity}%</span>
              </div>
              <span className={`${s.class} tele text-[9px] px-1.5 py-0.5 rounded-full w-fit`}>{s.label}</span>
              <div className="flex items-center gap-1">
                <Clock size={10} className="text-white/20" />
                <span className="tele text-[10px] text-white/30">{tl.modified}</span>
              </div>
              <button className="p-1 rounded text-white/20 hover:text-thread hover:bg-thread/10 transition-colors">
                <ChevronRight size={12} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
