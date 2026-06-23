import { createClient } from '@supabase/supabase-js'
import { STALE_SERVER_CONFIG_MS } from '@/constants/api'

type ConfigMap = Record<string, string>

let _cache: ConfigMap = {}
let _fetchedAt = 0
const TTL = STALE_SERVER_CONFIG_MS

import { getSupabasePublicConfig } from '@/lib/env'

export async function getServerConfig(): Promise<ConfigMap> {
  if (_fetchedAt && Date.now() - _fetchedAt < TTL) return _cache

  const { url } = getSupabasePublicConfig()
  const key = process.env.SUPABASE_SERVICE_KEY ?? ''

  if (!url || !key) return _cache

  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } })
    const { data } = await supabase.from('config').select('key,value')
    _cache = Object.fromEntries((data ?? []).filter(r => r.value).map(r => [r.key, r.value]))
    _fetchedAt = Date.now()
  } catch {
    // keep stale cache
  }
  return _cache
}

export function get(config: ConfigMap, key: string, fallback = ''): string {
  return config[key] || process.env[key] || fallback
}
