'use client'

import { useQuery } from '@tanstack/react-query'
import { UserOutlined, MessageOutlined, WarningOutlined } from '@ant-design/icons'
import { Col, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppLocale } from '@/i18n/locale'
import { adminFetch } from '@/lib/admin/client'
import { AdminHeader } from '@/components/features/admin/AdminHeader'
import { AdminPageBody } from '@/components/features/admin/AdminPageBody'
import { StatCard } from '@/components/features/admin/StatCard'
import { ServiceHealthPanel } from '@/components/features/admin/ServiceHealthPanel'
import { RequestsChart } from '@/components/features/admin/RequestsChart'
import {
  AdminHealthSkeleton,
  AdminStatCardsSkeleton,
} from '@/components/features/admin/AdminSkeletons'

type OverviewRes = {
  success: boolean
  data: {
    stats: {
      totalUsers: number
      adminUsers: number
      chatSessionsToday: number | null
      totalChatSessions: number | null
      errors24h: number
    }
    chatDaily: Array<{ date: string; label: string; count: number }>
    services: Array<{
      name: string
      status: 'ok' | 'degraded' | 'down'
      detail: string
      latencyMs: number
    }>
  }
}

export function AdminOverviewPage() {
  const { t } = useTranslation()
  const { intlLocale: locale } = useAppLocale()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: () => adminFetch<OverviewRes>('/api/admin/overview'),
    refetchInterval: 60_000,
  })

  const stats = data?.data?.stats
  const chatDaily = data?.data?.chatDaily ?? []
  const services = data?.data?.services ?? []
  const hasChatStats = stats?.totalChatSessions != null

  const fmt = (n: number | null | undefined, fallback = '—') =>
    n == null ? fallback : n.toLocaleString(locale)

  const showChart = !isLoading && chatDaily.some(d => d.count > 0)

  return (
    <>
      <AdminHeader titleKey="admin.overview.title" subtitleKey="admin.overview.subtitle" />
      <AdminPageBody>
        {isLoading ? (
          <>
            <AdminStatCardsSkeleton />
            <Row gutter={[16, 16]}>
              <Col xs={24} xl={16}>
                <RequestsChart loading />
              </Col>
              <Col xs={24} xl={8}>
                <AdminHealthSkeleton />
              </Col>
            </Row>
          </>
        ) : (
          <>
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} xl={8}>
            <StatCard
              label={t('admin.overview.totalUsers')}
              value={fmt(stats?.totalUsers, '0')}
              delta={t('admin.overview.adminCount', { count: stats?.adminUsers ?? 0 })}
              deltaUp
              icon={<UserOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} xl={8}>
            <StatCard
              label={t('admin.overview.chatSessions')}
              value={fmt(stats?.chatSessionsToday)}
              delta={
                hasChatStats
                  ? t('admin.overview.totalSessions', {
                      count: fmt(stats?.totalChatSessions, '0'),
                    })
                  : t('admin.overview.noData')
              }
              deltaUp={hasChatStats && (stats?.chatSessionsToday ?? 0) > 0}
              icon={<MessageOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} xl={8}>
            <StatCard
              label={t('admin.overview.alerts24h')}
              value={stats?.errors24h ?? 0}
              delta={
                stats?.errors24h
                  ? t('admin.overview.serviceDegraded')
                  : t('admin.overview.allClear')
              }
              alert={!!stats?.errors24h}
              icon={<WarningOutlined />}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {(showChart) && (
            <Col xs={24} xl={16}>
              <RequestsChart
                points={chatDaily.map(d => ({ label: d.label, count: d.count }))}
              />
            </Col>
          )}
          <Col xs={24} xl={showChart ? 8 : 24}>
            <ServiceHealthPanel services={services} />
          </Col>
        </Row>
          </>
        )}
      </AdminPageBody>
    </>
  )
}
