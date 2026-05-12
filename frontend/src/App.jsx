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
    <div className="w-20 h-full flex flex-col items-center py-6 bg-black/20 backdrop-blur-xl border-r border-white/5">
      <div className="mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <span className="text-lg font-bold text-white">风</span>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-2 w-full px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <Tooltip key={item.path} content={item.label} placement="right">
              <Button
                isIconOnly
                variant={isActive ? 'solid' : 'light'}
                color={isActive ? 'warning' : 'default'}
                className={`w-full h-12 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-red-500/20 shadow-lg shadow-amber-500/10'
                    : 'hover:bg-white/5'
                }`}
                onPress={() => navigate(item.path)}
              >
                <Icon size={20} className={isActive ? 'text-amber-400' : 'text-zinc-400'} />
              </Button>
            </Tooltip>
          )
        })}
      </nav>

      <Divider className="my-4 bg-white/5 w-12" />

      <Button
        isIconOnly
        variant="light"
        className="rounded-xl hover:bg-white/5"
        onPress={toggleTheme}
      >
        {isDark ? (
          <Sun size={18} className="text-zinc-400" />
        ) : (
          <Moon size={18} className="text-zinc-400" />
        )}
      </Button>
    </div>
  )
}

function App() {
  return (
    <div className="flex h-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      {/* Background pattern */}
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      <Sidebar />
      
      <main className="flex-1 overflow-auto relative">
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
