import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, adminErrorResponse } from '@/lib/admin/auth'
import { getSupabaseAdmin } from '@/lib/admin/supabase-admin'
import { USER_ROLES, type UserRole } from '@/lib/admin/config-keys'
import { withBffAccess } from '@/lib/guard/bff-access'

export const GET = withBffAccess(async (req: NextRequest) => {
  try {
    await requireAdmin(req.headers.get('authorization'))

    const admin = getSupabaseAdmin()
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

    const admin = getSupabaseAdmin()
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
