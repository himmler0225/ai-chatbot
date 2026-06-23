import { NextRequest } from 'next/server'
import { withGuard } from '@/lib/guard/server'
import { aiLayer, AiLayerOfflineError } from '@/lib/ai-layer'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  return withGuard(request, async (_req, bodyText) => {
    const { slug } = await params
    const body = JSON.parse(bodyText)

    try {
      const data = await aiLayer.callUtility(slug.join('/'), body)
      return Response.json(data)
    } catch (err) {
      if (err instanceof AiLayerOfflineError) {
        return Response.json(
          { success: false, error: err.message, data: null, meta: {} },
          { status: 503 },
        )
      }
      const msg = err instanceof Error ? err.message : String(err)
      return Response.json({ success: false, error: msg, data: null, meta: {} }, { status: 500 })
    }
  })
}
