import React from 'react'
import { createRoot } from 'react-dom/client'
import { HeroUIProvider } from '@heroui/react'
import { BrowserRouter } from 'react-router-dom'
import './style.css'
import App from './App'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <HeroUIProvider>
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <App />
      </BrowserRouter>
    </HeroUIProvider>
  </React.StrictMode>
)
