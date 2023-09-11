import { ConfigProvider, DatePicker } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'

import { ChatHeader, ChatInput, ChatList } from '~components'
import { Role, type MessageItem } from '~types'

import 'dayjs/locale/zh-cn'
import './sidepanel.scss'

dayjs.locale('zh-cn')

const SidePanelMain = () => {
  const [messagePool, setMessagePool] = useImmer<MessageItem[]>([
    {
      role: Role.User,
      content: '你好',
      timestamp: 1,
    },
    {
      role: Role.Assistant,
      content: '你好你好你好你好你好你好你好你好你好你好你好你好',
      timestamp: 2,
    },
    {
      role: Role.User,
      content:
        '你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好',
      timestamp: 3,
    },
  ])

  useEffect(() => {
    console.log(messagePool)
  }, [messagePool])

  const addMessage = (content: string, role: Role) => {
    setMessagePool((draft) => {
      draft.push({
        role: role === Role.User ? Role.User : Role.Assistant,
        content,
        timestamp: dayjs().valueOf(),
      })
    })
  }

  const onSend = (content: string) => {
    addMessage(content, Role.User)
  }

  return (
    <ConfigProvider locale={zhCN}>
      <ChatHeader />
      <ChatList messagePool={messagePool} />
      <ChatInput onSend={onSend} />
    </ConfigProvider>
  )
}

export default SidePanelMain
