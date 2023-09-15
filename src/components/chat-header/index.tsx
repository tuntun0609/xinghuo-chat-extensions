import { SettingOutlined } from '@ant-design/icons'
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popover,
  Select,
  Space,
  Tooltip,
} from 'antd'
import { useState, type ReactNode } from 'react'

import { Storage } from '@plasmohq/storage'
import { useStorage } from '@plasmohq/storage/hook'

import type { ApiConfig } from '~types'
import { Version } from '~types'

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

const SettingPopover = ({ closePopover }: { closePopover?: () => void }) => {
  const [apiConfigForm] = Form.useForm()
  const [apiFormModalOpen, setApiFormModalOpen] = useState(false)
  const [apiConfig, setApiConfig] = useStorage<ApiConfig>(
    {
      key: 'apiConfig',
      instance: new Storage({
        area: 'local',
      }),
    },
    {},
  )
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
  const [maxContentTokens, setMaxContentTokens] = useStorage(
    {
      key: 'maxContentTokens',
      instance: new Storage({
        area: 'local',
      }),
    },
    2048,
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
        <FormItem tooltip="上下文tokens的最大长度" label="上下文tokens">
          <InputNumber
            value={maxContentTokens}
            onChange={(value) => {
              setMaxContentTokens(value)
            }}
            max={4096}
            min={1}
            step={100}
          />
        </FormItem>
        <Button
          style={{ width: '100%' }}
          type="primary"
          onClick={() => {
            setApiFormModalOpen(true)
            closePopover?.()
          }}>
          设置api配置
        </Button>
        <Modal
          destroyOnClose
          title="设置api配置"
          onCancel={() => setApiFormModalOpen(false)}
          open={apiFormModalOpen}
          onOk={() => {
            apiConfigForm
              .validateFields()
              .then((values) => {
                setApiConfig(values)
                apiConfigForm.resetFields()
                setApiFormModalOpen(false)
              })
              .catch((info) => {
                console.log('Validate Failed:', info)
              })
          }}>
          <Form initialValues={apiConfig} form={apiConfigForm}>
            <Space size={16} style={{ width: '100%' }} direction="vertical">
              <FormItem label="APPID">
                <Form.Item noStyle name="APPID">
                  <Input />
                </Form.Item>
              </FormItem>
              <FormItem label="APISecret">
                <Form.Item noStyle name="APISecret">
                  <Input />
                </Form.Item>
              </FormItem>
              <FormItem label="APIKey">
                <Form.Item noStyle name="APIKey">
                  <Input />
                </Form.Item>
              </FormItem>
            </Space>
          </Form>
        </Modal>
      </Space>
    </div>
  )
}

export const ChatHeader = () => {
  const [settingPopoverOpen, setSettingPopoverOpen] = useState(false)
  const [version, setVersion] = useStorage(
    {
      key: 'version',
      instance: new Storage({
        area: 'local',
      }),
    },
    Version.V2,
  )
  return (
    <div className={styles.main}>
      <Space className={styles.left}>
        <Select
          value={version}
          onChange={(value) => setVersion(value)}
          options={[
            { value: Version.V1, label: 'v1' },
            { value: Version.V2, label: 'v2' },
          ]}
        />
      </Space>
      <div className={styles.middle}>Tun Xinghuo Chat</div>
      <Space className={styles.right}>
        <Popover
          open={settingPopoverOpen}
          content={
            <SettingPopover closePopover={() => setSettingPopoverOpen(false)} />
          }
          title="设置"
          onOpenChange={(open) => setSettingPopoverOpen(open)}
          trigger="click">
          <Button
            onClick={() => setSettingPopoverOpen(true)}
            type="text"
            className={styles.settingBtn}>
            <SettingOutlined />
          </Button>
        </Popover>
      </Space>
    </div>
  )
}
