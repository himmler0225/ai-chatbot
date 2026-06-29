import axios, { type AxiosInstance } from 'axios'
import { resolveAiLayer, resolveDataMiner } from '@/lib/server-config'

export class MinerRequestError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'MinerRequestError'
    this.status = status
  }
}

export async function getAiLayerClient(): Promise<AxiosInstance> {
  const { url, key } = await resolveAiLayer()
  return axios.create({
    baseURL: url,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': key,
    },
    timeout: 120_000,
  })
}

export async function getDataMinerClient(): Promise<AxiosInstance> {
  const { url, key, bffToken } = await resolveDataMiner()
  return axios.create({
    baseURL: url,
    headers: {
      'X-API-Key': key,
      ...(bffToken ? { 'X-Rm-Bff': bffToken } : {}),
    },
    timeout: 30_000,
  })
}

export function unwrapMinerPayload(raw: unknown): unknown {
  const r = raw as { data?: { data?: unknown } }
  return r?.data?.data ?? r?.data ?? raw
}

export async function minerGet<T = unknown>(path: string): Promise<T> {
  try {
    const client = await getDataMinerClient()
    const { data } = await client.get(path)
    return unwrapMinerPayload(data) as T
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      const detail =
        typeof err.response.data === 'object' && err.response.data !== null
          ? JSON.stringify(err.response.data)
          : String(err.response.data ?? err.message)
      throw new MinerRequestError(err.response.status, detail)
    }
    throw err
  }
}
