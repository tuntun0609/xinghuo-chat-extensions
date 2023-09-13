import { createContext } from 'react'

import type { Version } from '~types'

export interface ApiConfig {
  APPID: string
  APISecret: string
  APIKey: string
}

export interface ChatContextProps {
  version?: Version
  setVersion?: (version: Version) => void
  apiConfig?: ApiConfig
}

export const ChatContext = createContext<ChatContextProps>({})
