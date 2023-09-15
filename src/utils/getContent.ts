import type { MessageItem } from '~types'

const getTokenLength = (content: string) => {
  // 一中文约为1.5个token，一英文约为0.8个token
  const chinese = content.match(/[\u4e00-\u9fa5]/g)
  const english = content.match(/[a-zA-Z]/g)
  const chineseLength = chinese ? chinese.length * 1.5 : 0
  const englishLength = english ? english.length * 0.8 : 0
  return Math.ceil(chineseLength + englishLength)
}

export const getContent = (
  messagePool: MessageItem[],
  maxContentTokens: number,
) => {
  const pool: MessageItem[] = []
  // 从messagePool消息池中取出最后 tokens 和小于 maxContentTokens 的消息
  // 从后往前取，直到 tokens 和大于 maxContentTokens
  let totalTokens = 0
  for (let i = messagePool.length - 1; i >= 0; i--) {
    const item = messagePool[i]
    const tokensLength = getTokenLength(item.content)
    if (totalTokens + tokensLength <= maxContentTokens) {
      pool.unshift(item)
      totalTokens += tokensLength
    } else {
      break
    }
  }
  return pool
}
