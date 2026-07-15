import { useState } from 'react'
import { GitBranch, Clock, Zap, ChevronRight, Search, Filter } from 'lucide-react'
import { timelines, timelinesMeta } from '../data'
import EmberBar from '../components/ui/EmberBar'

const STATUS = {
  stable:    { label: 'Stable',    class: 'badge-stability' },
  critical:  { label: 'Critical',  class: 'badge-decay' },
  divergent: { label: 'Divergent', class: 'badge-paradox' },
}

export default function Timelines() {
  const [search, setSearch]   = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = timelines.filter((tl) => {
    const matchSearch = tl.name.toLowerCase().includes(search.toLowerCase()) ||
      tl.id.toLowerCase().includes(search.toLowerCase()) ||
      tl.sector.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || tl.status === filterStatus
    return matchSearch && matchStatus
  })

  const selectedTl = selected ? timelines.find((t) => t.id === selected) : null

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="display text-xl text-white font-normal">Thread Weaver Array</h2>
          <p className="tele text-[11px] text-white/30 mt-1">
            {timelinesMeta.total} active threads · {timelinesMeta.divergent} divergent branches detected
          </p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-thread/10 border border-thread/20 text-sm text-thread hover:bg-thread/20 transition-colors flex items-center gap-2">
          <GitBranch size={14} /> New Branch
        </button>
      </div>

      {/* Search + filters */}
      <div className="flex items-center gap-3">
        <div className="loom-card flex-1 flex items-center gap-2 px-3 py-2">
          <Search size={13} className="text-white/25 shrink-0" />
          <input
            type="text"
            placeholder="Search by name, ID, or sector…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-white/25 outline-none flex-1 tele"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {['all', 'stable', 'critical', 'divergent'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg tele text-[10px] uppercase tracking-wide transition-colors ${
                filterStatus === s
                  ? 'bg-thread/15 border border-thread/30 text-thread'
                  : 'border border-white/8 text-white/30 hover:text-white/50 hover:bg-white/5'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className={`grid gap-4 ${selectedTl ? 'grid-cols-1 xl:grid-cols-5' : 'grid-cols-1'}`}>
        {/* Table */}
        <div className={`loom-card overflow-hidden ${selectedTl ? 'xl:col-span-3' : ''}`}>
          <div className="grid grid-cols-[1fr_70px_110px_80px_100px_40px] gap-4 px-4 py-2 border-b border-white/5">
            {['Timeline', 'Branches', 'Integrity', 'Status', 'Modified', ''].map((h) => (
              <span key={h} className="tele text-[9px] text-white/30 uppercase tracking-widest">{h}</span>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="py-8 text-center text-sm text-white/25">No timelines match your search.</div>
          )}
          {filtered.map((tl) => {
            const intColor = tl.integrity < 40 ? 'text-decay' : tl.integrity < 70 ? 'text-thread' : 'text-stability'
            const s = STATUS[tl.status]
            const isSelected = selected === tl.id
            return (
              <button
                key={tl.id}
                onClick={() => setSelected(isSelected ? null : tl.id)}
                className={`w-full grid grid-cols-[1fr_70px_110px_80px_100px_40px] gap-4 px-4 py-3.5 border-b border-white/4 last:border-0 transition-colors group items-center text-left ${isSelected ? 'bg-thread/5' : 'hover:bg-white/2'}`}
              >
                <div>
                  <p className="text-sm text-white/80 font-medium group-hover:text-white transition-colors leading-snug">{tl.name}</p>
                  <span className="tele text-[9px] text-white/25">{tl.id} · {tl.era}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GitBranch size={10} className="text-white/25" />
                  <span className="tele text-[11px] text-white/50">{tl.branches}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <EmberBar value={tl.integrity} height={3} />
                  </div>
                  <span className={`tele text-[10px] ${intColor} w-8 text-right`}>{tl.integrity}%</span>
                </div>
                <span className={`${s.class} tele text-[9px] px-1.5 py-0.5 rounded-full w-fit`}>{s.label}</span>
                <div className="flex items-center gap-1">
                  <Clock size={10} className="text-white/20" />
                  <span className="tele text-[10px] text-white/30">{tl.modified}</span>
                </div>
                <ChevronRight size={12} className={`text-white/20 transition-colors group-hover:text-thread ${isSelected ? 'text-thread rotate-90' : ''}`} />
              </button>
            )
          })}
        </div>

        {/* Detail panel */}
        {selectedTl && (
          <div className="xl:col-span-2 loom-card p-5 flex flex-col gap-4">
            <div>
              <span className="tele text-[10px] text-thread">{selectedTl.id} · {selectedTl.sector}</span>
              <h3 className="display text-lg text-white font-normal mt-1 leading-snug">{selectedTl.name}</h3>
              <p className="tele text-[10px] text-white/30 mt-0.5">{selectedTl.era}</p>
            </div>

            <p className="text-sm text-white/55 leading-relaxed">{selectedTl.description}</p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Branches',  val: selectedTl.branches,      color: 'text-paradox' },
                { label: 'Threads',   val: selectedTl.threads,       color: 'text-stability' },
                { label: 'Fragments', val: selectedTl.fragmentCount.toLocaleString(), color: 'text-thread' },
              ].map(({ label, val, color }) => (
                <div key={label} className="p-2.5 rounded-lg bg-white/3 border border-white/5 text-center">
                  <span className={`tele text-sm font-medium ${color}`}>{val}</span>
                  <p className="tele text-[9px] text-white/25 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Key figures */}
            <div>
              <p className="tele text-[9px] text-white/30 uppercase tracking-widest mb-2">Key Figures</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedTl.keyFigures.map((fig) => (
                  <span key={fig} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/8 tele text-[9px] text-white/50">{fig}</span>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {selectedTl.tags.map((tag) => (
                <span key={tag} className="badge-thread tele text-[8px] px-1.5 py-0.5 rounded">#{tag}</span>
              ))}
            </div>

            {/* Paradox links */}
            {selectedTl.affectedParadoxes.length > 0 && (
              <div className="p-3 rounded-lg bg-decay/5 border border-decay/15">
                <p className="tele text-[9px] text-decay/70 mb-1.5">⚠ Linked Paradoxes</p>
                {selectedTl.affectedParadoxes.map((pid) => (
                  <span key={pid} className="tele text-[10px] text-decay">{pid} </span>
                ))}
              </div>
            )}

            <button
              onClick={() => setSelected(null)}
              className="mt-auto py-2 rounded-lg border border-white/8 tele text-[10px] text-white/30 hover:text-white/50 transition-colors"
            >
              Close Detail
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
