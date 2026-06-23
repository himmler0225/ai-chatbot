import { NextRequest } from 'next/server'
import { minerGet } from '@/lib/api/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const page = req.nextUrl.searchParams.get('page') ?? '1'
  const limit = req.nextUrl.searchParams.get('limit') ?? '10'
  const sortMethod = req.nextUrl.searchParams.get('sort_method') ?? '1'

  try {
    const qs = new URLSearchParams({ page, limit, sort_method: sortMethod })
    const payload = await minerGet(
      `/api/fpt-shop/products/${encodeURIComponent(id)}/reviews?${qs}`,
    )
    return Response.json({ success: true, data: payload })
  } catch {
    return Response.json({ success: false, data: [] }, { status: 502 })
  }
}
