import {
  JSON_SECRET_PATHS,
  SECRET_CONFIG_KEYS,
} from '@/lib/admin/config-keys'

const MASK_SENTINEL = '••••••••'

export function maskSecret(value: string): string {
  if (!value) return ''
  if (value.length <= 4) return MASK_SENTINEL
  return `${MASK_SENTINEL}${value.slice(-4)}`
}

function getAt(obj: unknown, path: string[]): unknown {
  let cur = obj
  for (const segment of path) {
    if (cur == null || typeof cur !== 'object') return undefined
    cur = (cur as Record<string, unknown>)[segment]
  }
  return cur
}

function setAt(obj: Record<string, unknown>, path: string[], value: unknown): void {
  let cur: Record<string, unknown> = obj
  for (let i = 0; i < path.length - 1; i++) {
    const segment = path[i]
    const next = cur[segment]
    if (next == null || typeof next !== 'object' || Array.isArray(next)) {
      cur[segment] = {}
    }
    cur = cur[segment] as Record<string, unknown>
  }
  cur[path[path.length - 1]] = value
}

function maskJsonSecrets(key: string, value: string): string {
  const paths = JSON_SECRET_PATHS[key]
  if (!paths?.length) return maskSecret(value)

  try {
    const parsed = JSON.parse(value)

    if (key === 'PROXY_POOLS' && Array.isArray(parsed)) {
      print(parsed)
  const masked = parsed.map(item => {
    if (!item || typeof item !== 'object') return item

    const pool = structuredClone(item) as Record<string, any>

    if (
      pool.provider?.type === 'direct' &&
      typeof pool.provider.value === 'string' &&
      pool.provider.value
    ) {
      pool.provider.value = maskSecret(pool.provider.value)
    }

    if (
      pool.provider?.type === 'api' &&
      pool.provider.query?.key
    ) {
      pool.provider.query.key = maskSecret(pool.provider.query.key)
    }

    return pool
  })

  return JSON.stringify(masked, null, 2)
}

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return maskSecret(value)
    }

    const copy = structuredClone(parsed) as Record<string, unknown>
    for (const path of paths) {
      const current = getAt(copy, path)
      if (typeof current === 'string' && current) {
        setAt(copy, path, maskSecret(current))
      }
    }
    return JSON.stringify(copy, null, 2)
  } catch {
    return maskSecret(value)
  }
}

function mergeJsonSecrets(key: string, previous: string, incoming: string): string {
  const paths = JSON_SECRET_PATHS[key]
  if (!paths?.length) return incoming

  try {
    const prev = JSON.parse(previous)
    const next = JSON.parse(incoming)

    if (key === 'PROXY_POOLS' && Array.isArray(prev) && Array.isArray(next)) {
  return JSON.stringify(
    next.map((item, index) => {
      if (!item || typeof item !== 'object') return item

      const pool = structuredClone(item) as Record<string, any>
      const old = prev[index] as Record<string, any> | undefined

      if (
        pool.provider?.type === 'direct' &&
        isMaskedSecret(pool.provider?.value)
      ) {
        pool.provider.value = old?.provider?.value
      }

      if (
        pool.provider?.type === 'api' &&
        isMaskedSecret(pool.provider?.query?.key)
      ) {
        pool.provider.query.key = old?.provider?.query?.key
      }

      return pool
    }),
    null,
    2,
  )
}

    if (!next || typeof next !== 'object' || Array.isArray(next)) return incoming

    const merged = structuredClone(next) as Record<string, unknown>
    for (const path of paths) {
      const val = getAt(merged, path)
      if (typeof val === 'string' && isMaskedSecret(val)) {
        const original = getAt(prev, path)
        if (typeof original === 'string' && original) {
          setAt(merged, path, original)
        }
      }
    }
    return JSON.stringify(merged, null, 2)
  } catch {
    return incoming
  }
}

export function maskConfigMap(config: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(config)) {
    if (!SECRET_CONFIG_KEYS.has(key) || !value) {
      out[key] = value
      continue
    }
    out[key] = JSON_SECRET_PATHS[key] ? maskJsonSecrets(key, value) : maskSecret(value)
  }
  return out
}

export function mergeConfigUpdate(
  key: string,
  previous: string | undefined,
  incoming: string,
): string {
  if (!SECRET_CONFIG_KEYS.has(key) || !previous || !JSON_SECRET_PATHS[key]) {
    return incoming
  }
  return mergeJsonSecrets(key, previous, incoming)
}

export function isMaskedSecret(value: string): boolean {
  return value.startsWith(MASK_SENTINEL)
}
