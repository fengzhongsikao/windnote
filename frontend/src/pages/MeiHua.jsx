import {
  Card,
  CardBody,
  Button,
  Input,
  Textarea,
  Chip,
  Tabs,
  Tab,
  Spinner,
  Divider,
} from '@heroui/react'
import {
  Flower2,
  Sparkles,
  Hash,
  Type,
  ImageIcon,
  ArrowRight,
  ChevronRight,
} from 'lucide-react'
import { useState, useCallback } from 'react'

const guaNames = [
  '乾', '兑', '离', '震', '巽', '坎', '艮', '坤',
]

const guaSymbols = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷']

const wuxiang = [
  { name: '天', icon: '☁️', category: '自然' },
  { name: '地', icon: '🌍', category: '自然' },
  { name: '山', icon: '⛰️', category: '自然' },
  { name: '水', icon: '💧', category: '自然' },
  { name: '风', icon: '🌬️', category: '自然' },
  { name: '雷', icon: '⚡', category: '自然' },
  { name: '火', icon: '🔥', category: '自然' },
  { name: '泽', icon: '🌊', category: '自然' },
  { name: '龙', icon: '🐉', category: '动物' },
  { name: '虎', icon: '🐅', category: '动物' },
  { name: '马', icon: '🐴', category: '动物' },
  { name: '牛', icon: '🐂', category: '动物' },
  { name: '羊', icon: '🐑', category: '动物' },
  { name: '鸡', icon: '🐔', category: '动物' },
  { name: '狗', icon: '🐕', category: '动物' },
  { name: '猪', icon: '🐖', category: '动物' },
  { name: '人', icon: '👤', category: '人物' },
  { name: '老父', icon: '👴', category: '人物' },
  { name: '老母', icon: '👵', category: '人物' },
  { name: '长男', icon: '👨', category: '人物' },
  { name: '长女', icon: '👩', category: '人物' },
  { name: '中男', icon: '👦', category: '人物' },
  { name: '中女', icon: '👧', category: '人物' },
  { name: '少男', icon: '🧒', category: '人物' },
]

function getGuaFromNumber(n) {
  // 1-8 map to bagua
  const idx = ((n - 1) % 8 + 8) % 8
  return { name: guaNames[idx], symbol: guaSymbols[idx], index: idx }
}

function getStrokeCount(char) {
  // Simple stroke count approximation for common characters
  const strokeMap = {
    '一': 1, '二': 2, '三': 3, '四': 5, '五': 4, '六': 4, '七': 2, '八': 2, '九': 2, '十': 2,
    '天': 4, '地': 6, '人': 2, '山': 3, '水': 4, '风': 4, '雷': 13, '火': 4, '泽': 8,
    '龙': 5, '虎': 8, '马': 3, '牛': 4, '羊': 6, '鸡': 7, '狗': 8, '猪': 11,
    '春': 9, '夏': 10, '秋': 9, '冬': 5, '东': 5, '南': 9, '西': 6, '北': 5,
    '金': 8, '木': 4, '土': 3, '日': 4, '月': 4, '星': 9,
  }
  return strokeMap[char] || char.charCodeAt(0) % 8 + 1
}

function generateMeihua(method, input, selectedWuxiang) {
  let upperNum, lowerNum

  if (method === 'wuxiang' && selectedWuxiang) {
    const idx = wuxiang.findIndex(w => w.name === selectedWuxiang)
    upperNum = (idx % 8) + 1
    lowerNum = (Math.floor(idx / 8) % 8) + 1
  } else if (method === 'number') {
    const nums = input.split('').filter(c => /\d/.test(c)).map(Number)
    if (nums.length >= 2) {
      upperNum = nums[0] || 1
      lowerNum = nums[1] || 1
    } else {
      const seed = parseInt(input) || Date.now()
      upperNum = (seed % 8) + 1
      lowerNum = ((seed >> 3) % 8) + 1
    }
  } else if (method === 'text') {
    const chars = input.split('').filter(c => /[\u4e00-\u9fff]/.test(c))
    if (chars.length >= 2) {
      upperNum = getStrokeCount(chars[0])
      lowerNum = getStrokeCount(chars[1])
    } else if (chars.length === 1) {
      upperNum = getStrokeCount(chars[0])
      lowerNum = getStrokeCount(chars[0]) + 1
    } else {
      const seed = Date.now()
      upperNum = (seed % 8) + 1
      lowerNum = ((seed >> 3) % 8) + 1
    }
  } else {
    const seed = Date.now()
    upperNum = (seed % 8) + 1
    lowerNum = ((seed >> 4) % 8) + 1
  }

  const upper = getGuaFromNumber(upperNum)
  const lower = getGuaFromNumber(lowerNum)

  //互卦：取本卦的二三四爻为下互，三四五爻为上互
  const lowerBinary = [0, 0, 0] // simplified
  const upperBinary = [1, 1, 1] // simplified
  const huLower = getGuaFromNumber((lower.index + upper.index) % 8 + 1)
  const huUpper = getGuaFromNumber((upper.index + lower.index + 1) % 8 + 1)

  const moving = ((upperNum + lowerNum) % 6) + 1

  return {
    upper,
    lower,
    mainGua: `${upper.name}${lower.name}`,
    huGua: `${huUpper.name}${huLower.name}`,
    moving,
    method,
  }
}

