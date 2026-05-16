import { useEffect } from 'react'
import { Card, Button, Typography, Row, Col, Flex, Divider, Space, Tag, Skeleton } from 'antd'
import {
  ThunderboltOutlined,
  CalendarOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import useLunarStore from '../stores/lunarStore'

const { Title, Text } = Typography

const zodiacIcons = {
  '鼠': '🐭', '牛': '🐮', '虎': '🐯', '兔': '🐰',
  '龙': '🐲', '蛇': '🐍', '马': '🐴', '羊': '🐑',
  '猴': '🐵', '鸡': '🐔', '狗': '🐶', '猪': '🐷',
}

const colors = {
  qing: '#7bc3db',
  hei: '#2e2e33',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const today = new Date()
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`

  const { lunarData, loading, refreshLunarData } = useLunarStore()

  useEffect(() => {
    refreshLunarData()
  }, [])

  return (
    <div style={{ padding: 32, maxWidth: 1152, margin: '0 auto' }}>
      <Flex vertical style={{ marginBottom: 32 }}>
        <Title level={3} style={{ marginBottom: 8, background: 'linear-gradient(to right, #0dc2b3, #f5222d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          风筮
        </Title>
        <Text type="secondary">心诚则灵，遇事不决问东风</Text>
      </Flex>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12} xl={8}>
          <Card
            style={{ backgroundColor: 'rgba(243, 215, 105, 0.1)', borderColor: 'rgba(46, 46, 51, 0.1)', overflow: 'hidden' }}
            styles={{ body: { padding: 0 } }}
          >
            <div style={{ padding: 16 }}>
              <Flex align="center" gap={8} style={{ marginBottom: 12 }}>
                <CalendarOutlined style={{ color: colors.qing }} />
                <Text strong style={{ color: 'rgba(46, 46, 51, 0.7)' }}>今日黄历</Text>
              </Flex>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <Title level={4} style={{ marginBottom: 4, color: colors.hei }}>{dateStr}</Title>
                <Text style={{ color: 'rgba(123, 195, 219, 0.7)', fontWeight: 500 }}>{lunarData?.weekday_cn}</Text>
              </div>

              <Divider style={{ margin: '16px 0', borderColor: 'rgba(46, 46, 51, 0.1)' }} />

              {loading && (
                <div style={{ padding: '16px 8px' }}>
                  <Skeleton active paragraph={{ rows: 2 }} title={{ width: '60%' }} />
                </div>
              )}

              {!loading && lunarData && (
                <Flex vertical gap={16}>
                  <div style={{ background: 'linear-gradient(to bottom right, rgba(123, 195, 219, 0.1), #ede8e4)', borderRadius: 8, padding: '12px 16px', textAlign: 'center', border: '1px solid rgba(123, 195, 219, 0.2)' }}>
                    <Text type="secondary" style={{ fontSize: 12, marginBottom: 4, display: 'block', letterSpacing: '0.2em' }}>
                      农 历
                    </Text>
                    <Text strong style={{ fontSize: 18, letterSpacing: '0.05em' }}>
                      {lunarData.lunar_year_cn}年
                      {lunarData.is_leap_month ? '闰' : ''}
                      {lunarData.lunar_month_cn}
                      {lunarData.lunar_day_cn}
                    </Text>
                  </div>

                  <Row gutter={8}>
                    <Col span={8}>
                      <div style={{ textAlign: 'center', borderRadius: 8, backgroundColor: 'rgba(46, 46, 51, 0.05)', padding: '8px 16px' }}>
                        <Text type="secondary" style={{ fontSize: 10, marginBottom: 4, display: 'block' }}>
                          年干支
                        </Text>
                        <Text strong style={{ fontSize: 14, color: '#f5222d' }}>
                          {lunarData.ganzhi_year}
                        </Text>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ textAlign: 'center', borderRadius: 8, backgroundColor: 'rgba(46, 46, 51, 0.05)', padding: '8px 16px' }}>
                        <Text type="secondary" style={{ fontSize: 10, marginBottom: 4, display: 'block' }}>
                          月干支
                        </Text>
                        <Text strong style={{ fontSize: 14, color: 'rgba(46, 46, 51, 0.7)' }}>
                          {lunarData.ganzhi_month}
                        </Text>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ textAlign: 'center', borderRadius: 8, backgroundColor: 'rgba(46, 46, 51, 0.05)', padding: '8px 16px' }}>
                        <Text type="secondary" style={{ fontSize: 10, marginBottom: 4, display: 'block' }}>
                          日干支
                        </Text>
                        <Text strong style={{ fontSize: 14, color: 'rgba(46, 46, 51, 0.7)' }}>
                          {lunarData.ganzhi_day}
                        </Text>
                      </div>
                    </Col>
                  </Row>

                  <Flex justify="center" align="center" style={{ paddingTop: 4 }}>
                    <Space size={4}>
                      <SunOutlined style={{ color: '#faad14' }} />
                      <Text type="secondary">{lunarData.ganzhi_year}年</Text>
                    </Space>
                    <Divider type="vertical" style={{ margin: '0 12px', borderColor: 'rgba(46, 46, 51, 0.2)' }} />
                    <Space size={4}>
                      <MoonOutlined style={{ color: colors.qing }} />
                      <Text type="secondary">{lunarData.lunar_month_cn}</Text>
                    </Space>
                    <Divider type="vertical" style={{ margin: '0 12px', borderColor: 'rgba(46, 46, 51, 0.2)' }} />
                    <Space size={4}>
                      <Text style={{ fontSize: 16 }}>{zodiacIcons[lunarData.zodiac] || '🏮'}</Text>
                      <Tag color="red">{lunarData.zodiac}年</Tag>
                    </Space>
                  </Flex>
                </Flex>
              )}

              {!loading && !lunarData && (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <Text type="secondary">暂无数据</Text>
                </div>
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12} xl={16}>
          <Card style={{ height: '100%', background: 'linear-gradient(to bottom right, rgba(106, 179, 203, 0.1), rgba(174, 49, 54, 0.1))', borderColor: 'rgba(123, 195, 219, 0.2)' }}>
            <Flex vertical justify="center" align="center" style={{ padding: '32px 0', textAlign: 'center' }}>
              <ThunderboltOutlined style={{ fontSize: 24, marginBottom: 12, color: colors.qing }} />
              <Title level={4} style={{ marginBottom: 8, color: colors.hei }}>立即起卦</Title>
              <Text type="secondary" style={{ marginBottom: 16 }}>心有所疑，卦象自知</Text>
              <Space size={12}>
                <Button type="primary" onClick={() => navigate('/liuyao')}>
                  六爻起卦
                </Button>
                <Button onClick={() => navigate('/meihua')}>
                  梅花易数
                </Button>
              </Space>
            </Flex>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
