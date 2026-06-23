import { issueChallenge } from '@/lib/guard/server'

export async function GET(): Promise<Response> {
  try {
    const challenge = issueChallenge()
    return Response.json(challenge)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Guard unavailable'
    return Response.json({ error: message }, { status: 503 })
  }
}
