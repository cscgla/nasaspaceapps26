import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@fontsource-variable/pixelify-sans'
import '@fontsource/silkscreen/700.css'
import './index.css'
import App from './App.tsx'
import { JournalProvider } from './state/journal.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <JournalProvider>
        <App />
      </JournalProvider>
    </HashRouter>
  </StrictMode>,
)
