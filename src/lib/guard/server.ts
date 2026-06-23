import { createHmac, randomBytes, timingSafeEqual } from 'crypto'
import type { NextRequest } from 'next/server'
import { GUARD_HEADERS } from './constants'
import { buildSignMaterial, hashBody, rmsign } from './rmsign'
import { apiNotFoundResponse } from './not-found-response'
import {
  hasClientMarker,
  isAllowedFeRequest,
  isDirectApiNavigation,
  isOriginGuardEnabled,
} from './origin'

export { GUARD_HEADERS }

const CHALLENGE_TTL_MS = 5 * 60 * 1000
const SIGN_SKEW_MS = 60 * 1000
const MAX_NONCES = 256

type ChallengeRecord = {
  exp: number
  sessionKey: string
  nonces: Set<string>
}

const challenges = new Map<string, ChallengeRecord>()

function guardSecret(): string {
  return process.env.API_GUARD_SECRET ?? ''
}

export function isGuardEnabled(): boolean {
  if (process.env.API_GUARD_ENABLED === 'false') return false
  if (process.env.NODE_ENV === 'development' && !guardSecret()) return false
  return Boolean(guardSecret())
}

function pruneChallenges(): void {
  const now = Date.now()
  for (const [cid, rec] of challenges) {
    if (rec.exp < now) challenges.delete(cid)
  }
}

function deriveSessionKey(secret: string, cid: string, exp: number): string {
  return createHmac('sha256', secret)
    .update(`${cid}:${exp}`)
    .digest('hex')
    .slice(0, 32)
}

export function issueChallenge(): { cid: string; exp: number; key: string } {
  const secret = guardSecret()
  if (!secret) throw new Error('API_GUARD_SECRET is not configured')

  pruneChallenges()
  const cid = randomBytes(16).toString('hex')
  const exp = Date.now() + CHALLENGE_TTL_MS
  const sessionKey = deriveSessionKey(secret, cid, exp)

  challenges.set(cid, { exp, sessionKey, nonces: new Set() })

  return { cid, exp, key: sessionKey }
}

export type GuardVerifyResult =
  | { ok: true }
  | { ok: false; notFound?: boolean; status?: number; message?: string }

export function verifyGuardRequest(
  req: NextRequest,
  bodyText: string,
): GuardVerifyResult {
  if (isOriginGuardEnabled()) {
    if (!isAllowedFeRequest(req) || isDirectApiNavigation(req) || !hasClientMarker(req)) {
      return { ok: false, notFound: true }
    }
  }

  if (!isGuardEnabled()) return { ok: true }

  const cid = req.headers.get(GUARD_HEADERS.cid)
  const tsRaw = req.headers.get(GUARD_HEADERS.ts)
  const nonce = req.headers.get(GUARD_HEADERS.nonce)
  const sign = req.headers.get(GUARD_HEADERS.sign)

  if (!cid || !tsRaw || !nonce || !sign) {
    return { ok: false, notFound: true }
  }

  const ts = Number(tsRaw)
  if (!Number.isFinite(ts)) {
    return { ok: false, notFound: true }
  }

  const now = Date.now()
  if (Math.abs(now - ts) > SIGN_SKEW_MS) {
    return { ok: false, notFound: true }
  }

  const record = challenges.get(cid)
  if (!record || record.exp < now) {
    return { ok: false, notFound: true }
  }

  if (record.nonces.has(nonce)) {
    return { ok: false, notFound: true }
  }

  if (record.nonces.size >= MAX_NONCES) record.nonces.clear()
  record.nonces.add(nonce)

  const path = req.nextUrl.pathname
  const material = buildSignMaterial({
    method: req.method,
    path,
    bodyHash: hashBody(bodyText),
    ts,
    nonce,
    cid,
    sessionKey: record.sessionKey,
  })

  const ua = req.headers.get('user-agent') ?? 'ReviewMine/1.0'
  const expected = rmsign(material, ua, ts, record.sessionKey)

  const a = Buffer.from(sign)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, notFound: true }
  }

  return { ok: true }
}

export async function withGuard(
  req: NextRequest,
  handler: (req: NextRequest, bodyText: string) => Promise<Response>,
): Promise<Response> {
  const bodyText =
    req.method === 'GET' || req.method === 'HEAD' ? '' : await req.text()

  const result = verifyGuardRequest(req, bodyText)
  if (!result.ok) {
    return apiNotFoundResponse()
  }

  return handler(req, bodyText)
}
