'use client'

import { Button, Flex, Typography } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/theme'
import { useColors } from '@/src/components/landing/useColors'
import { Reveal } from '@/src/components/landing/Motion'
import { Logo } from '@/src/components/ui/Logo'
import { PRIM, APP_NAME } from '@/src/constants/brand'

const { Text } = Typography

interface Props {
  ctaAction: () => void
}

export function CtaSection({ ctaAction }: Props) {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const C = useColors(isDark)

  return (
    <Reveal>
      <section className="px-6 py-20 text-center">
        <motion.div
          className="max-w-[560px] mx-auto px-8 py-12 sm:p-14 rounded-[20px]"
          style={{
            background: C.card2,
            border: `1px solid ${C.card}`,
            boxShadow: `0 0 80px ${PRIM}15`,
          }}
          whileHover={{ scale: 1.01 }}
        >
          <Flex align="center" justify="center" gap={10} className="mb-4">
            <Logo size={48} />
            <Text strong style={{ fontSize: 22, color: C.fg }}>
              {APP_NAME}
            </Text>
          </Flex>
          <h2 className="text-[28px] font-bold mb-3" style={{ color: C.fg }}>
            {t('landing.cta.title')}
          </h2>
          <p className="text-base mb-8" style={{ color: C.muted }}>
            {t('landing.cta.desc')}
          </p>
          <Button
            type="primary"
            size="large"
            icon={<ArrowRightOutlined />}
            onClick={ctaAction}
            className="!h-[52px] !px-9 !text-base"
            style={{ background: PRIM, borderColor: PRIM }}
          >
            {t('landing.cta.btn')}
          </Button>
        </motion.div>
      </section>
    </Reveal>
  )
}
