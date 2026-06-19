import { NextRequest } from 'next/server'
import { minerGet } from '@/lib/api/server'

export async function GET(req: NextRequest) {
  const limit = req.nextUrl.searchParams.get('limit') ?? '20'
  try {
    const payload = await minerGet(`/api/tiki/products/sales?per_page=${limit}`)
    return Response.json({ success: true, data: payload })
  } catch {
    return Response.json({ success: false, data: [] }, { status: 502 })
  }
}
