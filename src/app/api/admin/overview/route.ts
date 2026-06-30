import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { requireAdmin, adminErrorResponse } from '@/lib/admin/auth'
import { canUseDevConfigFallback } from '@/lib/admin/dev-config'
import { tryGetSupabaseAdmin } from '@/lib/admin/supabase-admin'
import { withBffAccess } from '@/lib/guard/bff-access'
import { getAiLayerClient } from '@/lib/api/server'
import { resolveAiLayer, resolveDataMiner } from '@/lib/server-config'

type ChatStats = {
  sessionsToday: number
  totalSessions: number
  daily: Array<{ date: string; label: string; count: number }>
}

type ServiceStatus = 'ok' | 'degraded' | 'down'

async function pingHealth(
  name: string,
  url: string,
): Promise<{ name: string; status: ServiceStatus; detail: string; latencyMs: number }> {
  const start = Date.now()
  try {
    const res = await axios.get(`${url}/health`, { timeout: 4000 })
    const latencyMs = Date.now() - start
    const healthy = res.data?.data?.healthy ?? res.data?.healthy ?? res.status === 200
    if (!healthy) {
      return { name, status: 'degraded', detail: 'Unhealthy response', latencyMs }
    }
    if (latencyMs > 400) {
      return { name, status: 'degraded', detail: `Latency spike (${latencyMs}ms)`, latencyMs }
    }
    return { name, status: 'ok', detail: 'Operational', latencyMs }
  } catch {
    return { name, status: 'down', detail: 'Unreachable', latencyMs: Date.now() - start }
  }
}

export const GET = withBffAccess(async (req: NextRequest) => {
  try {
    const ctx = await requireAdmin(req.headers.get('authorization'))

    const admin = tryGetSupabaseAdmin()
    let totalUsers = 0
    let adminUsers = 0
    let devMode = false

    if (admin) {
      const { count: userCount } = await admin
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      const { count: adminCount } = await admin
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin')

      totalUsers = userCount ?? 0
      adminUsers = adminCount ?? 0
    } else if (canUseDevConfigFallback()) {
      totalUsers = 1
      adminUsers = ctx.profile.role === 'admin' ? 1 : 0
      devMode = true
    }

    const [{ url: aiLayerUrl }, { url: dataMinerUrl }] = await Promise.all([
      resolveAiLayer(),
      resolveDataMiner(),
    ])

    const [aiLayer, dataMiner, chatStats] = await Promise.all([
      pingHealth('ai-layer', aiLayerUrl),
      pingHealth('data-miner', dataMinerUrl),
      getAiLayerClient()
        .then(client =>
          client.get<{ data?: ChatStats }>('/ai/history/admin/stats', { params: { days: 7 } }),
        )
        .then(res => res.data?.data ?? null)
        .catch(() => null),
    ])

    const chatbot = {
      name: 'KiraAI',
      status: 'ok' as ServiceStatus,
      detail: devMode ? 'Dev mode' : 'This instance',
      latencyMs: 0,
    }

    const services = [chatbot, aiLayer, dataMiner]
    const errors24h = services.filter(s => s.status !== 'ok').length

    return NextResponse.json({
      success: true,
      data: {
        devMode,
        stats: {
          totalUsers,
          adminUsers,
          chatSessionsToday: chatStats?.sessionsToday ?? null,
          totalChatSessions: chatStats?.totalSessions ?? null,
          errors24h,
        },
        chatDaily: chatStats?.daily ?? [],
        services,
      },
    })
  } catch (err) {
    return adminErrorResponse(err)
  }
})
