import { Card, Button, Typography, Flex, Divider, message } from 'antd'
import {
  ThunderboltOutlined,
  ArrowLeftOutlined,
  DownloadOutlined,
} from '@ant-design/icons'
import { useMemo, useState, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toBlob } from 'html-to-image'
import { SaveScreenshot } from '../../wailsjs/go/main/App'
import YaoDisplay from '../components/YaoDisplay'
import { guaMap, liuyaoGuaNames, guaPalaceInfo } from '../values/guaMap'
import { LIU_SHI_SI_GUA } from '../values/liushisi-gua'
import useLunarStore from '../stores/lunarStore'
import guoxueData from '../assets/guoxue.json'

function reconstructHexagram({ upperGua, lowerGua, movingDetails }) {
  const upperBinary = upperGua === 8 ? 0 : 8 - upperGua
  const lowerBinary = lowerGua === 8 ? 0 : 8 - lowerGua

  const rawTypes = [
    (lowerBinary & 4) ? 1 : 0,
    (lowerBinary & 2) ? 1 : 0,
    (lowerBinary & 1) ? 1 : 0,
    (upperBinary & 4) ? 1 : 0,
    (upperBinary & 2) ? 1 : 0,
    (upperBinary & 1) ? 1 : 0,
  ]

  for (const { position, type } of movingDetails) {
    rawTypes[position - 1] = type
  }

  const mainLines = rawTypes.map(t => ({
    type: t,
    isMoving: t === 2 || t === 3,
  }))

  const changeLines = rawTypes.map(t => {
    const isMoving = t === 2 || t === 3
    const changed = isMoving ? (t === 2 ? 1 : 0) : t
    return { type: changed }
  })

  const changeLowerBits = []
  const changeUpperBits = []
  for (let i = 0; i < 3; i++) {
    const isMoving = rawTypes[i] === 2 || rawTypes[i] === 3
    const yang = rawTypes[i] === 1 || rawTypes[i] === 3
    changeLowerBits.push(isMoving ? (yang ? 0 : 1) : (yang ? 1 : 0))
  }
  for (let i = 3; i < 6; i++) {
    const isMoving = rawTypes[i] === 2 || rawTypes[i] === 3
    const yang = rawTypes[i] === 1 || rawTypes[i] === 3
    changeUpperBits.push(isMoving ? (yang ? 0 : 1) : (yang ? 1 : 0))
  }
  const changeLower = parseInt(changeLowerBits.join(''), 2)
  const changeUpper = parseInt(changeUpperBits.join(''), 2)

  const changeUpperGua = changeUpper === 0 ? 8 : 8 - changeUpper
  const changeLowerGua = changeLower === 0 ? 8 : 8 - changeLower

  const findGuaName = (upper, lower) => {
    const idx = guaMap.findIndex(item => {
      const key = Object.keys(item)[0]
      return Number(key) === upper && item[key] === lower
    })
    return { name: liuyaoGuaNames[idx], index: idx }
  }

  const mainResult = findGuaName(upperGua, lowerGua)
  const changeResult = findGuaName(changeUpperGua, changeLowerGua)

  return {
    mainLines,
    changeLines,
    mainGua: mainResult.name,
    mainGuaIndex: mainResult.index,
    changeGua: changeResult.name,
    changeGuaIndex: changeResult.index,
    movingYao: movingDetails.map(m => m.position),
  }
}

const LIU_CHONG_GUA = ['乾为天', '兑为泽', '离为火', '震为雷', '巽为风', '坎为水', '艮为山', '坤为地', '天雷无妄', '雷天大壮']
const LIU_HE_GUA = ['天地否', '地天泰', '泽水困', '雷地豫', '山火贲', '火山旅', '水泽节', '地雷复']

function getGuaLiuType(guaName) {
  if (!guaName) return null
  if (LIU_CHONG_GUA.includes(guaName)) return '六冲'
  if (LIU_HE_GUA.includes(guaName)) return '六合'
  return null
}

