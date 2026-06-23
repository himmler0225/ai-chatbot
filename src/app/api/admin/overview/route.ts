import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { requireAdmin, adminErrorResponse } from '@/lib/admin/auth'
import { getSupabaseAdmin } from '@/lib/admin/supabase-admin'
import { withBffAccess } from '@/lib/guard/bff-access'
import { aiLayerClient } from '@/lib/api/server'

const DATA_MINER_URL = process.env.DATA_MINER_URL ?? 'http://localhost:8000'

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
    await requireAdmin(req.headers.get('authorization'))

    const admin = getSupabaseAdmin()
    const { count: userCount } = await admin
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    const { count: adminCount } = await admin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin')

    const aiLayerUrl = process.env.AI_LAYER_URL ?? 'http://localhost:8001'

    const [aiLayer, dataMiner, chatStats] = await Promise.all([
      pingHealth('ai-layer', aiLayerUrl),
      pingHealth('data-miner', DATA_MINER_URL),
      aiLayerClient
        .get<{ data?: ChatStats }>('/ai/history/admin/stats', { params: { days: 7 } })
        .then(res => res.data?.data ?? null)
        .catch(() => null),
    ])

    const chatbot = {
      name: 'ai-chatbot',
      status: 'ok' as ServiceStatus,
      detail: 'This instance',
      latencyMs: 0,
    }

    const services = [chatbot, aiLayer, dataMiner]
    const errors24h = services.filter(s => s.status !== 'ok').length

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers: userCount ?? 0,
          adminUsers: adminCount ?? 0,
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
