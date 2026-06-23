'use client'

import { Skeleton, theme } from 'antd'

export function CardSkeleton() {
  const { token } = theme.useToken()

  return (
    <div
      style={{
        borderRadius: 14,
        border: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorBgContainer,
        overflow: 'hidden',
      }}
    >
      <div
        className="animate-pulse"
        style={{ aspectRatio: '1 / 1', background: token.colorFillQuaternary }}
      />
      <div style={{ padding: 12 }}>
        <Skeleton active paragraph={{ rows: 2 }} title={false} />
      </div>
    </div>
  )
}
