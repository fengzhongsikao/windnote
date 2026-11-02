import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Button, ConfigProvider, Tooltip, Divider, theme } from 'antd'
import {
  HomeOutlined,
  UpCircleOutlined,
  DownCircleOutlined,
  BookOutlined,
  SettingOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import Dashboard from './pages/Dashboard'
import LiuYao from './pages/liuyao/LiuYao'
import LiuYaoDetail from './pages/liuyao/LiuYaoDetail'
import LiuYaoRecords from './pages/liuyao/LiuYaoRecords'
import MeiHua from './pages/meihua/MeiHua'
import MeiHuaDetail from './pages/meihua/MeiHuaDetail'
import MeiHuaRecords from './pages/meihua/MeiHuaRecords'
import Library from './pages/Library'
import SettingsPage from './pages/Settings'

const navItems = [
  { path: '/', label: '首页', icon: HomeOutlined },
  { path: '/liuyao', label: '六爻起卦', icon: UpCircleOutlined  },
  { path: '/meihua', label: '梅花易数', icon: DownCircleOutlined },
  { path: '/library', label: '解卦库', icon: BookOutlined },
  { path: '/settings', label: '设置', icon: SettingOutlined },
]

const themeKey = 'windnote-theme'

function Sidebar({ isDark, onToggleTheme }: { isDark: boolean, onToggleTheme: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div style={{ position: 'fixed', left: 0, top: 0, width: 80, height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', backgroundColor: 'var(--surface)', zIndex: 50, borderRight: '1px solid var(--border)' }}>
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, width: '100%', padding: '0 8px', alignItems: 'center' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <Tooltip key={item.path} title={item.label} placement="right">
              <Button
                type={isActive ? 'primary' : 'text'}
                icon={<Icon />}
                onClick={() => navigate(item.path)}
                style={{ width: '100%' }}
                size="large"
              />
            </Tooltip>
          )
        })}
      </nav>

      <Divider style={{ margin: '16px 0', width: 48, borderColor: 'var(--border)' }} />

      <div style={{ width: '100%', padding: '0 8px' }}>
        <Tooltip title={isDark ? '白天模式' : '夜晚模式'} placement="right">
          <Button
            type="text"
            style={{ width: '100%' }}
            onClick={onToggleTheme}
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            aria-label={isDark ? '切换到白天模式' : '切换到夜晚模式'}
          />
        </Tooltip>
      </div>
    </div>
  )
}

function App() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem(themeKey) === 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem(themeKey, isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <ConfigProvider theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
    <div style={{ display: 'flex', height: '100%', backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Sidebar isDark={isDark} onToggleTheme={() => setIsDark((value) => !value)} />
      
      <main style={{ flex: 1, marginLeft: 80, overflow: 'auto', position: 'relative' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/liuyao" element={<LiuYao />} />
          <Route path="/liuyao/detail" element={<LiuYaoDetail />} />
          <Route path="/liuyao/records" element={<LiuYaoRecords />} />
          <Route path="/meihua" element={<MeiHua />} />
          <Route path="/meihua/detail" element={<MeiHuaDetail />} />
          <Route path="/meihua/records" element={<MeiHuaRecords />} />
          <Route path="/library" element={<Library />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
    </ConfigProvider>
  )
}

export default App
