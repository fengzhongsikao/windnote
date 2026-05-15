import { Card, Button, Input, Select, Tabs, Radio, InputNumber, Checkbox } from 'antd'
import {
  DashboardOutlined,
  SlidersOutlined,
} from '@ant-design/icons'
import { useState, useCallback } from 'react'
import YaoDisplay from '../components/YaoDisplay'
import { useNavigate } from 'react-router-dom'

function generateMeihua(method, numberInput, manualLines, movingYao, movingWithShichen) {
  let upperNum, lowerNum, moving

  if (method === 'manual') {
    const lowerBits = manualLines[0] * 4 + manualLines[1] * 2 + manualLines[2] * 1
    const upperBits = manualLines[3] * 4 + manualLines[4] * 2 + manualLines[5] * 1
    upperNum = 8 - upperBits
    lowerNum = 8 - lowerBits
    moving = movingYao
  } else if (method === 'number') {
    const str = String(numberInput ?? '')
    const nums = str.split('').filter(c => /\d/.test(c)).map(Number)
    const upperRemainder = nums[0] % 8
    upperNum = upperRemainder === 0 ? 8 : upperRemainder
    const lowerRemainder = nums[1] % 8
    lowerNum = lowerRemainder === 0 ? 8 : lowerRemainder
    let movingRemainder = nums[2] % 6
    moving = movingRemainder === 0 ? 6 : movingRemainder
    if (movingWithShichen) {
      const hour = new Date().getHours()
      const shichenIndex = Math.floor(((hour + 1) % 24) / 2)
      moving = ((moving - 1 + shichenIndex) % 6) + 1
    }
  } else {
    const randUpper = Math.floor(Math.random() * 8) + 1
    const randLower = Math.floor(Math.random() * 8) + 1
    upperNum = randUpper
    lowerNum = randLower
    moving = Math.floor(Math.random() * 6) + 1
  }

  return { upperNum, lowerNum, moving }
}

export default function MeiHua() {
  const navigate = useNavigate()
  const [method, setMethod] = useState('manual')
  const [numberValue, setNumberValue] = useState('')
  const [question, setQuestion] = useState('')
  const [manualLines, setManualLines] = useState(Array(6).fill(0))
  const [movingYao, setMovingYao] = useState(1)
  const [movingWithShichen, setMovingWithShichen] = useState(false)
  const handleLineChange = useCallback((index, value) => {
    setManualLines(prev => {
      const next = [...prev]
      next[index] = parseInt(value)
      return next
    })
  }, [])

  const handleCast = useCallback(() => {
    const res = generateMeihua(method, numberValue, method === 'manual' ? manualLines : null, movingYao, movingWithShichen)
    console.log(res);
    return
    navigate('/meihua/detail', {
      state: {
        upperNum: res.upperNum,
        lowerNum: res.lowerNum,
        manualLines: method === 'manual' ? manualLines : null,
        movingYao: res.moving,
      },
    })
  }, [method, numberValue, manualLines, movingYao, movingWithShichen, navigate])

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
            起卦算法: 第一数÷8 所得余数为上卦,第二数÷8 所得余数为下卦,第三数÷6所得余数为动爻。
          </p>
          <div className="flex items-center gap-4">
            <InputNumber
              placeholder="请输入一个三位的数字"
              value={numberValue}
              min={100}
              max={999}
              onChange={(val) => setNumberValue(val)}
              style={{ width: '30%' }}
            />
            <Checkbox checked={movingWithShichen} onChange={(e) => setMovingWithShichen(e.target.checked)}>
              动爻加时辰
            </Checkbox>
          </div>
        </div>
      ),
    },
    {
      key: 'auto',
      label: <span><SlidersOutlined /> 自动起卦</span>,
      children: (
        <div className="mt-4">
          <p className="text-sm text-hei-400/60 mb-4">
            假尔泰假尔泰筮假尔泰筮有常,XX今以XX事,未知可否,则以爰质所疑于神于灵，吉凶得失，悔吝忧虞，惟尔有神，尚明告之。
          </p>
          <div className="bg-hei-400/5 rounded-lg p-6 text-center">
            <DashboardOutlined className="text-2xl text-qing-400 mx-auto mb-3 block" />
            <p className="text-hei-400/70">点击下方「开始排盘」按钮</p>
            <p className="text-sm text-hei-400/50 mt-1">系统将根随机自动起卦</p>
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
            disabled={!canSubmit}
            className="!w-full"
          >
            开始排盘
          </Button>
        </div>
      </Card>
    </div>
  )
}
