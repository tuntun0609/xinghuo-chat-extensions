export enum Version {
  V1 = 'v1.1',
  V2 = 'v2.1',
}

export enum General {
  V1 = 'general',
  V2 = 'generalv2',
}

export type Config = Partial<{
  host: string
  version: Version
  baseUrl: string
  general: General
}>

export enum Role {
  User = 'user',
  Assistant = 'assistant',
}

export type MessageItem =
  | {
      role: Role.Assistant
      content?: string
      timestamp?: number
    }
  | {
      role: Role.User
      content: string
      timestamp?: number
    }
