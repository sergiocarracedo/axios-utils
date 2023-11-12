import type { AxiosInstance } from 'axios'

type LogLevel = 'none' | 'debug' | 'warn' | 'error'
type Strategy = 'filter' | 'error'

export interface JwtGuardOptions {
  token: string | (() => string)
  header?: string
  callback?: () => void
  logLevel?: LogLevel
}
export function setupJwtGuard(axios: AxiosInstance, options: JwtGuardOptions) {
  const {
    token,
    header = 'bearer',
    callback = () => {},
    logLevel = 'debug'
  } = options

  const log = (...data: any[]): void => {
    switch (logLevel) {
      case 'none':
        return
      default:
        return console[logLevel]('[jwt-guard]', ...data)
    }
  }

  axios.interceptors.request.use((config) => {
    const headers = config.headers
    const tokenValue = typeof token === 'function' ? token() : token

    // Checks token validity
    if (!tokenValue) {
      log('Token is empty')
      callback()
    }

    // Check token expiration
    const tokenParts = tokenValue.split('.')
    const tokenPayload = JSON.parse(atob(tokenParts[1]))
    const tokenExpiration = tokenPayload.exp * 1000
    const now = Date.now()
    if (now > tokenExpiration) {
      console.log('Token expired')
      callback()
    }


    const tokenHeader = `${header} ${tokenValue}`
    headers.Authorization = tokenHeader
    config.headers = headers
    log(`Authorization header set to ${tokenHeader}`)

    return config
  })
}
