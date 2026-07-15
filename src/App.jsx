import { useNavigate, Routes, Route } from 'react-router-dom'
import IntroHero from './components/intro/IntroHero'
import BootAnimation from './components/intro/BootAnimation'
import DashboardShell from './components/layout/DashboardShell'

function App() {
  const navigate = useNavigate()

  // Called by IntroHero when navigation is triggered.
  // We navigate to /boot and pass the target destination inside the router state.
  const handleInitialize = (destination = '/overview') => {
    navigate('/boot', { state: { destination } })
  }

  // Called by BootAnimation when the loading sequence completes.
  const handleBootComplete = (destination = '/overview') => {
    navigate(destination, { replace: true })
  }

  return (
    <Routes>
      <Route path="/" element={<IntroHero onInitialize={handleInitialize} />} />
      <Route path="/boot" element={<BootAnimation onComplete={handleBootComplete} />} />
      <Route path="/*" element={<DashboardShell />} />
    </Routes>
  )
}

export default App

