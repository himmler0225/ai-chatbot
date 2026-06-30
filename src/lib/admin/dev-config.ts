import { ADMIN_CONFIG_WHITELIST } from '@/lib/admin/config-keys'

let _overrides: Record<string, string> = {}

/** In-memory config fallback when Supabase service key is not set (development only). */
export function canUseDevConfigFallback(): boolean {
  return process.env.NODE_ENV === 'development'
}

function loadEnvConfig(): Record<string, string> {
  const config: Record<string, string> = {}
  for (const key of ADMIN_CONFIG_WHITELIST) {
    const value = process.env[key]
    if (value) config[key] = value
  }
  return config
}

export function getDevConfig(): Record<string, string> {
  return { ...loadEnvConfig(), ..._overrides }
}

export function patchDevConfig(updates: Record<string, string>): string[] {
  const saved: string[] = []
  for (const [key, value] of Object.entries(updates)) {
    if (!ADMIN_CONFIG_WHITELIST.has(key)) continue
    _overrides[key] = value
    saved.push(key)
  }
  return saved
}
