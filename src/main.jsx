import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { SimulatorProvider } from './context/SimulatorContext.jsx'

// BrowserRouter lives at the very top so URL-based routing
// works from the first render (including the intro and boot phases).
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SimulatorProvider>
        <App />
      </SimulatorProvider>
    </BrowserRouter>
  </StrictMode>,
)
