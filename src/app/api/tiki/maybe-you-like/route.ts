const MINER = process.env.DATA_MINER_URL ?? 'http://localhost:8000'
const KEY   = process.env.DATA_MINER_KEY  ?? ''

export async function GET() {
  try {
    const r   = await fetch(`${MINER}/api/tiki/products/maybe-you-like`, { headers: { 'X-API-Key': KEY }, next: { revalidate: 600 } })
    const raw = await r.json()
    const payload = raw?.data?.data ?? raw?.data ?? raw
    return Response.json({ success: true, data: payload })
  } catch { return Response.json({ success: false, data: [] }, { status: 502 }) }
}
