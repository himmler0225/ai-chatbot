'use client'

import { Button } from 'antd'
import { ArrowRightOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/theme'
import { ChatDemo } from '@/src/components/landing/ChatDemo'
import { PRIM } from '@/src/constants/brand'
import { useColors } from '@/src/components/landing/useColors'

interface Props {
  ctaAction: () => void
}

export function HeroSection({ ctaAction }: Props) {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const C = useColors(isDark)

  return (
    <section className="relative max-w-3xl mx-auto px-6 pt-36 pb-16 text-center">
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(ellipse, ${PRIM}18 0%, transparent 70%)` }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium mb-6"
          style={{ background: `${PRIM}15`, border: `1px solid ${PRIM}35`, color: PRIM }}
        >
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: PRIM }} />
          {t('landing.badge')}
        </span>
      </motion.div>

      <motion.h1
        className="font-bold leading-tight mb-5"
        style={{ fontSize: 'clamp(36px, 5.5vw, 58px)', color: C.fg }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
      >
        {t('landing.hero.title1')}
        <br />
        <span style={{ color: PRIM }}>{t('landing.hero.title2')}</span>
      </motion.h1>

      <motion.p
        className="text-lg leading-relaxed mb-9 mx-auto max-w-lg"
        style={{ color: C.muted }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.2 }}
      >
        {t('landing.hero.desc')}
      </motion.p>

      <motion.div
        className="flex flex-wrap gap-3 justify-center mb-14"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.3 }}
      >
        <Button
          type="primary"
          size="large"
          icon={<ArrowRightOutlined />}
          onClick={ctaAction}
          className="!h-[50px] !px-8 !text-base"
          style={{ background: PRIM, borderColor: PRIM }}
        >
          {t('landing.hero.cta')}
        </Button>
        <a href="#how-it-works">
          <Button
            size="large"
            icon={<PlayCircleOutlined />}
            className="!h-[50px] !px-7 !text-base"
            style={{ borderColor: '#2a2a2a', color: C.fg, background: 'transparent' }}
          >
            {t('landing.hero.howto')}
          </Button>
        </a>
      </motion.div>

      <ChatDemo />
    </section>
  )
}
