import axios, { type AxiosInstance } from 'axios'
import type { ChatPayload, ChatResponse, Tool, ApiResponse } from '@/src/types/chat'
import type { AgentResult } from './types'
import { AiLayerTimeoutError, AiLayerUpstreamError } from './errors'
import { buildTask, mapAxiosError } from './utils'

const AI_LAYER_URL  = process.env.AI_LAYER_URL ?? 'http://localhost:8001'
const AI_LAYER_KEY  = process.env.AI_LAYER_KEY ?? ''
const AGENT_TIMEOUT = 80_000

export class AiLayerClient {
  private readonly http: AxiosInstance

  constructor() {
    this.http = axios.create({
      baseURL: AI_LAYER_URL,
      timeout: AGENT_TIMEOUT,
      headers: { 'Content-Type': 'application/json', 'X-API-Key': AI_LAYER_KEY },
    })
  }

  async runAgent(payload: ChatPayload): Promise<ChatResponse> {
    let raw: ApiResponse<AgentResult>
    try {
      const { data } = await this.http.post<ApiResponse<AgentResult>>('/ai/agent/run', {
        task: buildTask(payload), tools: 'all', max_iter: 5,
      })
      raw = data
    } catch (err) {
      throw mapAxiosError(err, 'agent')
    }

    const d = raw.data
    return {
      message:       d.result                ?? '',
      reviewSummary: d.data?.review_summary  ?? null,
      sources:       d.data?.sources         ?? [],
      products:      d.data?.products        ?? [],
      usedTools:     (d.tool_calls ?? []).map((t): Tool => ({ name: t.tool, label: t.tool, icon: '🔧' })),
    }
  }

  async callUtility<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    try {
      const { data } = await this.http.post<ApiResponse<T>>(`/ai/utilities/${endpoint}`, body)
      return data
    } catch (err) {
      throw mapAxiosError(err, 'utility')
    }
  }

  toOfflineResponse(err: unknown): ChatResponse {
    const msg = err instanceof AiLayerTimeoutError || err instanceof AiLayerUpstreamError
      ? err.message
      : err instanceof Error ? err.message : 'Đã có lỗi xảy ra.'
    return { message: msg, usedTools: [], reviewSummary: null, sources: [], products: [] }
  }
}
