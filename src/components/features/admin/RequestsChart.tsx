'use client'

import { Card, Flex, Skeleton, Tag, Tooltip, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppLocale } from '@/i18n/locale'
import { useAdminColors, adminCardStyle } from '@/constants/admin-theme'

const { Text, Title } = Typography

export type ChartPoint = {
  label: string
  count: number
}

type Props = {
  points?: ChartPoint[] | null
  loading?: boolean
}

export function RequestsChart({ points, loading }: Props) {
  const { t } = useTranslation()
  const { intlLocale: locale } = useAppLocale()
  const c = useAdminColors()

  if (loading) {
    return (
      <Card style={{ ...adminCardStyle(c), minHeight: 280 }} styles={{ body: { padding: 20 } }}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    )
  }

  const data = points ?? []
  const total = data.reduce((sum, p) => sum + p.count, 0)
  if (!data.length || total === 0) return null

  const max = Math.max(...data.map(p => p.count), 1)

  return (
    <Card style={{ ...adminCardStyle(c), minHeight: 280 }} styles={{ body: { padding: 20 } }}>
      <Flex justify="space-between" align="start" className="mb-4">
        <div>
          <Title level={5} className="!m-0" style={{ color: c.text }}>
            {t('admin.overview.chartTitle')}
          </Title>
          <Text className="text-xs" style={{ color: c.textMuted }}>
            {t('admin.overview.chartSummary', {
              total: total.toLocaleString(locale),
              days: data.length,
            })}
          </Text>
        </div>
        <Tag color={c.accent} style={{ background: c.accentSoft, border: 'none', color: c.accent }}>
          {t('admin.overview.chartDays', { days: data.length })}
        </Tag>
      </Flex>

      <Flex align="end" gap={6} className="pt-4" style={{ minHeight: 200 }}>
        {data.map((p, i) => (
          <Flex
            key={p.label}
            vertical
            align="center"
            justify="end"
            className="flex-1 min-w-0"
          >
            <Text className="text-[10px] mb-1 truncate w-full text-center" style={{ color: c.textMuted }}>
              {p.label}
            </Text>
            <Tooltip title={t('admin.overview.chartSessions', { count: p.count })}>
              <div
                className="w-full rounded-t transition-all"
                style={{
                  height: Math.max(4, (p.count / max) * 160),
                  background: `linear-gradient(180deg, ${c.accent} 0%, rgba(37,99,235,0.15) 100%)`,
                  boxShadow: i === data.length - 1 ? `0 0 12px rgba(37,99,235,0.25)` : undefined,
                }}
              />
            </Tooltip>
          </Flex>
        ))}
      </Flex>
    </Card>
  )
}
