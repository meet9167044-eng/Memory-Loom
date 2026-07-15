/**
 * Memory Loom — Central Data Store
 * All pages import from this file, NOT directly from the JSON files.
 * This layer adds computed helpers and keeps cross-references consistent.
 */

import timelinesData   from './timelines.json'
import fragmentsData   from './fragments.json'
import paradoxesData   from './paradoxes.json'
import sectorsData     from './sectors.json'
import eventsData      from './events.json'
import missionData     from './mission.json'

// ─── Raw collections ───────────────────────────────────────────────────────
export const timelines  = timelinesData.timelines
export const fragments  = fragmentsData.fragments
export const paradoxes  = paradoxesData.paradoxes
export const sectors    = sectorsData.sectors
export const edges      = sectorsData.edges
export const events     = eventsData.events
export const mission    = missionData.mission

// ─── Meta ──────────────────────────────────────────────────────────────────
export const timelinesMeta  = timelinesData.meta
export const fragmentsMeta  = fragmentsData.meta
export const paradoxesMeta  = paradoxesData.meta
export const sectorsMeta    = sectorsData.meta

// ─── Computed: Timeline helpers ────────────────────────────────────────────
export const getTimeline = (id) => timelines.find((t) => t.id === id)

export const criticalTimelines = timelines.filter((t) => t.status === 'critical')
export const stableTimelines   = timelines.filter((t) => t.status === 'stable')
export const divergentTimelines = timelines.filter((t) => t.status === 'divergent')

// ─── Computed: Fragment helpers ────────────────────────────────────────────
export const getFragment = (id) => fragments.find((f) => f.id === id)

export const criticalFragments = fragments.filter((f) => f.integrity < 30)
export const starredFragments  = fragments.filter((f) => f.starred)
export const activeFragments   = fragments.filter((f) => f.status === 'active')

/** Returns all fragments belonging to a given sector shortName e.g. "Sec-1" */
export const fragmentsBySector = (sectorName) =>
  fragments.filter((f) => f.sector === sectorName)

/** Returns all fragments linked to a given timeline ID */
export const fragmentsByTimeline = (timelineId) =>
  fragments.filter((f) => f.timeline === timelineId)

// ─── Computed: Paradox helpers ─────────────────────────────────────────────
export const getParadox = (id) => paradoxes.find((p) => p.id === id)

export const criticalParadoxes  = paradoxes.filter((p) => p.severity === 'critical')
export const unresolvedParadoxes = paradoxes.filter((p) => p.status === 'unresolved')
export const totalFragDrainRate  = paradoxes.reduce((sum, p) => sum + p.fragLossRate, 0)

// ─── Computed: Sector helpers ──────────────────────────────────────────────
export const getSector = (id) => sectors.find((s) => s.id === id)

export const criticalSectors = sectors.filter((s) => s.integrity < 40)
export const avgSectorIntegrity =
  Math.round(sectors.reduce((sum, s) => sum + s.integrity, 0) / sectors.length)

// ─── Computed: Event helpers ───────────────────────────────────────────────
export const recentEvents       = events.slice(0, 10)
export const criticalEvents     = events.filter((e) => e.severity === 'critical')
export const unresolvedEvents   = events.filter((e) => !e.autoResolved)

// ─── Computed: Mission helpers ─────────────────────────────────────────────
export const completedObjectives = mission.objectives.filter((o) => o.done)
export const pendingObjectives   = mission.objectives.filter((o) => !o.done)
export const missionProgress     =
  Math.round((completedObjectives.length / mission.objectives.length) * 100)
export const totalPoints         = mission.objectives.reduce((s, o) => s + o.points, 0)
export const earnedPoints        = completedObjectives.reduce((s, o) => s + o.points, 0)

// ─── Computed: Dashboard quick-stats ──────────────────────────────────────
/** The single source of truth object used by Overview and Topbar */
export const dashStats = {
  integrityNow:     mission.integrityNow,
  integrityTarget:  mission.integrityTarget,
  integrityDecay:   mission.integrityDecayRate,
  fragmentsTotal:   fragmentsMeta.total,
  fragmentsLost:    fragmentsMeta.criticalLoss,
  timelinesActive:  timelinesMeta.total,
  timelinesDivergent: timelinesMeta.divergent,
  paradoxesActive:  paradoxesMeta.total,
  paradoxesCritical: paradoxesMeta.critical,
  hoursRemaining:   mission.deadline.hoursRemaining,
  minutesRemaining: mission.deadline.minutesRemaining,
  totalFragDrain:   paradoxesMeta.totalFragDrain,
}
