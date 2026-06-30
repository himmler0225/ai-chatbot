'use client'

import { Card, Col, Flex, Row, Skeleton } from 'antd'
import { adminCardStyle, useAdminColors } from '@/constants/admin-theme'

const skeletonLoose = 'admin-skeleton-loose'

export function AdminStatCardSkeleton() {
  const c = useAdminColors()
  return (
    <Card
      size="small"
      className={skeletonLoose}
      style={adminCardStyle(c)}
      styles={{ body: { padding: '24px 22px' } }}
    >
      <Skeleton active title={{ width: '42%' }} paragraph={{ rows: 2, width: ['58%', '38%'] }} />
    </Card>
  )
}

export function AdminStatCardsSkeleton() {
  return (
    <Row gutter={[20, 20]} className="mb-6">
      {[0, 1, 2, 3].map(i => (
        <Col key={i} xs={24} sm={12} xl={6}>
          <AdminStatCardSkeleton />
        </Col>
      ))}
    </Row>
  )
}

export function AdminHealthSkeleton({ rows = 3 }: { rows?: number }) {
  const c = useAdminColors()
  return (
    <Card
      className={skeletonLoose}
      style={adminCardStyle(c)}
      styles={{ body: { padding: '24px 22px' } }}
    >
      <Skeleton active title={{ width: '35%' }} paragraph={{ rows, width: ['92%', '78%', '64%'] }} />
    </Card>
  )
}

export function AdminChartSkeleton() {
  const c = useAdminColors()
  return (
    <Card
      className={skeletonLoose}
      style={{ ...adminCardStyle(c), minHeight: 280 }}
      styles={{ body: { padding: '24px 22px' } }}
    >
      <Skeleton active title={{ width: '40%' }} paragraph={{ rows: 6, width: ['100%', '96%', '88%', '72%', '60%', '48%'] }} />
    </Card>
  )
}

export function AdminConfigSkeleton() {
  const c = useAdminColors()
  return (
    <Flex vertical gap={24}>
      <Flex gap={12} wrap="wrap">
        <Skeleton.Button active block style={{ flex: 1, minWidth: 280, height: 40 }} />
        <Skeleton.Button active style={{ width: 140, height: 40 }} />
      </Flex>
      <Flex gap={10} wrap="wrap">
        {[0, 1, 2, 3, 4].map(i => (
          <Skeleton.Button key={i} active size="small" style={{ width: 88 }} />
        ))}
      </Flex>
      <Card className={skeletonLoose} style={adminCardStyle(c)} styles={{ body: { padding: 28 } }}>
        <Skeleton active paragraph={{ rows: 8, width: ['100%', '96%', '92%', '88%', '84%', '80%', '76%', '72%'] }} />
      </Card>
    </Flex>
  )
}

export function AdminTableSkeleton({ rows = 8 }: { rows?: number }) {
  const c = useAdminColors()
  return (
    <Card className={skeletonLoose} style={adminCardStyle(c)} styles={{ body: { padding: 20 } }}>
      <Skeleton active title={{ width: '100%' }} paragraph={{ rows }} />
    </Card>
  )
}

export function AdminShellSkeleton() {
  const c = useAdminColors()

  return (
    <div className="admin-console flex h-screen min-h-0 w-full overflow-hidden">
      <aside
        className="hidden md:flex flex-col shrink-0 h-full"
        style={{
          width: 260,
          borderRight: `1px solid ${c.sidebarBorder}`,
          background: c.sidebarBg,
          padding: '16px 12px',
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
          className="px-4 md:px-8 py-4 flex justify-end"
          style={{ borderBottom: `1px solid ${c.border}`, background: c.topBarBg }}
        >
          <Skeleton.Button active style={{ width: 220, height: 40 }} />
        </div>
        <div className="flex-1 p-4 md:p-8">
          <AdminStatCardsSkeleton />
          <Row gutter={[20, 20]}>
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
