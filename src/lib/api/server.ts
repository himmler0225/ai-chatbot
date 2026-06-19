import axios, { type AxiosInstance } from 'axios'

const MINER_URL = process.env.DATA_MINER_URL ?? 'http://localhost:8000'
const MINER_KEY = process.env.DATA_MINER_KEY ?? ''
const AI_LAYER_URL = process.env.AI_LAYER_URL ?? 'http://localhost:8001'
const AI_LAYER_KEY = process.env.AI_LAYER_KEY ?? ''

export const dataMinerClient: AxiosInstance = axios.create({
  baseURL: MINER_URL,
  headers: { 'X-API-Key': MINER_KEY },
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
  const { data } = await dataMinerClient.get(path)
  return unwrapMinerPayload(data) as T
}
