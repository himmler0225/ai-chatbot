import axios, { type AxiosInstance } from 'axios'
import { resolveAiLayer } from '@/lib/server-config'

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
