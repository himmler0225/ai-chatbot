import { NextRequest } from 'next/server'

const MINER = process.env.DATA_MINER_URL ?? 'http://localhost:8000'
const KEY   = process.env.DATA_MINER_KEY  ?? ''

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q     = searchParams.get('q') ?? ''
  const limit = searchParams.get('limit') ?? '20'
  const sort  = searchParams.get('sort') ?? 'top_seller'
  const page  = searchParams.get('page') ?? '1'

  if (!q.trim()) return Response.json({ success: false, data: [] })

  try {
    const r    = await fetch(
      `${MINER}/api/tiki/products/search?q=${encodeURIComponent(q)}&limit=${limit}&sort=${sort}&page=${page}`,
      { headers: { 'X-API-Key': KEY }, next: { revalidate: 60 } }
    )
    const raw  = await r.json()
    const payload = raw?.data?.data ?? raw?.data ?? raw
    return Response.json({ success: true, data: payload })
  } catch {
    return Response.json({ success: false, data: [] }, { status: 502 })
  }
}
