import { Card, Button, Input, Select, Tabs, Radio } from 'antd'
import {
  DashboardOutlined,
  SlidersOutlined,
} from '@ant-design/icons'
import { useState, useCallback } from 'react'
import YaoDisplay from '../components/YaoDisplay'
import { useNavigate } from 'react-router-dom'

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

function generateMeihua(method, numberInput, manualLines, movingYao) {
  let upperNum, lowerNum

  if (method === 'manual') {
    const lowerBits = manualLines[2] * 4 + manualLines[1] * 2 + manualLines[0] * 1
    const upperBits = manualLines[5] * 4 + manualLines[4] * 2 + manualLines[3] * 1
    upperNum = (7 - upperBits) + 1
    lowerNum = (7 - lowerBits) + 1
  } else if (method === 'number') {
    const nums = numberInput.split('').filter(c => /\d/.test(c)).map(Number)
    if (nums.length >= 2) {
      upperNum = nums[0] || 1
      lowerNum = nums[1] || 1
    } else {
      const seed = parseInt(numberInput) || Date.now()
      upperNum = (seed % 8) + 1
      lowerNum = ((seed >> 3) % 8) + 1
    }
  } else {
    const seed = Date.now()
    upperNum = (seed % 8) + 1
    lowerNum = ((seed >> 4) % 8) + 1
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

  const moving = method === 'manual' ? movingYao : ((upperNum + lowerNum) % 6) + 1

  const changeLines = [...lines]
  changeLines[moving - 1] = changeLines[moving - 1] === 1 ? 0 : 1
  const changeGua = linesToHexagram(changeLines)

  const cuoLines = lines.map(l => (l === 1 ? 0 : 1))
  const cuoGua = linesToHexagram(cuoLines)

  const zongLines = [...lines].reverse()
  const zongGua = linesToHexagram(zongLines)

  return {
    upper: mainGua.upper,
    lower: mainGua.lower,
    mainGua: mainGua.name,
    mainLines: lines,
    huGua: huGua.name,
    huGuaData: huGua,
    changeGua,
    cuoGua,
    zongGua,
    moving,
    method,
  }
}

export default function MeiHua() {
  const navigate = useNavigate()
  const [method, setMethod] = useState('manual')
  const [numberInput, setNumberInput] = useState('')
  const [question, setQuestion] = useState('')
  const [manualLines, setManualLines] = useState(Array(6).fill(0))
  const [movingYao, setMovingYao] = useState(1)
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
      const res = generateMeihua(method, numberInput, method === 'manual' ? manualLines : null, movingYao)
      setLoading(false)
      navigate('/meihua/detail', { state: { result: res, question } })
    }, 800)
  }, [method, numberInput, manualLines, movingYao, question, navigate])

  const canSubmit = method === 'auto' || method === 'number' || method === 'manual'

  const tabItems = [
    {
      key: 'manual',
      label: <span><SlidersOutlined /> 手动指定</span>,
      children: (
        <div className="mt-4 flex gap-10">
          <div className="space-y-[10px]">
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
                    style={{ width: 224 }}
                    options={[
                      {
                        value: 0,
                        label: <span className="flex items-center gap-2"><span className="text-sm text-hei-400/60 shrink-0">少阴</span><YaoDisplay type={0} /></span>,
                      },
                      {
                        value: 1,
                        label: <span className="flex items-center gap-2"><span className="text-sm text-hei-400/60 shrink-0">少阳</span><YaoDisplay type={1} /></span>,
                      },
                    ]}
                  />
                </div>
              )
            })}
          </div>
          <div>
            <p className="text-sm text-hei-400/60 mb-3">选择动爻</p>
            <Radio.Group
              value={movingYao}
              onChange={(e) => setMovingYao(e.target.value)}
              className="!flex flex-col gap-2"
            >
              {['上', '五', '四', '三', '二', '初'].map((label, i) => (
                <Radio key={i} value={6 - i}>
                  {label}爻动
                </Radio>
              ))}
            </Radio.Group>
          </div>
        </div>
      ),
    },
    {
      key: 'number',
      label: <span><DashboardOutlined /> 数字起卦</span>,
      children: (
        <div className="mt-4">
          <p className="text-sm text-hei-400/60 mb-4">
            输入任意数字，前数为上卦，后数为下卦。
          </p>
          <Input
            placeholder="输入数字，如：123"
            value={numberInput}
            onChange={(e) => setNumberInput(e.target.value)}
            style={{ maxWidth: 384 }}
          />
        </div>
      ),
    },
    {
      key: 'auto',
      label: <span><SlidersOutlined /> 自动起卦</span>,
      children: (
        <div className="mt-4">
          <p className="text-sm text-hei-400/60 mb-4">
            以当前时间为种子自动生成卦象，心诚则灵。
          </p>
          <div className="bg-hei-400/5 rounded-lg p-6 text-center">
            <DashboardOutlined className="text-2xl text-qing-400 mx-auto mb-3 block" />
            <p className="text-hei-400/70">点击下方「开始排盘」按钮</p>
            <p className="text-sm text-hei-400/50 mt-1">系统将根据当前时间自动起卦</p>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <DashboardOutlined className="text-lg text-qing-400" />
        <h1 className="text-2xl font-bold text-hei-400">梅花易数</h1>
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
            {loading ? '排盘中...' : '开始排盘'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
