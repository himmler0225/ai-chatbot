import { NextRequest } from 'next/server'
const MINER = process.env.DATA_MINER_URL ?? 'http://localhost:8000'
const KEY   = process.env.DATA_MINER_KEY  ?? ''

export async function GET(req: NextRequest) {
  const limit = req.nextUrl.searchParams.get('limit') ?? '20'
  try {
    const r   = await fetch(`${MINER}/api/tiki/products/sales?per_page=${limit}`, { headers: { 'X-API-Key': KEY }, next: { revalidate: 300 } })
    const raw = await r.json()
    const payload = raw?.data?.data ?? raw?.data ?? raw
    return Response.json({ success: true, data: payload })
  } catch { return Response.json({ success: false, data: [] }, { status: 502 }) }
}
