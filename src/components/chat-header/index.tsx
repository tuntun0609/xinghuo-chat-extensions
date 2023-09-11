import { Space } from 'antd'

import styles from './index.module.scss'

export const ChatHeader = () => {
  return (
    <div className={styles.main}>
      <Space className={styles.left}></Space>
      <Space className={styles.right}></Space>
    </div>
  )
}
