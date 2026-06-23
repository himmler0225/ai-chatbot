'use client'

import { Card, Col, Flex, Row, Skeleton } from 'antd'
import { adminCardStyle, useAdminColors } from '@/constants/admin-theme'

export function AdminStatCardSkeleton() {
  const c = useAdminColors()
  return (
    <Card size="small" style={adminCardStyle(c)} styles={{ body: { padding: 20 } }}>
      <Skeleton active title={{ width: '45%' }} paragraph={{ rows: 2, width: ['55%', '35%'] }} />
    </Card>
  )
}

export function AdminStatCardsSkeleton() {
  return (
    <Row gutter={[16, 16]} className="mb-6">
      {[0, 1, 2].map(i => (
        <Col key={i} xs={24} sm={12} xl={8}>
          <AdminStatCardSkeleton />
        </Col>
      ))}
    </Row>
  )
}

export function AdminHealthSkeleton({ rows = 3 }: { rows?: number }) {
  const c = useAdminColors()
  return (
    <Card style={adminCardStyle(c)} styles={{ body: { padding: 20 } }}>
      <Skeleton active title={{ width: '35%' }} paragraph={{ rows }} />
    </Card>
  )
}

export function AdminChartSkeleton() {
  const c = useAdminColors()
  return (
    <Card style={{ ...adminCardStyle(c), minHeight: 280 }} styles={{ body: { padding: 20 } }}>
      <Skeleton active title={{ width: '40%' }} paragraph={{ rows: 6 }} />
    </Card>
  )
}

export function AdminConfigSkeleton() {
  const c = useAdminColors()
  return (
    <Flex vertical gap={20}>
      <Flex gap={12} wrap="wrap">
        <Skeleton.Button active block style={{ flex: 1, minWidth: 280, height: 40 }} />
        <Skeleton.Button active style={{ width: 140, height: 40 }} />
      </Flex>
      <Flex gap={8} wrap="wrap">
        {[0, 1, 2, 3, 4].map(i => (
          <Skeleton.Button key={i} active size="small" style={{ width: 88 }} />
        ))}
      </Flex>
      <Card style={adminCardStyle(c)} styles={{ body: { padding: 24 } }}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
    </Flex>
  )
}

export function AdminTableSkeleton({ rows = 8 }: { rows?: number }) {
  const c = useAdminColors()
  return (
    <Card style={adminCardStyle(c)} styles={{ body: { padding: 16 } }}>
      <Skeleton active title={{ width: '100%' }} paragraph={{ rows }} />
    </Card>
  )
}

export function AdminShellSkeleton() {
  const c = useAdminColors()

  return (
    <div className="admin-console flex min-h-screen" style={{ background: c.bg }}>
      <aside
        className="hidden md:flex flex-col shrink-0"
        style={{
          width: 240,
          borderRight: `1px solid ${c.border}`,
          background: c.sidebarBg,
          padding: '20px 12px',
        }}
      >
        <Flex align="center" gap={12} className="px-3 mb-5">
          <Skeleton.Avatar active size={36} shape="square" />
          <Skeleton.Input active size="small" style={{ width: 120 }} />
        </Flex>
        <Skeleton.Button active block className="mb-4" style={{ height: 42 }} />
        <Skeleton.Input active size="small" className="mb-3 mx-2" style={{ width: '70%' }} />
        <Skeleton.Button active block className="mb-2" style={{ height: 36 }} />
        <Skeleton.Button active block className="mb-4" style={{ height: 36 }} />
        <Skeleton active paragraph={{ rows: 5 }} />
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <div
          className="px-4 md:px-8 py-4"
          style={{ borderBottom: `1px solid ${c.border}`, background: c.bg }}
        >
          <Skeleton active title={{ width: 200 }} paragraph={false} />
        </div>
        <div className="flex-1 p-4 md:p-8">
          <AdminStatCardsSkeleton />
          <Row gutter={[16, 16]}>
            <Col xs={24} xl={16}>
              <AdminChartSkeleton />
            </Col>
            <Col xs={24} xl={8}>
              <AdminHealthSkeleton />
            </Col>
          </Row>
        </div>
      </main>
    </div>
  )
}
