import { Card, Button, Input, Select, Tabs, Radio, Flex, InputNumber, Checkbox, Typography } from 'antd'
import {
  DashboardOutlined,
  SlidersOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { useState, useCallback } from 'react'
import YaoDisplay from '../components/YaoDisplay'
import { useNavigate } from 'react-router-dom'

function toGuaNum(n) {
  const r = n % 8
  return r === 0 ? 8 : r
}

function toYaoNum(n) {
  const r = n % 6
  return r === 0 ? 6 : r
}

function generateMeihua(method, numberInput, manualLines, movingYao, movingWithShichen) {
  let upperNum, lowerNum, moving

  if (method === 'manual') {
    const lowerBits = manualLines[0] * 4 + manualLines[1] * 2 + manualLines[2] * 1
    const upperBits = manualLines[3] * 4 + manualLines[4] * 2 + manualLines[5] * 1
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
    navigate('/meihua/detail', {
      state: {
        upperNum: res.upperNum,
        lowerNum: res.lowerNum,
        manualLines: method === 'manual' ? manualLines : null,
        movingYao: res.moving,
      },
    })
  }, [method, numberValue, manualLines, movingYao, movingWithShichen, navigate])

  const tabItems = [
    {
      key: 'manual',
      label: <span><SlidersOutlined /> 手动指定</span>,
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
          <Radio.Group
            value={movingYao}
            onChange={(e) => setMovingYao(e.target.value)}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
              {[5, 4, 3, 2, 1, 0].map((dataIndex) => {
              const label = ['初', '二', '三', '四', '五', '上'][dataIndex]
              return (
                <Flex key={dataIndex} align="center" gap={40}>
                  <Flex align="center" gap={16} style={{ width: 272 }}>
                    <Typography.Text style={{ width: 32, flexShrink: 0, color: 'rgba(46, 46, 51, 0.6)' }}>
                      {label}爻
                    </Typography.Text>
                    <Select
                      size="small"
                      value={manualLines[dataIndex]}
                      onChange={(val) => handleLineChange(dataIndex, val)}
                      style={{ width: 224 }}
                      options={[
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
                      ]}
                    />
                  </Flex>
                  <Radio value={dataIndex + 1}>{label}爻动</Radio>
                </Flex>
              )
            })}
            </Radio.Group>
        </div>
      ),
    },
    {
      key: 'number',
      label: <span><DashboardOutlined /> 数字起卦</span>,
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
      label: <span><ThunderboltOutlined /> 自动起卦</span>,
      children: (
        <div style={{ marginTop: 16 }}>
          <Typography.Paragraph style={{ marginBottom: 16, color: 'rgba(46, 46, 51, 0.6)' }}>
            假尔泰筮有常，假尔泰筮有常，某官姓名，今以某事云云，未知可否？爰质所疑于神灵，吉凶得失、悔吝忧虞，惟尔有神，尚明告之。
          </Typography.Paragraph>
          <div style={{ borderRadius: 8, padding: 24, textAlign: 'center', backgroundColor: 'rgba(46, 46, 51, 0.05)' }}>
            <DashboardOutlined style={{ fontSize: 24, margin: '0 auto 12px', display: 'block', color: '#7bc3db' }} />
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
        <DashboardOutlined style={{ fontSize: 18, color: '#7bc3db' }} />
        <Typography.Title level={4} style={{ marginBottom: 0, color: '#2e2e33' }}>
          梅花易数
        </Typography.Title>
      </Flex>

      <Card style={{ marginBottom: 24, backgroundColor: '#f5f1ee', borderColor: 'rgba(46, 46, 51, 0.1)' }}>
        <Flex vertical gap={16}>
          <Input.TextArea
            placeholder="请输入事项内容（选填）"
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
        </Flex>
      </Card>
    </div>
  )
}
