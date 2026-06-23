import { NextRequest } from 'next/server'
import { withGuard } from '@/lib/guard/server'
import { MinerRequestError, minerGet } from '@/lib/api/server'

function minerErrorStatus(err: unknown): number {
  if (err instanceof MinerRequestError) {
    if (err.status === 404) return 404
    if (err.status >= 400 && err.status < 500) return err.status
  }
  return 502
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withGuard(req, async (request) => {
    const { id } = await params
    const spid = request.nextUrl.searchParams.get('spid')
    const qs = spid ? `?spid=${encodeURIComponent(spid)}` : ''
    try {
      const payload = await minerGet(`/api/tiki/products/${id}${qs}`)
      return Response.json({ success: true, data: payload })
    } catch (err) {
      return Response.json(
        { success: false, data: null },
        { status: minerErrorStatus(err) },
      )
    }
  })
}
