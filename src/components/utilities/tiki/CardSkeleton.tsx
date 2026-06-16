'use client'
import { Card, Skeleton, theme } from 'antd'

export function CardSkeleton() {
  const { token } = theme.useToken()
  return (
    <Card size="small" styles={{ body: { padding: 10 } }}>
      <div
        className="animate-pulse rounded-t-lg w-full mb-3"
        style={{ aspectRatio: '4/3', background: token.colorBgLayout }}
      />
      <Skeleton active paragraph={{ rows: 2 }} title={false} />
    </Card>
  )
}
