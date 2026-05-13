import { useState, useEffect } from 'react'
import { Card, Button } from 'antd'
import {
  ThunderboltOutlined,
  CalendarOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const zodiacIcons = {
  '鼠': '🐭', '牛': '🐮', '虎': '🐯', '兔': '🐰',
  '龙': '🐲', '蛇': '🐍', '马': '🐴', '羊': '🐑',
  '猴': '🐵', '鸡': '🐔', '狗': '🐶', '猪': '🐷',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const today = new Date()
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`

  const [ganzhi, setGanzhi] = useState(null)

  useEffect(() => {
    axios.get('/api/lunartime')
      .then(res => {
        setGanzhi(res.data)
      })
      .catch(() => {
        setGanzhi(null)
      })
  }, [])

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-qing-400 to-chi-400 bg-clip-text text-transparent mb-2">
          风筮
        </h1>
        <p className="text-hei-400/60">心诚则灵，遇事不决问东风</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          className="bg-bai-400 border-hei-400/10 overflow-hidden"
          styles={{ body: { padding: 0 } }}
        >
          <div className="h-1 bg-gradient-to-r from-qing-400 via-huang-400 to-chi-400" />
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <CalendarOutlined className="text-qing-400" />
              <span className="text-sm font-medium text-hei-400/70">今日黄历</span>
            </div>
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-hei-400 mb-1">{dateStr}</div>
              <div className="text-sm text-hei-400/60">
                  <span className="text-qing-400/70 font-medium">{ganzhi?.weekday_cn}</span>
              </div>
            </div>

            <div className="border-t border-hei-400/10 pt-4" />

            {ganzhi && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-qing-400/10 to-bai-500 rounded-lg px-4 py-3 text-center border border-qing-400/20">
                  <div className="text-xs text-hei-400/50 mb-1 tracking-widest">农 历</div>
                  <div className="text-lg font-bold text-hei-400 tracking-wide">
                    {ganzhi.lunar_year_cn}年
                    {ganzhi.is_leap_month ? '闰' : ''}
                    {ganzhi.lunar_month_cn}
                    {ganzhi.lunar_day_cn}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center rounded-lg bg-hei-400/5 px-2 py-2">
                    <div className="text-[10px] text-hei-400/40 mb-1">年干支</div>
                    <div className="text-sm font-bold text-chi-400/80">{ganzhi.ganzhi_year}</div>
                  </div>
                  <div className="text-center rounded-lg bg-hei-400/5 px-2 py-2">
                    <div className="text-[10px] text-hei-400/40 mb-1">月干支</div>
                    <div className="text-sm font-bold text-hei-400/70">{ganzhi.ganzhi_month}</div>
                  </div>
                  <div className="text-center rounded-lg bg-hei-400/5 px-2 py-2">
                    <div className="text-[10px] text-hei-400/40 mb-1">日干支</div>
                    <div className="text-sm font-bold text-hei-400/70">{ganzhi.ganzhi_day}</div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-1">
                  <div className="flex items-center gap-1.5 text-sm text-hei-400/60">
                    <SunOutlined className="text-huang-500" />
                    <span>{ganzhi.ganzhi_year}年</span>
                  </div>
                  <span className="text-hei-400/20">·</span>
                  <div className="flex items-center gap-1.5 text-sm text-hei-400/60">
                    <MoonOutlined className="text-qing-400" />
                    <span>{ganzhi.lunar_month_cn}</span>
                  </div>
                  <span className="text-hei-400/20">·</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{zodiacIcons[ganzhi.zodiac] || '🏮'}</span>
                    <span className="text-sm font-medium text-chi-400/80">
                      {ganzhi.zodiac}年
                    </span>
                  </div>
                </div>
              </div>
            )}

            {!ganzhi && (
              <div className="text-center py-4 text-sm text-hei-400/40">
                加载中...
              </div>
            )}
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-qing-500/10 to-chi-400/10 border-qing-400/20">
          <div className="flex flex-col justify-center items-center text-center py-8">
            <ThunderboltOutlined className="text-2xl text-qing-400 mb-3" />
            <h3 className="text-lg font-bold text-hei-400 mb-2">立即起卦</h3>
            <p className="text-sm text-hei-400/60 mb-4">心有所疑，卦象自知</p>
            <div className="flex gap-3">
              <Button
                type="primary"
                onClick={() => navigate('/liuyao')}
              >
                六爻起卦
              </Button>
              <Button
                onClick={() => navigate('/meihua')}
              >
                梅花易数
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
