import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Divider,
  ScrollShadow,
} from '@heroui/react'
import {
  Sparkles,
  Calendar,
  Compass,
  Clock,
  ChevronRight,
  History,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const recentReadings = [
  { id: 1, type: '六爻', question: '问事业发展', date: '今日', gua: '乾为天' },
  { id: 2, type: '梅花', question: '问感情姻缘', date: '昨日', gua: '泽山咸' },
  { id: 3, type: '六爻', question: '问财运投资', date: '3天前', gua: '水火既济' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const today = new Date()
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`
  const weekday = ['日', '一', '二', '三', '四', '五', '六'][today.getDay()]

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent mb-2">
          风筮
        </h1>
        <p className="text-zinc-400">心诚则灵，遇事不决问东风</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Almanac */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-amber-400" />
              <span className="text-sm font-medium text-zinc-300">今日黄历</span>
            </div>
          </CardHeader>
          <CardBody>
            <div className="text-2xl font-bold mb-1">{dateStr}</div>
            <div className="text-sm text-zinc-400 mb-4">星期{weekday}</div>
            <div className="flex gap-2 flex-wrap">
              <Chip size="sm" color="success" variant="flat">宜：祭祀 祈福</Chip>
              <Chip size="sm" color="danger" variant="flat">忌：动土 嫁娶</Chip>
            </div>
          </CardBody>
        </Card>

        {/* Fortune Direction */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Compass size={18} className="text-amber-400" />
              <span className="text-sm font-medium text-zinc-300">财神方位</span>
            </div>
          </CardHeader>
          <CardBody>
            <div className="text-3xl font-bold text-amber-400 mb-1">东南</div>
            <div className="text-sm text-zinc-400 mb-2">广东中山</div>
            <div className="text-xs text-zinc-500">
              喜神：正南 · 福神：正东 · 阳贵：东北
            </div>
          </CardBody>
        </Card>

        {/* Quick Start */}
        <Card className="bg-gradient-to-br from-amber-500/10 to-red-500/10 border-amber-500/20 backdrop-blur-sm">
          <CardBody className="flex flex-col justify-center items-center text-center py-8">
            <Sparkles size={32} className="text-amber-400 mb-3" />
            <h3 className="text-lg font-bold mb-2">立即起卦</h3>
            <p className="text-sm text-zinc-400 mb-4">心有所疑，卦象自知</p>
            <div className="flex gap-3">
              <Button
                color="warning"
                variant="solid"
                onPress={() => navigate('/liuyao')}
                className="bg-gradient-to-r from-amber-500 to-red-500"
              >
                六爻起卦
              </Button>
              <Button
                color="default"
                variant="bordered"
                onPress={() => navigate('/meihua')}
              >
                梅花易数
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      <Divider className="my-8 bg-white/5" />

      {/* Recent Readings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History size={18} className="text-zinc-400" />
            <h2 className="text-lg font-bold">最近占卜</h2>
          </div>
          <Button variant="light" size="sm" className="text-zinc-400">
            查看全部 <ChevronRight size={14} />
          </Button>
        </div>

        <ScrollShadow orientation="horizontal" className="w-full">
          <div className="flex gap-4 pb-2">
            {recentReadings.map((reading) => (
              <Card
                key={reading.id}
                className="min-w-[280px] bg-white/5 border-white/10 hover:border-amber-500/30 transition-colors cursor-pointer"
                isPressable
                onPress={() => navigate('/liuyao')}
              >
                <CardBody>
                  <div className="flex items-center justify-between mb-2">
                    <Chip size="sm" color={reading.type === '六爻' ? 'warning' : 'secondary'} variant="flat">
                      {reading.type}
                    </Chip>
                    <span className="text-xs text-zinc-500">{reading.date}</span>
                  </div>
                  <div className="font-bold mb-1">{reading.question}</div>
                  <div className="text-sm text-zinc-400">{reading.gua}</div>
                </CardBody>
              </Card>
            ))}
          </div>
        </ScrollShadow>
      </div>
    </div>
  )
}
