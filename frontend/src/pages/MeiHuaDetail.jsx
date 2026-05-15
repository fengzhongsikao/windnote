import { Card, Button, Tag } from 'antd'
import {
  DashboardOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'

const guaNames = [
  '乾', '兑', '离', '震', '巽', '坎', '艮', '坤',
]

function getGuaFromNumber(n) {
  const idx = ((n - 1) % 8 + 8) % 8
  return { name: guaNames[idx], index: idx }
}

function trigramIndexToBits(index) {
  const val = 7 - index
  return [(val >> 2) & 1, (val >> 1) & 1, val & 1]
}

function linesToHexagram(lines) {
  const lowerVal = lines[2] * 4 + lines[1] * 2 + lines[0] * 1
  const upperVal = lines[5] * 4 + lines[4] * 2 + lines[3] * 1
  const lowerIdx = 7 - lowerVal
  const upperIdx = 7 - upperVal
  return {
    name: guaNames[upperIdx] + guaNames[lowerIdx],
    upper: { name: guaNames[upperIdx], index: upperIdx },
    lower: { name: guaNames[lowerIdx], index: lowerIdx },
    lines: [...lines],
  }
}

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

export default function MeiHuaDetail() {
  const navigate = useNavigate()
  const location = useLocation()
  const { upperNum, lowerNum, movingYao, methodName } = location.state || {}

  if (!upperNum || !lowerNum) {
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

  const upper = getGuaFromNumber(upperNum)
  const lower = getGuaFromNumber(lowerNum)

  const upperBits = trigramIndexToBits(upper.index)
  const lowerBits = trigramIndexToBits(lower.index)

  const lines = [
    lowerBits[2], lowerBits[1], lowerBits[0],
    upperBits[2], upperBits[1], upperBits[0],
  ]

  const mainGua = linesToHexagram(lines)

  const huLowerBits = [lines[1], lines[2], lines[3]]
  const huUpperBits = [lines[2], lines[3], lines[4]]
  const huGuaLines = [...huLowerBits, ...huUpperBits]
  const huGua = linesToHexagram(huGuaLines)

  const changeLines = [...lines]
  changeLines[movingYao - 1] = changeLines[movingYao - 1] === 1 ? 0 : 1
  const changeGua = linesToHexagram(changeLines)

  const cuoLines = lines.map(l => (l === 1 ? 0 : 1))
  const cuoGua = linesToHexagram(cuoLines)

  const zongLines = [...lines].reverse()
  const zongGua = linesToHexagram(zongLines)

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
        <div>
          <h2 className="text-xl font-bold text-hei-400 mb-4">排盘结果</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <HexagramCard
              title="本卦"
              hexagram={{
                name: mainGua.name,
                lines: mainGua.lines,
                upper: mainGua.upper,
                lower: mainGua.lower,
              }}
              highlightMoving
              movingYao={movingYao}
              isMain
            />
            <HexagramCard
              title="互卦"
              hexagram={huGua}
            />
            <HexagramCard
              title="变卦"
              hexagram={changeGua}
              highlightMoving
              movingYao={movingYao}
            />
            <HexagramCard
              title="错卦"
              hexagram={cuoGua}
            />
            <HexagramCard
              title="综卦"
              hexagram={zongGua}
            />
          </div>

          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-sm text-hei-400/60">
              <span className="text-qing-400 font-medium">体卦</span>
              <span>{mainGua.upper.name}</span>
            </div>
            <span className="text-hei-400/30">|</span>
            <div className="flex items-center gap-2 text-sm text-hei-400/60">
              <span className="text-chi-400 font-medium">用卦</span>
              <span>{mainGua.lower.name}</span>
            </div>
            <span className="text-hei-400/30">|</span>
            <Tag color="error">动爻：第 {movingYao} 爻</Tag>
            <span className="text-hei-400/30">|</span>
            <Tag color="processing">{methodName}</Tag>
          </div>
        </div>
      </div>
    </div>
  )
}
