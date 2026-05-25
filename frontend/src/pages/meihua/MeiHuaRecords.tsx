import {  List, Button, Typography, Flex, Tag, Empty } from 'antd'
import {
  DashboardOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
  HistoryOutlined,
} from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GetMeihuaRecords } from '../../../wailsjs/go/zhanbu/App'
import { guaIndexMap, guaMap } from '@/values/guaMap'

const guaNames = ['乾 ☰', '兑 ☱', '离 ☲', '震 ☳', '巽 ☴', '坎 ☵', '艮 ☶', '坤 ☷']

const trigramElements: Record<number, string> = {
  1: '天',
  2: '泽',
  3: '火',
  4: '雷',
  5: '风',
  6: '水',
  7: '山',
  8: '地',
}

const methodLabels: Record<string, string> = {
  manual: '手动',
  number: '数字',
  auto: '自动',
}

interface MeihuaRecord {
  id: string
  upperNum: number
  lowerNum: number
  movingYao: number
  method: string
  question: string
  manualLines: number[] | null
  createdAt: string
}

function getGuaDisplayName(upperNum: number, lowerNum: number): string {
  const key = `${upperNum}-${lowerNum}`
  const name = guaIndexMap[key]
  if (!name) {
    const upperName = guaNames[((upperNum - 1) % 8 + 8) % 8]
    const lowerName = guaNames[((lowerNum - 1) % 8 + 8) % 8]
    return `${upperName}${lowerName}`
  }

  if (upperNum === lowerNum) {
    const element = trigramElements[upperNum]
    const upperName = guaNames[((upperNum - 1) % 8 + 8) % 8]
    return `${upperName}为${element}`
  }

  const upperElement = trigramElements[upperNum]
  const lowerElement = trigramElements[lowerNum]
  return `${upperElement}${lowerElement}${name}`
}


const yaoLabels = ['初', '二', '三', '四', '五', '上']

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

export default function MeiHuaRecords() {
  const navigate = useNavigate()
  const [records, setRecords] = useState<MeihuaRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecords()
  }, [])

  const loadRecords = async () => {
    try {
      const data = await GetMeihuaRecords()
      const parsed = JSON.parse(data) as MeihuaRecord[]
      setRecords(parsed.reverse())
    } catch (err) {
      console.error('加载梅花排盘记录失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRecordClick = (record: MeihuaRecord) => {
    navigate('/meihua/detail', {
      state: {
        upperNum: record.upperNum,
        lowerNum: record.lowerNum,
        manualLines: record.manualLines || null,
        movingYao: record.movingYao,
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
            onClick={() => navigate('/meihua')}
          />
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
              const upperIdx = ((record.upperNum - 1) % 8 + 8) % 8
              const lowerIdx = ((record.lowerNum - 1) % 8 + 8) % 8
              const upperName = guaNames[upperIdx]
              const lowerName = guaNames[lowerIdx]
              const displayName = getGuaDisplayName(record.upperNum, record.lowerNum)
              const yaoLabel = yaoLabels[record.movingYao - 1]

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
                        <DashboardOutlined style={{ color: '#7bc3db' }} />
                        <Typography.Text strong style={{ fontSize: 16 }}>
                          {displayName}
                        </Typography.Text>
                      </Flex>
                      <Tag color={record.method === 'auto' ? 'blue' : record.method === 'number' ? 'orange' : 'green'}>
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
                      <Flex align="center" gap={4}>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                          动爻:
                        </Typography.Text>
                        <Typography.Text style={{ fontSize: 13, color: '#f5222d' }}>
                          {yaoLabel}爻
                        </Typography.Text>
                      </Flex>
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
