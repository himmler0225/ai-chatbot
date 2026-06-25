/** Server/runtime env — không dùng NEXT_PUBLIC_ (Docker Compose VPS). */

export type SupabasePublicConfig = {
  url: string
  anonKey: string
}

export function getSupabasePublicConfig(): SupabasePublicConfig {
  return {
    url: process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    anonKey:
      process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  }
}

export function getSiteUrl(): string {
  return process.env.SITE_URL ?? ''
}

/** Dev local — ưu tiên .env, không đọc Supabase config. */
export function isLocalDev(): boolean {
  if (process.env.USE_REMOTE_CONFIG === 'true') return false
  if (process.env.USE_REMOTE_CONFIG === 'false') return true
  return process.env.NODE_ENV === 'development'
}
