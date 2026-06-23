'use client'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function initSupabase(url: string, anonKey: string): void {
  if (_client || !url || !anonKey) return
  _client = createClient(url, anonKey)
}

export function getSupabase(): SupabaseClient {
  if (!_client) {
    throw new Error('Supabase not initialized — missing SUPABASE_URL / SUPABASE_ANON_KEY')
  }
  return _client
}

export async function signInWithGoogle(redirectPath = '/app') {
  return getSupabase().auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback?next=${redirectPath}` },
  })
}

export async function signInWithEmail(email: string, password: string) {
  return getSupabase().auth.signInWithPassword({ email, password })
}

export async function signUpWithEmail(email: string, password: string, name?: string) {
  return getSupabase().auth.signUp({
    email,
    password,
    options: { data: { full_name: name ?? '' } },
  })
}

export async function signOut() {
  return getSupabase().auth.signOut()
}

export async function getSession() {
  const { data } = await getSupabase().auth.getSession()
  return data.session
}

export async function getUser() {
  const { data } = await getSupabase().auth.getUser()
  return data.user
}