export default function LiuYaoDetail() {
  const navigate = useNavigate()
  const location = useLocation()
  const { upperGua, lowerGua, movingDetails, question } = location.state || {}

  const { ganzhiDay } = useLunarStore()

  const liuShen = useMemo(() => {
    if (!ganzhiDay) return []
    const tianGan = ganzhiDay.charAt(0)
    const map = {
      '甲': ['青龙', '朱雀', '勾陈', '腾蛇', '白虎', '玄武'],
      '乙': ['青龙', '朱雀', '勾陈', '腾蛇', '白虎', '玄武'],
      '丙': ['朱雀', '勾陈', '腾蛇', '白虎', '玄武', '青龙'],
      '丁': ['朱雀', '勾陈', '腾蛇', '白虎', '玄武', '青龙'],
      '戊': ['勾陈', '腾蛇', '白虎', '玄武', '青龙', '朱雀'],
      '己': ['腾蛇', '白虎', '玄武', '青龙', '朱雀', '勾陈'],
      '庚': ['白虎', '玄武', '青龙', '朱雀', '勾陈', '腾蛇'],
      '辛': ['白虎', '玄武', '青龙', '朱雀', '勾陈', '腾蛇'],
      '壬': ['玄武', '青龙', '朱雀', '勾陈', '腾蛇', '白虎'],
      '癸': ['玄武', '青龙', '朱雀', '勾陈', '腾蛇', '白虎'],
    }
    return map[tianGan] || []
  }, [ganzhiDay])

  const hexagram = useMemo(() => {
    if (upperGua == null || lowerGua == null) return null
    return reconstructHexagram({ upperGua, lowerGua, movingDetails: movingDetails || [] })
  }, [upperGua, lowerGua, movingDetails])

  const mainGuaData = useMemo(() => {
    if (!hexagram?.mainGua) return null
    return LIU_SHI_SI_GUA.find(g => g.name === hexagram.mainGua) || null
  }, [hexagram?.mainGua])

  const changeGuaData = useMemo(() => {
    if (!hexagram?.changeGua) return null
    return LIU_SHI_SI_GUA.find(g => g.name === hexagram.changeGua) || null
  }, [hexagram?.changeGua])

  const mainGuaLiuType = useMemo(() => getGuaLiuType(mainGuaData?.name), [mainGuaData?.name])
  const changeGuaLiuType = useMemo(() => getGuaLiuType(changeGuaData?.name), [changeGuaData?.name])

  const isSameGua = hexagram?.mainGua === hexagram?.changeGua

  const [activeGuaTab, setActiveGuaTab] = useState('main')
  const effectiveTab = isSameGua ? 'main' : activeGuaTab

  const currentGuaIndex = hexagram?.[effectiveTab === 'main' ? 'mainGuaIndex' : 'changeGuaIndex']
  const currentGuaName = hexagram?.[effectiveTab === 'main' ? 'mainGua' : 'changeGua']
  const currentGuaData = currentGuaIndex != null ? guoxueData[currentGuaIndex] : null

  const contentRef = useRef(null)

  const handleScreenshot = useCallback(async () => {
    if (!contentRef.current) return
    try {
      const blob = await toBlob(contentRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        cacheBust: true,
      })
      if (!blob) throw new Error('Failed to generate blob')

      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = async () => {
        const dataUrl = reader.result
        const filename = `六爻排盘-${hexagram?.mainGua || 'unknown'}.png`
        const savePath = await SaveScreenshot(filename, dataUrl)
        if (savePath) {
          message.success(`截图已保存到 ${savePath}`)
        }
      }
    } catch {
      message.error('截图保存失败')
    }
  }, [hexagram])

  if (!hexagram) {
    return (
      <div style={{ padding: 32, maxWidth: 1280, margin: '0 auto' }}>
        <Flex align="center" gap={8} style={{ marginBottom: 24 }}>
          <ThunderboltOutlined style={{ fontSize: 18 }} />
          <Typography.Title level={4} style={{ margin: 0 }}>
            六爻起卦
          </Typography.Title>
        </Flex>
        <Card>
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
              暂无摇卦数据
            </Typography.Text>
            <Button
              type="primary"
              onClick={() => navigate('/liuyao')}
              icon={<ArrowLeftOutlined />}
            >
              返回摇卦
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ padding: 32, maxWidth: 1280, margin: '0 auto' }}>
      <Flex align="center" justify="space-between" style={{ marginBottom: 24 }}>
        <Flex align="center" gap={8}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/liuyao')}
          />
          <ThunderboltOutlined style={{ fontSize: 18 }} />
          <Typography.Title level={4} style={{ margin: 0 }}>
            排盘详情
          </Typography.Title>
        </Flex>
        <Button
          type="default"
          icon={<DownloadOutlined />}
          onClick={handleScreenshot}
        >
          截图保存
        </Button>
      </Flex>

      <div ref={contentRef}>
        <Flex vertical gap={24}>
        {question && (
          <Card>
            <Typography.Text type="secondary" style={{ fontSize: 14 }}>
              所问之事
            </Typography.Text>
            <Typography.Paragraph strong style={{ margin: '4px 0 0 0' }}>
              {question}
            </Typography.Paragraph>
          </Card>
        )}

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 16 }}>
            <div style={{ width: 36 }} />
            <div style={{ width: 80 }} />
            <div style={{ width: 100, textAlign: 'center', overflow: 'visible' }}>
              <Typography.Title level={5} style={{ margin: 0, whiteSpace: 'nowrap' }}>
                {(() => {
                  const info = guaPalaceInfo[hexagram.mainGuaIndex]
                  return (
                    <>
                      {hexagram.mainGua}（{info.palace}
                      {info.soulType && <span style={{ color: '#0dc2b3' }}>-{info.soulType}</span>}）
                    </>
                  )
                })()}
              </Typography.Title>
            </div>
            {!isSameGua && (
              <>
                <div style={{ width: 24 }} />
                <div style={{ width: 24 }} />
                <div style={{ width: 100, textAlign: 'center', overflow: 'visible' }}>
                  <Typography.Title level={5} style={{ margin: 0, whiteSpace: 'nowrap' }}>
                    {(() => {
                      const info = guaPalaceInfo[hexagram.changeGuaIndex]
                      return (
                        <>
                          {hexagram.changeGua}（{info.palace}
                          {info.soulType && <span style={{ color: '#0dc2b3' }}>-{info.soulType}</span>}）
                        </>
                      )
                    })()}
                  </Typography.Title>
                </div>
                <div style={{ width: 24 }} />
                <div style={{ width: 80 }} />
                <div style={{ width: 36 }} />
              </>
            )}
          </div>

          <Flex vertical gap={4}>
            {[5,4,3,2,1,0].map(i => {
              const positionFromBottom = i + 1
              const mainLine = hexagram.mainLines[i]
              const changeLine = hexagram.changeLines[i]
              const isShi = positionFromBottom === mainGuaData?.shi
              const isYing = positionFromBottom === mainGuaData?.ying
              return (
                <div key={i} style={{ padding: '8px 0', minHeight: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <div style={{ width: 36, textAlign: 'center', fontSize: 13, color: liuShen.length ? '#f5222d' : 'transparent' }}>
                    {liuShen[i] || ''}
                  </div>
                  <div style={{ width: 80, textAlign: 'right', fontSize: 13, color: '#595959' }}>
                    {mainGuaData?.yaos[5 - i]?.split(' ').reverse().join(' ')}
                  </div>
                  <div style={{ width: 100, display: 'flex', justifyContent: 'center' }}>
                    <YaoDisplay type={mainLine.type} showMoving={false} />
                  </div>
                  <div style={{ width: 24, textAlign: 'center', fontSize: 13, fontWeight: 'bold', color: isShi ? '#f5222d' : '#1890ff' }}>
                    {isShi ? '世' : isYing ? '应' : ''}
                  </div>
                  {mainLine.isMoving && <span style={{ fontSize: 12, fontWeight: 700, color: '#2e2e33', width: 24, textAlign: 'center' }}>{mainLine.type === 3 ? '○' : '✕'}</span>}
                  {!mainLine.isMoving && <span style={{ width: 24 }} />}
                  {!isSameGua && (
                    <>
                      <div style={{ width: 100, display: 'flex', justifyContent: 'center' }}>
                        <YaoDisplay type={changeLine.type} showMoving={false} />
                      </div>
                      <div style={{ width: 24 }} />
                      <div style={{ width: 80, textAlign: 'left', fontSize: 13, color: '#595959' }}>
                        {changeGuaData?.yaos[5 - i]?.split(' ').reverse().join(' ')}
                      </div>
                      <div style={{ width: 36, textAlign: 'center', fontSize: 13, color: liuShen.length ? '#f5222d' : 'transparent' }}>
                        {liuShen[i] || ''}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </Flex>

          {(mainGuaLiuType || (!isSameGua && changeGuaLiuType)) && (
            <div style={{ paddingTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <div style={{ width: 36 }} />
              <div style={{ width: 80 }} />
              <div style={{ width: 100, textAlign: 'center' }}>
                <Typography.Text style={{ fontSize: 12, color: '#07ec12ff', fontWeight: 600 }}>
                  本卦{mainGuaLiuType ? `：${mainGuaLiuType}卦` : ''}
                </Typography.Text>
              </div>
              {!isSameGua && (
                <>
                  <div style={{ width: 24 }} />
                  <div style={{ width: 24 }} />
                  <div style={{ width: 100, textAlign: 'center' }}>
                    <Typography.Text style={{ fontSize: 12, color: '#07ec12ff', fontWeight: 600 }}>
                      变卦{changeGuaLiuType ? `：${changeGuaLiuType}卦` : ''}
                    </Typography.Text>
                  </div>
                  <div style={{ width: 24 }} />
                  <div style={{ width: 80 }} />
                  <div style={{ width: 36 }} />
                </>
              )}
            </div>
          )}
        </div>
        </Flex>
      </div>

      <Divider style={{ margin: '4px 0' }} />

        <Flex gap={12} justify="center">
          <Button
            type={activeGuaTab === 'main' ? 'primary' : 'default'}
            onClick={() => setActiveGuaTab('main')}
          >
            本卦·{hexagram?.mainGua}
          </Button>
          {!isSameGua && (
            <Button
              type={activeGuaTab === 'change' ? 'primary' : 'default'}
              onClick={() => setActiveGuaTab('change')}
            >
              变卦·{hexagram?.changeGua}
            </Button>
          )}
        </Flex>

        {currentGuaData && (
          <Card>
            <Typography.Title level={5} style={{ margin: 0 }}>
              《{currentGuaName}》
            </Typography.Title>
            <div style={{ marginTop: 16 }}>
              {currentGuaData.quan.map((text, i) => (
                <Typography.Paragraph
                  key={i}
                  style={{
                    margin: 0,
                    padding: '6px 0',
                    borderBottom: i < currentGuaData.quan.length - 1 ? '1px dashed #f0f0f0' : 'none',
                    lineHeight: 1.8,
                  }}
                >
                  {text}
                </Typography.Paragraph>
              ))}
            </div>
          </Card>
        )}
    </div>
  )
}
