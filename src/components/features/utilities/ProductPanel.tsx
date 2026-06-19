'use client'

import { Button, Flex, Typography, theme } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { TikiLogo } from '@/components/common/ui/TikiLogo'
import { YouTubeLogo } from '@/components/common/ui/YouTubeLogo'
import { TikTokLogo } from '@/components/common/ui/TikTokLogo'
import { useTranslation } from 'react-i18next'
import '@/i18n/config'
import { ProductSearch } from '@/components/features/utilities/ProductSearch'

const { Text } = Typography

interface Props {
  onClose: () => void
  compact?: boolean
}

export function ProductPanel({ onClose, compact = false }: Props) {
  const { token } = theme.useToken()
  const { t } = useTranslation()

  return (
    <Flex
      vertical
      style={{
        height: '100%',
        background: token.colorBgContainer,
      }}
    >
      <Flex
        align="flex-start"
        justify="space-between"
        gap={8}
        style={{
          padding: compact ? '12px 14px' : '14px 16px',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          flexShrink: 0,
        }}
      >
        <Flex align="flex-start" gap={10} style={{ minWidth: 0, flex: 1 }}>
          <TikiLogo size={28} style={{ marginTop: 1, flexShrink: 0 }} />
          <Flex vertical gap={3} style={{ minWidth: 0 }}>
            <Text strong style={{ fontSize: 14, lineHeight: 1.3 }}>
              {t('utilities.product.panelTitle')}
            </Text>
            <Flex align="center" gap={6} wrap="wrap">
              <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.4 }}>
                {t('utilities.product.panelHint')}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          onClick={onClose}
          aria-label={t('utilities.product.closePanel')}
          style={{ flexShrink: 0, marginTop: -2 }}
        />
      </Flex>

      <div style={{ flex: 1, overflowY: 'auto', padding: compact ? '12px 14px' : '14px 16px' }}>
        <ProductSearch compact={compact} />
      </div>
    </Flex>
  )
}
