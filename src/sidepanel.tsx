import { ConfigProvider, message } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { useImmer } from 'use-immer'

import { Storage } from '@plasmohq/storage'
import { useStorage } from '@plasmohq/storage/hook'

import {
  ChatContext,
  ChatHeader,
  ChatInput,
  ChatList,
  type ApiConfig,
} from '~components'
import { Role, Version, type MessageItem } from '~types'
import { sendMsg } from '~utils/chat'

import 'dayjs/locale/zh-cn'
import 'property-information'
import './sidepanel.scss'

dayjs.locale('zh-cn')

// export const apiConfig: ApiConfig = {
//   APPID: process.env.PLASMO_PUBLIC_APPID,
//   APISecret: process.env.PLASMO_PUBLIC_APISecret,
//   APIKey: process.env.PLASMO_PUBLIC_APIKey,
// }

const SidePanelMain = () => {
  const [messagePool, setMessagePool] = useImmer<MessageItem[]>([])
  const [version, setVersion] = useState<Version>(Version.V2)
  const [apiConfig] = useStorage<ApiConfig>(
    {
      key: 'apiConfig',
      instance: new Storage({
        area: 'local',
      }),
    },
    {},
  )

  const addMessage = (content: string, role: Role, timestamp?: number) => {
    setMessagePool((draft) => {
      draft.push({
        role: role === Role.User ? Role.User : Role.Assistant,
        content,
        timestamp: timestamp ?? dayjs().valueOf(),
      })
    })
  }

  const addAssistantMessage = async (
    content: string,
    messages: MessageItem[],
  ) => {
    const timestamp = dayjs().valueOf()
    // 添加初始化消息
    addMessage('', Role.Assistant, timestamp)
    sendMsg(content, messages, apiConfig, (addContent) => {
      setMessagePool((draft) => {
        draft.find(
          (item) =>
            item.timestamp === timestamp && item.role === Role.Assistant,
        )!.content += addContent
      })
    })
  }

  const onAsk = (content: string) => {
    if (
      apiConfig.APPID === undefined ||
      apiConfig.APISecret === undefined ||
      apiConfig.APIKey === undefined
    ) {
      message.error('请先配置 API')
      return
    }
    addMessage(content, Role.User)
    addAssistantMessage(content, messagePool)
  }

  return (
    <ConfigProvider locale={zhCN}>
      <ChatContext.Provider
        value={{
          version,
          setVersion,
          apiConfig,
        }}>
        <ChatHeader />
        <ChatList messagePool={messagePool} />
        <ChatInput onSend={onAsk} />
      </ChatContext.Provider>
    </ConfigProvider>
  )
}

export default SidePanelMain
