import { StrictMode } from 'react'
import 'default-passive-events'
import { createRoot } from 'react-dom/client'
import App from './app/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
