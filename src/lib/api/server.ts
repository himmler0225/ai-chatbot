import axios, { type AxiosInstance } from 'axios'

const MINER_URL = process.env.DATA_MINER_URL ?? 'http://localhost:8000'
const MINER_KEY = process.env.DATA_MINER_KEY ?? ''
const MINER_BFF_TOKEN = process.env.DATA_MINER_BFF_TOKEN ?? ''
const AI_LAYER_URL = process.env.AI_LAYER_URL ?? 'http://localhost:8001'
const AI_LAYER_KEY = process.env.AI_LAYER_KEY ?? ''

export class MinerRequestError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'MinerRequestError'
    this.status = status
  }
}

export const dataMinerClient: AxiosInstance = axios.create({
  baseURL: MINER_URL,
  headers: {
    'X-API-Key': MINER_KEY,
    ...(MINER_BFF_TOKEN ? { 'X-Rm-Bff': MINER_BFF_TOKEN } : {}),
  },
  timeout: 30_000,
})

export const aiLayerClient: AxiosInstance = axios.create({
  baseURL: AI_LAYER_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': AI_LAYER_KEY,
  },
  timeout: 120_000,
})

export function unwrapMinerPayload(raw: unknown): unknown {
  const r = raw as { data?: { data?: unknown } }
  return r?.data?.data ?? r?.data ?? raw
}

export async function minerGet<T = unknown>(path: string): Promise<T> {
  try {
    const { data } = await dataMinerClient.get(path)
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
