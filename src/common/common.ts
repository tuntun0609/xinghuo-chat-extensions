import { General, Version, type Config } from '~types'

export const commonConfig: Config = {
  host: 'spark-api.xf-yun.com',
}

export const configV2: Config = {
  version: Version.V2,
  baseUrl: 'wss://spark-api.xf-yun.com/v2.1/chat',
  general: General.V2,
}

export const configV1: Config = {
  version: Version.V1,
  baseUrl: 'wss://spark-api.xf-yun.com/v1.1/chat',
  general: General.V1,
}

export const getConfig = (version: Version): Config => {
  let versionConfig = {}
  switch (version) {
    case Version.V1:
      versionConfig = configV1
      break
    case Version.V2:
      versionConfig = configV2
    default:
      break
  }
  return {
    ...commonConfig,
    ...versionConfig,
  }
}
