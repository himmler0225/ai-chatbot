import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios'

export type ApiOptions = {
  headers?: Record<string, string>
  params?: Record<string, unknown>
  signal?: AbortSignal
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
  headers: { 'Content-Type': 'application/json' },
  timeout: 90_000,
})

apiClient.interceptors.request.use(
  config => {
    withLanguageHeaders(config)
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
  return fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': lang,
    },
    body: JSON.stringify(data),
    signal,
  })
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
