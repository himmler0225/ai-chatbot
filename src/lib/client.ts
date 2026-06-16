import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'

export abstract class BaseApi {
  protected readonly http: AxiosInstance

  constructor(basePath: string) {
    this.http = axios.create({
      baseURL: basePath,
      headers: { 'Content-Type': 'application/json' },
      timeout: 90_000,
    })
  }

  protected get<T>(path = '', config?: AxiosRequestConfig) {
    return this.http.get<T>(path, config)
  }

  protected post<T>(path = '', data?: unknown, config?: AxiosRequestConfig) {
    return this.http.post<T>(path, data, config)
  }

  protected put<T>(path = '', data?: unknown, config?: AxiosRequestConfig) {
    return this.http.put<T>(path, data, config)
  }

  protected patch<T>(path = '', data?: unknown, config?: AxiosRequestConfig) {
    return this.http.patch<T>(path, data, config)
  }

  protected delete<T>(path = '', config?: AxiosRequestConfig) {
    return this.http.delete<T>(path, config)
  }
}
