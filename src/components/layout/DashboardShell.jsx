import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Overview from '../../pages/Overview'
import Timelines from '../../pages/Timelines'
import Memories from '../../pages/Memories'
import Paradoxes from '../../pages/Paradoxes'
import UniverseMap from '../../pages/UniverseMap'
import Settings from '../../pages/Settings'

// DashboardShell owns the Sidebar + Topbar frame.
// BrowserRouter lives in main.jsx so URLs change correctly.
export default function DashboardShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-void">
      {/* Ambient thread glow (fixed, behind everything) */}
      <div className="thread-ambient pointer-events-none" />

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      {/* Right column: Topbar + page content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/overview"     element={<Overview />} />
            <Route path="/timelines"    element={<Timelines />} />
            <Route path="/memories"     element={<Memories />} />
            <Route path="/paradoxes"    element={<Paradoxes />} />
            <Route path="/universe-map" element={<UniverseMap />} />
            <Route path="/settings"     element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
