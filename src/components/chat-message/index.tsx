import { Space } from 'antd'
import { clsx } from 'clsx'

import { Role, type MessageItem } from '~types'

import styles from './index.module.scss'

interface ChatMessageProps {
  message: MessageItem
}

const UserMessage = ({ message }: ChatMessageProps) => (
  <div className={clsx(styles.message, styles.user)}>
    <div className={styles.content}>{message.content}</div>
  </div>
)

const AssistantMessage = ({ message }: ChatMessageProps) => (
  <div className={clsx(styles.message, styles.assistant)}>
    <div className={styles.content}>{message.content}</div>
  </div>
)

export const ChatMessage = ({ message }: ChatMessageProps) => {
  let MessageCmp: (props: ChatMessageProps) => React.JSX.Element | null = null
  switch (message.role) {
    case Role.User: {
      MessageCmp = UserMessage
      break
    }
    case Role.Assistant: {
      MessageCmp = AssistantMessage
      break
    }
    default: {
      MessageCmp = null
    }
  }

  return (
    <div className={styles.main}>
      {MessageCmp && <MessageCmp message={message} />}
    </div>
  )
}
