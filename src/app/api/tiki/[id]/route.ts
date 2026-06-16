import { NextRequest } from 'next/server'
const MINER = process.env.DATA_MINER_URL ?? 'http://localhost:8000'
const KEY   = process.env.DATA_MINER_KEY  ?? ''

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const r   = await fetch(`${MINER}/api/tiki/products/${id}`, { headers: { 'X-API-Key': KEY }, next: { revalidate: 1800 } })
    const raw = await r.json()
    const payload = raw?.data?.data ?? raw?.data ?? raw
    return Response.json({ success: true, data: payload })
  } catch { return Response.json({ success: false, data: null }, { status: 502 }) }
}
