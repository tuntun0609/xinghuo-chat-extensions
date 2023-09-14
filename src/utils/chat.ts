import { Storage } from '@plasmohq/storage'

import { getConfig } from '~common/common'
import type { ApiConfig } from '~types'
import { Version, type ChatResponse, type MessageItem } from '~types'

import { getWebsocketUrl } from './getWebSocketUrl'

const storage = new Storage({
  area: 'local',
})

export const sendMsg = async (
  content: string,
  messagePool: MessageItem[],
  apiConfig: ApiConfig,
  version = Version.V2,
  onMessage?: (message: string) => void,
): Promise<string> => {
  const config = getConfig(version)
  const url = getWebsocketUrl(config, apiConfig)
  const temperature = (await storage.get('temperature')) ?? 0.5
  const maxTokens = (await storage.get('max-tokens')) ?? 2048
  const topK = (await storage.get('top_k')) ?? 4
  let result = ''
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url)
    socket.addEventListener('open', (event) => {
      // 发送消息
      let params = {
        header: {
          app_id: apiConfig.APPID,
          uid: 'user1',
        },
        parameter: {
          chat: {
            domain: config.general,
            temperature: temperature,
            max_tokens: maxTokens,
            top_k: topK,
            chat_id: 'user1',
          },
        },
        payload: {
          message: {
            text: [
              ...messagePool.map((item) => ({
                role: item.role,
                content: item.content,
              })),
              { role: 'user', content: content },
            ],
          },
        },
      }
      socket.send(JSON.stringify(params))
    })
    socket.addEventListener('message', (event) => {
      try {
        let data: ChatResponse = JSON.parse(event.data)
        onMessage?.(
          data.payload?.choices?.text[0].content ?? data.header.message,
        )
        result += data.payload?.choices?.text[0].content ?? data.header.message
        if (data.header.code !== 0) {
          socket.close()
        }
        if (data.header.code === 0) {
          // 对话已经完成
          if (data.payload.choices.text && data.header.status === 2) {
            setTimeout(() => {
              // "对话完成，手动关闭连接"
              socket.close()
            }, 0)
          }
        }
      } catch {
        socket.close()
      }
    })
    socket.addEventListener('close', (event) => {
      resolve(result)
    })
    socket.addEventListener('error', (event) => {
      resolve('连接错误')
    })
  })
}
