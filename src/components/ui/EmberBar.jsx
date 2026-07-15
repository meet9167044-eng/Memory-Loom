/* EmberBar — progress bar with dissolving ember particles
   Props:
     value       0..100
     height      px (default 4)
     colorFn     (val) => css color string
*/
import { useId } from 'react'

const EMBER_COUNT = 6

export default function EmberBar({ value = 0, height = 4, colorFn }) {
  const id = useId()

  const getColor = colorFn || ((v) =>
    v < 35 ? '#C44B6E' : v < 65 ? '#D4923A' : '#4A8FA8'
  )

  const color = getColor(value)
  const glow  = value < 35
    ? 'rgba(196, 75, 110, 0.5)'
    : value < 65
      ? 'rgba(212, 146, 58, 0.5)'
      : 'rgba(74, 143, 168, 0.5)'

  const embers = Array.from({ length: EMBER_COUNT }, (_, i) => ({
    id: i,
    left: `${55 + Math.random() * 44}%`,   // near the fill edge
    size: 1.5 + Math.random() * 1.5,
    delay: `${(i / EMBER_COUNT) * 2}s`,
    dur:   `${1.4 + Math.random() * 0.8}s`,
    dx:    `${(Math.random() - 0.5) * 14}px`,
  }))

  return (
    <div className="relative" style={{ height: `${height}px`, overflow: 'visible' }}>
      {/* Track */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      />

      {/* Fill */}
      <div
        className="absolute inset-y-0 left-0 rounded-full overflow-hidden"
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          background: `linear-gradient(90deg, ${color}cc, ${color})`,
          boxShadow: `0 0 8px ${glow}`,
          transition: 'width 1.8s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Shimmer sweep */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)',
            backgroundSize: '60% 100%',
            animation: 'shimmer 2.2s ease-in-out infinite',
          }}
        />
      </div>

      {/* Ember particles hovering above the fill edge */}
      {value < 65 && embers.map((e) => (
        <div
          key={e.id}
          style={{
            position: 'absolute',
            bottom: `${height}px`,
            left: e.left,
            width: `${e.size}px`,
            height: `${e.size}px`,
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 4px ${glow}`,
            '--dx': e.dx,
            '--dur': e.dur,
            '--delay': e.delay,
            animation: `ember-rise ${e.dur} ease-out ${e.delay} infinite`,
          }}
        />
      ))}
    </div>
  )
}
