import { NextRequest } from 'next/server'
import { minerGet } from '@/lib/api/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q = searchParams.get('q') ?? ''
  const limit = searchParams.get('limit') ?? '20'
  const sort = searchParams.get('sort') ?? 'top_seller'
  const page = searchParams.get('page') ?? '1'

  if (!q.trim()) return Response.json({ success: false, data: [] })

  try {
    const payload = await minerGet(
      `/api/tiki/products/search?q=${encodeURIComponent(q)}&limit=${limit}&sort=${sort}&page=${page}`,
    )
    return Response.json({ success: true, data: payload })
  } catch {
    return Response.json({ success: false, data: [] }, { status: 502 })
  }
}
