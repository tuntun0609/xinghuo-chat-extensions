import { getConfig } from '~common/common'
import { Version, type ChatResponse, type MessageItem } from '~types'

import { getWebsocketUrl, requestObj } from './getWebSocketUrl'

export const sendMsg = (
  content: string,
  messagePool: MessageItem[],
  onMessage?: (message: string) => void,
  version = Version.V2,
): Promise<string> => {
  console.log(messagePool)
  const url = getWebsocketUrl(getConfig(version))
  let result = ''
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url)
    socket.addEventListener('open', (event) => {
      // 发送消息
      let params = {
        header: {
          app_id: requestObj.APPID,
          uid: 'user1',
        },
        parameter: {
          chat: {
            domain: 'generalv2',
            temperature: 0.5,
            max_tokens: 300,
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
