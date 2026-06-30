'use client'

import { CheckCircleFilled, CloseCircleFilled, WarningFilled } from '@ant-design/icons'
import { Card, Col, Flex, Row, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import '@/i18n/config'
import { useAdminColors, adminCardStyle } from '@/constants/admin-theme'

const { Text, Title } = Typography

type Service = {
  name: string
  status: 'ok' | 'degraded' | 'down'
  detail: string
  latencyMs: number
}

export function ServiceHealthPanel({ services }: { services: Service[] }) {
  const { t } = useTranslation()
  const c = useAdminColors()

  const STATUS_META = {
    ok: { color: c.success, bg: 'rgba(22,163,74,0.1)', Icon: CheckCircleFilled },
    degraded: { color: c.warning, bg: 'rgba(217,119,6,0.1)', Icon: WarningFilled },
    down: { color: c.danger, bg: 'rgba(220,38,38,0.1)', Icon: CloseCircleFilled },
  } as const

  return (
    <Card
      title={
        <Title level={5} className="!m-0" style={{ color: c.text }}>
          {t('admin.health.title')}
        </Title>
      }
      style={{ ...adminCardStyle(c), boxShadow: '0 1px 2px rgba(15,23,42,0.04)' }}
      styles={{ body: { padding: '20px 22px 22px' } }}
    >
      <Row gutter={[16, 16]}>
        {services.map(service => {
          const meta = STATUS_META[service.status]
          return (
            <Col xs={24} sm={12} key={service.name}>
              <Flex
                vertical
                gap={10}
                className="rounded-xl h-full"
                style={{
                  padding: '16px 18px',
                  background: c.bg,
                  border: `1px solid ${c.border}`,
                }}
              >
                <Flex justify="space-between" align="center">
                  <Text className="font-medium" style={{ color: c.text }}>
                    {service.name}
                  </Text>
                  <meta.Icon style={{ color: meta.color, fontSize: 16 }} />
                </Flex>
                <Text className="text-xs" style={{ color: c.textMuted }}>
                  {service.detail}
                </Text>
                <Flex justify="space-between" align="center">
                  <span
                    className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded"
                    style={{ color: meta.color, background: meta.bg }}
                  >
                    {t(`admin.health.status.${service.status}`)}
                  </span>
                  {service.latencyMs > 0 && (
                    <Text className="text-[11px]" style={{ color: c.textMuted }}>
                      {service.latencyMs}ms
                    </Text>
                  )}
                </Flex>
              </Flex>
            </Col>
          )
        })}
      </Row>
    </Card>
  )
}
