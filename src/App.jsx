import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Overview from './pages/Overview'
import Timelines from './pages/Timelines'
import Memories from './pages/Memories'
import Paradoxes from './pages/Paradoxes'
import UniverseMap from './pages/UniverseMap'
import Settings from './pages/Settings'

const navItems = [
  { to: '/', label: 'Overview' },
  { to: '/timelines', label: 'Timelines' },
  { to: '/memories', label: 'Memories' },
  { to: '/paradoxes', label: 'Paradoxes' },
  { to: '/universe-map', label: 'Universe Map' },
  { to: '/settings', label: 'Settings' },
]

function App() {
  return (
    <BrowserRouter>
      <nav className="border-b border-gray-200 p-4">
        <ul className="flex flex-wrap gap-4">
          {navItems.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  isActive
                    ? 'font-bold text-gray-900 underline'
                    : 'text-gray-600 hover:text-gray-900'
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/timelines" element={<Timelines />} />
          <Route path="/memories" element={<Memories />} />
          <Route path="/paradoxes" element={<Paradoxes />} />
          <Route path="/universe-map" element={<UniverseMap />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
