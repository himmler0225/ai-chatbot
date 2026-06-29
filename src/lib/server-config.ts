import { createClient } from '@supabase/supabase-js'
import { STALE_SERVER_CONFIG_MS } from '@/constants/api'
import { getSupabasePublicConfig, isLocalDev } from '@/lib/env'

export type ConfigMap = Record<string, string>

let _cache: ConfigMap = {}
let _fetchedAt = 0
const TTL = STALE_SERVER_CONFIG_MS

export async function getServerConfig(): Promise<ConfigMap> {
  if (isLocalDev()) return {}

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

export function getJson(config: ConfigMap, key: string): Record<string, unknown> | null {
  const raw = isLocalDev() ? process.env[key] : config[key]
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null
  } catch {
    return null
  }
}

export function getService(
  config: ConfigMap,
  service: string,
  field: string,
  fallback = '',
): string {
  const services = getJson(config, 'SERVICES')
  const block = services?.[service]
  if (!block || typeof block !== 'object' || Array.isArray(block)) return fallback
  const value = (block as Record<string, unknown>)[field]
  return typeof value === 'string' ? value : fallback
}

export function getAgentInt(config: ConfigMap, field: string, fallback: number): number {
  const agent = getJson(config, 'AI_AGENT')
  const value = agent?.[field]
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export async function resolveAiLayer(config?: ConfigMap) {
  const c = config ?? (await getServerConfig())
  return {
    url: getService(c, 'ai_layer', 'url', process.env.AI_LAYER_URL ?? 'http://localhost:8001'),
    key: getService(c, 'ai_layer', 'key', process.env.AI_LAYER_KEY ?? ''),
    maxIter: getAgentInt(c, 'max_iter', Number(process.env.AGENT_MAX_ITER ?? '10')),
  }
}

export async function resolveDataMiner(config?: ConfigMap) {
  const c = config ?? (await getServerConfig())
  return {
    url: getService(c, 'data_miner', 'url', process.env.DATA_MINER_URL ?? 'http://localhost:8000'),
    key: getService(c, 'data_miner', 'key', process.env.DATA_MINER_KEY ?? ''),
    bffToken: process.env.DATA_MINER_BFF_TOKEN ?? '',
  }
}

export function get(config: ConfigMap, key: string, fallback = ''): string {
  if (isLocalDev()) return process.env[key] || fallback
  return config[key] || process.env[key] || fallback
}
