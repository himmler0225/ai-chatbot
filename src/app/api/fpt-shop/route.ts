import { NextRequest } from 'next/server'
import { minerGet } from '@/lib/api/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q = searchParams.get('q') ?? ''
  const limit = searchParams.get('limit') ?? '24'
  const page = searchParams.get('page') ?? '1'
  const sortMethod = searchParams.get('sort_method')
  const priceRange = searchParams.get('price_range')

  if (!q.trim()) return Response.json({ success: false, data: [] })

  try {
    const qs = new URLSearchParams({
      q,
      limit,
      page,
    })
    if (sortMethod) qs.set('sort_method', sortMethod)
    if (priceRange) qs.set('price_range', priceRange)

    const payload = await minerGet(`/api/fpt-shop/products/search?${qs}`)
    return Response.json({ success: true, data: payload })
  } catch {
    return Response.json({ success: false, data: [] }, { status: 502 })
  }
}
