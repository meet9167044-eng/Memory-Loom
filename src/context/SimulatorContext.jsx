/**
 * MEMORY LOOM — Live Simulator Context (Step 8)
 *
 * Runs a background engine that:
 *  1. Decays integrity ~0.3%/min in real time (configurable speed)
 *  2. Spawns new alert events every 25–45 seconds
 *  3. Recovering +3–5% integrity when a paradox is sealed
 *  4. Tracks sealed paradoxes globally across all pages
 *  5. Broadcasts the live state to all consumers via context
 */
import { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react'
import { dashStats, events as seedEvents, paradoxes as seedParadoxes, mission } from '../data'

/* ── Tick speed ──────────────────────────────────────────
   1 real second = 1 simulated minute (for demo purposes).
   Integrity decays at mission.integrityDecayRate per hour,
   so per simulated-minute: decayRate / 60 per tick.
──────────────────────────────────────────────────────── */
const TICK_MS        = 3000   // 3 real seconds = 3 simulated minutes
const DECAY_PER_TICK = (Math.abs(mission.integrityDecayRate) / 60) * (TICK_MS / 1000)

/* ── New event templates (spawned randomly) ── */
const EVENT_POOL = [
  { type: 'warn',     sector: 'Sec-1',  message: 'Minor resonance spike detected in Verdana cluster' },
  { type: 'anomaly',  sector: 'CORE',   message: 'Echo pattern intensifying — Core buffer at 78%' },
  { type: 'warn',     sector: 'Sec-3',  message: 'Memory thread tension rising — Chen identity unstable' },
  { type: 'critical', sector: 'Sec-6',  message: 'Ghost fragment overwrite detected — immediate action required' },
  { type: 'info',     sector: 'Sec-4',  message: 'Song fragment frequency drift stabilised momentarily' },
  { type: 'warn',     sector: 'Sec-2',  message: 'Circular reference loop expanding — 9 threads affected' },
  { type: 'anomaly',  sector: 'Sec-5',  message: 'Temporal echo signal origin re-detected' },
  { type: 'critical', sector: 'Sec-9',  message: 'Fragment batch MF-2241 critically fragmented — 3% remaining' },
  { type: 'info',     sector: 'Sec-2',  message: 'Economic record Cycle 14 partially anchored' },
  { type: 'warn',     sector: 'CORE',   message: 'Quantum thread load at 91% — approaching saturation threshold' },
]

/* ── Initial state ── */
const initState = {
  integrity:      dashStats.integrityNow,        // live %, decays over time
  integrityTarget: dashStats.integrityTarget,
  decayRate:      mission.integrityDecayRate,    // %/hr reference
  fragmentsTotal: dashStats.fragmentsTotal,
  fragmentsLost:  dashStats.fragmentsLost,
  timelinesActive: dashStats.timelinesActive,
  timelinesDivergent: dashStats.timelinesDivergent,
  paradoxesActive: dashStats.paradoxesActive,
  paradoxesCritical: dashStats.paradoxesCritical,
  hoursRemaining: dashStats.hoursRemaining,
  minutesRemaining: dashStats.minutesRemaining,

  events: seedEvents.slice(0, 12),               // live feed (newest first)
  sealedParadoxes: new Set(),                    // ids sealed this session
  paradoxes: seedParadoxes,                      // for shared paradox list

  // Notification flash — pulses true briefly when new event arrives
  newEventFlash: false,
  // Recovery flash — pulses briefly after a seal
  recoveryFlash: false,
}

/* ── Reducer ── */
function reducer(state, action) {
  switch (action.type) {

    case 'TICK': {
      // Decay integrity. Stop at 1% floor.
      const newInt = Math.max(1, parseFloat((state.integrity - DECAY_PER_TICK).toFixed(2)))
      // Lose ~1–3 fragments per tick
      const fragDecay = Math.floor(Math.random() * 3) + 1
      return {
        ...state,
        integrity:      newInt,
        fragmentsLost:  state.fragmentsLost + fragDecay,
      }
    }

    case 'NEW_EVENT': {
      const ev = action.payload
      return {
        ...state,
        events: [ev, ...state.events].slice(0, 30), // keep max 30
        newEventFlash: true,
      }
    }

    case 'CLEAR_FLASH': {
      return { ...state, newEventFlash: false, recoveryFlash: false }
    }

    case 'SEAL_PARADOX': {
      const id = action.payload
      if (state.sealedParadoxes.has(id)) return state

      const newSealed = new Set([...state.sealedParadoxes, id])

      // Find paradox drain rate to recover
      const p = state.paradoxes.find(px => px.id === id)
      const drainRate  = p?.fragLossRate || 0
      const recovery   = drainRate > 0 ? 4.5 : 2.0   // % integrity recovery
      const newInt     = Math.min(99.9, parseFloat((state.integrity + recovery).toFixed(2)))
      const newActive  = Math.max(0, state.paradoxesActive - 1)
      const newCrit    = p?.severity === 'critical'
        ? Math.max(0, state.paradoxesCritical - 1)
        : state.paradoxesCritical

      // Inject a "restored" event
      const restoredEv = {
        id:       `EVT-LIVE-${Date.now()}`,
        time:     new Date().toISOString().slice(11, 19),
        type:     'info',
        sector:   p?.sector || 'CORE',
        severity: 'info',
        message:  `Paradox ${id} sealed — integrity recovering (+${recovery}%)`,
        event:    `Paradox ${id} sealed — integrity recovering (+${recovery}%)`,
        autoResolved: true,
      }

      return {
        ...state,
        integrity:         newInt,
        sealedParadoxes:   newSealed,
        paradoxesActive:   newActive,
        paradoxesCritical: newCrit,
        events:            [restoredEv, ...state.events].slice(0, 30),
        recoveryFlash:     true,
      }
    }

    case 'RESTORE_FRAGMENT': {
      const recovered = action.payload || 50
      return {
        ...state,
        fragmentsTotal: state.fragmentsTotal + recovered,
      }
    }

    default:
      return state
  }
}

/* ── Context ── */
const SimulatorContext = createContext(null)

/* ── Provider ── */
export function SimulatorProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initState)
  const tickRef   = useRef(null)
  const eventRef  = useRef(null)

  // ── Tick loop (decay) ──────────────────────────────
  useEffect(() => {
    tickRef.current = setInterval(() => {
      dispatch({ type: 'TICK' })
    }, TICK_MS)
    return () => clearInterval(tickRef.current)
  }, [])

  // ── Event spawner ──────────────────────────────────
  useEffect(() => {
    const scheduleNext = () => {
      // Random interval 25–45 seconds
      const delay = 25000 + Math.random() * 20000
      eventRef.current = setTimeout(() => {
        const pool = EVENT_POOL.filter(e =>
          // Don't repeat critical events if integrity is already recovering
          !(e.type === 'critical' && state.integrity > 70)
        )
        const template = pool[Math.floor(Math.random() * pool.length)]
        const now = new Date()
        const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`
        dispatch({
          type: 'NEW_EVENT',
          payload: {
            id:       `EVT-LIVE-${Date.now()}`,
            time:     timeStr,
            type:     template.type,
            sector:   template.sector,
            severity: template.type === 'critical' ? 'critical' : template.type === 'warn' ? 'high' : 'info',
            message:  template.message,
            event:    template.message,
            autoResolved: false,
            isLive:   true,
          }
        })
        // Flash clears after 2s
        setTimeout(() => dispatch({ type: 'CLEAR_FLASH' }), 2000)
        scheduleNext()
      }, delay)
    }
    scheduleNext()
    return () => clearTimeout(eventRef.current)
  }, [])  // eslint-disable-line

  // ── Public API ─────────────────────────────────────
  const sealParadox = useCallback((id) => {
    dispatch({ type: 'SEAL_PARADOX', payload: id })
    setTimeout(() => dispatch({ type: 'CLEAR_FLASH' }), 3000)
  }, [])

  const restoreFragment = useCallback((count = 50) => {
    dispatch({ type: 'RESTORE_FRAGMENT', payload: count })
  }, [])

  return (
    <SimulatorContext.Provider value={{ state, sealParadox, restoreFragment }}>
      {children}
    </SimulatorContext.Provider>
  )
}

/* ── Hook ── */
export function useSimulator() {
  const ctx = useContext(SimulatorContext)
  if (!ctx) throw new Error('useSimulator must be used inside <SimulatorProvider>')
  return ctx
}
