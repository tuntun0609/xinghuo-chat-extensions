import base64 from 'base-64'
import CryptoJs from 'crypto-js'

import type { ApiConfig } from '~components'
import type { Config } from '~types'

export const getWebsocketUrl = (config: Config, apiConfig: ApiConfig) => {
  const date = new Date().toUTCString()
  const signatureOrigin = `host: ${config.host}\ndate: ${date}\nGET /v2.1/chat HTTP/1.1`
  const signatureSha = CryptoJs.HmacSHA256(signatureOrigin, apiConfig.APISecret)
  const signature = CryptoJs.enc.Base64.stringify(signatureSha)

  const authorizationOrigin = `api_key="${apiConfig.APIKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
  const authorization = base64.encode(authorizationOrigin)

  const finalUrl = `${
    config.baseUrl
  }?authorization=${authorization}&date=${encodeURI(date)}&host=${config.host}`

  return finalUrl
}
