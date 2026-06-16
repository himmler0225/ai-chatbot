import { BaseApi } from '@/src/lib/client'
import type { ChatPayload } from '@/src/types/chat'

class ChatApi extends BaseApi {
  constructor() {
    super('/api')
  }

  fetchStream(payload: ChatPayload, signal: AbortSignal): Promise<Response> {
    return fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    })
  }
}

export const chatApi = new ChatApi()
