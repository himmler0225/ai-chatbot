import { NextRequest } from 'next/server'
import { minerGet } from '@/lib/api/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ upc: string }> }) {
  const { upc } = await params
  try {
    const payload = await minerGet(`/api/fpt-shop/products/detail/${encodeURIComponent(upc)}`)
    return Response.json({ success: true, data: payload })
  } catch {
    return Response.json({ success: false, data: null }, { status: 502 })
  }
}
