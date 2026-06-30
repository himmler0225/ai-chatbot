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
  accent?: string
}

export function StatCard({ label, value, delta, deltaUp, icon, alert, accent = PRIM }: Props) {
  const c = useAdminColors()
  const card = adminCardStyle(c)

  return (
    <Card
      size="small"
      className="admin-stat-card"
      style={{
        ...card,
        borderColor: alert ? 'rgba(255,77,79,0.35)' : card.borderColor,
        overflow: 'hidden',
      }}
      styles={{ body: { padding: 0 } }}
    >
      <div
        style={{
          height: 3,
          background: alert
            ? 'linear-gradient(90deg, #ff4d4f, #ff7875)'
            : `linear-gradient(90deg, ${accent}, transparent)`,
        }}
      />
      <div style={{ padding: '18px 20px 20px' }}>
        <Flex justify="space-between" align="start" className="mb-3">
          <Text className="text-[11px] uppercase tracking-wider font-medium" style={{ color: c.textMuted }}>
            {label}
          </Text>
          {icon && (
            <span
              className="flex items-center justify-center rounded-lg"
              style={{
                color: alert ? '#ff4d4f' : accent,
                fontSize: 16,
                width: 32,
                height: 32,
                background: alert ? 'rgba(255,77,79,0.1)' : `${accent}18`,
              }}
            >
              {icon}
            </span>
          )}
        </Flex>
        <Statistic
          value={value}
          styles={{
            content: { color: c.text, fontSize: 30, fontWeight: 700, lineHeight: 1.1 },
          }}
        />
        {delta && (
          <Text
            className="text-xs font-medium block mt-3"
            style={{ color: alert ? '#ff4d4f' : deltaUp ? accent : c.textMuted }}
          >
            {delta}
          </Text>
        )}
      </div>
    </Card>
  )
}
