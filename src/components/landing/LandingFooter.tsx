'use client'

import { Flex, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/theme'
import { useColors } from '@/src/components/landing/useColors'
import { Logo } from '@/src/components/ui/Logo'
import { APP_NAME } from '@/src/constants/brand'

const { Text } = Typography

export function LandingFooter() {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const C = useColors(isDark)

  return (
    <footer className="px-6 py-8 text-center" style={{ borderTop: `1px solid ${C.border}` }}>
      <Flex justify="center" align="center" gap={8} className="mb-2">
        <Logo size={22} />
        <Text strong style={{ color: C.fg }}>
          {APP_NAME}
        </Text>
      </Flex>
      <Text className="text-[13px]" style={{ color: C.muted }}>
        {t('app.tagline')}
      </Text>
    </footer>
  )
}
