import React from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import { HashRouter } from 'react-router-dom'
import './style.css'
import App from './App'

const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <ConfigProvider theme={{ token: { fontFamily: '\'LXGWWenKai\', \'Noto Serif SC\', serif' } }}>
      <HashRouter>
        <App />
      </HashRouter>
    </ConfigProvider>
  </React.StrictMode>
)
