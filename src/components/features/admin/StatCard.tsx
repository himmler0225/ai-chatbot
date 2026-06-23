'use client'

import type { ReactNode } from 'react'
import { Card, Flex, Statistic, Typography } from 'antd'
import { adminCardStyle, useAdminColors } from '@/constants/admin-theme'
import { PRIM } from '@/constants/brand'

const { Text } = Typography

type Props = {
  label: string
  value: string | number
  delta?: string
  deltaUp?: boolean
  icon?: ReactNode
  alert?: boolean
}

export function StatCard({ label, value, delta, deltaUp, icon, alert }: Props) {
  const c = useAdminColors()
  const card = adminCardStyle(c)

  return (
    <Card
      size="small"
      style={{
        ...card,
        borderColor: alert ? 'rgba(255,77,79,0.35)' : card.borderColor,
      }}
      styles={{ body: { padding: 20 } }}
    >
      <Flex justify="space-between" align="start" className="mb-2">
        <Text className="text-xs uppercase tracking-wide" style={{ color: c.textMuted }}>
          {label}
        </Text>
        {icon && (
          <span style={{ color: alert ? '#ff4d4f' : PRIM, fontSize: 16 }}>{icon}</span>
        )}
      </Flex>
      <Statistic
        value={value}
        styles={{
          content: { color: c.text, fontSize: 28, fontWeight: 700 },
        }}
      />
      {delta && (
        <Text
          className="text-xs font-medium block mt-2"
          style={{ color: alert ? '#ff4d4f' : deltaUp ? PRIM : c.textMuted }}
        >
          {delta}
        </Text>
      )}
    </Card>
  )
}
