import { Globe, Layers, Activity } from 'lucide-react'

const NODES = [
  { id: 'N1', label: 'Sector 1', x: 60, y: 25, integrity: 78, color: '#4C8CFF', r: 22 },
  { id: 'N2', label: 'Sector 2', x: 78, y: 55, integrity: 65, color: '#E8B96A', r: 18 },
  { id: 'N3', label: 'Sector 3', x: 55, y: 72, integrity: 34, color: '#E8506A', r: 20 },
  { id: 'N4', label: 'Sector 4', x: 30, y: 60, integrity: 55, color: '#E8B96A', r: 16 },
  { id: 'N5', label: 'Sector 5', x: 20, y: 30, integrity: 89, color: '#4C8CFF', r: 18 },
  { id: 'N6', label: 'Sector 6', x: 42, y: 42, integrity: 29, color: '#E8506A', r: 14 },
  { id: 'CORE', label: 'Core', x: 50, y: 50, integrity: 12, color: '#9D6FE0', r: 28 },
]

const EDGES = [
  ['N1', 'CORE'], ['N2', 'CORE'], ['N3', 'CORE'],
  ['N4', 'CORE'], ['N5', 'CORE'], ['N6', 'CORE'],
  ['N1', 'N2'], ['N2', 'N3'], ['N3', 'N4'],
  ['N4', 'N5'], ['N5', 'N1'],
]

function getNode(id) { return NODES.find((n) => n.id === id) }

export default function UniverseMap() {
  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="display text-xl text-white font-normal">Spatial Topology Index</h2>
          <p className="tele text-[11px] text-white/30 mt-1">7 sectors monitored · Topology version 4.1.2</p>
        </div>
        <div className="flex items-center gap-2">
          <Globe size={14} className="text-stability" />
          <span className="tele text-[10px] text-white/30">Real-time map</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map canvas */}
        <div className="loom-card p-4 lg:col-span-2 aspect-video relative overflow-hidden">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(232,185,106,0.15) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
          />
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {/* Edges */}
            {EDGES.map(([a, b]) => {
              const na = getNode(a), nb = getNode(b)
              return (
                <line
                  key={`${a}-${b}`}
                  x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                  stroke="rgba(255,255,255,0.06)" strokeWidth="0.4"
                />
              )
            })}
            {/* Nodes */}
            {NODES.map((n) => (
              <g key={n.id}>
                {/* Glow ring */}
                <circle cx={n.x} cy={n.y} r={n.r + 4} fill={n.color} opacity="0.05" />
                <circle cx={n.x} cy={n.y} r={n.r + 2} fill="none" stroke={n.color} strokeWidth="0.3" opacity="0.3" />
                {/* Node */}
                <circle cx={n.x} cy={n.y} r={n.r} fill="#0A0912" stroke={n.color} strokeWidth="0.6" />
                {/* Integrity fill */}
                <circle cx={n.x} cy={n.y} r={n.r * 0.7} fill={n.color} opacity="0.15" />
                {/* Label */}
                <text x={n.x} y={n.y - 1} textAnchor="middle" fontSize="2.5" fill={n.color} fontFamily="JetBrains Mono, monospace">{n.label}</text>
                <text x={n.x} y={n.y + 3.5} textAnchor="middle" fontSize="2" fill={n.color} opacity="0.6" fontFamily="JetBrains Mono, monospace">{n.integrity}%</text>
              </g>
            ))}
          </svg>
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <Layers size={10} className="text-white/25" />
            <span className="tele text-[9px] text-white/25">Topology v4.1.2</span>
          </div>
        </div>

        {/* Node list */}
        <div className="loom-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={14} className="text-stability" />
            <span className="display text-sm font-medium text-white/70">Node Health</span>
          </div>
          <div className="space-y-2">
            {NODES.map((n) => (
              <div key={n.id} className="flex items-center gap-3 py-1.5">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: n.color, boxShadow: `0 0 6px ${n.color}60` }} />
                <span className="tele text-[11px] text-white/50 flex-1">{n.label}</span>
                <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${n.integrity}%`, background: n.color }} />
                </div>
                <span className="tele text-[10px] w-8 text-right" style={{ color: n.color }}>{n.integrity}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
