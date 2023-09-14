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

export enum Status {
  First = 0,
  Continue = 1,
  End = 2,
}

export interface ChatResponse {
  header: {
    code: number
    message: string
    sid: string
    status: Status
  }
  payload: {
    choices: {
      seq: number
      status: Status
      text: {
        content: string
        role: Role
        index: number
      }[]
    }
    usage: {
      text: {
        question_tokens: number
        prompt_tokens: number
        completion_tokens: number
        total_tokens: number
      }
    }
  }
}

export interface ApiConfig {
  APPID?: string
  APISecret?: string
  APIKey?: string
}
