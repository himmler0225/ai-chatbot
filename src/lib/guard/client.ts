'use client'

import { buildSignMaterial, hashBody, rmsign } from './rmsign'
import { GUARD_HEADERS } from './constants'

type Challenge = {
  cid: string
  exp: number
  key: string
}

let cache: Challenge | null = null
let inflight: Promise<Challenge> | null = null

function randomNonce(): string {
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}

async function fetchChallenge(): Promise<Challenge> {
  const res = await fetch('/api/guard/challenge', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to obtain guard challenge')
  const data = (await res.json()) as Challenge
  if (!data.cid || !data.key || !data.exp) {
    throw new Error('Invalid guard challenge payload')
  }
  return data
}

async function getChallenge(): Promise<Challenge> {
  const now = Date.now()
  if (cache && cache.exp - 30_000 > now) return cache

  if (!inflight) {
    inflight = fetchChallenge()
      .then(ch => {
        cache = ch
        return ch
      })
      .finally(() => {
        inflight = null
      })
  }

  return inflight
}

/** Attach RmSign headers for BFF requests. */
export async function guardHeaders(
  method: string,
  path: string,
  body = '',
): Promise<Record<string, string>> {
  try {
    const challenge = await getChallenge()
    const ts = Date.now()
    const nonce = randomNonce()
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : 'ReviewMine/1.0'

    const material = buildSignMaterial({
      method,
      path,
      bodyHash: hashBody(body),
      ts,
      nonce,
      cid: challenge.cid,
      sessionKey: challenge.key,
    })

    const sign = rmsign(material, ua, ts, challenge.key)

    return {
      [GUARD_HEADERS.cid]: challenge.cid,
      [GUARD_HEADERS.ts]: String(ts),
      [GUARD_HEADERS.nonce]: nonce,
      [GUARD_HEADERS.sign]: sign,
    }
  } catch {
    return {}
  }
}

export function invalidateGuardChallenge(): void {
  cache = null
}
