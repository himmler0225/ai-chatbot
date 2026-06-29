import type { NextRequest } from 'next/server'
import { withGuard } from '@/lib/guard/server'
import type { ChatPayload } from '@/types/chat'
import { buildTask } from '@/lib/ai-layer/utils'
import { getAiLayerClient } from '@/lib/api/server'
import { resolveAiLayer } from '@/lib/server-config'

export const maxDuration = 120

function errorSse(message: string): Response {
  return new Response(`data: ${JSON.stringify({ type: 'error', message })}\n\n`, {
    headers: { 'Content-Type': 'text/event-stream' },
  })
}

export async function POST(request: NextRequest): Promise<Response> {
  return withGuard(request, async (_req, bodyText) => {
    let payload: ChatPayload
    try {
      payload = JSON.parse(bodyText) as ChatPayload
      if (!payload.message || typeof payload.message !== 'string') {
        return errorSse('Invalid message')
      }
    } catch {
      return errorSse('Invalid JSON body')
    }

    const { url: layerUrl } = await resolveAiLayer()

    try {
      const client = await getAiLayerClient()
      const response = await client.post(
        '/ai/agent/run/stream',
        // max_iter: để ai-layer đọc AGENT_MAX_ITER từ Supabase (tránh dev fallback 10 ghi đè)
        { task: buildTask(payload), tools: 'all' },
        { responseType: 'stream' },
      )

      return new Response(response.data as ReadableStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'X-Accel-Buffering': 'no',
        },
      })
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err)
      return errorSse(`AI Layer không khả dụng (${layerUrl}).\n\n${detail}`)
    }
  })
}
