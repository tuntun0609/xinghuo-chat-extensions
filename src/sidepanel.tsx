import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'

import { ChatHeader, ChatInput, ChatList } from '~components'
import { Role, type MessageItem } from '~types'

import 'dayjs/locale/zh-cn'
import 'property-information'
import './sidepanel.scss'

import { sendMsg } from '~utils/chat'

dayjs.locale('zh-cn')

const SidePanelMain = () => {
  const [messagePool, setMessagePool] = useImmer<MessageItem[]>([])

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
    sendMsg(content, messages, (addContent) => {
      setMessagePool((draft) => {
        draft.find(
          (item) =>
            item.timestamp === timestamp && item.role === Role.Assistant,
        )!.content += addContent
      })
    })
  }

  const onAsk = (content: string) => {
    addMessage(content, Role.User)
    addAssistantMessage(content, messagePool)
  }

  return (
    <ConfigProvider locale={zhCN}>
      <ChatHeader />
      <ChatList messagePool={messagePool} />
      <ChatInput onSend={onAsk} />
    </ConfigProvider>
  )
}

export default SidePanelMain
