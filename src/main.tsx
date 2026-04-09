import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './pdfGames.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'

// Avoid precache/service worker on dev — it often serves stale bundles on localhost:5173 after pulls.
if (import.meta.env.PROD) {
  registerSW({ immediate: true })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
