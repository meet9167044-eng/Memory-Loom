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

export default function DashboardShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-void">
      {/* Ambient thread glow */}
      <div className="thread-ambient pointer-events-none" />

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/timelines" element={<Timelines />} />
            <Route path="/memories" element={<Memories />} />
            <Route path="/paradoxes" element={<Paradoxes />} />
            <Route path="/universe-map" element={<UniverseMap />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
