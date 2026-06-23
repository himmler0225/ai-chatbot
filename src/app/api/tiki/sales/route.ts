import { NextRequest } from 'next/server'
import { withGuard } from '@/lib/guard/server'
import { minerGet } from '@/lib/api/server'

export async function GET(req: NextRequest) {
  return withGuard(req, async (request) => {
    const limit = request.nextUrl.searchParams.get('limit') ?? '20'
    try {
      const payload = await minerGet(`/api/tiki/products/sales?per_page=${limit}`)
      return Response.json({ success: true, data: payload })
    } catch {
      return Response.json({ success: false, data: [] }, { status: 502 })
    }
  })
}
