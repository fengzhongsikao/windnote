import {
  Card,
  CardBody,
  CardHeader,
  Switch,
  Select,
  SelectItem,
  Divider,
  Button,
  Input,
} from '@heroui/react'
import { Server, Bell, MapPin, Trash2 } from 'lucide-react'

const aiModels = [
  { key: 'openai', label: 'OpenAI GPT-4' },
  { key: 'claude', label: 'Claude 3.5' },
  { key: 'local', label: '本地模型' },
  { key: 'custom', label: '自定义 API' },
]

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">设置</h1>

      <div className="space-y-6">
        {/* AI Model Settings */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Server size={18} className="text-amber-400" />
              <span className="font-medium">AI 模型</span>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <Select
              label="选择 AI 模型"
              defaultSelectedKeys={['openai']}
              className="max-w-md"
            >
              {aiModels.map((model) => (
                <SelectItem key={model.key}>{model.label}</SelectItem>
              ))}
            </Select>
            <Input
              label="API Key"
              type="password"
              placeholder="请输入 API Key"
              className="max-w-md"
            />
            <Input
              label="自定义 API 地址"
              placeholder="https://api.example.com/v1"
              className="max-w-md"
            />
          </CardBody>
        </Card>

        {/* Location Settings */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-amber-400" />
              <span className="font-medium">地理位置</span>
            </div>
          </CardHeader>
          <CardBody>
            <Input
              label="当前城市"
              defaultValue="广东中山"
              className="max-w-md"
            />
            <p className="text-xs text-zinc-500 mt-2">
              用于计算财神方位和黄历信息
            </p>
          </CardBody>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-amber-400" />
              <span className="font-medium">通知</span>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <span>每日运势提醒</span>
              <Switch defaultSelected />
            </div>
            <Divider className="bg-white/5" />
            <div className="flex items-center justify-between">
              <span>占卜结果保存提示</span>
              <Switch defaultSelected />
            </div>
          </CardBody>
        </Card>

        {/* Data Management */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Trash2 size={18} className="text-red-400" />
              <span className="font-medium">数据管理</span>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">清除所有历史记录</div>
                <div className="text-sm text-zinc-400">此操作不可撤销</div>
              </div>
              <Button color="danger" variant="flat">
                清除
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
