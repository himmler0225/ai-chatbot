import type { NextRequest } from 'next/server'

function normalizeOrigin(value: string): string {
  try {
    const url = new URL(value)
    return `${url.protocol}//${url.host}`
  } catch {
    return value.replace(/\/$/, '')
  }
}

/** Origins considered part of this FE deployment. */
export function getFeOrigins(req: NextRequest): string[] {
  const origins = new Set<string>()
  const host = req.headers.get('host')
  const proto = req.headers.get('x-forwarded-proto') ?? 'https'

  if (host) {
    origins.add(`${proto}://${host}`)
    if (process.env.NODE_ENV === 'development') {
      origins.add(`http://${host}`)
      origins.add(`http://127.0.0.1:${host.split(':')[1] ?? '3000'}`)
    }
  }

  for (const key of ['NEXT_PUBLIC_SITE_URL', 'SITE_URL'] as const) {
    const raw = process.env[key]
    if (raw) origins.add(normalizeOrigin(raw))
  }

  return [...origins]
}

export function isOriginGuardEnabled(): boolean {
  if (process.env.API_ORIGIN_GUARD_ENABLED === 'false') return false
  if (process.env.NODE_ENV === 'development' && process.env.API_ORIGIN_GUARD_ENABLED !== 'true') {
    return false
  }
  return true
}

/** Request must come from our FE (not curl/Postman/cross-site) when guard is on. */
export function isAllowedFeRequest(req: NextRequest): boolean {
  if (!isOriginGuardEnabled()) return true

  const origins = getFeOrigins(req)
  if (!origins.length) return true

  const origin = req.headers.get('origin')
  const referer = req.headers.get('referer')
  const secFetchSite = req.headers.get('sec-fetch-site')?.toLowerCase()

  if (secFetchSite === 'same-origin' || secFetchSite === 'same-site') return true

  for (const allowed of origins) {
    if (origin?.startsWith(allowed)) return true
    if (referer?.startsWith(allowed)) return true
  }

  return false
}

/** Block opening /api/... directly in the browser address bar. */
export function isDirectApiNavigation(req: NextRequest): boolean {
  const dest = req.headers.get('sec-fetch-dest')?.toLowerCase()
  const mode = req.headers.get('sec-fetch-mode')?.toLowerCase()
  return dest === 'document' || mode === 'navigate'
}

export function hasClientMarker(req: NextRequest): boolean {
  return req.headers.get('x-rm-client') === '1'
}
