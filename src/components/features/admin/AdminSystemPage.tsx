'use client'

import { useQuery } from '@tanstack/react-query'
import { Col, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import '@/i18n/config'
import { adminFetch } from '@/lib/admin/client'
import { AdminPageLayout } from '@/components/features/admin/AdminPageLayout'
import { ServiceHealthPanel } from '@/components/features/admin/ServiceHealthPanel'
import { AdminHealthSkeleton } from '@/components/features/admin/AdminSkeletons'

type OverviewRes = {
  data: {
    services: Array<{
      name: string
      status: 'ok' | 'degraded' | 'down'
      detail: string
      latencyMs: number
    }>
  }
}

export function AdminSystemPage() {
  const { t } = useTranslation()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: () => adminFetch<OverviewRes>('/api/admin/overview'),
    refetchInterval: 30_000,
  })

  return (
    <AdminPageLayout
      breadcrumbs={[t('admin.breadcrumb'), t('admin.nav.system')]}
      title={t('admin.system.title')}
      description={t('admin.health.title')}
    >
      <Row>
        <Col xs={24}>
          {isLoading ? (
            <AdminHealthSkeleton rows={4} />
          ) : (
            <ServiceHealthPanel services={data?.data?.services ?? []} />
          )}
        </Col>
      </Row>
    </AdminPageLayout>
  )
}
