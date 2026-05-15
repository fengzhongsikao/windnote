import { Card, Switch, Divider, Button } from 'antd'
import {
  BellOutlined, DeleteOutlined,
} from '@ant-design/icons'

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-hei-400 mb-6">设置</h1>

      <div className="space-y-6">

        <Card
          className="bg-bai-400 border-hei-400/10"
          title={
            <div className="flex items-center gap-2">
              <BellOutlined className="text-qing-400" />
              <span className="font-medium text-hei-400">通知</span>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-hei-400">每日运势提醒</span>
              <Switch defaultChecked />
            </div>
            <Divider className="!bg-hei-400/10" />
            <div className="flex items-center justify-between">
              <span className="text-hei-400">占卜结果保存提示</span>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        <Card
          className="bg-bai-400 border-hei-400/10"
          title={
            <div className="flex items-center gap-2">
              <DeleteOutlined className="text-chi-400" />
              <span className="font-medium text-hei-400">数据管理</span>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-hei-400">清除所有历史记录</div>
                <div className="text-sm text-hei-400/60">此操作不可撤销</div>
              </div>
              <Button danger>
                清除
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
