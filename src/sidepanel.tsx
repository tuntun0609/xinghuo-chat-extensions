import { Button, ConfigProvider, message } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import React, { useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'

import { Storage } from '@plasmohq/storage'
import { useStorage } from '@plasmohq/storage/hook'

import { ChatHeader, ChatInput, ChatList } from '~components'
import { Role, Version, type ApiConfig, type MessageItem } from '~types'
import { sendMsg } from '~utils/chat'

import 'dayjs/locale/zh-cn'
import 'property-information'
import './sidepanel.scss'

dayjs.locale('zh-cn')

const SidePanelMain = () => {
  const [messagePool, setMessagePool] = useImmer<MessageItem[]>([])
  const inputRef = useRef<{
    setContent: (content: string) => void
  }>()
  const [apiConfig] = useStorage<ApiConfig>(
    {
      key: 'apiConfig',
      instance: new Storage({
        area: 'local',
      }),
    },
    {},
  )
  const [version] = useStorage(
    {
      key: 'version',
      instance: new Storage({
        area: 'local',
      }),
    },
    Version.V2,
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
    sendMsg(content, messages, apiConfig, version, (addContent) => {
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

  useEffect(() => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.type === 'search') {
        inputRef.current.setContent(request.content)
        sendResponse({
          status: 'success',
        })
      }
    })
  }, [])

  return (
    <ConfigProvider locale={zhCN}>
      <ChatHeader />
      <ChatList messagePool={messagePool} />
      <ChatInput onSend={onAsk} cRef={inputRef} />
    </ConfigProvider>
  )
}

export default SidePanelMain
