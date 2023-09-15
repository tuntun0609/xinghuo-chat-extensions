import { Button, Input, Space } from 'antd'
import React, { useImperativeHandle, useState } from 'react'

import styles from './index.module.scss'

interface ChatInputProps {
  onSend?: (content: string) => void
  cRef: React.MutableRefObject<{
    setContent: (content: string) => void
  }>
}

export const ChatInput = (props: ChatInputProps) => {
  const [content, setContent] = useState('')

  useImperativeHandle(props.cRef, () => ({
    setContent: (content: string) => {
      setContent(content)
    },
  }))

  const onContentChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
    e,
  ) => {
    setContent(e.target.value)
  }

  const send = (message: string) => {
    props.onSend?.(message)
    setContent('')
  }

  const onPressEnter: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.shiftKey) {
      e.preventDefault()
      send(content)
    }
  }

  const onSendBtnClick = () => {
    send(content)
  }

  return (
    <div className={styles.main}>
      <div className={styles.input}>
        <Input.TextArea
          value={content}
          onChange={onContentChange}
          onPressEnter={onPressEnter}
          placeholder="请输入发送信息, 按下 Shift + Enter 发送"
        />
      </div>
      <div className={styles.icons}>
        <Button onClick={onSendBtnClick} type="primary">
          发送
        </Button>
      </div>
    </div>
  )
}
