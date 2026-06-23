import { NextRequest, NextResponse } from 'next/server'
import { withGuard } from '@/lib/guard/server'
import { aiLayerClient } from '@/lib/api/server'

type Ctx = { params: Promise<{ path: string[] }> }

async function proxy(
  req: NextRequest,
  ctx: Ctx,
  bodyText: string,
): Promise<NextResponse> {
  const { path } = await ctx.params
  const target = `/ai/history/${path.join('/')}`
  const auth = req.headers.get('authorization') ?? ''

  try {
    let body: unknown = undefined
    if (req.method !== 'GET' && req.method !== 'DELETE' && bodyText) {
      body = JSON.parse(bodyText)
    }

    const { data, status } = await aiLayerClient.request({
      method: req.method,
      url: target,
      data: body,
      headers: { Authorization: auth, 'X-API-Key': process.env.AI_LAYER_KEY ?? '' },
      params: Object.fromEntries(new URL(req.url).searchParams),
    })

    return NextResponse.json(data, { status })
  } catch (err: unknown) {
    const e = err as { response?: { data?: unknown; status?: number }; message?: string }
    if (e?.response) {
      return NextResponse.json(e.response.data, { status: e.response.status ?? 500 })
    }
    return NextResponse.json({ error: e?.message ?? 'proxy error' }, { status: 502 })
  }
}

function guarded(method: 'GET' | 'POST' | 'PATCH' | 'DELETE') {
  return (req: NextRequest, ctx: Ctx) =>
    withGuard(req, async (request, bodyText) => proxy(request, ctx, bodyText))
}

export const GET = guarded('GET')
export const POST = guarded('POST')
export const PATCH = guarded('PATCH')
export const DELETE = guarded('DELETE')
