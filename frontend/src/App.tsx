import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Button, Tooltip, Divider } from 'antd'
import {
  HomeOutlined,
  DashboardOutlined,
  ThunderboltOutlined,
  BookOutlined,
  SettingOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import LiuYao from './pages/LiuYao'
import LiuYaoDetail from './pages/LiuYaoDetail'
import MeiHua from './pages/MeiHua'
import MeiHuaDetail from './pages/MeiHuaDetail'
import Library from './pages/Library'
import SettingsPage from './pages/Settings'

const navItems = [
  { path: '/', label: '首页', icon: HomeOutlined },
  { path: '/liuyao', label: '六爻起卦', icon: ThunderboltOutlined },
  { path: '/meihua', label: '梅花易数', icon: DashboardOutlined },
  { path: '/library', label: '解卦库', icon: BookOutlined },
  { path: '/settings', label: '设置', icon: SettingOutlined },
]

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div style={{ position: 'fixed', left: 0, top: 0, width: 80, height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', backgroundColor: 'white', zIndex: 50, borderRight: '1px solid rgba(46, 46, 51, 0.1)' }}>
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, width: '100%', padding: '0 8px', alignItems: 'center' }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#7bc3db' }}>
          风
        </div>
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

      <Divider style={{ margin: '16px 0', width: 48, borderColor: 'rgba(46, 46, 51, 0.1)' }} />

      <div style={{ width: '100%', padding: '0 8px' }}>
        <Button
          type="text"
          style={{ width: '100%' }}
          onClick={toggleTheme}
          icon={isDark ? <SunOutlined /> : <MoonOutlined />}
        />
      </div>
    </div>
  )
}

function App() {
  return (
    <div style={{ display: 'flex', height: '100%', backgroundColor: 'white' }}>
      <Sidebar />
      
      <main style={{ flex: 1, marginLeft: 80, overflow: 'auto', position: 'relative' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/liuyao" element={<LiuYao />} />
          <Route path="/liuyao/detail" element={<LiuYaoDetail />} />
          <Route path="/meihua" element={<MeiHua />} />
          <Route path="/meihua/detail" element={<MeiHuaDetail />} />
          <Route path="/library" element={<Library />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
