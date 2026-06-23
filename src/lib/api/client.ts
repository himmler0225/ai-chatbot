import axios, {
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { guardHeaders } from '@/lib/guard/client'
import { clientGuardHeaders } from '@/lib/guard/client-headers'

export type ApiOptions = {
  headers?: Record<string, string>
  params?: Record<string, unknown>
  signal?: AbortSignal
}

function apiPath(url: string | undefined): string {
  if (!url) return ''
  const raw = url.startsWith('http') ? new URL(url).pathname : url
  const q = raw.indexOf('?')
  return q === -1 ? raw : raw.slice(0, q)
}

function shouldGuard(path: string): boolean {
  if (!path.startsWith('/api/')) return false
  if (path.startsWith('/api/guard/')) return false
  if (path.startsWith('/api/admin/')) return false
  return true
}

function resolveRequestPath(config: InternalAxiosRequestConfig): string {
  const url = config.url ?? ''
  if (url.startsWith('http')) return apiPath(url)
  const base = (config.baseURL ?? '').replace(/\/$/, '')
  const rel = url.startsWith('/') ? url : `/${url}`
  return apiPath(`${base}${rel}`)
}

async function attachGuard(config: InternalAxiosRequestConfig): Promise<void> {
  const path = resolveRequestPath(config)
  if (!shouldGuard(path)) return

  const method = (config.method ?? 'get').toUpperCase()
  const body =
    config.data === undefined || config.data === null
      ? ''
      : typeof config.data === 'string'
        ? config.data
        : JSON.stringify(config.data)

  const signed = await guardHeaders(method, path, body)
  config.headers = AxiosHeaders.from({
    ...(config.headers as Record<string, string>),
    ...signed,
  })
}

export function getCurrentLang(): string {
  if (typeof window !== 'undefined') {
    const stored =
      localStorage.getItem('i18nextLng') ||
      localStorage.getItem('lang') ||
      navigator?.language
    if (stored) return stored.split('-')[0]
  }
  return 'vi'
}

export function withLanguageHeaders(
  config: AxiosRequestConfig,
): AxiosRequestConfig {
  const lang = getCurrentLang()
  config.headers = {
    ...(config.headers || {}),
    'Accept-Language': lang,
  }
  return config
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
    ...clientGuardHeaders(),
  },
  timeout: 90_000,
})

apiClient.interceptors.request.use(
  async config => {
    withLanguageHeaders(config)
    await attachGuard(config)
    return config
  },
  error => Promise.reject(error),
)

/** Browser không đọc SSE stream qua axios — dùng fetch nhưng gom header/config tại đây */
export async function postSse(
  path: string,
  data: unknown,
  signal?: AbortSignal,
): Promise<Response> {
  const lang = getCurrentLang()
  const body = JSON.stringify(data)
  const signed = shouldGuard(path) ? await guardHeaders('POST', path, body) : {}

  return fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': lang,
      ...clientGuardHeaders(),
      ...signed,
    },
    body,
    signal,
  })
}

export function installGuardInterceptor(client: AxiosInstance): void {
  client.interceptors.request.use(
    async config => {
      await attachGuard(config)
      return config
    },
    error => Promise.reject(error),
  )
}

export class BaseApi {
  constructor(
    protected basePath: string,
    protected client: AxiosInstance = apiClient,
  ) {}

  protected async get<T>(path = '', options: ApiOptions = {}): Promise<T> {
    const res: AxiosResponse<T> = await this.client.get(
      `${this.basePath}${path}`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
        params: options.params,
        signal: options.signal,
      },
    )
    return res.data
  }

  protected async post<T>(
    path = '',
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const res: AxiosResponse<T> = await this.client.post(
      `${this.basePath}${path}`,
      data,
      config,
    )
    return res.data
  }

  protected async put<T>(
    path = '',
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const res: AxiosResponse<T> = await this.client.put(
      `${this.basePath}${path}`,
      data,
      config,
    )
    return res.data
  }

  protected async patch<T>(
    path = '',
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const res: AxiosResponse<T> = await this.client.patch(
      `${this.basePath}${path}`,
      data,
      config,
    )
    return res.data
  }

  protected async delete<T>(
    path = '',
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const res: AxiosResponse<T> = await this.client.delete(
      `${this.basePath}${path}`,
      config,
    )
    return res.data
  }
}
