import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import {
  Button,
  Card,
  CardBody,
  Tooltip,
  Divider,
} from '@heroui/react'
import {
  Home,
  Hexagon,
  Flower2,
  BookOpen,
  Settings,
  Moon,
  Sun,
} from 'lucide-react'
import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import LiuYao from './pages/LiuYao'
import MeiHua from './pages/MeiHua'
import Library from './pages/Library'
import SettingsPage from './pages/Settings'

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/liuyao', label: '六爻起卦', icon: Hexagon },
  { path: '/meihua', label: '梅花易数', icon: Flower2 },
  { path: '/library', label: '解卦库', icon: BookOpen },
  { path: '/settings', label: '设置', icon: Settings },
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
        <Button
          isIconOnly
          variant="light"
          className="text-xl font-bold text-qing-400"
        >
          风
        </Button>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <Tooltip key={item.path} content={item.label} placement="right">
              <Button
                isIconOnly
                variant={isActive ? 'solid' : 'light'}
                color={isActive ? 'warning' : 'default'}
                onPress={() => navigate(item.path)}
              >
                <Icon size={20} />
              </Button>
            </Tooltip>
          )
        })}
      </nav>

      <Divider className="my-4 bg-hei-400/10 w-12" />

      <div className="w-full px-2">
        <Button
          isIconOnly
          variant="light"
          className="w-full"
          onPress={toggleTheme}
        >
          {isDark ? (
            <Sun size={18} />
          ) : (
            <Moon size={18} />
          )}
        </Button>
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
          <Route path="/meihua" element={<MeiHua />} />
          <Route path="/library" element={<Library />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
