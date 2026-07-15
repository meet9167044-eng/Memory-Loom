import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import IntroHero from './components/intro/IntroHero'
import DashboardShell from './components/layout/DashboardShell'

function App() {
  const [entered, setEntered] = useState(
    () => sessionStorage.getItem('loom-entered') === 'true',
  )

  const handleEnter = () => {
    sessionStorage.setItem('loom-entered', 'true')
    setEntered(true)
  }

  if (!entered) {
    return <IntroHero onEnter={handleEnter} />
  }

  return (
    <BrowserRouter>
      <DashboardShell />
    </BrowserRouter>
  )
}

export default App
