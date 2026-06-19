import type { ChatPayload } from '@/types/chat'
import { buildTask } from '@/lib/ai-layer/utils'
import { aiLayerClient } from '@/lib/api/server'
import { getServerConfig, get } from '@/lib/server-config'

export const maxDuration = 120

function errorSse(message: string): Response {
  return new Response(`data: ${JSON.stringify({ type: 'error', message })}\n\n`, {
    headers: { 'Content-Type': 'text/event-stream' },
  })
}

export async function POST(request: Request): Promise<Response> {
  let payload: ChatPayload
  try {
    payload = (await request.json()) as ChatPayload
    if (!payload.message || typeof payload.message !== 'string') {
      return errorSse('Invalid message')
    }
  } catch {
    return errorSse('Invalid JSON body')
  }

  const config = await getServerConfig()
  const layerUrl = get(config, 'AI_LAYER_URL', process.env.AI_LAYER_URL ?? 'http://localhost:8001')
  const layerKey = get(config, 'AI_LAYER_KEY', process.env.AI_LAYER_KEY ?? '')
  const maxIter = Number(get(config, 'AGENT_MAX_ITER', '10'))

  try {
    const response = await aiLayerClient.post(
      '/ai/agent/run/stream',
      { task: buildTask(payload), tools: 'all', max_iter: maxIter },
      {
        responseType: 'stream',
        headers: { 'X-API-Key': layerKey },
        baseURL: layerUrl,
      },
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
}
