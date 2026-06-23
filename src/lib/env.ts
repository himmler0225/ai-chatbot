/** Server/runtime env — không dùng NEXT_PUBLIC_ (Docker Compose VPS). */

export type SupabasePublicConfig = {
  url: string
  anonKey: string
}

export function getSupabasePublicConfig(): SupabasePublicConfig {
  return {
    url: process.env.SUPABASE_URL ?? '',
    anonKey: process.env.SUPABASE_ANON_KEY ?? '',
  }
}

export function getSiteUrl(): string {
  return process.env.SITE_URL ?? ''
}
