import { NextRequest, NextResponse } from 'next/server'
import { aiLayerClient } from '@/lib/api/server'

type Ctx = { params: Promise<{ path: string[] }> }

async function proxy(req: NextRequest, ctx: Ctx): Promise<NextResponse> {
  const { path } = await ctx.params
  const target = `/ai/history/${path.join('/')}`
  const auth = req.headers.get('authorization') ?? ''
  const apiKey = req.headers.get('x-api-key') ?? ''

  try {
    let body: unknown = undefined
    if (req.method !== 'GET' && req.method !== 'DELETE') {
      body = await req.json().catch(() => undefined)
    }

    const { data, status } = await aiLayerClient.request({
      method: req.method,
      url: target,
      data: body,
      headers: { Authorization: auth, 'X-API-Key': apiKey || undefined },
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

export const GET    = proxy
export const POST   = proxy
export const PATCH  = proxy
export const DELETE = proxy
