import { NextRequest } from 'next/server'
const MINER = process.env.DATA_MINER_URL ?? 'http://localhost:8000'
const KEY   = process.env.DATA_MINER_KEY  ?? ''

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const spid  = req.nextUrl.searchParams.get('spid') ?? ''
  const page  = req.nextUrl.searchParams.get('page') ?? '1'
  const limit = req.nextUrl.searchParams.get('limit') ?? '10'
  try {
    const qs  = new URLSearchParams({ page, limit, ...(spid ? { spid } : {}) })
    const r   = await fetch(`${MINER}/api/tiki/products/${id}/reviews?${qs}`, { headers: { 'X-API-Key': KEY }, next: { revalidate: 300 } })
    const raw = await r.json()
    const payload = raw?.data?.data ?? raw?.data ?? raw
    return Response.json({ success: true, data: payload })
  } catch { return Response.json({ success: false, data: [] }, { status: 502 }) }
}
