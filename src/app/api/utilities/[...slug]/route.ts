const AI_LAYER_URL = process.env.AI_LAYER_URL ?? 'http://localhost:8001'
const AI_LAYER_KEY = process.env.AI_LAYER_KEY ?? ''

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params
  const endpoint  = slug.join('/')
  const body      = await request.json()

  let res: Response
  try {
    res = await fetch(`${AI_LAYER_URL}/ai/utilities/${endpoint}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': AI_LAYER_KEY },
      body:    JSON.stringify(body),
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return Response.json(
      { success: false, error: `AI Layer không khả dụng (${AI_LAYER_URL}): ${msg}`, data: null, meta: {} },
      { status: 503 },
    )
  }

  const data = await res.json()
  return Response.json(data, { status: res.ok ? 200 : res.status })
}
