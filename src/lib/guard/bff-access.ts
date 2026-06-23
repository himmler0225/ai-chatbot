import type { NextRequest } from 'next/server'
import { apiNotFoundResponse } from './not-found-response'
import {
  hasClientMarker,
  isAllowedFeRequest,
  isDirectApiNavigation,
  isOriginGuardEnabled,
} from './origin'

/** Secondary check inside route handlers (middleware runs first). */
export function rejectExternalBffAccess(req: NextRequest) {
  if (!isOriginGuardEnabled()) return null

  if (!isAllowedFeRequest(req) || isDirectApiNavigation(req) || !hasClientMarker(req)) {
    return apiNotFoundResponse()
  }

  return null
}

type RouteHandler = (req: NextRequest, ...args: unknown[]) => Promise<Response>

export function withBffAccess(handler: RouteHandler): RouteHandler {
  return async (req, ...args) => {
    const blocked = rejectExternalBffAccess(req)
    if (blocked) return blocked
    return handler(req, ...args)
  }
}
