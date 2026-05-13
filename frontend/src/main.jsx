import React from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import { BrowserRouter } from 'react-router-dom'
import './style.css'
import App from './App'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#6ab3cb',
          colorWarning: '#e8c954',
          colorError: '#ae3136',
          colorBgContainer: '#f5f1ee',
          colorText: '#2e2e33',
          colorTextSecondary: '#6b7280',
          borderRadius: 8,
        },
      }}
    >
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>
)
