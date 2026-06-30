import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, adminErrorResponse } from '@/lib/admin/auth'
import { tryGetSupabaseAdmin } from '@/lib/admin/supabase-admin'
import {
  ADMIN_CONFIG_WHITELIST,
  JSON_CONFIG_KEYS,
  JSON_SECRET_PATHS,
  LONG_TEXT_KEYS,
  SECRET_CONFIG_KEYS,
} from '@/lib/admin/config-keys'
import { canUseDevConfigFallback, getDevConfig, patchDevConfig } from '@/lib/admin/dev-config'
import { isMaskedSecret, maskConfigMap, mergeConfigUpdate } from '@/lib/admin/mask'
import { withBffAccess } from '@/lib/guard/bff-access'

export const GET = withBffAccess(async (req: NextRequest) => {
  try {
    await requireAdmin(req.headers.get('authorization'))

    const admin = tryGetSupabaseAdmin()
    let config: Record<string, string> = {}
    let devMode = false

    if (admin) {
      const { data, error } = await admin.from('config').select('key, value')
      if (error) throw error
      for (const row of data ?? []) {
        if (row.key && ADMIN_CONFIG_WHITELIST.has(row.key) && row.value != null) {
          config[row.key] = row.value
        }
      }
    } else if (canUseDevConfigFallback()) {
      config = getDevConfig()
      devMode = true
    } else {
      throw new Error('Supabase admin credentials are not configured')
    }

    return NextResponse.json({
      success: true,
      data: {
        config: maskConfigMap(config),
        devMode,
        meta: {
          longTextKeys: [...LONG_TEXT_KEYS],
          jsonKeys: [...JSON_CONFIG_KEYS],
          secretKeys: [...SECRET_CONFIG_KEYS],
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

    const admin = tryGetSupabaseAdmin()
    let saved: string[] = []
    let devMode = false

    if (admin) {
      const { data: existingRows } = await admin.from('config').select('key,value').in('key', keys)
      const existingMap = Object.fromEntries((existingRows ?? []).map(row => [row.key, row.value]))

      for (const [key, value] of Object.entries(updates)) {
        if (isMaskedSecret(value) && !JSON_SECRET_PATHS[key]) continue

        const finalValue =
          JSON_SECRET_PATHS[key] && existingMap[key]
            ? mergeConfigUpdate(key, existingMap[key], value)
            : value

        const { error } = await admin
          .from('config')
          .upsert(
            { key, value: finalValue, updated_at: new Date().toISOString() },
            { onConflict: 'key' },
          )

        if (error) throw error
        saved.push(key)
      }
    } else if (canUseDevConfigFallback()) {
      saved = patchDevConfig(updates)
      devMode = true
    } else {
      throw new Error('Supabase admin credentials are not configured')
    }

    return NextResponse.json({
      success: true,
      data: { saved, devMode },
      message: devMode
        ? 'Đã lưu vào bộ nhớ local (dev). Restart ai-layer để áp dụng nếu dùng .env.'
        : 'Restart ai-layer và data-miner để áp dụng config.',
    })
  } catch (err) {
    return adminErrorResponse(err)
  }
})
