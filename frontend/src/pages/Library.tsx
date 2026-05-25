import { Card, Input, Tabs, Tag, Collapse } from 'antd'
import { SearchOutlined, BookOutlined } from '@ant-design/icons'
import { useState, useMemo } from 'react'
import guoxueData from '../assets/guoxue.json'

const guaData = guoxueData.map((item, index) => {
  const quan = item.quan
  const firstLine = quan[0]
  const name = firstLine.split('：')[0]
  const number = index + 1
  const symbol = String.fromCodePoint(0x4DC0 + index)

  const meaningSplit = firstLine.split('彖曰')
  const meaning = meaningSplit[0].replace(/[，。、；：\s]+$/, '').trim()

  const cleanName = name.replace(/[《》]/g, '')
  const nature = cleanName

  return { name: cleanName, nature, meaning, number, symbol, quan }
})

export default function Library() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() =>
    guaData.filter(
      (g) =>
        g.name.includes(search) ||
        g.nature.includes(search) ||
        g.meaning.includes(search)
    ),
    [search]
  )

  const tabItems = [
    {
      key: 'all',
      label: '全部',
      children: (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 16, marginTop: 16 }}>
          {filtered.map((gua) => (
            <Card
              key={gua.number}
              hoverable
              style={{ backgroundColor: '#f5f1ee', borderColor: 'rgba(46, 46, 51, 0.1)' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#2e2e33' }}>{gua.name}</div>
                  <div style={{ fontSize: 24, margin: '4px 0' }}>{gua.symbol}</div>
                </div>
                <Tag color="warning">第 {gua.number} 卦</Tag>
              </div>
              <p style={{ fontSize: 14, marginBottom: 12, color: 'rgba(46, 46, 51, 0.6)' }}>{gua.meaning}</p>
              <Collapse
                ghost
                items={[
                  {
                    key: 'yao',
                    label: '查看爻辞',
                    children: (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 14, color: 'rgba(46, 46, 51, 0.6)' }}>
                        {gua.quan.map((y, i) => (
                          <p key={i} style={{ margin: 0 }}>{y}</p>
                        ))}
                      </div>
                    ),
                  },
                ]}
              />
            </Card>
          ))}
        </div>
      ),
    },
    {
      key: 'upper',
      label: '上经',
      children: <div style={{ marginTop: 16, color: 'rgba(46, 46, 51, 0.6)' }}>上经三十卦，展示前十六卦</div>,
    },
    {
      key: 'lower',
      label: '下经',
      children: <div style={{ marginTop: 16, color: 'rgba(46, 46, 51, 0.6)' }}>下经三十四卦</div>,
    },
  ]

  return (
    <div style={{ padding: 32, maxWidth: 1024, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <BookOutlined style={{ fontSize: 18, color: '#7bc3db' }} />
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2e2e33' }}>解卦库</h1>
      </div>

      <Input
        placeholder="搜索卦名、卦象或含义..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        prefix={<SearchOutlined style={{ color: 'rgba(46, 46, 51, 0.4)' }} />}
        style={{ maxWidth: 384, marginBottom: 24 }}
      />

      <Tabs items={tabItems} />
    </div>
  )
}
