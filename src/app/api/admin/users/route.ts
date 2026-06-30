import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, adminErrorResponse } from '@/lib/admin/auth'
import { canUseDevConfigFallback } from '@/lib/admin/dev-config'
import { tryGetSupabaseAdmin } from '@/lib/admin/supabase-admin'
import { USER_ROLES, type UserRole } from '@/lib/admin/config-keys'
import { withBffAccess } from '@/lib/guard/bff-access'

function devUserRow(ctx: Awaited<ReturnType<typeof requireAdmin>>) {
  const now = new Date().toISOString()
  return {
    id: ctx.profile.id,
    email: ctx.profile.email,
    full_name: ctx.profile.full_name,
    role: ctx.profile.role,
    created_at: now,
    updated_at: now,
  }
}

export const GET = withBffAccess(async (req: NextRequest) => {
  try {
    const ctx = await requireAdmin(req.headers.get('authorization'))

    const admin = tryGetSupabaseAdmin()
    if (!admin) {
      if (!canUseDevConfigFallback()) {
        throw new Error('Supabase admin credentials are not configured')
      }
      return NextResponse.json({ success: true, data: [devUserRow(ctx)], devMode: true })
    }

    const { data, error } = await admin
      .from('profiles')
      .select('id, email, full_name, role, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, data: data ?? [] })
  } catch (err) {
    return adminErrorResponse(err)
  }
})

export const PATCH = withBffAccess(async (req: NextRequest) => {
  try {
    const ctx = await requireAdmin(req.headers.get('authorization'))
    const body = (await req.json()) as { userId?: string; role?: UserRole }
    const { userId, role } = body

    if (!userId || !role) {
      return NextResponse.json({ success: false, error: 'userId and role required' }, { status: 400 })
    }
    if (!USER_ROLES.includes(role)) {
      return NextResponse.json({ success: false, error: 'Invalid role' }, { status: 400 })
    }
    if (userId === ctx.user.id && role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Cannot demote your own admin account' },
        { status: 400 },
      )
    }

    const admin = tryGetSupabaseAdmin()
    if (!admin) {
      if (!canUseDevConfigFallback()) {
        throw new Error('Supabase admin credentials are not configured')
      }
      return NextResponse.json({
        success: true,
        data: { ...devUserRow(ctx), role },
        devMode: true,
        message: 'Dev mode — role changes are not persisted.',
      })
    }

    const { data, error } = await admin
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select('id, email, full_name, role')
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (err) {
    return adminErrorResponse(err)
  }
})
