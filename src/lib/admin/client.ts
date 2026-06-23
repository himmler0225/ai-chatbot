import { getSession } from '@/lib/supabase'
import { clientGuardHeaders } from '@/lib/guard/client-headers'

export async function adminFetch<T>(
  path: string,
  init?: RequestInit & { json?: unknown },
): Promise<T> {
  const session = await getSession()
  const token = session?.access_token
  if (!token) throw new Error('Not authenticated')

  const headers: Record<string, string> = {
    ...clientGuardHeaders(),
    Authorization: `Bearer ${token}`,
    ...(init?.json ? { 'Content-Type': 'application/json' } : {}),
    ...(init?.headers as Record<string, string> | undefined),
  }

  const res = await fetch(path, {
    ...init,
    headers,
    body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 404) throw new Error('Not found')
    throw new Error(data?.error ?? `Request failed (${res.status})`)
  }
  return data as T
}