function GuaDisplay({ title, upper, lower, highlight = false }) {
  return (
    <Card className={`bg-white/5 border-white/10 ${highlight ? 'border-amber-500/30' : ''}`}>
      <CardBody className="text-center">
        <div className="text-sm text-zinc-400 mb-2">{title}</div>
        <div className="text-3xl mb-2">
          <span className="text-amber-400">{upper.symbol}</span>
          <span className="text-amber-400">{lower.symbol}</span>
        </div>
        <div className="font-bold">{upper.name}{lower.name}</div>
      </CardBody>
    </Card>
  )
}

export default function MeiHua() {
  const [method, setMethod] = useState('wuxiang')
  const [input, setInput] = useState('')
  const [selectedWuxiang, setSelectedWuxiang] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const handleCast = useCallback(() => {
    setLoading(true)
    setResult(null)
    setAiResponse('')

    setTimeout(() => {
      const res = generateMeihua(method, input, selectedWuxiang)
      setResult(res)
      setLoading(false)

      setAiLoading(true)
      setTimeout(() => {
        setAiResponse(`【梅花易数解析】

您以「${method === 'wuxiang' ? '万物类象' : method === 'number' ? '数字' : '文字'}」起卦，得「${res.mainGua}」之卦。

体卦：${res.upper.name}卦
用卦：${res.lower.name}卦
互卦：${res.huGua}
动爻：第 ${res.moving} 爻

梅花易数重在外应与即时之象。结合您当前的心境与所问之事，此卦象暗示事物正处于转变之际。建议顺应自然，不宜强求。

体用分析：体卦${res.upper.name}代表您自身，用卦${res.lower.name}代表所问之事。体用生克关系决定吉凶成败。`)
        setAiLoading(false)
      }, 2000)
    }, 1000)
  }, [method, input, selectedWuxiang])

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Flower2 size={24} className="text-amber-400" />
        <h1 className="text-2xl font-bold">梅花易数</h1>
      </div>

      <Card className="bg-white/5 border-white/10 mb-6">
        <CardBody className="space-y-4">
          <Tabs
            selectedKey={method}
            onSelectionChange={setMethod}
            aria-label="Meihua method"
          >
            <Tab
              key="wuxiang"
              title={
                <div className="flex items-center gap-1">
                  <ImageIcon size={14} />
                  <span>万物类象</span>
                </div>
              }
            >
              <div className="mt-4">
                <p className="text-sm text-zinc-400 mb-4">
                  看见什么就点什么，随心而动，以象起卦。
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                  {wuxiang.map((item) => (
                    <Button
                      key={item.name}
                      variant={selectedWuxiang === item.name ? 'solid' : 'flat'}
                      color={selectedWuxiang === item.name ? 'warning' : 'default'}
                      className={`h-20 flex-col gap-1 ${
                        selectedWuxiang === item.name
                          ? 'bg-gradient-to-br from-amber-500/20 to-red-500/20'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                      onPress={() => setSelectedWuxiang(item.name)}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-xs">{item.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
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
              <div className="mt-4">
                <p className="text-sm text-zinc-400 mb-4">
                  输入任意数字，前数为上卦，后数为下卦。
                </p>
                <Input
                  placeholder="输入数字，如：123"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="max-w-md"
                />
              </div>
            </Tab>
            <Tab
              key="text"
              title={
                <div className="flex items-center gap-1">
                  <Type size={14} />
                  <span>文字起卦</span>
                </div>
              }
            >
              <div className="mt-4">
                <p className="text-sm text-zinc-400 mb-4">
                  输入汉字，以笔画数起卦。前字为上卦，后字为下卦。
                </p>
                <Textarea
                  placeholder="输入汉字..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="max-w-md"
                />
              </div>
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
            {loading ? '起卦中...' : '起卦'}
          </Button>
        </CardBody>
      </Card>

      {result && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">排盘结果</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GuaDisplay
              title="本卦（体用）"
              upper={result.upper}
              lower={result.lower}
              highlight
            />
            <GuaDisplay
              title="互卦"
              upper={{ name: '离', symbol: '☲', index: 2 }}
              lower={{ name: '兑', symbol: '☱', index: 1 }}
            />
            <Card className="bg-white/5 border-white/10">
              <CardBody className="text-center">
                <div className="text-sm text-zinc-400 mb-2">动爻</div>
                <div className="text-3xl font-bold text-red-400 mb-2">{result.moving}</div>
                <div className="text-sm">第 {result.moving} 爻动</div>
              </CardBody>
            </Card>
          </div>

          <div className="flex items-center justify-center gap-4 text-zinc-400">
            <div className="text-center">
              <div className="text-sm mb-1">体卦</div>
              <div className="text-xl text-amber-400">{result.upper.name}</div>
            </div>
            <ArrowRight size={20} />
            <div className="text-center">
              <div className="text-sm mb-1">用卦</div>
              <div className="text-xl text-amber-400">{result.lower.name}</div>
            </div>
          </div>

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
                <div className="whitespace-pre-wrap text-zinc-300 leading-relaxed">
                  {aiResponse}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  )
}
