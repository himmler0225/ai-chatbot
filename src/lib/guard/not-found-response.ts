import { NextResponse } from 'next/server'

/** Hide API errors — always look like a missing page. */
export function apiNotFoundResponse(): NextResponse {
  return new NextResponse(null, {
    status: 404,
    headers: {
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  })
}
