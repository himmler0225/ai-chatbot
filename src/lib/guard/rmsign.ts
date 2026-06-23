/**
 * RmSign — request signature inspired by layered anti-tamper pipelines
 * (double digest → RC4 → byte scramble → custom base64).
 * Used for ReviewMine BFF guard, not TikTok X-Bogus.
 */

const SHIFT =
  'Rm8Kp2Zh9QxW4nL7vJc3Ty6B1gDf0sA5uEiNoPqXwVzHaSbCdGjMkUlFr5+/'

const MAGIC = 0x524d_2026 // "RM " + year fragment

const FILTER_IDX = [
  3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 4, 6, 8, 10, 12, 14, 16, 18, 20,
] as const

/* ── MD5 (minimal, isomorphic) ─────────────────────────────────────────── */

function md5Bytes(input: string): Uint8Array {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(input)
  const bitLen = bytes.length * 8

  const padded = new Uint8Array(((bytes.length + 9 + 63) >> 6) << 6)
  padded.set(bytes)
  padded[bytes.length] = 0x80
  const view = new DataView(padded.buffer)
  view.setUint32(padded.length - 8, bitLen >>> 0, true)
  view.setUint32(padded.length - 4, Math.floor(bitLen / 0x1_0000_0000), true)

  let a0 = 0x67_45_23_01
  let b0 = 0xef_cd_ab_89
  let c0 = 0x98_ba_dc_fe
  let d0 = 0x10_32_54_76

  const K = new Int32Array(64)
  for (let i = 0; i < 64; i++) {
    K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x1_0000_0000)
  }
  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4,
    11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6,
    10, 15, 21,
  ]

  const rot = (x: number, n: number) => (x << n) | (x >>> (32 - n))
  const u32 = (x: number) => x >>> 0

  for (let i = 0; i < padded.length; i += 64) {
    const M = new Int32Array(16)
    for (let j = 0; j < 16; j++) M[j] = view.getInt32(i + j * 4, true)

    let a = a0
    let b = b0
    let c = c0
    let d = d0

    for (let j = 0; j < 64; j++) {
      let f: number
      let g: number
      if (j < 16) {
        f = (b & c) | (~b & d)
        g = j
      } else if (j < 32) {
        f = (d & b) | (~d & c)
        g = (5 * j + 1) % 16
      } else if (j < 48) {
        f = b ^ c ^ d
        g = (3 * j + 5) % 16
      } else {
        f = c ^ (b | ~d)
        g = (7 * j) % 16
      }
      const tmp = d
      d = c
      c = b
      const sum = u32(a + f + K[j] + M[g])
      b = u32(b + rot(sum, S[j]))
      a = tmp
    }

    a0 = u32(a0 + a)
    b0 = u32(b0 + b)
    c0 = u32(c0 + c)
    d0 = u32(d0 + d)
  }

  const out = new Uint8Array(16)
  const outView = new DataView(out.buffer)
  outView.setUint32(0, a0, true)
  outView.setUint32(4, b0, true)
  outView.setUint32(8, c0, true)
  outView.setUint32(12, d0, true)
  return out
}

function md5Hex(input: string): string {
  const d = md5Bytes(input)
  return Array.from(d, b => b.toString(16).padStart(2, '0')).join('')
}

function md5x2(input: string): string {
  const first = md5Bytes(input)
  return md5Hex(String.fromCharCode(...first))
}

/* ── RC4 + custom base64 + scramble ────────────────────────────────────── */

function rc4(plaintext: string, key: number[]): string {
  const s = Array.from({ length: 256 }, (_, i) => i)
  let j = 0
  for (let i = 0; i < 256; i++) {
    j = (j + s[i]! + key[i % key.length]!) % 256
    ;[s[i], s[j]] = [s[j]!, s[i]!]
  }
  let i = 0
  j = 0
  let out = ''
  for (const ch of plaintext) {
    i = (i + 1) % 256
    j = (j + s[i]!) % 256
    ;[s[i], s[j]] = [s[j]!, s[i]!]
    const k = s[(s[i]! + s[j]!) % 256]!
    out += String.fromCharCode(ch.charCodeAt(0) ^ k)
  }
  return out
}

function b64Encode(raw: string, table = SHIFT): string {
  const parts: number[] = []
  for (let i = 0; i < raw.length; i += 3) {
    const b1 = raw.charCodeAt(i)
    const b2 = i + 1 < raw.length ? raw.charCodeAt(i + 1) : 0
    const b3 = i + 2 < raw.length ? raw.charCodeAt(i + 2) : 0
    parts.push(b1 >> 2)
    parts.push(((b1 & 3) << 4) | (b2 >> 4))
    parts.push(i + 1 < raw.length ? ((b2 & 15) << 2) | (b3 >> 6) : 64)
    parts.push(i + 2 < raw.length ? b3 & 63 : 64)
  }
  const pad = table[64] ?? '='
  return parts.map(n => (n === 64 ? pad : table[n]!)).join('')
}

function filter(nums: number[]): number[] {
  return FILTER_IDX.map(i => nums[i - 1]!)
}

function scramble(...nums: number[]): string {
  const order = [
    0, 10, 1, 11, 2, 12, 3, 13, 4, 14, 5, 15, 6, 16, 7, 17, 8, 18, 9,
  ]
  return order.map(i => String.fromCharCode(nums[i]!)).join('')
}

function checksum(salt: number[]): number {
  let c = 64
  for (let i = 3; i < salt.length; i++) c ^= salt[i]!
  return c
}

function uaDigest(userAgent: string): string {
  const rc = rc4(userAgent, [0, 1, 14])
  return md5Hex(b64Encode(rc))
}

/** Build canonical string that gets signed. */
export function buildSignMaterial(opts: {
  method: string
  path: string
  bodyHash: string
  ts: number
  nonce: string
  cid: string
  sessionKey: string
}): string {
  const { method, path, bodyHash, ts, nonce, cid, sessionKey } = opts
  return [method.toUpperCase(), path, bodyHash, String(ts), nonce, cid, sessionKey].join(
    '\n',
  )
}

function hexTail(hex: string): [number, number] {
  return [parseInt(hex.slice(-4, -2), 16), parseInt(hex.slice(-2), 16)]
}

/** Produce RmSign token from sign material + UA fingerprint. */
export function rmsign(
  material: string,
  userAgent: string,
  timestamp: number,
  sessionKey: string,
): string {
  const md5Material = md5x2(material)
  const md5Key = md5x2(sessionKey)
  const md5Ua = uaDigest(userAgent || 'ReviewMine/1.0')

  const [m1, m2] = hexTail(md5Material)
  const [k1, k2] = hexTail(md5Key)
  const [u1, u2] = hexTail(md5Ua)

  const salt: number[] = [
    timestamp,
    MAGIC,
    64,
    0,
    1,
    14,
    m1,
    m2,
    k1,
    k2,
    u1,
    u2,
  ]

  for (let i = 24; i >= 0; i -= 8) salt.push((timestamp >> i) & 0xff)
  for (let i = 24; i >= 0; i -= 8) salt.push((salt[1]! >> i) & 0xff)
  salt.push(checksum(salt), 255)

  const filtered = filter(salt)
  const packed = rc4(scramble(...filtered), [255])
  return b64Encode(`\x02ÿ${packed}`)
}

export function hashBody(body: string): string {
  return body ? md5x2(body) : md5x2('')
}
