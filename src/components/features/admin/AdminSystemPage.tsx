'use client'

import { useQuery } from '@tanstack/react-query'
import { Col, Row } from 'antd'
import '@/i18n/config'
import { adminFetch } from '@/lib/admin/client'
import { AdminHeader } from '@/components/features/admin/AdminHeader'
import { AdminPageBody } from '@/components/features/admin/AdminPageBody'
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
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: () => adminFetch<OverviewRes>('/api/admin/overview'),
    refetchInterval: 30_000,
  })

  return (
    <>
      <AdminHeader titleKey="admin.system.title" subtitleKey="admin.system.subtitle" />
      <AdminPageBody>
        <Row>
          <Col xs={24} lg={16}>
            {isLoading ? (
              <AdminHealthSkeleton rows={4} />
            ) : (
              <ServiceHealthPanel services={data?.data?.services ?? []} />
            )}
          </Col>
        </Row>
      </AdminPageBody>
    </>
  )
}
