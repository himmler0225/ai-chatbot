import { AxiosError } from 'axios'
import type { ChatPayload } from '@/types/chat'
import { AiLayerOfflineError, AiLayerTimeoutError, AiLayerUpstreamError } from './errors'

const AI_LAYER_URL = process.env.AI_LAYER_URL ?? 'http://localhost:8001'

/** Khớp server `slugify_product_id` — agent dùng làm product_id RAG. */
export function slugifyProductId(name: string): string {
  const s = (name || '').toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '')
  const slug = s.replace(/\s+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80)
  return slug || 'unknown-product'
}

export function buildTask(payload: ChatPayload): string {
  const parts: string[] = []

  if (payload.product?.name) {
    const pid = slugifyProductId(payload.product.name)
    parts.push('[Sản phẩm đang xem]')
    parts.push(`Tên: ${payload.product.name}`)
    parts.push(`product_id: ${pid}`)
    if (payload.product.price) parts.push(`Giá: ${payload.product.price}`)
    if (payload.product.url) parts.push(`Link: ${payload.product.url}`)
    if (payload.product.store) parts.push(`Cửa hàng: ${payload.product.store}`)
    parts.push('')
  }

  if (payload.history.length === 0) {
    parts.push(payload.message)
    return parts.join('\n')
  }

  const ctx = payload.history
    .slice(-6)
    .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content.slice(0, 400)}`)
    .join('\n')
  parts.push(`[Lịch sử hội thoại]\n${ctx}\n\n[Câu hỏi hiện tại]\n${payload.message}`)
  return parts.join('\n')
}

export function mapAxiosError(err: unknown, context: string): Error {
  if (err instanceof AxiosError) {
    if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') return new AiLayerTimeoutError()
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND')
      return new AiLayerOfflineError(AI_LAYER_URL, err.message)
    if (err.response)
      return new AiLayerUpstreamError(err.response.status, JSON.stringify(err.response.data))
  }
  const msg = err instanceof Error ? err.message : String(err)
  return new AiLayerOfflineError(AI_LAYER_URL, `[${context}] ${msg}`)
}
