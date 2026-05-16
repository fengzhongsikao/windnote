import { Card, Button, Flex, Typography, Row, Col } from 'antd'
import {
  DashboardOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { guaIndexMap, guaMap } from '../values/guaMap'
import guoxueData from '../assets/guoxue.json'

const guaNames = [
  '乾', '兑', '离', '震', '巽', '坎', '艮', '坤',
]

const trigramElements = {
  1: '天',
  2: '泽',
  3: '火',
  4: '雷',
  5: '风',
  6: '水',
  7: '山',
  8: '地',
}

function getGuaFromNumber(n) {
  const idx = ((n - 1) % 8 + 8) % 8
  return { name: guaNames[idx], index: idx }
}

function getHexagramDisplayName(upperNum, lowerNum) {
  const key = `${upperNum}-${lowerNum}`
  const name = guaIndexMap[key]
  if (!name) return null

  const upperName = guaNames[((upperNum - 1) % 8 + 8) % 8]

  if (upperNum === lowerNum) {
    const element = trigramElements[upperNum]
    return `${upperName}为${element}`
  }

  const upperElement = trigramElements[upperNum]
  const lowerElement = trigramElements[lowerNum]
  return `${upperElement}${lowerElement}${name}`
}

function trigramIndexToBits(index) {
  const val = 7 - index
  return [val & 1, (val >> 1) & 1, (val >> 2) & 1]
}

function linesToHexagram(lines) {
  const lowerVal = lines[0] * 4 + lines[1] * 2 + lines[2] * 1
  const upperVal = lines[3] * 4 + lines[4] * 2 + lines[5] * 1
  const lowerIdx = 7 - lowerVal
  const upperIdx = 7 - upperVal
  const upperNum = upperIdx + 1
  const lowerNum = lowerIdx + 1

  const simpleName = guaNames[upperIdx] + guaNames[lowerIdx]
  const displayName = getHexagramDisplayName(upperNum, lowerNum) || simpleName

  return {
    name: displayName,
    simpleName,
    upper: { name: guaNames[upperIdx], index: upperIdx },
    lower: { name: guaNames[lowerIdx], index: lowerIdx },
    lines: [...lines],
  }
}

function getHexagramIndex(upperNum, lowerNum) {
  for (let i = 0; i < guaMap.length; i++) {
    const entry = guaMap[i]
    const key = Object.keys(entry)[0]
    if (Number(key) === upperNum && entry[key] === lowerNum) {
      return i
    }
  }
  return -1
}

function YaoLine({ type, isRed }) {
  const isYang = type === 1
  const bgColor = isRed ? '#ff0008ff' : '#000000ff'
  return (
    <Flex justify="center" align="center">
      {isYang ? (
        <div style={{ height: 10, width: 88, borderRadius: 2, backgroundColor: bgColor }} />
      ) : (
        <Flex align="center" gap={10}>
          <div style={{ height: 10, width: 39, borderRadius: 2, backgroundColor: bgColor }} />
          <div style={{ height: 10, width: 39, borderRadius: 2, backgroundColor: bgColor }} />
        </Flex>
      )}
    </Flex>
  )
}

function TiYongLabels({ movingYao }) {
  if (movingYao == null) return null

  const getLabels = () => {
    if (movingYao >= 1 && movingYao <= 3) {
      return { upper: '体', lower: '用' }
    }
    return { upper: '用', lower: '体' }
  }

  const { upper, lower } = getLabels()

  const labelStyle = {
    fontSize: 14,
    color: '#2e2e33',
    width: 16,
    textAlign: 'center',
    fontWeight: 700,
  }

  return (
    <Flex vertical justify="space-between" style={{ marginRight: 16 }}>
      <Flex align="center" style={{ minHeight: 42 }}>
        <span style={labelStyle}>{upper}</span>
      </Flex>
      <Flex align="center" style={{ minHeight: 42 }}>
        <span style={labelStyle}>{lower}</span>
      </Flex>
    </Flex>
  )
}

function HexagramCard({ title, hexagram, highlightMoving, movingYao, isMain }) {
  if (!hexagram) return null
  const lines = hexagram.lines || []
  const hasMoving = highlightMoving && movingYao != null

  const displayLines = [...lines].reverse()
  const upperGroup = displayLines.slice(0, 3)
  const lowerGroup = displayLines.slice(3, 6)

  const renderLine = (line, lineIndexFromBottom) => {
    const isMovingLine = hasMoving && movingYao === lineIndexFromBottom + 1
    return <YaoLine type={line} isRed={isMovingLine && isMain} />
  }

  return (
    <Card>
      <Flex vertical align="center">
        <Flex justify="center" align="center" gap={8} style={{ marginBottom: 12 }}>
          <Typography.Text style={{ fontSize: 14, color: '#0dc2b3' }}>
            {title}
          </Typography.Text>
        </Flex>
        <Flex vertical align="center">
          <Typography.Text strong style={{ fontSize: 18, color: '#2e2e33', marginBottom: 12 }}>
            {hexagram.name}
          </Typography.Text>
          <Flex vertical gap={6}>
            {upperGroup.map((line, i) => (
              <Flex key={i} justify="center" align="center">
                {renderLine(line, lines.length - 1 - i)}
              </Flex>
            ))}
            {lowerGroup.map((line, i) => (
              <Flex key={i + 3} justify="center" align="center">
                {renderLine(line, lines.length - 1 - (i + 3))}
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </Card>
  )
}

function HexagramCardMain({ title, hexagram, highlightMoving, movingYao, isMain }) {
  if (!hexagram) return null
  const lines = hexagram.lines || []
  const hasMoving = highlightMoving && movingYao != null

  const displayLines = [...lines].reverse()
  const upperGroup = displayLines.slice(0, 3)
  const lowerGroup = displayLines.slice(3, 6)

  const renderLine = (line, lineIndexFromBottom) => {
    const isMovingLine = hasMoving && movingYao === lineIndexFromBottom + 1
    return <YaoLine type={line} isRed={isMovingLine && isMain} />
  }

  return (
    <Card>
      <Flex horizontal align="end">
         <TiYongLabels movingYao={movingYao} />
         <Flex vertical align="center">
        <Flex justify="center" align="center" gap={8} style={{ marginBottom: 12 }}>
          <Typography.Text style={{ fontSize: 14, color: '#ff0000' }}>
            {title}
          </Typography.Text>
        </Flex>
        <Flex vertical align="center">
          <Typography.Text strong style={{ fontSize: 18, color: '#2e2e33', marginBottom: 12 }}>
            {hexagram.name}
          </Typography.Text>
          <Flex vertical gap={6}>
            {upperGroup.map((line, i) => (
              <Flex key={i} justify="center" align="center">
                {renderLine(line, lines.length - 1 - i)}
              </Flex>
            ))}
            {lowerGroup.map((line, i) => (
              <Flex key={i + 3} justify="center" align="center">
                {renderLine(line, lines.length - 1 - (i + 3))}
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Flex>
      </Flex>
     
    </Card>
  )
}

export default function MeiHuaDetail() {
  const navigate = useNavigate()
  const location = useLocation()
  const { upperNum, lowerNum, movingYao, methodName } = location.state || {}

  if (!upperNum || !lowerNum) {
    return (
      <div style={{ padding: 32, maxWidth: 1060, margin: '0 auto' }}>
        <Flex align="center" gap={8} style={{ marginBottom: 24 }}>
          <DashboardOutlined style={{ fontSize: 18, color: '#7bc3db' }} />
          <Typography.Title level={3} style={{ color: '#2e2e33', margin: 0 }}>
            梅花易数
          </Typography.Title>
        </Flex>
        <Card>
          <Flex vertical align="center" style={{ padding: '48px 0' }}>
            <Typography.Text style={{ color: 'rgba(46, 46, 51, 0.6)', marginBottom: 16 }}>
              暂无排盘数据
            </Typography.Text>
            <Button
              type="primary"
              onClick={() => navigate('/meihua')}
              icon={<ArrowLeftOutlined />}
            >
              返回排盘
            </Button>
          </Flex>
        </Card>
      </div>
    )
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

  const changeLines = [...lines]
  changeLines[movingYao - 1] = changeLines[movingYao - 1] === 1 ? 0 : 1
  const changeGua = linesToHexagram(changeLines)

  const cuoLines = lines.map(l => (l === 1 ? 0 : 1))
  const cuoGua = linesToHexagram(cuoLines)

  const zongLines = [...lines].reverse()
  const zongGua = linesToHexagram(zongLines)

  const hexagramIdx = getHexagramIndex(upperNum, lowerNum)
  const yaoTexts = hexagramIdx >= 0 ? guoxueData[hexagramIdx]?.quan : null

  return (
    <div style={{ padding: 32, maxWidth: 1060, margin: '0 auto' }}>
      <Flex align="center" gap={8} style={{ marginBottom: 24 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/meihua')}
        />
        <DashboardOutlined style={{ fontSize: 18, color: '#7bc3db' }} />
        <Typography.Title level={3} style={{ color: '#2e2e33', margin: 0 }}>
          排盘详情
        </Typography.Title>
      </Flex>

      <Flex vertical gap={24}>
        <div>
          <Typography.Title level={4} style={{ color: '#2e2e33', marginBottom: 16 }}>
            排盘结果
          </Typography.Title>

          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12} md={8} lg={{ flex: '0 0 20%', maxWidth: '20%' }}>
              <Flex align="stretch" justify="center">
                <div style={{ flex: 1 }}>
                  <HexagramCardMain
                    title="「 本卦 」"
                    hexagram={{
                      name: mainGua.name,
                      lines: mainGua.lines,
                      upper: mainGua.upper,
                      lower: mainGua.lower,
                    }}
                    highlightMoving
                    movingYao={movingYao}
                    isMain
                  />
                </div>
              </Flex>
            </Col>
            <Col xs={24} sm={12} md={8} lg={{ flex: '0 0 20%', maxWidth: '20%' }}>
              <HexagramCard
                title="「 互卦 」"
                hexagram={huGua}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={{ flex: '0 0 20%', maxWidth: '20%' }}>
              <HexagramCard
                title="「 变卦 」"
                hexagram={changeGua}
                highlightMoving
                movingYao={movingYao}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={{ flex: '0 0 20%', maxWidth: '20%' }}>
              <HexagramCard
                title="「 错卦 」"
                hexagram={cuoGua}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={{ flex: '0 0 20%', maxWidth: '20%' }}>
              <HexagramCard
                title="「 综卦 」"
                hexagram={zongGua}
              />
            </Col>
          </Row>
        </div>

        {yaoTexts && (
          <div>
            <Typography.Title level={4} style={{ color: '#2e2e33', marginBottom: 16 }}>
              本卦全文
            </Typography.Title>
            <Card>
              <Flex vertical gap={10}>
                {yaoTexts.map((text, idx) => (
                  <Typography.Paragraph key={idx} style={{
                    fontSize: 15,
                    color: '#2e2e33',
                    lineHeight: '26px',
                    margin: 0,
                    textIndent: '2em',
                  }}>
                    {text}
                  </Typography.Paragraph>
                ))}
              </Flex>
            </Card>
          </div>
        )}
      </Flex>
    </div>
  )
}
