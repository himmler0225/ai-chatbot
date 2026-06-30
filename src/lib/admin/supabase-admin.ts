import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _admin: SupabaseClient | null = null

export function isSupabaseAdminConfigured(): boolean {
  const url = process.env.SUPABASE_URL ?? ''
  const key = process.env.SUPABASE_SERVICE_KEY ?? ''
  return Boolean(url && key)
}

export function tryGetSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseAdminConfigured()) return null
  return getSupabaseAdmin()
}

export function getSupabaseAdmin(): SupabaseClient {
  if (_admin) return _admin

  const url = process.env.SUPABASE_URL ?? ''
  const key = process.env.SUPABASE_SERVICE_KEY ?? ''

  if (!url || !key) {
    throw new Error('Supabase admin credentials are not configured')
  }

  _admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return _admin
}

export function getSupabaseAuth() {
  const url = process.env.SUPABASE_URL ?? ''
  const anon = process.env.SUPABASE_ANON_KEY ?? ''
  if (!url || !anon) throw new Error('Supabase auth is not configured')
  return createClient(url, anon, { auth: { persistSession: false } })
}
