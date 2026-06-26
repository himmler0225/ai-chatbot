/** BFF API prefixes that exist in this app. Unknown /api/* → 404. */
export const ALLOWED_API_PREFIXES = [
  '/api/admin',
  '/api/chat',
  '/api/fpt-shop',
  '/api/guard',
  '/api/history',
  '/api/tiki',
  '/api/utilities',
] as const

/** Public page paths on the FE domain. Everything else → 404 UI. */
export const ALLOWED_PAGE_PATHS = new Set(['/', '/app', '/privacy', '/terms'])

export const ALLOWED_PAGE_PREFIXES = ['/admin', '/auth'] as const

export const CLIENT_HEADER = 'x-rm-client'
export const CLIENT_HEADER_VALUE = '1'

export function isAllowedApiPath(pathname: string): boolean {
  return ALLOWED_API_PREFIXES.some(
    prefix => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

export function isAllowedPagePath(pathname: string): boolean {
  if (ALLOWED_PAGE_PATHS.has(pathname)) return true
  return ALLOWED_PAGE_PREFIXES.some(
    prefix => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}
