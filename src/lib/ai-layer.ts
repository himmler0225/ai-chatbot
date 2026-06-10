import axios, { AxiosError, type AxiosInstance } from 'axios'
import type { ChatPayload, ChatResponse, Source, Tool, ApiResponse } from '@/src/types/chat'

const AI_LAYER_URL   = process.env.AI_LAYER_URL ?? 'http://localhost:8001'
const AI_LAYER_KEY   = process.env.AI_LAYER_KEY ?? ''
const AGENT_TIMEOUT  = 80_000

interface AgentResult {
  result:     string
  data:       { review_summary: string | null; sources: Source[]; products: unknown[] }
  tool_calls: { tool: string }[]
  iterations: number
}

export class AiLayerOfflineError extends Error {
  constructor(url: string, cause: string) {
    super(`Không thể kết nối đến AI Layer (${url}).\n\n${cause}`)
    this.name = 'AiLayerOfflineError'
  }
}

export class AiLayerTimeoutError extends Error {
  constructor() {
    super('Yêu cầu mất quá nhiều thời gian. Vui lòng thử lại với câu hỏi ngắn hơn.')
    this.name = 'AiLayerTimeoutError'
  }
}

export class AiLayerUpstreamError extends Error {
  constructor(public readonly status: number, body: string) {
    super(body)
    this.name = 'AiLayerUpstreamError'
  }
}

class AiLayerClient {
  private readonly http: AxiosInstance

  constructor() {
    this.http = axios.create({
      baseURL: AI_LAYER_URL,
      timeout: AGENT_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key':    AI_LAYER_KEY,
      },
    })
  }

  async runAgent(payload: ChatPayload): Promise<ChatResponse> {
    const task = buildTask(payload)

    let raw: ApiResponse<AgentResult>
    try {
      const { data } = await this.http.post<ApiResponse<AgentResult>>('/ai/agent/run', {
        task, tools: 'all', max_iter: 5,
      })
      raw = data
    } catch (err) {
      throw mapAxiosError(err, 'agent')
    }

    const d = raw.data
    return {
      message:       d.result                   ?? '',
      reviewSummary: d.data?.review_summary      ?? null,
      sources:       d.data?.sources             ?? [],
      products:      d.data?.products            ?? [],
      usedTools:     (d.tool_calls ?? []).map((t): Tool => ({
        name: t.tool, label: t.tool, icon: '🔧',
      })),
    }
  }

  async callUtility<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    try {
      const { data } = await this.http.post<ApiResponse<T>>(
        `/ai/utilities/${endpoint}`, body,
      )
      return data
    } catch (err) {
      throw mapAxiosError(err, 'utility')
    }
  }
}

function buildTask(payload: ChatPayload): string {
  if (payload.history.length === 0) return payload.message
  const ctx = payload.history
    .slice(-6)
    .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content.slice(0, 400)}`)
    .join('\n')
  return `[Lịch sử hội thoại]\n${ctx}\n\n[Câu hỏi hiện tại]\n${payload.message}`
}

function mapAxiosError(err: unknown, context: string): Error {
  if (err instanceof AxiosError) {
    if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
      return new AiLayerTimeoutError()
    }
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      return new AiLayerOfflineError(AI_LAYER_URL, err.message)
    }
    if (err.response) {
      return new AiLayerUpstreamError(err.response.status, JSON.stringify(err.response.data))
    }
  }
  const msg = err instanceof Error ? err.message : String(err)
  return new AiLayerOfflineError(AI_LAYER_URL, `[${context}] ${msg}`)
}

export const aiLayer = new AiLayerClient()
