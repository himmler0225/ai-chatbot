import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  isAllowedApiPath,
  isAllowedPagePath,
} from '@/lib/guard/api-routes'
import {
  hasClientMarker,
  isAllowedFeRequest,
  isDirectApiNavigation,
  isOriginGuardEnabled,
} from '@/lib/guard/origin'
import { apiNotFoundResponse } from '@/lib/guard/not-found-response'

const INTERNAL_NOT_FOUND = '/__internal_not_found__'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/api/')) {
    if (!isAllowedApiPath(pathname)) {
      return apiNotFoundResponse()
    }

    if (isOriginGuardEnabled()) {
      if (!isAllowedFeRequest(req)) return apiNotFoundResponse()
      if (isDirectApiNavigation(req)) return apiNotFoundResponse()

      const isChallenge = pathname === '/api/guard/challenge'
      if (!isChallenge && !hasClientMarker(req)) {
        return apiNotFoundResponse()
      }
    }

    const res = NextResponse.next()
    res.headers.set('Cache-Control', 'no-store')
    return res
  }

  if (pathname === INTERNAL_NOT_FOUND) {
    return NextResponse.next()
  }

  if (!isAllowedPagePath(pathname)) {
    const url = req.nextUrl.clone()
    url.pathname = INTERNAL_NOT_FOUND
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|logo.png|tiktok.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
