import { List, Button, Typography, Flex, Tag, Empty, Modal, message, Checkbox } from 'antd'
import {
  ArrowLeftOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { useState, useEffect, useMemo, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { DeleteMeihuaRecord, GetMeihuaRecords } from '../../../wailsjs/go/zhanbu/App'
import { guaIndexMap } from '@/values/guaMap'

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

const yaoLabels = ['上', '五', '四', '三', '二', '初']

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
  const [editing, setEditing] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [deleting, setDeleting] = useState(false)

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

  const allSelected = useMemo(
    () => records.length > 0 && selectedIds.length === records.length,
    [records, selectedIds],
  )

  const handleToggleEdit = () => {
    setEditing(prev => {
      if (prev) setSelectedIds([])
      return !prev
    })
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? records.map(r => r.id) : [])
  }

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    )
  }

  const handleRecordClick = (record: MeihuaRecord) => {
    if (editing) {
      handleToggleSelect(record.id)
      return
    }
    navigate('/meihua/detail', {
      state: {
        upperNum: record.upperNum,
        lowerNum: record.lowerNum,
        movingYao: record.movingYao,
        question: record.question,
        method: record.method,
      },
    })
  }

  const handleDelete = (e: MouseEvent, record: MeihuaRecord) => {
    e.stopPropagation()
    Modal.confirm({
      title: '删除这条排盘记录？',
      content: '删除后无法恢复',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        await DeleteMeihuaRecord(record.id)
        setRecords(prev => prev.filter(item => item.id !== record.id))
        setSelectedIds(prev => prev.filter(id => id !== record.id))
        message.success('已删除')
      },
    })
  }

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      message.warning('请先选择要删除的记录')
      return
    }
    Modal.confirm({
      title: `删除选中的 ${selectedIds.length} 条记录？`,
      content: '删除后无法恢复',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        setDeleting(true)
        try {
          await Promise.all(selectedIds.map(id => DeleteMeihuaRecord(id)))
          setRecords(prev => prev.filter(item => !selectedIds.includes(item.id)))
          setSelectedIds([])
          message.success('已删除')
        } catch (err) {
          console.error('批量删除失败:', err)
          message.error('删除失败')
          await loadRecords()
        } finally {
          setDeleting(false)
        }
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
          <Typography.Title level={4} style={{ margin: 0, color: '#2e2e33' }}>
            排盘记录
          </Typography.Title>
        </Flex>
        {records.length > 0 && (
          <Button type="link" onClick={handleToggleEdit}>
            {editing ? '完成' : '编辑'}
          </Button>
        )}
      </Flex>

      {editing && records.length > 0 && (
        <Flex align="center" justify="space-between" style={{ marginBottom: 16 }}>
          <Checkbox
            checked={allSelected}
            indeterminate={selectedIds.length > 0 && !allSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
          >
            全选
          </Checkbox>
          <Button
            danger
            type="primary"
            icon={<DeleteOutlined />}
            disabled={selectedIds.length === 0}
            loading={deleting}
            onClick={handleBatchDelete}
          >
            删除{selectedIds.length > 0 ? ` (${selectedIds.length})` : ''}
          </Button>
        </Flex>
      )}

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
            const selected = selectedIds.includes(record.id)

            return (
              <List.Item
                onClick={() => handleRecordClick(record)}
                style={{
                  cursor: 'pointer',
                  padding: '16px 20px',
                  borderRadius: 8,
                  marginBottom: 8,
                  backgroundColor: selected ? 'rgba(123, 195, 219, 0.12)' : 'white',
                  border: `1px solid ${selected ? '#7bc3db' : 'rgba(46, 46, 51, 0.08)'}`,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!selected) {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(46, 46, 51, 0.1)'
                    e.currentTarget.style.borderColor = '#7bc3db'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selected) {
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.borderColor = 'rgba(46, 46, 51, 0.08)'
                  }
                }}
              >
                <Flex gap={12} style={{ width: '100%' }}>
                  {editing && (
                    <Checkbox
                      checked={selected}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => handleToggleSelect(record.id)}
                      style={{ marginTop: 2 }}
                    />
                  )}
                  <Flex vertical gap={8} style={{ width: '100%', minWidth: 0 }}>
                    <Flex align="center" justify="space-between">
                      <Flex align="center" gap={8} style={{ minWidth: 0, flex: 1, marginRight: 12 }}>
                        <Typography.Text strong style={{ fontSize: 16 }} ellipsis>
                          {record.question || displayName}
                        </Typography.Text>
                      </Flex>
                      <Flex align="center" gap={8}>
                        <Tag color={record.method === 'auto' ? 'blue' : record.method === 'number' ? 'orange' : 'green'}>
                          {methodLabels[record.method] || record.method}
                        </Tag>
                        {!editing && (
                          <Button
                            type="text"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={(e) => handleDelete(e, record)}
                          />
                        )}
                      </Flex>
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

                    <Flex align="center" gap={4}>
                      <ClockCircleOutlined style={{ fontSize: 12, color: 'rgba(46, 46, 51, 0.4)' }} />
                      <Typography.Text style={{ fontSize: 12, color: 'rgba(46, 46, 51, 0.4)' }}>
                        {formatTime(record.createdAt)}
                      </Typography.Text>
                    </Flex>
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
