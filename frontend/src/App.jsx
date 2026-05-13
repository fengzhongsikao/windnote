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
    <div className="fixed left-0 top-0 w-20 h-screen flex flex-col items-center py-6 bg-bai-400 border-r border-hei-400/10 z-50">
      <nav className="flex-1 flex flex-col gap-2 w-full px-2 items-center">
        <div className="text-xl font-bold text-qing-400 mb-2">
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
                className="!w-full"
                size="large"
              />
            </Tooltip>
          )
        })}
      </nav>

      <Divider className="!my-4 !bg-hei-400/10 !w-12" />

      <div className="w-full px-2">
        <Button
          type="text"
          className="!w-full"
          onClick={toggleTheme}
          icon={isDark ? <SunOutlined /> : <MoonOutlined />}
        />
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="flex h-full bg-white">
      <Sidebar />
      
      <main className="flex-1 ml-20 overflow-auto relative">
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
