'use client'

import { Button, Flex, Typography } from 'antd'
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import '@/src/i18n/config'
import { useTheme } from '@/src/context/theme'
import { Logo } from '@/src/components/ui/Logo'
import { useColors } from '@/src/components/landing/useColors'
import { PRIM, APP_NAME } from '@/src/constants/brand'

const { Title, Text } = Typography

export default function NotFound() {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const C = useColors(isDark)

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: C.bg, color: C.fg }}
    >
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[260px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(ellipse, ${PRIM}12 0%, transparent 70%)` }}
      />

      <motion.div
        className="flex flex-col items-center gap-6 relative z-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Logo size={56} />

        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="font-bold leading-none"
          style={{ fontSize: 'clamp(80px, 15vw, 140px)', color: PRIM, lineHeight: 1 }}
        >
          404
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col items-center gap-2"
        >
          <Title level={3} style={{ color: C.fg, margin: 0 }}>
            {t('notFound.title')}
          </Title>
          <Text style={{ color: C.muted, fontSize: 15, maxWidth: 380 }}>{t('notFound.desc')}</Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Flex gap={10} wrap="wrap" justify="center">
            <Button
              type="primary"
              size="large"
              icon={<HomeOutlined />}
              onClick={() => {
                window.location.href = '/'
              }}
              style={{ background: PRIM, borderColor: PRIM, height: 46 }}
            >
              {t('notFound.home')}
            </Button>
            <Button
              size="large"
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                window.location.href = '/'
              }}
              style={{ height: 46, borderColor: C.border, color: C.fg, background: 'transparent' }}
            >
              {t('notFound.back')}
            </Button>
          </Flex>
        </motion.div>

        <Text style={{ color: C.muted, fontSize: 13, marginTop: 8 }}>{APP_NAME}</Text>
      </motion.div>
    </div>
  )
}
