import { NextResponse } from 'next/server'
import type { User } from '@supabase/supabase-js'
import { getSupabaseAdmin, getSupabaseAuth } from '@/lib/admin/supabase-admin'
import type { UserRole } from '@/lib/admin/config-keys'

export type AdminProfile = {
  id: string
  email: string | null
  full_name: string | null
  role: UserRole
}

export type AdminContext = {
  user: User
  profile: AdminProfile
}

export class AdminAuthError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function parseBearer(header: string | null): string | null {
  if (!header?.startsWith('Bearer ')) return null
  const token = header.slice(7).trim()
  return token || null
}

export async function requireAdmin(authHeader: string | null): Promise<AdminContext> {
  const token = parseBearer(authHeader)
  if (!token) throw new AdminAuthError(401, 'Missing authorization')

  const authClient = getSupabaseAuth()
  const { data: userData, error: userError } = await authClient.auth.getUser(token)
  if (userError || !userData.user) {
    throw new AdminAuthError(401, 'Invalid or expired session')
  }

  const admin = getSupabaseAdmin()
  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('id, email, full_name, role')
    .eq('id', userData.user.id)
    .maybeSingle()

  if (profileError) {
    throw new AdminAuthError(500, 'Failed to load profile')
  }
  if (!profile || profile.role !== 'admin') {
    throw new AdminAuthError(403, 'Admin access required')
  }

  return {
    user: userData.user,
    profile: profile as AdminProfile,
  }
}

export function adminErrorResponse(err: unknown): NextResponse {
  if (err instanceof AdminAuthError) {
    return NextResponse.json({ success: false, error: err.message }, { status: err.status })
  }
  console.error('[admin]', err)
  return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
}
