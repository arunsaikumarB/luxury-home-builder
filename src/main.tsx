import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Preserve deep links (#quote, #contact, etc). Only force top on bare `/` loads.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

const hasSectionHash = () => {
  const hash = window.location.hash.replace(/^#/, '')
  return Boolean(hash) && hash !== 'walkthrough' && hash !== 'top'
}

const resetToTop = () => {
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

if (!hasSectionHash()) {
  resetToTop()
}

window.addEventListener('pageshow', (event) => {
  if (event.persisted && !hasSectionHash()) resetToTop()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
