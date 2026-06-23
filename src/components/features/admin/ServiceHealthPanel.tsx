'use client'

import { CheckCircleFilled, CloseCircleFilled, WarningFilled } from '@ant-design/icons'
import { Card, Flex, List, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import '@/i18n/config'
import { adminCardStyle, useAdminColors } from '@/constants/admin-theme'
import { PRIM } from '@/constants/brand'

const { Text, Title } = Typography

type Service = {
  name: string
  status: 'ok' | 'degraded' | 'down'
  detail: string
  latencyMs: number
}

const STATUS_META = {
  ok: { color: PRIM, Icon: CheckCircleFilled },
  degraded: { color: '#faad14', Icon: WarningFilled },
  down: { color: '#ff4d4f', Icon: CloseCircleFilled },
} as const

export function ServiceHealthPanel({ services }: { services: Service[] }) {
  const { t } = useTranslation()
  const c = useAdminColors()

  return (
    <Card
      title={
        <Title level={5} className="!m-0" style={{ color: c.text }}>
          {t('admin.health.title')}
        </Title>
      }
      style={adminCardStyle(c)}
      styles={{ body: { paddingTop: 8 } }}
    >
      <List
        dataSource={services}
        split={false}
        renderItem={service => {
          const meta = STATUS_META[service.status]
          return (
            <List.Item className="!px-0 !py-3">
              <Flex justify="space-between" align="center" className="w-full gap-3">
                <div className="min-w-0">
                  <Text className="block" style={{ color: c.text }}>
                    {service.name}
                  </Text>
                  <Text className="text-xs" style={{ color: c.textMuted }}>
                    {service.detail}
                  </Text>
                </div>
                <Flex align="center" gap={8} className="shrink-0">
                  <Text
                    className="text-[10px] font-bold tracking-wider"
                    style={{ color: meta.color }}
                  >
                    {t(`admin.health.status.${service.status}`)}
                  </Text>
                  <meta.Icon style={{ color: meta.color, fontSize: 18 }} />
                </Flex>
              </Flex>
            </List.Item>
          )
        }}
      />
    </Card>
  )
}
