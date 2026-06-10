import type { ChatPayload } from '@/src/types/chat'
import { aiLayer }          from '@/src/lib/ai-layer'

export const maxDuration = 90

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

  try {
    return Response.json(await aiLayer.runAgent(payload))
  } catch (err) {
    return Response.json(aiLayer.toOfflineResponse(err))
  }
}
