import { Card, Button, Input, Select, Tabs, Radio, Flex, InputNumber, Checkbox, Typography, message } from 'antd'
import { useState, useCallback } from 'react'
import YaoDisplay from '@/components/YaoDisplay'
import { useNavigate } from 'react-router-dom'
import { SaveMeihuaRecord } from '../../../wailsjs/go/zhanbu/App'

const YAO_NAMES = ['上', '五', '四', '三', '二', '初'] as const
const YAO_DISPLAY_ORDER = [0,1,2,3,4,5] as const

const LINE_OPTIONS = [
  {
    value: 0,
    label: (
      <Flex align="center" gap={8}>
        <Typography.Text style={{ flexShrink: 0, color: 'rgba(46, 46, 51, 0.6)' }}>
          少阴
        </Typography.Text>
        <YaoDisplay type={0} />
      </Flex>
    ),
  },
  {
    value: 1,
    label: (
      <Flex align="center" gap={8}>
        <Typography.Text style={{ flexShrink: 0, color: 'rgba(46, 46, 51, 0.6)' }}>
          少阳
        </Typography.Text>
        <YaoDisplay type={1} />
      </Flex>
    ),
  },
]

function toGuaNum(n: number) {
  const r = n % 8
  return r === 0 ? 8 : r
}

function toYaoNum(n: number) {
  const r = n % 6
  return r === 0 ? 6 : r
}

