import { NextRequest } from 'next/server'
import { minerGet } from '@/lib/api/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const spid = req.nextUrl.searchParams.get('spid') ?? ''
  const page = req.nextUrl.searchParams.get('page') ?? '1'
  const limit = req.nextUrl.searchParams.get('limit') ?? '10'
  try {
    const qs = new URLSearchParams({ page, limit, ...(spid ? { spid } : {}) })
    const payload = await minerGet(`/api/tiki/products/${id}/reviews?${qs}`)
    return Response.json({ success: true, data: payload })
  } catch {
    return Response.json({ success: false, data: [] }, { status: 502 })
  }
}
