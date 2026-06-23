import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, adminErrorResponse } from '@/lib/admin/auth'
import { withBffAccess } from '@/lib/guard/bff-access'

export const GET = withBffAccess(async (req: NextRequest) => {
  try {
    const ctx = await requireAdmin(req.headers.get('authorization'))
    return NextResponse.json({
      success: true,
      data: {
        id: ctx.user.id,
        email: ctx.profile.email ?? ctx.user.email,
        full_name: ctx.profile.full_name,
        role: ctx.profile.role,
      },
    })
  } catch (err) {
    return adminErrorResponse(err)
  }
})
