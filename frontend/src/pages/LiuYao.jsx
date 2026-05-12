import {
  Card,
  CardBody,
  Button,
  Input,
  Textarea,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tabs,
  Tab,
  Spinner,
  Divider,
  useDisclosure,
} from '@heroui/react'
import {
  Hexagon,
  Camera,
  Sparkles,
  Clock,
  Hash,
  Shuffle,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react'
import { useState, useRef, useCallback } from 'react'
import html2canvas from 'html2canvas'

const guaNames = [
  '乾为天', '坤为地', '水雷屯', '山水蒙', '水天需', '天水讼', '地水师', '水地比',
  '风天小畜', '天泽履', '地天泰', '天地否', '天火同人', '火天大有', '地山谦', '雷地豫',
  '泽雷随', '山风蛊', '地泽临', '风地观', '火雷噬嗑', '山火贲', '山地剥', '地雷复',
  '天雷无妄', '山天大畜', '山雷颐', '泽风大过', '坎为水', '离为火', '泽山咸', '雷风恒',
  '天山遁', '雷天大壮', '火地晋', '地火明夷', '风火家人', '火泽睽', '水山蹇', '雷水解',
  '山泽损', '风雷益', '泽天夬', '天风姤', '泽地萃', '地风升', '泽水困', '水风井',
  '泽火革', '火风鼎', '震为雷', '艮为山', '风山渐', '雷泽归妹', '雷火丰', '火山旅',
  '巽为风', '兑为泽', '风水涣', '水泽节', '风泽中孚', '雷山小过', '水火既济', '火水未济',
]

const guaSymbols = {
  0: '⚋', 1: '⚊', // yin, yang
  2: '⚍', 3: '⚎', // moving yin, moving yang
}

function getGuaIndex(upper, lower) {
  // bagua index: 乾111 兑110 离101 震100 巽011 坎010 艮001 坤000
  const bagua = [7, 6, 5, 4, 3, 2, 1, 0]
  return bagua[upper] * 8 + bagua[lower]
}

function generateGua(method, input) {
  let lines = []
  let seed = Date.now()

  if (method === 'random') {
    for (let i = 0; i < 6; i++) {
      const r = Math.floor(Math.random() * 4)
      lines.push(r) // 0: old yin, 1: old yang, 2: young yin, 3: young yang
    }
  } else if (method === 'number') {
    const nums = input.split('').filter(c => /\d/.test(c)).map(Number)
    if (nums.length < 3) {
      // generate from seed
      for (let i = 0; i < 6; i++) {
        seed = (seed * 9301 + 49297) % 233280
        lines.push(Math.floor(seed / 233280 * 4))
      }
    } else {
      for (let i = 0; i < 6; i++) {
        const a = nums[i % nums.length] || 0
        const b = nums[(i + 1) % nums.length] || 0
        const sum = a + b + seed % 10
        lines.push(sum % 4)
      }
    }
  } else if (method === 'time') {
    const now = new Date()
    const h = now.getHours()
    const m = now.getMinutes()
    const s = now.getSeconds()
    const upper = (h + m) % 8
    const lower = (h + s) % 8
    const moving = (h + m + s) % 6
    for (let i = 0; i < 6; i++) {
      const bit = (lower >> i) & 1
      lines.push(bit === 1 ? 3 : 2) // young yang/yin
    }
    // override moving yao
    const idx = moving === 0 ? 5 : moving - 1
    lines[idx] = lines[idx] === 3 ? 1 : 0 // make it old
  }

  // Build hexagrams
  const upperBits = []
  const lowerBits = []
  const changeBits = []

  for (let i = 5; i >= 0; i--) {
    const line = lines[i]
    const isYang = line === 1 || line === 3
    const isMoving = line === 0 || line === 1
    if (i >= 3) {
      upperBits.push(isYang ? 1 : 0)
    } else {
      lowerBits.push(isYang ? 1 : 0)
    }
    changeBits.push(isMoving ? (isYang ? 0 : 1) : (isYang ? 1 : 0))
  }

  const upperIdx = parseInt(upperBits.join(''), 2)
  const lowerIdx = parseInt(lowerBits.join(''), 2)
  const changeUpper = parseInt(changeBits.slice(0, 3).join(''), 2)
  const changeLower = parseInt(changeBits.slice(3, 6).join(''), 2)

  const mainGua = guaNames[getGuaIndex(upperIdx, lowerIdx)]
  const changeGua = guaNames[getGuaIndex(changeUpper, changeLower)]

  return {
    lines: lines.reverse(),
    mainGua,
    changeGua,
    movingYao: lines.map((l, i) => (l === 0 || l === 1 ? 6 - i : null)).filter(Boolean),
  }
}

function GuaLine({ line, index, onClick }) {
  const isYang = line === 1 || line === 3
  const isMoving = line === 0 || line === 1

  return (
    <div
      className={`flex items-center justify-center py-2 cursor-pointer transition-all hover:scale-105 gua-line`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <span className="text-xs text-zinc-500 w-8 text-right">{['初', '二', '三', '四', '五', '上'][index]}爻</span>
        {isYang ? (
          <div className={`h-3 w-24 rounded-full ${isMoving ? 'bg-gradient-to-r from-red-500 to-red-400 shadow-lg shadow-red-500/30' : 'bg-zinc-300'}`} />
        ) : (
          <div className="flex gap-2">
            <div className={`h-3 w-10 rounded-full ${isMoving ? 'bg-gradient-to-r from-red-500 to-red-400 shadow-lg shadow-red-500/30' : 'bg-zinc-300'}`} />
            <div className={`h-3 w-10 rounded-full ${isMoving ? 'bg-gradient-to-r from-red-500 to-red-400 shadow-lg shadow-red-500/30' : 'bg-zinc-300'}`} />
          </div>
        )}
        {isMoving && (
          <Chip size="sm" color="danger" variant="solid" className="text-xs">
            动
          </Chip>
        )}
      </div>
    </div>
  )
}

export default function LiuYao() {
  const [question, setQuestion] = useState('')
  const [method, setMethod] = useState('random')
  const [numberInput, setNumberInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState('')
  const [selectedYao, setSelectedYao] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const resultRef = useRef(null)

  const handleCast = useCallback(() => {
    if (!question.trim()) return
    setLoading(true)
    setResult(null)
    setAiResponse('')

    setTimeout(() => {
      const res = generateGua(method, numberInput)
      setResult(res)
      setLoading(false)
      // Simulate AI response
      setAiLoading(true)
      setTimeout(() => {
        setAiResponse(`【卦象分析】

您占得「${res.mainGua}」之「${res.changeGua}」。

${res.movingYao.length > 0 ? `动爻位于第 ${res.movingYao.join('、')} 爻，表示事情正在发生变化。` : '无动爻，表示当前局势稳定。'}

本卦代表当前状况，变卦代表未来趋势。结合您所问的「${question}」，建议保持冷静观察，等待时机成熟再行动。

卦象显示：宜守不宜攻，静待天时。`)
        setAiLoading(false)
      }, 2000)
    }, 1500)
  }, [question, method, numberInput])

  const handleScreenshot = async () => {
    if (!resultRef.current) return
    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#0a0a0f',
        scale: 2,
      })
      const link = document.createElement('a')
      link.download = `${result.mainGua}_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (err) {
      console.error('Screenshot failed:', err)
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Hexagon size={24} className="text-amber-400" />
        <h1 className="text-2xl font-bold">六爻起卦</h1>
      </div>

      {/* Input Section */}
      <Card className="bg-white/5 border-white/10 mb-6">
        <CardBody className="space-y-4">
          <Textarea
            label="所问之事"
            placeholder="请诚心默念你所问之事..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="max-w-xl"
          />

          <Tabs
            selectedKey={method}
            onSelectionChange={setMethod}
            aria-label="Casting method"
          >
            <Tab
              key="random"
              title={
                <div className="flex items-center gap-1">
                  <Shuffle size={14} />
                  <span>随机起卦</span>
                </div>
              }
            >
              <p className="text-sm text-zinc-400 mt-2">
                系统将使用随机数生成卦象，适合快速占卜。
              </p>
            </Tab>
            <Tab
              key="number"
              title={
                <div className="flex items-center gap-1">
                  <Hash size={14} />
                  <span>数字起卦</span>
                </div>
              }
            >
              <Input
                label="输入数字"
                placeholder="请输入3个或以上数字，如：123456"
                value={numberInput}
                onChange={(e) => setNumberInput(e.target.value)}
                className="max-w-md mt-2"
              />
            </Tab>
            <Tab
              key="time"
              title={
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>时间起卦</span>
                </div>
              }
            >
              <p className="text-sm text-zinc-400 mt-2">
                根据当前时间自动起卦，以此时此刻为缘。
              </p>
            </Tab>
          </Tabs>

          <Button
            color="warning"
            className="bg-gradient-to-r from-amber-500 to-red-500 max-w-xs"
            size="lg"
            onPress={handleCast}
            isLoading={loading}
            startContent={!loading && <Sparkles size={18} />}
          >
            {loading ? '摇卦中...' : '开始摇卦'}
          </Button>
        </CardBody>
      </Card>

      {/* Result Section */}
      {result && (
        <div ref={resultRef} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">排盘结果</h2>
            <Button
              variant="flat"
              size="sm"
              onPress={handleScreenshot}
              startContent={<Camera size={16} />}
            >
              保存结果
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Gua */}
            <Card className="bg-white/5 border-white/10">
              <CardBody>
                <div className="text-center mb-4">
                  <div className="text-sm text-zinc-400 mb-1">本卦</div>
                  <div className="text-2xl font-bold text-amber-400">{result.mainGua}</div>
                </div>
                <div className="space-y-1">
                  {result.lines.map((line, i) => (
                    <GuaLine
                      key={i}
                      line={line}
                      index={i}
                      onClick={() => {
                        setSelectedYao({ index: 6 - i, line })
                        onOpen()
                      }}
                    />
                  ))}
                </div>
                {result.movingYao.length > 0 && (
                  <div className="mt-4 text-center">
                    <Chip color="danger" variant="flat">
                      动爻：{result.movingYao.join('、')}爻
                    </Chip>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Change Gua */}
            <Card className="bg-white/5 border-white/10">
              <CardBody>
                <div className="text-center mb-4">
                  <div className="text-sm text-zinc-400 mb-1">变卦</div>
                  <div className="text-2xl font-bold text-amber-400">{result.changeGua}</div>
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
              </CardBody>
            </Card>
          </div>

          {/* AI Analysis */}
          <Card className="bg-white/5 border-white/10">
            <CardBody>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-amber-400" />
                <h3 className="font-bold">AI 解析</h3>
              </div>
              {aiLoading ? (
                <div className="flex items-center gap-2 text-zinc-400">
                  <Spinner size="sm" />
                  <span>正在解析卦象...</span>
                </div>
              ) : (
                <div className="whitespace-pre-wrap text-zinc-300 leading-relaxed typewriter-cursor">
                  {aiResponse}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {/* Yao Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalContent>
          <ModalHeader>爻辞详解</ModalHeader>
          <ModalBody>
            {selectedYao && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-400 mb-2">
                    第 {selectedYao.index} 爻
                  </div>
                  <Chip color={selectedYao.line === 0 || selectedYao.line === 1 ? 'danger' : 'default'}>
                    {selectedYao.line === 0 || selectedYao.line === 1 ? '动爻' : '静爻'}
                  </Chip>
                </div>
                <Divider />
                <div>
                  <h4 className="font-bold mb-2">爻辞</h4>
                  <p className="text-zinc-400">
                    {selectedYao.index === 1 && '初爻：潜龙勿用。宜静不宜动，等待时机。'}
                    {selectedYao.index === 2 && '二爻：见龙在田，利见大人。时机初现，可得贵人相助。'}
                    {selectedYao.index === 3 && '三爻：君子终日乾乾，夕惕若，厉无咎。谨慎行事，虽有艰险，终无大咎。'}
                    {selectedYao.index === 4 && '四爻：或跃在渊，无咎。进退皆可，审时度势。'}
                    {selectedYao.index === 5 && '五爻：飞龙在天，利见大人。大吉之象，事事亨通。'}
                    {selectedYao.index === 6 && '上爻：亢龙有悔。盛极而衰，宜收敛退守。'}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">AI 建议</h4>
                  <p className="text-zinc-400">
                    此爻显示当前处于变化{selectedYao.index <= 3 ? '初期' : '后期'}，建议保持{selectedYao.line === 0 || selectedYao.line === 1 ? '警觉，注意变化带来的机遇与挑战' : '现状，不宜轻举妄动'}。
                  </p>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="flat" onPress={onClose}>
              关闭
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
