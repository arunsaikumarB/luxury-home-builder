import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Always start at the top on load / hard refresh (prevents mid-walkthrough restore)
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

const resetToStart = () => {
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

resetToStart()
window.addEventListener('pageshow', (event) => {
  // Also reset when restoring from bfcache
  if (event.persisted) resetToStart()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
