import type { ChatPayload, ChatResponse } from '@/src/types/chat'

export const maxDuration = 90

const AI_LAYER_URL    = process.env.AI_LAYER_URL    ?? 'http://localhost:8001'
const AI_LAYER_KEY    = process.env.AI_LAYER_KEY    ?? ''
const AGENT_TIMEOUT   = 80_000

function buildTask(payload: ChatPayload): string {
  if (payload.history.length === 0) return payload.message
  const ctx = payload.history
    .slice(-6)
    .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content.slice(0, 400)}`)
    .join('\n')
  return `[Lịch sử hội thoại]\n${ctx}\n\n[Câu hỏi hiện tại]\n${payload.message}`
}

function errorResponse(message: string): Response {
  return Response.json({ message, usedTools: [], reviewSummary: null, sources: [] } satisfies Partial<ChatResponse>)
}

export async function POST(request: Request): Promise<Response> {
  let payload: ChatPayload
  try {
    payload = await request.json() as ChatPayload
    if (!payload.message || typeof payload.message !== 'string') {
      return Response.json({ error: 'Invalid message' }, { status: 400 })
    }
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const controller = new AbortController()
  const timer      = setTimeout(() => controller.abort(), AGENT_TIMEOUT)

  let agentResp: Response
  try {
    agentResp = await fetch(`${AI_LAYER_URL}/ai/agent/run`, {
      method:  'POST',
      signal:  controller.signal,
      headers: { 'Content-Type': 'application/json', 'X-API-Key': AI_LAYER_KEY },
      body:    JSON.stringify({ task: buildTask(payload), tools: 'all', max_iter: 5 }),
    })
  } catch (err) {
    clearTimeout(timer)
    if (err instanceof Error && err.name === 'AbortError') {
      return errorResponse('Yêu cầu mất quá nhiều thời gian. Vui lòng thử lại với câu hỏi ngắn hơn.')
    }
    const detail = err instanceof Error ? err.message : String(err)
    return errorResponse(`Không thể kết nối đến AI Layer (${AI_LAYER_URL}).\n\n${detail}`)
  } finally {
    clearTimeout(timer)
  }

  if (!agentResp.ok) {
    const body = await agentResp.text()
    if (agentResp.status === 504) {
      return errorResponse('Tôi cần thêm thời gian để tìm dữ liệu. Bạn có thể hỏi cụ thể hơn không?')
    }
    return Response.json({ error: 'Agent error', detail: body }, { status: 502 })
  }

  const agent = await agentResp.json()
  const response: ChatResponse = {
    message:       agent.result?.data?.response      ?? agent.result ?? '',
    reviewSummary: agent.result?.data?.review_summary ?? null,
    sources:       agent.result?.data?.sources        ?? [],
    products:      agent.result?.data?.products       ?? [],
    usedTools:     (agent.tool_calls ?? []).map((t: { tool: string }) => ({
      name: t.tool, label: t.tool, icon: '🔧',
    })),
  }

  return Response.json(response)
}
