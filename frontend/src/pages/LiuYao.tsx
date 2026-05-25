import { Card, Button, Input, Select, Tabs, Flex, Typography } from 'antd'
import {
  ThunderboltOutlined,
  SlidersOutlined,
} from '@ant-design/icons'
import { useState, useCallback } from 'react'
import YaoDisplay from '../components/YaoDisplay'
import { useNavigate } from 'react-router-dom'
import { guaMap, liuyaoGuaNames } from '../values/guaMap'


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
  const isYang = (line) => line === 1 || line === 3
  const isMoving = (line) => line === 2 || line === 3

  const lowerBinary = (isYang(lines[0]) ? 4 : 0) + (isYang(lines[1]) ? 2 : 0) + (isYang(lines[2]) ? 1 : 0)
  const upperBinary = (isYang(lines[3]) ? 4 : 0) + (isYang(lines[4]) ? 2 : 0) + (isYang(lines[5]) ? 1 : 0)

  const changeLowerBits = []
  const changeUpperBits = []
  for (let i = 0; i < 3; i++) {
    const line = lines[i]
    const yang = isYang(line)
    changeLowerBits.push(isMoving(line) ? (yang ? 0 : 1) : (yang ? 1 : 0))
  }
  for (let i = 3; i < 6; i++) {
    const line = lines[i]
    const yang = isYang(line)
    changeUpperBits.push(isMoving(line) ? (yang ? 0 : 1) : (yang ? 1 : 0))
  }
  const changeLower = parseInt(changeLowerBits.join(''), 2)
  const changeUpper = parseInt(changeUpperBits.join(''), 2)

  const upperGua = upperBinary === 0 ? 8 : 8 - upperBinary
  const lowerGua = lowerBinary === 0 ? 8 : 8 - lowerBinary
  const changeUpperGua = changeUpper === 0 ? 8 : 8 - changeUpper
  const changeLowerGua = changeLower === 0 ? 8 : 8 - changeLower

  const mainGuaIndex = guaMap.findIndex(item => {
    const key = Object.keys(item)[0]
    return Number(key) === upperGua && item[key] === lowerGua
  })
  const changeGuaIndex = guaMap.findIndex(item => {
    const key = Object.keys(item)[0]
    return Number(key) === changeUpperGua && item[key] === changeLowerGua
  })

  const mainGua = liuyaoGuaNames[mainGuaIndex]
  const changeGua = liuyaoGuaNames[changeGuaIndex]

  const movingDetails = []
  for (let i = 0; i < 6; i++) {
    if (lines[i] === 2 || lines[i] === 3) {
      movingDetails.push({ position: i + 1, type: lines[i] })
    }
  }

  const mainLines = lines.map(line => ({
    type: line,
    isMoving: line === 2 || line === 3,
  }))

  const changeLines = lines.map(line => {
    const isMoving = line === 2 || line === 3
    const changed = isMoving ? (line === 2 ? 1 : 0) : line
    return { type: changed }
  })

  return {
    mainGua,
    changeGua,
    movingYao: movingDetails.map(m => m.position),
    movingDetails,
    upperGua,
    lowerGua,
    mainLines,
    changeLines,
  }
}

export default function LiuYao() {
  const navigate = useNavigate()
  const [method, setMethod] = useState('manual')
  const [question, setQuestion] = useState('')
  const [manualLines, setManualLines] = useState(Array(6).fill(0))

  const handleLineChange = useCallback((index, value) => {
    setManualLines(prev => {
      const next = [...prev]
      next[index] = parseInt(value)
      return next
    })
  }, [])

  const handleCast = useCallback(() => {
    const rawLines = method === 'manual' ? manualLines : generateAutoLines()
    const result = computeHexagram(rawLines)
    
    navigate('/liuyao/detail', {
      state: {
        upperGua: result.upperGua,
        lowerGua: result.lowerGua,
        movingDetails: result.movingDetails,
        method,
        question,
      },
    })
  }, [method, manualLines, question, navigate])

  const tabItems = [
    {
      key: 'manual',
      label: <span><SlidersOutlined /> 手动指定</span>,
      children: (
        <Flex style={{ marginTop: 16 }} gap={40}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Typography.Text style={{ display: 'block', marginBottom: 12, color: 'rgba(46, 46, 51, 0.6)' }}>
              逐爻选择阴阳
            </Typography.Text>
            {[5, 4, 3, 2, 1, 0].map((dataIndex) => {
              const label = ['初', '二', '三', '四', '五', '上'][dataIndex]
              return (
                <Flex key={dataIndex} align="center" gap={16}>
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
                      {
                        value: 2,
                        label: (
                          <Flex align="center" gap={8}>
                            <Typography.Text style={{ flexShrink: 0, color: 'rgba(46, 46, 51, 0.6)' }}>
                              老阴
                            </Typography.Text>
                            <YaoDisplay type={2} />
                          </Flex>
                        ),
                      },
                      {
                        value: 3,
                        label: (
                          <Flex align="center" gap={8}>
                            <Typography.Text style={{ flexShrink: 0, color: 'rgba(46, 46, 51, 0.6)' }}>
                              老阳
                            </Typography.Text>
                            <YaoDisplay type={3} />
                          </Flex>
                        ),
                      },
                    ]}
                  />
                </Flex>
              )
            })}
          </div>
        </Flex>
      ),
    },
    {
      key: 'auto',
      label: <span><ThunderboltOutlined /> 自动起卦</span>,
      children: (
        <div style={{ marginTop: 16 }}>
          <Typography.Paragraph style={{ marginBottom: 16, color: 'rgba(46, 46, 51, 0.6)' }}>
            以当前时间为种子自动生成卦象，心诚则灵。
          </Typography.Paragraph>
          <div style={{ borderRadius: 8, padding: 24, textAlign: 'center', backgroundColor: 'rgba(46, 46, 51, 0.05)' }}>
            <ThunderboltOutlined style={{ fontSize: 24, margin: '0 auto 12px', display: 'block', color: '#7bc3db' }} />
            <Typography.Text style={{ display: 'block', color: 'rgba(46, 46, 51, 0.7)' }}>
              点击下方「开始排盘」按钮
            </Typography.Text>
            <Typography.Text style={{ display: 'block', marginTop: 4, fontSize: 14, color: 'rgba(46, 46, 51, 0.5)' }}>
              系统将根据当前时间自动起卦
            </Typography.Text>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div style={{ padding: 32, maxWidth: 1024, margin: '0 auto' }}>
      <Flex align="center" gap={8} style={{ marginBottom: 24 }}>
        <ThunderboltOutlined style={{ fontSize: 18, color: '#7bc3db' }} />
        <Typography.Title level={4} style={{ marginBottom: 0, color: '#2e2e33' }}>
          六爻起卦
        </Typography.Title>
      </Flex>

      <Card style={{ marginBottom: 24, backgroundColor: '#f5f1ee', borderColor: 'rgba(46, 46, 51, 0.1)' }}>
        <Flex vertical gap={16}>
          <Input.TextArea
            placeholder="请诚心默念你所问之事..."
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
