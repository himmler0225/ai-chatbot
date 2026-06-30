'use client'

import {
  CheckCircleFilled,
  CloseCircleFilled,
  MessageOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { Alert, Col, Row, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppLocale } from '@/i18n/locale'
import { adminFetch } from '@/lib/admin/client'
import { AdminPageLayout } from '@/components/features/admin/AdminPageLayout'
import { EnterpriseStatCard } from '@/components/features/admin/EnterpriseStatCard'
import { ServiceHealthPanel } from '@/components/features/admin/ServiceHealthPanel'
import { RequestsChart } from '@/components/features/admin/RequestsChart'
import {
  AdminHealthSkeleton,
  AdminStatCardsSkeleton,
} from '@/components/features/admin/AdminSkeletons'
import { useQuery } from '@tanstack/react-query'

type OverviewRes = {
  success: boolean
  data: {
    devMode?: boolean
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
  const devMode = data?.data?.devMode
  const hasChatStats = stats?.totalChatSessions != null
  const allServicesOk = services.every(s => s.status === 'ok')
  const showChart = !isLoading && chatDaily.some(d => d.count > 0)

  const fmt = (n: number | null | undefined, fallback = '—') =>
    n == null ? fallback : n.toLocaleString(locale)

  return (
    <AdminPageLayout
      breadcrumbs={[t('admin.breadcrumb'), t('admin.nav.overview')]}
      title={t('admin.overview.title')}
      description={t('admin.overview.welcomeDesc')}
    >
      {devMode && (
        <Alert
          type="info"
          showIcon
          className="mb-6"
          title={t('admin.devMode.title')}
          description={t('admin.devMode.desc')}
        />
      )}

      {isLoading ? (
        <>
          <AdminStatCardsSkeleton />
          <Row gutter={[20, 20]} className="mt-6">
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
          <Row gutter={[20, 20]} className="mb-6">
            <Col xs={24} sm={12} xl={6}>
              <EnterpriseStatCard
                label={t('admin.overview.totalUsers')}
                value={fmt(stats?.totalUsers, '0')}
                hint={t('admin.overview.adminCount', { count: stats?.adminUsers ?? 0 })}
                hintUp={(stats?.adminUsers ?? 0) > 0}
                icon={<UserOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <EnterpriseStatCard
                label={t('admin.overview.chatSessions')}
                value={fmt(stats?.chatSessionsToday)}
                hint={
                  hasChatStats
                    ? t('admin.overview.totalSessions', {
                        count: fmt(stats?.totalChatSessions, '0'),
                      })
                    : t('admin.overview.noData')
                }
                hintNeutral={!hasChatStats}
                hintUp={hasChatStats && (stats?.chatSessionsToday ?? 0) > 0}
                icon={<MessageOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <EnterpriseStatCard
                label={t('admin.overview.alerts24h')}
                value={stats?.errors24h ?? 0}
                hint={
                  stats?.errors24h
                    ? t('admin.overview.serviceDegraded')
                    : t('admin.overview.allClear')
                }
                hintNeutral={!stats?.errors24h}
                alert={!!stats?.errors24h}
                icon={<WarningOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <EnterpriseStatCard
                label={t('admin.overview.servicesUp')}
                value={`${services.filter(s => s.status === 'ok').length}/${services.length}`}
                hint={t('admin.overview.latencyHint')}
                hintUp={allServicesOk}
                alert={!allServicesOk}
                icon={
                  allServicesOk ? (
                    <CheckCircleFilled />
                  ) : (
                    <CloseCircleFilled style={{ color: '#dc2626' }} />
                  )
                }
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            {showChart && (
              <Col xs={24} xl={16}>
                <RequestsChart points={chatDaily.map(d => ({ label: d.label, count: d.count }))} />
              </Col>
            )}
            <Col xs={24} xl={showChart ? 8 : 24}>
              <ServiceHealthPanel services={services} />
            </Col>
          </Row>
        </>
      )}
    </AdminPageLayout>
  )
}