function generateMeihua(method: string, numberInput: number | null, manualLines: number[] | null, movingYao: number, movingWithShichen: boolean) {
  let upperNum, lowerNum, moving

  if (method === 'manual') {
    // manualLines: [上, 五, 四, 三, 二, 初]
    const upperBits = manualLines![2] * 4 + manualLines![1] * 2 + manualLines![0] * 1
    const lowerBits = manualLines![5] * 4 + manualLines![4] * 2 + manualLines![3] * 1
    upperNum = 8 - upperBits
    lowerNum = 8 - lowerBits
    moving = movingYao 
  } else if (method === 'number') {
    const str = String(numberInput ?? '').replace(/\D/g, '')

    if (str.length === 3) {
      const d0 = parseInt(str[0])
      const d1 = parseInt(str[1])
      const d2 = parseInt(str[2])

      if (d2 === 0) {
        const a = d0
        const bc = d1 * 10 + d2
        upperNum = toGuaNum(a)
        lowerNum = toGuaNum(bc)
        moving = toYaoNum(a + bc)
      } else if (d1 === 0) {
        const ab = d0 * 10 + d1
        const c = d2
        upperNum = toGuaNum(ab)
        lowerNum = upperNum
        moving = toYaoNum(c)
      } else {
        upperNum = toGuaNum(d0)
        lowerNum = toGuaNum(d1)
        moving = toYaoNum(d2)
      }
    } else {
      const nums = str.split('').filter(c => /\d/.test(c)).map(Number)
      upperNum = toGuaNum(nums[0] || 0)
      lowerNum = toGuaNum(nums[1] || 0)
      moving = toYaoNum(nums[2] || 0)
    }

    if (movingWithShichen) {
      const hour = new Date().getHours()
      const shichenIndex = Math.floor(((hour + 1) % 24) / 2)
      moving = ((moving + shichenIndex) % 6) + 1
    }
  } else if (method === 'auto') {
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
  const [numberValue, setNumberValue] = useState<number | null>(null)
  const [question, setQuestion] = useState('')
  const [manualLines, setManualLines] = useState(Array(6).fill(0))
  const [movingYao, setMovingYao] = useState(1)
  const [movingWithShichen, setMovingWithShichen] = useState(false)

  const handleLineChange = useCallback((index: number, value: number) => {
    setManualLines(prev => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }, [])

  const handleCast = useCallback(async () => {
    const trimmedQuestion = question.trim()
    if (!trimmedQuestion) {
      message.warning('请填写所问之事')
      return
    }

    const res = generateMeihua(method, numberValue, method === 'manual' ? manualLines : null, movingYao, movingWithShichen)

    const createdAt = new Date().toISOString()
    const record = {
      id: Date.now().toString(),
      upperNum: res.upperNum,
      lowerNum: res.lowerNum,
      movingYao: res.moving,
      method,
      question: trimmedQuestion,
      createdAt,
    }

    try {
      await SaveMeihuaRecord(JSON.stringify(record))
    } catch (err) {
      console.error('保存梅花排盘记录失败:', err)
    }

    navigate('/meihua/detail', {
      state: {
        upperNum: res.upperNum,
        lowerNum: res.lowerNum,
        movingYao: res.moving,
        question: trimmedQuestion,
        method,
        createdAt,
      },
    })
  }, [method, numberValue, manualLines, movingYao, movingWithShichen, question, navigate])

  const tabItems = [
    {
      key: 'manual',
      label: <span>手动指定</span>,
      children: (
        <div style={{ marginTop: 16 }}>
          <Flex style={{ marginBottom: 12 }} gap={40}>
            <Typography.Text style={{ width: 272, color: 'rgba(46, 46, 51, 0.6)' }}>
              逐爻选择阴阳
            </Typography.Text>
            <Typography.Text style={{ color: 'rgba(46, 46, 51, 0.6)' }}>
              选择动爻
            </Typography.Text>
          </Flex>
          <Flex gap={40}>
            <Flex vertical gap={16} style={{ width: 272 }}>
              {YAO_DISPLAY_ORDER.map((dataIndex) => (
                <Flex key={dataIndex} align="center" gap={16}>
                  <Typography.Text style={{ width: 32, flexShrink: 0, color: 'rgba(46, 46, 51, 0.6)' }}>
                    {YAO_NAMES[dataIndex]}爻
                  </Typography.Text>
                  <Select
                    size="small"
                    value={manualLines[dataIndex]}
                    onChange={(val) => handleLineChange(dataIndex, val)}
                    style={{ width: 224 }}
                    options={LINE_OPTIONS}
                  />
                </Flex>
              ))}
            </Flex>
            <Radio.Group
              vertical
              value={movingYao}
              onChange={(e) => setMovingYao(e.target.value)}
              options={YAO_DISPLAY_ORDER.map((dataIndex) => ({
                value: dataIndex + 1,
                label: `${YAO_NAMES[dataIndex]}爻动`,
                style: { height: 24, lineHeight: '24px' },
              }))}
              style={{ gap: 16 }}
            />
          </Flex>
        </div>
      ),
    },
    {
      key: 'number',
      label: <span>数字起卦</span>,
      children: (
        <div style={{ marginTop: 16 }}>
          <Typography.Paragraph style={{ marginBottom: 16, color: 'rgba(46, 46, 51, 0.6)' }}>
            起卦算法: 第一数÷8 所得余数为上卦,第二数÷8 所得余数为下卦,第三数÷6所得余数为动爻。
          </Typography.Paragraph>
          <Flex align="center" gap={16}>
            <InputNumber
              placeholder="请输入一个三位的数字"
              value={numberValue}
              min={101}
              max={999}
              onChange={(val) => setNumberValue(val)}
              style={{ width: 240 }}
            />
            <Checkbox checked={movingWithShichen} onChange={(e) => setMovingWithShichen(e.target.checked)}>
              动爻加时辰
            </Checkbox>
          </Flex>
        </div>
      ),
    },
    {
      key: 'auto',
      label: <span>自动起卦</span>,
      children: (
        <div style={{ marginTop: 16 }}>
          <Typography.Paragraph style={{ marginBottom: 16, color: 'rgba(46, 46, 51, 0.6)' }}>
            假尔泰筮有常，假尔泰筮有常，某官姓名，今以某事云云，未知可否？爰质所疑于神灵，吉凶得失、悔吝忧虞，惟尔有神，尚明告之。
          </Typography.Paragraph>
          <div style={{ borderRadius: 8, padding: 24, textAlign: 'center', backgroundColor: 'rgba(46, 46, 51, 0.05)' }}>
            <Typography.Text style={{ display: 'block', color: 'rgba(46, 46, 51, 0.7)' }}>
              点击下方「开始排盘」按钮
            </Typography.Text>
            <Typography.Text style={{ display: 'block', marginTop: 4, fontSize: 14, color: 'rgba(46, 46, 51, 0.5)' }}>
              系统将根据随机自动起卦
            </Typography.Text>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div style={{ padding: 32, maxWidth: 1024, margin: '0 auto' }}>
      <Flex align="center" gap={8} style={{ marginBottom: 24 }}>
        <Typography.Title level={4} style={{ margin: 0, color: '#2e2e33' }}>
          梅花易数
        </Typography.Title>
      </Flex>

      <Card style={{ marginBottom: 24, backgroundColor: '#D4E4DF', borderColor: 'rgba(46, 46, 51, 0.1)' }}>
        <Flex vertical gap={16}>
          <Input.TextArea
            placeholder="请输入所问之事（必填）"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{ maxWidth: 480 }}
            rows={3}
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
            style={{ width: '100%' }}
          >
            开始排盘
          </Button>

          <Button
            type="default"
            size="large"
            onClick={() => navigate('/meihua/records')}
            style={{ width: '100%' }}
          >
            排盘记录
          </Button>
        </Flex>
      </Card>
    </div>
  )
}
