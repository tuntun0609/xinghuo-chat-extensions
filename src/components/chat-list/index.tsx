import { ChatMessage } from '~components/chat-message'
import type { MessageItem } from '~types'

import styles from './index.module.scss'

interface ChatListProps {
  messagePool: MessageItem[]
}

export const ChatList = ({ messagePool }: ChatListProps) => {
  return (
    <div className={styles.main}>
      {messagePool.map((message) => (
        <ChatMessage key={message.timestamp} message={message} />
      ))}
    </div>
  )
}
