'use client'

import type { ReactNode } from 'react'
import { Typography } from 'antd'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { useAdminColors, adminCardStyle } from '@/constants/admin-theme'

const { Text } = Typography

type Props = {
  label: string
  value: string | number
  hint?: string
  hintUp?: boolean
  hintNeutral?: boolean
  icon?: ReactNode
  alert?: boolean
}

export function EnterpriseStatCard({ label, value, hint, hintUp, hintNeutral, icon, alert }: Props) {
  const c = useAdminColors()
  const card = adminCardStyle(c)
  const hintColor = alert
    ? c.danger
    : hintNeutral
      ? c.textMuted
      : hintUp
        ? c.success
        : c.danger

  return (
    <div
      style={{
        ...card,
        padding: '22px 24px',
        boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-5">
        <Text className="text-xs font-semibold uppercase tracking-wide" style={{ color: c.textMuted }}>
          {label}
        </Text>
        {icon && (
          <span
            className="flex items-center justify-center rounded-lg shrink-0"
            style={{
              width: 36,
              height: 36,
              background: alert ? 'rgba(220,38,38,0.08)' : c.accentSoft,
              color: alert ? c.danger : c.accent,
              fontSize: 16,
            }}
          >
            {icon}
          </span>
        )}
      </div>
      <Text className="block text-3xl font-bold leading-none mb-4" style={{ color: c.text }}>
        {value}
      </Text>
      {hint && (
        <Text className="text-xs font-medium flex items-center gap-1" style={{ color: hintColor }}>
          {!hintNeutral && hintUp && <ArrowUpOutlined style={{ fontSize: 10 }} />}
          {!hintNeutral && !hintUp && !alert && <ArrowDownOutlined style={{ fontSize: 10 }} />}
          {hint}
        </Text>
      )}
    </div>
  )
}
