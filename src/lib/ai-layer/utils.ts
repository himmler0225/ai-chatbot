import { AxiosError } from 'axios'
import type { ChatPayload } from '@/src/types/chat'
import { AiLayerOfflineError, AiLayerTimeoutError, AiLayerUpstreamError } from './errors'

const AI_LAYER_URL = process.env.AI_LAYER_URL ?? 'http://localhost:8001'

export function buildTask(payload: ChatPayload): string {
  if (payload.history.length === 0) return payload.message
  const ctx = payload.history
    .slice(-6)
    .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content.slice(0, 400)}`)
    .join('\n')
  return `[Lịch sử hội thoại]\n${ctx}\n\n[Câu hỏi hiện tại]\n${payload.message}`
}

export function mapAxiosError(err: unknown, context: string): Error {
  if (err instanceof AxiosError) {
    if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') return new AiLayerTimeoutError()
    if (err.code === 'ECONNREFUSED'  || err.code === 'ENOTFOUND')  return new AiLayerOfflineError(AI_LAYER_URL, err.message)
    if (err.response) return new AiLayerUpstreamError(err.response.status, JSON.stringify(err.response.data))
  }
  const msg = err instanceof Error ? err.message : String(err)
  return new AiLayerOfflineError(AI_LAYER_URL, `[${context}] ${msg}`)
}
