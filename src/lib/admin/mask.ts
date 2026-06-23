import { SECRET_CONFIG_KEYS } from '@/lib/admin/config-keys'

const MASK_SENTINEL = '••••••••'

export function maskSecret(value: string): string {
  if (!value) return ''
  if (value.length <= 4) return MASK_SENTINEL
  return `${MASK_SENTINEL}${value.slice(-4)}`
}

export function maskConfigMap(config: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(config)) {
    out[key] = SECRET_CONFIG_KEYS.has(key) && value ? maskSecret(value) : value
  }
  return out
}

export function isMaskedSecret(value: string): boolean {
  return value.startsWith(MASK_SENTINEL)
}
