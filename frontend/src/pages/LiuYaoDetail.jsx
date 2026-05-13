import { Card, Button, Tag, Spin, Modal, Divider } from 'antd'
import {
  ThunderboltOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function GuaLine({ line, index, onClick }) {
  const isYang = line === 1 || line === 3
  const isMoving = line === 0 || line === 1

  return (
    <div
      className="flex items-center justify-center py-2 cursor-pointer transition-all hover:scale-105"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <span className="text-xs text-hei-400/40 w-8 text-right">{['初', '二', '三', '四', '五', '上'][index]}爻</span>
        {isYang ? (
          <div className={`h-3 w-24 rounded-full ${isMoving ? 'bg-gradient-to-r from-chi-400 to-chi-400 shadow-lg shadow-chi-400/30' : 'bg-hei-400'}`} />
        ) : (
          <div className="flex gap-2">
            <div className={`h-3 w-10 rounded-full ${isMoving ? 'bg-gradient-to-r from-chi-400 to-chi-400 shadow-lg shadow-chi-400/30' : 'bg-hei-400'}`} />
            <div className={`h-3 w-10 rounded-full ${isMoving ? 'bg-gradient-to-r from-chi-400 to-chi-400 shadow-lg shadow-chi-400/30' : 'bg-hei-400'}`} />
          </div>
        )}
        {isMoving && (
          <Tag color="error" className="!text-xs">动</Tag>
        )}
      </div>
    </div>
  )
}

export default function LiuYaoDetail() {
  const navigate = useNavigate()
  const location = useLocation()
  const { result, question } = location.state || {}
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedYao, setSelectedYao] = useState(null)
  const [aiResponse, setAiResponse] = useState('')
  const [aiLoading, setAiLoading] = useState(true)

  useEffect(() => {
    if (!result) return
    setAiLoading(true)
    const timer = setTimeout(() => {
      setAiResponse(`【卦象分析】

您占得「${result.mainGua}」之「${result.changeGua}」。

${result.movingYao.length > 0 ? `动爻位于第 ${result.movingYao.join('、')} 爻，表示事情正在发生变化。` : '无动爻，表示当前局势稳定。'}

本卦代表当前状况，变卦代表未来趋势。${question ? `结合您所问的「${question}」，` : ''}建议保持冷静观察，等待时机再行动。

卦象显示：宜守不宜攻，静待天时。`)
      setAiLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [result, question])

  if (!result) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <ThunderboltOutlined className="text-lg text-qing-400" />
          <h1 className="text-2xl font-bold text-hei-400">六爻起卦</h1>
        </div>
        <Card className="bg-bai-400 border-hei-400/10">
          <div className="text-center py-12">
            <p className="text-hei-400/60 mb-4">暂无摇卦数据</p>
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
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/liuyao')}
        />
        <ThunderboltOutlined className="text-lg text-qing-400" />
        <h1 className="text-2xl font-bold text-hei-400">排盘详情</h1>
      </div>

      <div className="space-y-6">
        {question && (
          <Card className="bg-bai-400 border-hei-400/10">
            <div>
              <span className="text-sm text-hei-400/60">所问之事</span>
              <p className="text-hei-400 font-medium mt-1">{question}</p>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-bai-400 border-hei-400/10">
            <div className="text-center mb-4">
              <div className="text-sm text-hei-400/60 mb-1">本卦</div>
              <div className="text-2xl font-bold text-qing-400">{result.mainGua}</div>
            </div>
            <div className="space-y-1">
              {result.lines.map((line, i) => (
                <GuaLine
                  key={i}
                  line={line}
                  index={i}
                  onClick={() => {
                    setSelectedYao({ index: 6 - i, line })
                    setModalOpen(true)
                  }}
                />
              ))}
            </div>
            {result.movingYao.length > 0 && (
              <div className="mt-4 text-center">
                <Tag color="error">动爻：{result.movingYao.join('、')}爻</Tag>
              </div>
            )}
          </Card>

          <Card className="bg-bai-400 border-hei-400/10">
            <div className="text-center mb-4">
              <div className="text-sm text-hei-400/60 mb-1">变卦</div>
              <div className="text-2xl font-bold text-qing-400">{result.changeGua}</div>
            </div>
            <div className="space-y-1 opacity-60">
              {result.lines.map((line, i) => {
                const isMoving = line === 0 || line === 1
                const changed = isMoving ? (line === 1 ? 2 : 3) : line
                return (
                  <GuaLine
                    key={i}
                    line={changed}
                    index={i}
                    onClick={() => {}}
                  />
                )
              })}
            </div>
          </Card>
        </div>

        <Card className="bg-bai-400 border-hei-400/10">
          <div className="flex items-center gap-2 mb-4">
            <ThunderboltOutlined className="text-qing-400" />
            <h3 className="font-bold text-hei-400">AI 解析</h3>
          </div>
          {aiLoading ? (
            <div className="flex items-center gap-2 text-hei-400/60">
              <Spin size="small" />
              <span>正在解析卦象...</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-hei-400/70 leading-relaxed">
              {aiResponse}
            </div>
          )}
        </Card>

        <div className="flex justify-center">
          <Button
            type="primary"
            onClick={() => navigate('/liuyao')}
            icon={<ThunderboltOutlined />}
          >
            重新摇卦
          </Button>
        </div>
      </div>

      <Modal
        title="爻辞详解"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        width={640}
        footer={
          <Button onClick={() => setModalOpen(false)}>关闭</Button>
        }
      >
        {selectedYao && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-qing-400 mb-2">
                第 {selectedYao.index} 爻
              </div>
              <Tag color={selectedYao.line === 0 || selectedYao.line === 1 ? 'error' : 'default'}>
                {selectedYao.line === 0 || selectedYao.line === 1 ? '动爻' : '静爻'}
              </Tag>
            </div>
            <Divider />
            <div>
              <h4 className="font-bold text-hei-400 mb-2">爻辞</h4>
              <p className="text-hei-400/70">
                {selectedYao.index === 1 && '初爻：潜龙勿用。宜静不宜动，等待时机。'}
                {selectedYao.index === 2 && '二爻：见龙在田，利见大人。时机初现，可得贵人相助。'}
                {selectedYao.index === 3 && '三爻：君子终日乾乾，夕惕若，厉无咎。谨慎行事，虽有艰险，终无大咎。'}
                {selectedYao.index === 4 && '四爻：或跃在渊，无咎。进退皆可，审时度势。'}
                {selectedYao.index === 5 && '五爻：飞龙在天，利见大人。大吉之象，事事亨通。'}
                {selectedYao.index === 6 && '上爻：亢龙有悔。盛极而衰，宜收敛退守。'}
              </p>
            </div>
            <div>
              <h4 className="font-bold text-hei-400 mb-2">AI 建议</h4>
              <p className="text-hei-400/70">
                此爻显示当前处于变化{selectedYao.index <= 3 ? '初期' : '后期'}，建议保持{selectedYao.line === 0 || selectedYao.line === 1 ? '警觉，注意变化带来的机遇与挑战' : '现状，不宜轻举妄动'}。
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
