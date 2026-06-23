import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, adminErrorResponse } from '@/lib/admin/auth'
import { getSupabaseAdmin } from '@/lib/admin/supabase-admin'
import {
  ADMIN_CONFIG_WHITELIST,
  JSON_CONFIG_KEYS,
  LONG_TEXT_KEYS,
} from '@/lib/admin/config-keys'
import { isMaskedSecret, maskConfigMap } from '@/lib/admin/mask'
import { withBffAccess } from '@/lib/guard/bff-access'

export const GET = withBffAccess(async (req: NextRequest) => {
  try {
    await requireAdmin(req.headers.get('authorization'))

    const admin = getSupabaseAdmin()
    const { data, error } = await admin.from('config').select('key, value')
    if (error) throw error

    const config: Record<string, string> = {}
    for (const row of data ?? []) {
      if (row.key && ADMIN_CONFIG_WHITELIST.has(row.key) && row.value != null) {
        config[row.key] = row.value
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        config: maskConfigMap(config),
        meta: {
          longTextKeys: [...LONG_TEXT_KEYS],
          jsonKeys: [...JSON_CONFIG_KEYS],
          secretKeys: [...ADMIN_CONFIG_WHITELIST].filter(k =>
            k.includes('KEY') || k.includes('PROXY'),
          ),
        },
      },
    })
  } catch (err) {
    return adminErrorResponse(err)
  }
})

export const PATCH = withBffAccess(async (req: NextRequest) => {
  try {
    await requireAdmin(req.headers.get('authorization'))
    const body = (await req.json()) as { updates?: Record<string, string> }
    const updates = body.updates ?? {}

    const keys = Object.keys(updates)
    if (!keys.length) {
      return NextResponse.json({ success: false, error: 'No updates' }, { status: 400 })
    }

    for (const key of keys) {
      if (!ADMIN_CONFIG_WHITELIST.has(key)) {
        return NextResponse.json(
          { success: false, error: `Key not allowed: ${key}` },
          { status: 400 },
        )
      }
      if (JSON_CONFIG_KEYS.has(key)) {
        try {
          JSON.parse(updates[key])
        } catch {
          return NextResponse.json(
            { success: false, error: `Invalid JSON for ${key}` },
            { status: 400 },
          )
        }
      }
    }

    const admin = getSupabaseAdmin()

    for (const [key, value] of Object.entries(updates)) {
      if (isMaskedSecret(value)) continue

      const { error } = await admin
        .from('config')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })

      if (error) throw error
    }

    return NextResponse.json({
      success: true,
      data: { saved: keys.filter(k => !isMaskedSecret(updates[k])) },
      message: 'Restart ai-layer và data-miner để áp dụng config.',
    })
  } catch (err) {
    return adminErrorResponse(err)
  }
})
