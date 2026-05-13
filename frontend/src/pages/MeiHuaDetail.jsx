import { Card, Button, Tag, Spin } from 'antd'
import {
  DashboardOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function YaoLine({ type, isRed }) {
  const isYang = type === 1
  const colorClass = isRed ? 'bg-chi-400' : 'bg-hei-400'
  return (
    <div className="flex items-center justify-center">
      {isYang ? (
        <div className={`h-[10px] w-[88px] rounded-sm ${colorClass}`} />
      ) : (
        <div className="flex items-center gap-[10px]">
          <div className={`h-[10px] w-[39px] rounded-sm ${colorClass}`} />
          <div className={`h-[10px] w-[39px] rounded-sm ${colorClass}`} />
        </div>
      )}
    </div>
  )
}

function HexagramCard({ title, hexagram, highlightMoving, movingYao, isMain }) {
  if (!hexagram) return null
  const lines = hexagram.lines || []
  const hasMoving = highlightMoving && movingYao != null

  return (
    <Card className={`bg-bai-400 border-hei-400/10 ${isMain ? 'border-qing-400/30 ring-1 ring-qing-400/20' : ''}`}>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-sm text-hei-400/60">{title}</span>
          {isMain && (
            <Tag color="warning" className="!text-xs">主卦</Tag>
          )}
        </div>
        <div className="font-bold text-hei-400 text-lg mb-3">{hexagram.name}</div>
        <div className="space-y-[6px]">
          {[...lines].reverse().map((line, i) => {
            const lineIndexFromBottom = lines.length - 1 - i
            const isMovingLine = hasMoving && movingYao === lineIndexFromBottom + 1
            return (
              <div key={i} className="flex items-center justify-center">
                <YaoLine type={line} isRed={isMovingLine && isMain} />
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

function generateAiResponse(result) {
  const methodLabel = result.method === 'manual' ? '手动指定' : result.method === 'number' ? '数字起卦' : '自动起卦'
  return `【梅花易数解析】

您以「${methodLabel}」起卦，得「${result.mainGua}」之卦。

体卦：${result.upper.name}卦
用卦：${result.lower.name}卦
本卦：${result.mainGua}
互卦：${result.huGua}
变卦：${result.changeGua.name}
错卦：${result.cuoGua.name}
综卦：${result.zongGua.name}
动爻：第 ${result.moving} 爻

梅花易数重在外应与即时之象。结合您当前的心境与所问之事，此卦象暗示事物正处于转变之际。建议顺应自然，不宜强求。

体用分析：体卦${result.upper.name}代表您自身，用卦${result.lower.name}代表所问之事。体用生克关系决定吉凶成败。`
}

export default function MeiHuaDetail() {
  const navigate = useNavigate()
  const location = useLocation()
  const { result, question } = location.state || {}

  const [aiResponse, setAiResponse] = useState('')
  const [aiLoading, setAiLoading] = useState(true)

  useEffect(() => {
    if (!result) return
    setAiLoading(true)
    const timer = setTimeout(() => {
      setAiResponse(generateAiResponse(result))
      setAiLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [result])

  if (!result) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <DashboardOutlined className="text-lg text-qing-400" />
          <h1 className="text-2xl font-bold text-hei-400">梅花易数</h1>
        </div>
        <Card className="bg-bai-400 border-hei-400/10">
          <div className="text-center py-12">
            <p className="text-hei-400/60 mb-4">暂无排盘数据</p>
            <Button
              type="primary"
              onClick={() => navigate('/meihua')}
              icon={<ArrowLeftOutlined />}
            >
              返回排盘
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/meihua')}
        />
        <DashboardOutlined className="text-lg text-qing-400" />
        <h1 className="text-2xl font-bold text-hei-400">排盘详情</h1>
      </div>

      <div className="space-y-6">
        {question && (
          <Card className="bg-bai-400 border-hei-400/10">
            <div>
              <span className="text-sm text-hei-400/60">所问之事</span>
              <p className="text-hei-400 font-medium mt-1">{question}</p>
            </div>
          </Card>
        )}

        <div>
          <h2 className="text-xl font-bold text-hei-400 mb-4">排盘结果</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <HexagramCard
              title="本卦"
              hexagram={{
                name: result.mainGua,
                lines: result.mainLines,
                upper: result.upper,
                lower: result.lower,
              }}
              highlightMoving
              movingYao={result.moving}
              isMain
            />
            <HexagramCard
              title="互卦"
              hexagram={result.huGuaData}
            />
            <HexagramCard
              title="变卦"
              hexagram={result.changeGua}
              highlightMoving
              movingYao={result.moving}
            />
            <HexagramCard
              title="错卦"
              hexagram={result.cuoGua}
            />
            <HexagramCard
              title="综卦"
              hexagram={result.zongGua}
            />
          </div>

          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-sm text-hei-400/60">
              <span className="text-qing-400 font-medium">体卦</span>
              <span>{result.upper.name}</span>
            </div>
            <span className="text-hei-400/30">|</span>
            <div className="flex items-center gap-2 text-sm text-hei-400/60">
              <span className="text-chi-400 font-medium">用卦</span>
              <span>{result.lower.name}</span>
            </div>
            <span className="text-hei-400/30">|</span>
            <Tag color="error">动爻：第 {result.moving} 爻</Tag>
          </div>
        </div>

        <Card className="bg-bai-400 border-hei-400/10">
          <div className="flex items-center gap-2 mb-4">
            <DashboardOutlined className="text-qing-400" />
            <h3 className="font-bold text-hei-400">AI 解析</h3>
          </div>
          {aiLoading ? (
            <div className="flex items-center gap-2 text-hei-400/60">
              <Spin size="small" />
              <span>正在解析卦象...</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-hei-400/70 leading-relaxed">
              {aiResponse}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
