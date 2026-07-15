import { useState } from 'react'
import { Globe, Layers, Activity, Info } from 'lucide-react'
import { sectors, edges, sectorsMeta } from '../data'

function getNode(id) { return sectors.find((s) => s.id === id) }

export default function UniverseMap() {
  const [selected, setSelected] = useState(null)
  const selectedNode = selected ? sectors.find((s) => s.id === selected) : null

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="display text-xl text-white font-normal">Spatial Topology Index</h2>
          <p className="tele text-[11px] text-white/30 mt-1">
            {sectorsMeta.total} sectors monitored · Topology version {sectorsMeta.topologyVersion} · Avg integrity {sectorsMeta.avgIntegrity}%
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Globe size={14} className="text-stability" />
          <span className="tele text-[10px] text-white/30">Real-time map</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map canvas */}
        <div className="loom-card p-4 lg:col-span-2 aspect-video relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(232,185,106,0.15) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
          />
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {/* Edges */}
            {edges.map(({ from, to, strength, type }) => {
              const na = getNode(from), nb = getNode(to)
              if (!na || !nb) return null
              return (
                <line
                  key={`${from}-${to}`}
                  x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                  stroke={type === 'primary' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'}
                  strokeWidth={type === 'primary' ? 0.6 : 0.3}
                  strokeDasharray={type === 'lateral' ? '1 2' : undefined}
                />
              )
            })}
            {/* Nodes */}
            {sectors.map((n) => {
              const isSelected = selected === n.id
              return (
                <g
                  key={n.id}
                  onClick={() => setSelected(isSelected ? null : n.id)}
                  className="cursor-pointer"
                  style={{ filter: isSelected ? `drop-shadow(0 0 6px ${n.color}80)` : undefined }}
                >
                  {/* Glow ring */}
                  <circle cx={n.x} cy={n.y} r={n.r + 5} fill={n.color} opacity={isSelected ? 0.12 : 0.05} />
                  <circle cx={n.x} cy={n.y} r={n.r + 2} fill="none" stroke={n.color} strokeWidth={isSelected ? 0.8 : 0.3} opacity={isSelected ? 0.6 : 0.3} />
                  {/* Node */}
                  <circle cx={n.x} cy={n.y} r={n.r} fill="#0A0912" stroke={n.color} strokeWidth={isSelected ? 1 : 0.6} />
                  {/* Integrity fill */}
                  <circle cx={n.x} cy={n.y} r={n.r * (n.integrity / 100) * 0.65} fill={n.color} opacity="0.2" />
                  {/* Label */}
                  <text x={n.x} y={n.y - 1} textAnchor="middle" fontSize="2.5" fill={n.color} fontFamily="JetBrains Mono, monospace">{n.name}</text>
                  <text x={n.x} y={n.y + 3.5} textAnchor="middle" fontSize="2" fill={n.color} opacity="0.7" fontFamily="JetBrains Mono, monospace">{n.integrity}%</text>
                </g>
              )
            })}
          </svg>
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <Layers size={10} className="text-white/25" />
            <span className="tele text-[9px] text-white/25">Topology v{sectorsMeta.topologyVersion}</span>
          </div>
          <div className="absolute bottom-3 right-3 tele text-[9px] text-white/25">Click a node to inspect</div>
        </div>

        {/* Right column: node list + detail */}
        <div className="flex flex-col gap-3">
          {/* Node health list */}
          <div className="loom-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={14} className="text-stability" />
              <span className="display text-sm font-medium text-white/70">Node Health</span>
            </div>
            <div className="space-y-2">
              {sectors.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSelected(selected === n.id ? null : n.id)}
                  className={`w-full flex items-center gap-3 py-1.5 rounded-lg px-2 transition-colors ${selected === n.id ? 'bg-white/5' : 'hover:bg-white/3'}`}
                >
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: n.color, boxShadow: `0 0 6px ${n.color}60` }} />
                  <span className="tele text-[11px] text-white/50 flex-1 text-left">{n.name}</span>
                  {n.activeParadoxes > 0 && (
                    <span className="badge-decay tele text-[8px] px-1 py-0.5 rounded">{n.activeParadoxes}P</span>
                  )}
                  <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${n.integrity}%`, background: n.color }} />
                  </div>
                  <span className="tele text-[10px] w-8 text-right" style={{ color: n.color }}>{n.integrity}%</span>
                </button>
              ))}
            </div>
          </div>

          {/* Node detail card */}
          {selectedNode ? (
            <div className="loom-card p-4 flex-1" style={{ borderColor: `${selectedNode.color}30` }}>
              <div className="flex items-center justify-between mb-3">
                <span className="display text-sm text-white font-medium">{selectedNode.name}</span>
                <span className="tele text-[9px]" style={{ color: selectedNode.color }}>{selectedNode.status.toUpperCase()}</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed mb-3">{selectedNode.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                {[
                  { label: 'Active Timelines', val: selectedNode.activeTimelines },
                  { label: 'Fragment Count',   val: selectedNode.fragmentCount.toLocaleString() },
                  { label: 'Active Paradoxes', val: selectedNode.activeParadoxes },
                  { label: 'Warden Staff',     val: selectedNode.wardenCount },
                ].map(({ label, val }) => (
                  <div key={label} className="p-2 rounded bg-white/4 border border-white/6">
                    <p className="tele text-[9px] text-white/25">{label}</p>
                    <p className="tele text-[11px] text-white/70 mt-0.5">{val}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedNode.tags.map((t) => (
                  <span key={t} className="px-1.5 py-0.5 rounded border border-white/8 tele text-[8px] text-white/30">#{t}</span>
                ))}
              </div>
            </div>
          ) : (
            <div className="loom-card p-4 flex-1 flex items-center justify-center text-center">
              <div>
                <Info size={24} className="text-white/10 mx-auto mb-2" />
                <p className="tele text-[10px] text-white/25">Click a node on the map or in the list to view sector details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
