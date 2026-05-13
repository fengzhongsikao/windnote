import { Card, Button, Tabs, Select, Input } from 'antd'
import {
  ThunderboltOutlined,
  SlidersOutlined,
} from '@ant-design/icons'
import { useState, useCallback } from 'react'
import YaoDisplay from '../components/YaoDisplay'
import { useNavigate } from 'react-router-dom'

const bagua = [7, 6, 5, 4, 3, 2, 1, 0]

const liuyaoGuaNames = [
  '乾为天', '坤为地', '水雷屯', '山水蒙', '水天需', '天水讼', '地水师', '水地比',
  '风天小畜', '天泽履', '地天泰', '天地否', '天火同人', '火天大有', '地山谦', '雷地豫',
  '泽雷随', '山风蛊', '地泽临', '风地观', '火雷噬嗑', '山火贲', '山地剥', '地雷复',
  '天雷无妄', '山天大畜', '山雷颐', '泽风大过', '坎为水', '离为火', '泽山咸', '雷风恒',
  '天山遁', '雷天大壮', '火地晋', '地火明夷', '风火家人', '火泽睽', '水山蹇', '雷水解',
  '山泽损', '风雷益', '泽天夬', '天风姤', '泽地萃', '地风升', '泽水困', '水风井',
  '泽火革', '火风鼎', '震为雷', '艮为山', '风山渐', '雷泽归妹', '雷火丰', '火山旅',
  '巽为风', '兑为泽', '风水涣', '水泽节', '风泽中孚', '雷山小过', '水火既济', '火水未济',
]

function getGuaIndex(upper, lower) {
  return bagua[upper] * 8 + bagua[lower]
}

function generateAutoLines() {
  const lines = []
  const seed = Date.now()
  for (let i = 0; i < 6; i++) {
    const val = Math.floor(((seed * (i + 1) * 9301 + 49297) % 233280) / 233280 * 4)
    lines.push(val)
  }
  return lines
}

function computeHexagram(lines) {
  const upperBits = []
  const lowerBits = []
  const changeBits = []

  for (let i = 5; i >= 0; i--) {
    const line = lines[i]
    const isYang = line === 1 || line === 3
    const isMoving = line === 0 || line === 1
    if (i >= 3) {
      upperBits.push(isYang ? 1 : 0)
    } else {
      lowerBits.push(isYang ? 1 : 0)
    }
    changeBits.push(isMoving ? (isYang ? 0 : 1) : (isYang ? 1 : 0))
  }

  const upperIdx = parseInt(upperBits.join(''), 2)
  const lowerIdx = parseInt(lowerBits.join(''), 2)
  const changeUpper = parseInt(changeBits.slice(0, 3).join(''), 2)
  const changeLower = parseInt(changeBits.slice(3, 6).join(''), 2)

  const mainGua = liuyaoGuaNames[getGuaIndex(upperIdx, lowerIdx)]
  const changeGua = liuyaoGuaNames[getGuaIndex(changeUpper, changeLower)]

  return {
    lines: lines.reverse(),
    mainGua,
    changeGua,
    movingYao: lines.map((l, i) => (l === 0 || l === 1 ? 6 - i : null)).filter(Boolean),
  }
}

export default function LiuYao() {
  const navigate = useNavigate()
  const [method, setMethod] = useState('manual')
  const [question, setQuestion] = useState('')
  const [manualLines, setManualLines] = useState(Array(6).fill(0))
  const [loading, setLoading] = useState(false)

  const handleLineChange = useCallback((index, value) => {
    setManualLines(prev => {
      const next = [...prev]
      next[index] = parseInt(value)
      return next
    })
  }, [])

  const handleCast = useCallback(() => {
    setLoading(true)

    setTimeout(() => {
      const rawLines = method === 'manual'
        ? manualLines.map(l => l === 0 ? 2 : 3)
        : generateAutoLines()
      const result = computeHexagram(rawLines)
      setLoading(false)
      navigate('/liuyao/detail', { state: { result, question } })
    }, 1000)
  }, [method, manualLines, question, navigate])

  const canSubmit = method === 'auto' || method === 'manual'

  const tabItems = [
    {
      key: 'manual',
      label: (
        <span><SlidersOutlined /> 手动指定</span>
      ),
      children: (
        <div className="mt-4 space-y-[10px]">
          <p className="text-sm text-hei-400/60 mb-3">逐爻选择阴阳</p>
          {[5, 4, 3, 2, 1, 0].map((dataIndex) => {
            const label = ['初', '二', '三', '四', '五', '上'][dataIndex]
            return (
              <div key={dataIndex} className="flex items-center gap-4">
                <span className="text-sm text-hei-400/60 w-8 shrink-0">{label}爻</span>
                <Select
                  size="small"
                  value={manualLines[dataIndex]}
                  onChange={(val) => handleLineChange(dataIndex, val)}
                  style={{ width: 112 }}
                  options={[
                    { value: 0, label: '阴爻' },
                    { value: 1, label: '阳爻' },
                  ]}
                />
                <YaoDisplay type={manualLines[dataIndex]} />
              </div>
            )
          })}
        </div>
      ),
    },
    {
      key: 'auto',
      label: (
        <span><ThunderboltOutlined /> 自动起卦</span>
      ),
      children: (
        <div className="mt-4">
          <p className="text-sm text-hei-400/60 mb-4">
            以当前时间为种子自动生成卦象，心诚则灵。
          </p>
          <div className="bg-hei-400/5 rounded-lg p-6 text-center">
            <ThunderboltOutlined className="text-2xl text-qing-400 mx-auto mb-3 block" />
            <p className="text-hei-400/70">点击下方「开始摇卦」按钮</p>
            <p className="text-sm text-hei-400/50 mt-1">系统将根据当前时间自动起卦</p>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <ThunderboltOutlined className="text-lg text-qing-400" />
        <h1 className="text-2xl font-bold text-hei-400">六爻起卦</h1>
      </div>

      <Card className="bg-bai-400 border-hei-400/10 mb-6">
        <div className="space-y-4">
          <Input.TextArea
            label="所问之事（选填）"
            placeholder="请诚心默念你所问之事..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{ maxWidth: 480 }}
          />

          <Tabs
            activeKey={method}
            onChange={setMethod}
            items={tabItems}
          />

          <Button
            type="primary"
            size="large"
            onClick={handleCast}
            loading={loading}
            disabled={!canSubmit}
            className="!w-full"
          >
            {loading ? '摇卦中...' : '开始排盘'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
