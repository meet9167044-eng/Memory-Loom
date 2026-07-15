import { useState } from 'react'
import { Brain, Search, Filter, Star, X } from 'lucide-react'
import { fragments, fragmentsMeta } from '../data'
import EmberBar from '../components/ui/EmberBar'

const TYPES = ['All', 'Event', 'Personal', 'Military', 'Technical', 'Medical', 'Political', 'Astronomical', 'Oral History', 'Legal', 'Economic', 'Cultural', 'Geographical', 'Ceremonial', 'Scientific', 'Media', 'Anomaly']

const STATUS_BADGE = {
  archived: 'badge-stability',
  active:   'badge-thread',
  critical: 'badge-decay',
}

export default function Memories() {
  const [search, setSearch]       = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [showStarred, setShowStarred] = useState(false)
  const [selected, setSelected]   = useState(null)

  const filtered = fragments.filter((f) => {
    const matchSearch = f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.id.toLowerCase().includes(search.toLowerCase()) ||
      f.sector.toLowerCase().includes(search.toLowerCase()) ||
      f.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    const matchType   = typeFilter === 'All' || f.type === typeFilter
    const matchStar   = !showStarred || f.starred
    return matchSearch && matchType && matchStar
  })

  const selectedFrag = selected ? fragments.find((f) => f.id === selected) : null

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="display text-xl text-white font-normal">Fragment Archive</h2>
          <p className="tele text-[11px] text-white/30 mt-1">
            {fragmentsMeta.total.toLocaleString()} fragments indexed · {fragmentsMeta.pendingRestoration.toLocaleString()} pending restoration
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStarred((s) => !s)}
            className={`p-2 rounded-lg border transition-colors ${showStarred ? 'border-thread/30 bg-thread/10 text-thread' : 'border-white/8 text-white/30 hover:text-white/60 hover:bg-white/5'}`}
          >
            <Star size={14} fill={showStarred ? '#E8B96A' : 'none'} />
          </button>
          <button className="px-4 py-2 rounded-lg bg-thread/10 border border-thread/20 text-sm text-thread hover:bg-thread/20 transition-colors flex items-center gap-2">
            <Brain size={14} /> Archive Fragment
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="loom-card p-3 flex items-center gap-2">
        <Search size={14} className="text-white/25 shrink-0" />
        <input
          type="text"
          placeholder="Search memories by title, sector, type, or tag…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none tele"
        />
        {search && (
          <button onClick={() => setSearch('')}><X size={13} className="text-white/25 hover:text-white/50" /></button>
        )}
      </div>

      {/* Type filter chips */}
      <div className="flex flex-wrap gap-1.5">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-2.5 py-1 rounded-full tele text-[9px] uppercase tracking-wide transition-colors ${
              typeFilter === t
                ? 'bg-thread/15 border border-thread/30 text-thread'
                : 'border border-white/8 text-white/25 hover:text-white/45 hover:bg-white/5'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Indexed',  val: fragmentsMeta.total.toLocaleString(),       color: 'text-white/70' },
          { label: 'Archived',       val: fragmentsMeta.archived.toLocaleString(),     color: 'text-stability' },
          { label: 'Restoring',      val: fragmentsMeta.pendingRestoration.toLocaleString(), color: 'text-thread' },
          { label: 'Lost This Cycle',val: fragmentsMeta.criticalLoss,                color: 'text-decay' },
        ].map(({ label, val, color }) => (
          <div key={label} className="loom-card px-3 py-2 text-center">
            <p className={`display text-base font-normal ${color}`}>{val}</p>
            <p className="tele text-[9px] text-white/25 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Grid + detail */}
      <div className={`grid gap-4 ${selectedFrag ? 'xl:grid-cols-5' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
        {/* Cards */}
        <div className={`${selectedFrag ? 'xl:col-span-3 grid grid-cols-1 md:grid-cols-2' : 'contents'} gap-3`}>
          {filtered.length === 0 && (
            <div className="col-span-3 py-10 text-center text-sm text-white/25">No fragments match your search.</div>
          )}
          {filtered.map((f) => {
            const intColor = f.integrity < 30 ? '#E8506A' : f.integrity < 65 ? '#E8B96A' : '#4C8CFF'
            const isSelected = selected === f.id
            return (
              <div
                key={f.id}
                onClick={() => setSelected(isSelected ? null : f.id)}
                className={`loom-card p-4 cursor-pointer transition-all ${isSelected ? 'ring-1 ring-thread/40 bg-thread/5' : 'hover:bg-white/3'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="tele text-[9px] text-white/25">{f.id}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`${STATUS_BADGE[f.status] || 'badge-thread'} tele text-[8px] px-1.5 py-0.5 rounded`}>{f.type}</span>
                      <span className="tele text-[9px] text-white/30">{f.sector}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {f.starred && <Star size={11} className="text-thread" fill="#E8B96A" />}
                    {f.integrity < 30 && <span className="tele text-[8px] text-decay">CRIT</span>}
                  </div>
                </div>
                <p className="text-sm text-white/75 font-medium leading-snug mb-3">{f.title}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <EmberBar value={f.integrity} height={3} />
                  </div>
                  <span className="tele text-[10px]" style={{ color: intColor }}>{f.integrity}%</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Detail panel */}
        {selectedFrag && (
          <div className="xl:col-span-2 loom-card p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="tele text-[10px] text-thread">{selectedFrag.id}</span>
                <h3 className="display text-base text-white font-normal mt-1 leading-snug">{selectedFrag.title}</h3>
              </div>
              <button onClick={() => setSelected(null)}><X size={14} className="text-white/25 hover:text-white/50" /></button>
            </div>

            <p className="text-sm text-white/55 leading-relaxed">{selectedFrag.summary}</p>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: 'Type',      val: selectedFrag.type },
                { label: 'Sector',    val: selectedFrag.sector },
                { label: 'Timeline',  val: selectedFrag.timeline },
                { label: 'Status',    val: selectedFrag.status },
                { label: 'Size',      val: selectedFrag.size },
                { label: 'Integrity', val: `${selectedFrag.integrity}%` },
              ].map(({ label, val }) => (
                <div key={label} className="p-2 rounded-lg bg-white/3 border border-white/5">
                  <p className="tele text-[9px] text-white/25">{label}</p>
                  <p className="text-white/70 mt-0.5 tele text-[10px]">{val}</p>
                </div>
              ))}
            </div>

            {/* Author */}
            <div>
              <p className="tele text-[9px] text-white/30 uppercase tracking-widest mb-1">Author</p>
              <p className="tele text-[10px] text-white/50">{selectedFrag.author}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {selectedFrag.tags.map((tag) => (
                <span key={tag} className="badge-thread tele text-[8px] px-1.5 py-0.5 rounded">#{tag}</span>
              ))}
            </div>

            <div className="flex gap-2 mt-auto">
              <button className="flex-1 py-2 rounded-lg bg-stability/10 border border-stability/20 tele text-[10px] text-stability hover:bg-stability/20 transition-colors">
                Begin Restoration
              </button>
              <button className="px-3 py-2 rounded-lg border border-white/8 tele text-[10px] text-white/30 hover:text-white/50 transition-colors">
                Archive
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
