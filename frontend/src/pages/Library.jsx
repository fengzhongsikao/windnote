import { Card, Input, Tabs, Tag, Collapse } from 'antd'
import { SearchOutlined, BookOutlined } from '@ant-design/icons'
import { useState } from 'react'

const guaData = [
  {
    name: '乾为天',
    symbol: '☰☰',
    number: 1,
    nature: '天',
    meaning: '元亨利贞。大吉，刚健中正。',
    yao: [
      '初九：潜龙勿用。',
      '九二：见龙在田，利见大人。',
      '九三：君子终日乾乾，夕惕若，厉无咎。',
      '九四：或跃在渊，无咎。',
      '九五：飞龙在天，利见大人。',
      '上九：亢龙有悔。',
    ],
  },
  {
    name: '坤为地',
    symbol: '☷☷',
    number: 2,
    nature: '地',
    meaning: '元亨，利牝马之贞。柔顺承载。',
    yao: [
      '初六：履霜，坚冰至。',
      '六二：直方大，不习无不利。',
      '六三：含章可贞。或从王事，无成有终。',
      '六四：括囊，无咎无誉。',
      '六五：黄裳，元吉。',
      '上六：龙战于野，其血玄黄。',
    ],
  },
  {
    name: '水雷屯',
    symbol: '☵☳',
    number: 3,
    nature: '水雷',
    meaning: '元亨利贞，勿用有攸往，利建侯。起始维艰。',
    yao: [
      '初九：磐桓；利居贞，利建侯。',
      '六二：屯如邅如，乘马班如。匪寇婚媾。',
      '六三：即鹿无虞，惟入于林中。',
      '六四：乘马班如，求婚媾，往吉，无不利。',
      '九五：屯其膏，小贞吉，大贞凶。',
      '上六：乘马班如，泣血涟如。',
    ],
  },
  {
    name: '山水蒙',
    symbol: '☶☵',
    number: 4,
    nature: '山水',
    meaning: '亨。匪我求童蒙，童蒙求我。启蒙教化。',
    yao: [
      '初六：发蒙，利用刑人，用说桎梏。',
      '九二：包蒙吉；纳妇吉；子克家。',
      '六三：勿用取女；见金夫，不有躬，无攸利。',
      '六四：困蒙，吝。',
      '六五：童蒙，吉。',
      '上九：击蒙；不利为寇，利御寇。',
    ],
  },
  {
    name: '水天需',
    symbol: '☵☰',
    number: 5,
    nature: '水天',
    meaning: '有孚，光亨，贞吉。利涉大川。等待时机。',
    yao: [
      '初九：需于郊。利用恒，无咎。',
      '九二：需于沙。小有言，终吉。',
      '九三：需于泥，致寇至。',
      '六四：需于血，出自穴。',
      '六五：需于酒食，贞吉。',
      '上六：入于穴，有不速之客三人来。',
    ],
  },
  {
    name: '天水讼',
    symbol: '☰☵',
    number: 6,
    nature: '天水',
    meaning: '有孚，窒。惕中吉。终凶。争讼之道。',
    yao: [
      '初六：不永所事，小有言，终吉。',
      '九二：不克讼，归而逋，其邑人三百户，无眚。',
      '六三：食旧德，贞厉，终吉。',
      '九四：不克讼，复即命，渝安贞，吉。',
      '九五：讼元吉。',
      '上九：或锡之鞶带，终朝三褫之。',
    ],
  },
  {
    name: '地水师',
    symbol: '☷☵',
    number: 7,
    nature: '地水',
    meaning: '贞，丈人吉，无咎。用兵之道。',
    yao: [
      '初六：师出以律，否臧凶。',
      '九二：在师中，吉无咎，王三锡命。',
      '六三：师或舆尸，凶。',
      '六四：师左次，无咎。',
      '六五：田有禽，利执言，无咎。',
      '上六：大君有命，开国承家，小人勿用。',
    ],
  },
  {
    name: '水地比',
    symbol: '☵☷',
    number: 8,
    nature: '水地',
    meaning: '吉。原筮元永贞，无咎。亲比团结。',
    yao: [
      '初六：有孚比之，无咎。有孚盈缶，终来有他，吉。',
      '六二：比之自内，贞吉。',
      '六三：比之匪人。',
      '六四：外比之，贞吉。',
      '九五：显比，王用三驱，失前禽。',
      '上六：比之无首，凶。',
    ],
  },
]

export default function Library() {
  const [search, setSearch] = useState('')

  const filtered = guaData.filter(
    (g) =>
      g.name.includes(search) ||
      g.nature.includes(search) ||
      g.meaning.includes(search)
  )

  const tabItems = [
    {
      key: 'all',
      label: '全部',
      children: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {filtered.map((gua) => (
            <Card
              key={gua.number}
              className="bg-bai-400 border-hei-400/10 hover:border-qing-400/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-lg font-bold text-hei-400">{gua.name}</div>
                  <div className="text-2xl my-1">{gua.symbol}</div>
                </div>
                <Tag color="warning">第 {gua.number} 卦</Tag>
              </div>
              <p className="text-sm text-hei-400/60 mb-3">{gua.meaning}</p>
              <Collapse
                ghost
                items={[
                  {
                    key: 'yao',
                    label: '查看爻辞',
                    children: (
                      <div className="space-y-1 text-sm text-hei-400/60">
                        {gua.yao.map((y, i) => (
                          <p key={i}>{y}</p>
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
      children: <div className="text-hei-400/60 mt-4">上经三十卦，展示前十六卦</div>,
    },
    {
      key: 'lower',
      label: '下经',
      children: <div className="text-hei-400/60 mt-4">下经三十四卦</div>,
    },
  ]

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <BookOutlined className="text-lg text-qing-400" />
        <h1 className="text-2xl font-bold text-hei-400">解卦库</h1>
      </div>

      <Input
        placeholder="搜索卦名、卦象或含义..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        prefix={<SearchOutlined className="text-hei-400/40" />}
        style={{ maxWidth: 384 }}
        className="mb-6"
      />

      <Tabs items={tabItems} />
    </div>
  )
}
