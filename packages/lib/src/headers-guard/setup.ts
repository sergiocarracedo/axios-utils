import type { AxiosInstance } from 'axios'

type LogLevel = 'none' | 'debug' | 'warn' | 'error'
type Strategy = 'filter' | 'error'

export interface HeadersGuardOptions {
  allowed: string[]
  forbidden: string[]
  strategy: Strategy
  logLevel: LogLevel

}
export function setupHeadersGuard(axios: AxiosInstance, options: Partial<HeadersGuardOptions = {}>) {
  const {
    allowed = [],
    forbidden = [],
    strategy = 'filter',
    logLevel = 'warn'
  } = options

  const log = (...data: any[]): void => {
    switch (logLevel) {
      case 'none':
        return
      default:
        return console[logLevel]('[headers-guard]', ...data)
    }
  }

  axios.interceptors.request.use((config) => {
    const headers = config.headers
    const headersKeys = Object.keys(headers)
    const forbiddenHeaders = headersKeys.filter((key) => forbidden.includes(key))
    const allowedHeaders = headersKeys.filter((key) => allowed.includes(key))

    if (forbiddenHeaders.length > 0) {
      let logMsg = `Forbidden headers found: ${forbiddenHeaders.join(', ')}`
      if (strategy === 'error') {
        throw new Error(logMsg)
      } else if (strategy === 'filter') {
        log(`${logMsg}. Removing them from the requests.`)
        forbiddenHeaders.forEach((key) => delete headers[key])
      }
    }

    if (allowed.length > 0) {
      log(`Allowed headers found: ${allowedHeaders.join(', ')}. Keeping them.`)
    }

    config.headers = headers

    return config
  })
}
