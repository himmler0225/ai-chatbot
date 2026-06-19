import type { ChatPayload, ChatResponse, Tool, ApiResponse } from '@/types/chat'
import type { AgentResult } from './types'
import { AiLayerTimeoutError, AiLayerUpstreamError } from './errors'
import { buildTask, mapAxiosError } from './utils'
import { aiLayerClient } from '@/lib/api/server'

const AGENT_MAX_ITER = 10

export class AiLayerClient {
  async runAgent(payload: ChatPayload): Promise<ChatResponse> {
    let raw: ApiResponse<AgentResult>
    try {
      const { data } = await aiLayerClient.post<ApiResponse<AgentResult>>('/ai/agent/run', {
        task: buildTask(payload),
        tools: 'all',
        max_iter: AGENT_MAX_ITER,
      })
      raw = data
    } catch (err) {
      throw mapAxiosError(err, 'agent')
    }

    const d = raw.data
    return {
      message: d.result ?? '',
      reviewSummary: d.data?.review_summary ?? null,
      sources: d.data?.sources ?? [],
      products: d.data?.products ?? [],
      usedTools: (d.tool_calls ?? []).map(
        (t): Tool => ({ name: t.tool, label: t.tool, icon: '🔧' }),
      ),
    }
  }

  async callUtility<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    try {
      const { data } = await aiLayerClient.post<ApiResponse<T>>(`/ai/utilities/${endpoint}`, body)
      return data
    } catch (err) {
      throw mapAxiosError(err, 'utility')
    }
  }

  toOfflineResponse(err: unknown): ChatResponse {
    const msg =
      err instanceof AiLayerTimeoutError || err instanceof AiLayerUpstreamError
        ? err.message
        : err instanceof Error
          ? err.message
          : 'Đã có lỗi xảy ra.'
    return { message: msg, usedTools: [], reviewSummary: null, sources: [], products: [] }
  }
}
