import { NextRequest } from 'next/server'
import { minerGet } from '@/lib/api/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const payload = await minerGet(`/api/tiki/products/${id}`)
    return Response.json({ success: true, data: payload })
  } catch {
    return Response.json({ success: false, data: null }, { status: 502 })
  }
}
