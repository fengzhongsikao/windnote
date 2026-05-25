import { List, Button, Typography, Flex, Tag, Empty } from 'antd'
import {
  ThunderboltOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
  HistoryOutlined,
} from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GetDivinationRecords } from '../../../wailsjs/go/zhanbu/App'
import { guaMap, liuyaoGuaNames } from '@/values/guaMap'

const singleGuaNames: Record<number, string> = {
  1: '乾 ☰',
  2: '兑 ☱',
  3: '离 ☲',
  4: '震 ☳',
  5: '巽 ☴',
  6: '坎 ☵',
  7: '艮 ☶',
  8: '坤 ☷',
}

const methodLabels: Record<string, string> = {
  manual: '手动',
  auto: '自动',
}

interface MovingDetail {
  position: number
  type: number
}

interface DivinationRecord {
  id: string
  upperGua: number
  lowerGua: number
  movingDetails: MovingDetail[]
  method: string
  question: string
  createdAt: string
}

function getGuaName(upperGua: number, lowerGua: number): string {
  const idx = guaMap.findIndex(item => {
    const key = Object.keys(item)[0]
    return Number(key) === upperGua && item[key] === lowerGua
  })
  return liuyaoGuaNames[idx] || '未知卦'
}

function formatTime(isoString: string): string {
  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export default function LiuYaoRecords() {
  const navigate = useNavigate()
  const [records, setRecords] = useState<DivinationRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecords()
  }, [])

  const loadRecords = async () => {
    try {
      const data = await GetDivinationRecords()
      const parsed = JSON.parse(data) as DivinationRecord[]
      setRecords(parsed.reverse())
    } catch (err) {
      console.error('加载排盘记录失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRecordClick = (record: DivinationRecord) => {
    navigate('/liuyao/detail', {
      state: {
        upperGua: record.upperGua,
        lowerGua: record.lowerGua,
        movingDetails: record.movingDetails,
        method: record.method,
        question: record.question,
      },
    })
  }

  return (
    <div style={{ padding: 32, maxWidth: 1024, margin: '0 auto' }}>
      <Flex align="center" justify="space-between" style={{ marginBottom: 24 }}>
        <Flex align="center" gap={8}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/liuyao')}
          />
          <HistoryOutlined style={{ fontSize: 18, color: '#7bc3db' }} />
          <Typography.Title level={4} style={{ marginBottom: 0, color: '#2e2e33' }}>
            排盘记录
          </Typography.Title>
        </Flex>
      </Flex>

      {records.length === 0 && !loading ? (
        <Empty
          description="暂无排盘记录"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <List
          loading={loading}
          dataSource={records}
          renderItem={(record) => {
            const guaName = getGuaName(record.upperGua, record.lowerGua)
            const upperName = singleGuaNames[record.upperGua] || ''
            const lowerName = singleGuaNames[record.lowerGua] || ''
            const movingPositions = record.movingDetails.map(m => m.position).join('、')

            return (
              <List.Item
                onClick={() => handleRecordClick(record)}
                style={{
                  cursor: 'pointer',
                  padding: '16px 20px',
                  borderRadius: 8,
                  marginBottom: 8,
                  backgroundColor: 'white',
                  border: '1px solid rgba(46, 46, 51, 0.08)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(46, 46, 51, 0.1)'
                  e.currentTarget.style.borderColor = '#7bc3db'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = 'rgba(46, 46, 51, 0.08)'
                }}
              >
                <Flex vertical gap={8} style={{ width: '100%' }}>
                  <Flex align="center" justify="space-between">
                    <Flex align="center" gap={8}>
                      <ThunderboltOutlined style={{ color: '#7bc3db' }} />
                      <Typography.Text strong style={{ fontSize: 16 }}>
                        {guaName}
                      </Typography.Text>
                    </Flex>
                    <Tag color={record.method === 'auto' ? 'blue' : 'green'}>
                      {methodLabels[record.method] || record.method}
                    </Tag>
                  </Flex>

                  <Flex gap={24} wrap="wrap">
                    <Flex align="center" gap={4}>
                      <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                        上卦:
                      </Typography.Text>
                      <Typography.Text style={{ fontSize: 13 }}>
                        {upperName}
                      </Typography.Text>
                    </Flex>
                    <Flex align="center" gap={4}>
                      <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                        下卦:
                      </Typography.Text>
                      <Typography.Text style={{ fontSize: 13 }}>
                        {lowerName}
                      </Typography.Text>
                    </Flex>
                    {movingPositions && (
                      <Flex align="center" gap={4}>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                          动爻:
                        </Typography.Text>
                        <Typography.Text style={{ fontSize: 13, color: '#f5222d' }}>
                          第{movingPositions}爻
                        </Typography.Text>
                      </Flex>
                    )}
                  </Flex>

                  {record.question && (
                    <Typography.Text
                      type="secondary"
                      style={{ fontSize: 13 }}
                      ellipsis
                    >
                      问：{record.question}
                    </Typography.Text>
                  )}

                  <Flex align="center" gap={4}>
                    <ClockCircleOutlined style={{ fontSize: 12, color: 'rgba(46, 46, 51, 0.4)' }} />
                    <Typography.Text style={{ fontSize: 12, color: 'rgba(46, 46, 51, 0.4)' }}>
                      {formatTime(record.createdAt)}
                    </Typography.Text>
                  </Flex>
                </Flex>
              </List.Item>
            )
          }}
        />
      )}
    </div>
  )
}
