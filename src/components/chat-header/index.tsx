import { SettingOutlined } from '@ant-design/icons'
import { Button, Form, InputNumber, Popover, Space, Tooltip } from 'antd'
import type { ReactNode } from 'react'

import { Storage } from '@plasmohq/storage'
import { useStorage } from '@plasmohq/storage/hook'

import styles from './index.module.scss'

const FormItem = ({
  children,
  label,
  tooltip,
}: {
  children: ReactNode
  label: ReactNode
  tooltip?: ReactNode
}) => {
  return (
    <div className={styles.formItme}>
      <Tooltip title={tooltip}>
        <div className={styles.label}>{label}</div>
      </Tooltip>
      <div>{children}</div>
    </div>
  )
}

const SettingPopover = () => {
  const [temperature, setTemperature] = useStorage(
    {
      key: 'temperature',
      instance: new Storage({
        area: 'local',
      }),
    },
    0.5,
  )
  const [maxTokens, setMaxTokens] = useStorage(
    {
      key: 'max-tokens',
      instance: new Storage({
        area: 'local',
      }),
    },
    2048,
  )
  const [topK, setTopK] = useStorage(
    {
      key: 'top_k',
      instance: new Storage({
        area: 'local',
      }),
    },
    4,
  )
  return (
    <div className={styles.popoverMain}>
      <Space size={16} style={{ width: '100%' }} direction="vertical">
        <FormItem
          tooltip="核采样阈值。用于决定结果随机性，取值越高随机性越强即相同的问题得到的不同答案的可能性越高"
          label="temperature">
          <InputNumber
            value={temperature}
            onChange={(value) => {
              setTemperature(value)
            }}
            max={1}
            min={0}
            step={0.1}
          />
        </FormItem>
        <FormItem tooltip="模型回答的tokens的最大长度" label="max_tokens">
          <InputNumber
            value={maxTokens}
            onChange={(value) => {
              setMaxTokens(value)
            }}
            max={4096}
            min={1}
            step={100}
          />
        </FormItem>
        <FormItem tooltip="从k个候选中随机选择⼀个（⾮等概率）" label="top_k">
          <InputNumber
            value={topK}
            onChange={(value) => {
              setTopK(value)
            }}
            max={6}
            min={1}
            step={1}
          />
        </FormItem>
      </Space>
    </div>
  )
}

export const ChatHeader = () => {
  return (
    <div className={styles.main}>
      <Space className={styles.left}>
        <div></div>
      </Space>
      <div className={styles.middle}>Tun Xinghuo Chat</div>
      <Space className={styles.right}>
        <Popover content={SettingPopover} title="设置" trigger="click">
          <Button type="text" className={styles.settingBtn}>
            <SettingOutlined />
          </Button>
        </Popover>
      </Space>
    </div>
  )
}
