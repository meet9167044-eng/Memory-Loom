import { Brain, Search, Filter, Star } from 'lucide-react'

const FRAGMENTS = [
  { id: 'MF-2241', title: 'The Last Coronation of Verdana', type: 'Event', sector: 'Sec-1', integrity: 94, starred: true },
  { id: 'MF-2240', title: 'Mira Chen\'s First Journal Entry', type: 'Personal', sector: 'Sec-3', integrity: 22, starred: false },
  { id: 'MF-2239', title: 'Battle Formation Records', type: 'Military', sector: 'Sec-1', integrity: 67, starred: false },
  { id: 'MF-2238', title: 'Architecture of the Void Gates', type: 'Technical', sector: 'Core', integrity: 8, starred: true },
  { id: 'MF-2237', title: 'The Forgetting Plague — Patient Zero', type: 'Medical', sector: 'Sec-5', integrity: 88, starred: false },
  { id: 'MF-2236', title: 'Council Decision — Final Session', type: 'Political', sector: 'Sec-2', integrity: 45, starred: true },
]

export default function Memories() {
  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="display text-xl text-white font-normal">Fragment Archive</h2>
          <p className="tele text-[11px] text-white/30 mt-1">18,342 fragments indexed · 3,201 pending restoration</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg border border-white/8 text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors">
            <Filter size={14} />
          </button>
          <button className="px-4 py-2 rounded-lg bg-thread/10 border border-thread/20 text-sm text-thread hover:bg-thread/20 transition-colors flex items-center gap-2">
            <Brain size={14} /> Archive Fragment
          </button>
        </div>
      </div>

      <div className="loom-card p-3 flex items-center gap-2">
        <Search size={14} className="text-white/25 shrink-0" />
        <input
          type="text"
          placeholder="Search memories by title, sector, or ID…"
          className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none tele"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {FRAGMENTS.map((f) => {
          const intColor = f.integrity < 40 ? '#E8506A' : f.integrity < 70 ? '#E8B96A' : '#4C8CFF'
          return (
            <div key={f.id} className="loom-card p-4 cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="tele text-[9px] text-white/25">{f.id}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="badge-thread tele text-[9px] px-1.5 py-0.5 rounded">{f.type}</span>
                    <span className="tele text-[9px] text-white/30">{f.sector}</span>
                  </div>
                </div>
                {f.starred && <Star size={12} className="text-thread shrink-0" fill="#E8B96A" />}
              </div>
              <p className="text-sm text-white/75 font-medium leading-snug mb-3">{f.title}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${f.integrity}%`, background: intColor }} />
                </div>
                <span className="tele text-[10px]" style={{ color: intColor }}>{f.integrity}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
