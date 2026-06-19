import { BaseApi, postSse } from '@/lib/api/client'
import type { ChatPayload } from '@/types/chat'

class ChatApi extends BaseApi {
  constructor() {
    super('/api')
  }

  fetchStream(payload: ChatPayload, signal: AbortSignal): Promise<Response> {
    return postSse('/api/chat', payload, signal)
  }
}

export const chatApi = new ChatApi()
