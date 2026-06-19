import { minerGet } from '@/lib/api/server'

export async function GET() {
  try {
    const payload = await minerGet('/api/tiki/products/maybe-you-like')
    return Response.json({ success: true, data: payload })
  } catch {
    return Response.json({ success: false, data: [] }, { status: 502 })
  }
}
