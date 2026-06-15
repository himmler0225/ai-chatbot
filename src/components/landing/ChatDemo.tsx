'use client'

import { useEffect, useState } from 'react'
import { Flex } from 'antd'
import { DollarOutlined, ShoppingOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/theme'
import { useColors } from '@/src/components/landing/useColors'
import { Logo } from '@/src/components/ui/Logo'
import { PRIM, APP_NAME, EASE } from '@/src/constants/brand'

function TypingText({
  text,
  speed = 20,
  onComplete,
}: {
  text: string
  speed?: number
  onComplete?: () => void
}) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(timer)
        onComplete?.()
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed, onComplete])

  return (
    <>
      {displayed}
      <span style={{ animation: 'blink 1s infinite', marginLeft: 2 }}>|</span>
    </>
  )
}

export function ChatDemo() {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const C = useColors(isDark)
  const [showTyping, setShowTyping] = useState(false)
  const [showQuality, setShowQuality] = useState(false)
  const [showPrice, setShowPrice] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowTyping(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      className="rounded-2xl overflow-hidden text-left"
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        boxShadow: isDark ? '0 24px 60px rgba(0,0,0,0.5)' : '0 24px 60px rgba(0,0,0,0.12)',
      }}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
    >
      <Flex
        align="center"
        gap={8}
        style={{
          padding: '10px 14px',
          background: isDark ? '#1a1a1a' : '#f3f4f6',
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <Flex gap={6}>
          {['#ff5f57', '#febc2e', '#28c840'].map(bg => (
            <span
              key={bg}
              className="w-3 h-3 rounded-full inline-block"
              style={{ background: bg }}
            />
          ))}
        </Flex>
        <Flex align="center" gap={6} style={{ flex: 1, justifyContent: 'center' }}>
          <Logo size={16} />
          <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>{APP_NAME}</span>
        </Flex>
      </Flex>

      <div style={{ padding: '16px 16px 12px' }}>
        <Flex justify="flex-end" className="mb-3">
          <div
            className="text-sm text-white px-4 py-2.5 max-w-[80%]"
            style={{ background: PRIM, borderRadius: '18px 18px 18px 18px', lineHeight: 1.5 }}
          >
            {t('landing.hero.demo.question')}
          </div>
        </Flex>

        <Flex align="flex-start" style={{ marginTop: 15 }} gap={10}>
          <div className="shrink-0 mt-1">
            <Logo size={28} />
          </div>
          <div
            className="text-sm flex-1"
            style={{
              background: C.card2,
              borderRadius: '18px 18px 18px 18px',
              padding: '10px 14px',
              color: C.muted,
              lineHeight: 1.6,
              minHeight: 80,
            }}
          >
            {!showTyping ? (
              <Flex gap={4} align="center" style={{ height: 24 }}>
                {[0, 0.15, 0.3].map((delay, i) => (
                  <motion.span
                    key={i}
                    style={{ fontSize: 8, color: PRIM }}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.7, delay }}
                  >
                    ●
                  </motion.span>
                ))}
              </Flex>
            ) : (
              <>
                <span style={{ color: C.fg }}>
                  <TypingText
                    text={`${t('landing.hero.demo.analyzed1')} ${t('landing.hero.demo.analyzed2')} ${t('landing.hero.demo.analyzed3')}`}
                    speed={15}
                    onComplete={() => {
                      setTimeout(() => setShowQuality(true), 300)
                      setTimeout(() => setShowPrice(true), 900)
                    }}
                  />
                </span>
                {showQuality && (
                  <motion.div
                    className="mt-3"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="font-semibold mb-0.5" style={{ color: C.fg }}>
                      <ShoppingOutlined style={{ marginRight: 6, color: PRIM }} />
                      {t('landing.hero.demo.quality')}
                    </div>
                    <div style={{ color: isDark ? '#666' : '#9ca3af', fontSize: 12 }}>
                      &ldquo;{t('landing.hero.demo.qualityQuote')}&rdquo;
                    </div>
                  </motion.div>
                )}
                {showPrice && (
                  <motion.div
                    className="mt-3"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="font-semibold mb-0.5" style={{ color: C.fg }}>
                      <DollarOutlined style={{ marginRight: 6, color: PRIM }} />
                      {t('landing.hero.demo.price')}
                    </div>
                    <div style={{ color: isDark ? '#666' : '#9ca3af', fontSize: 12 }}>
                      &ldquo;{t('landing.hero.demo.priceQuote')}&rdquo;
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </Flex>
      </div>

      <Flex
        align="center"
        gap={8}
        style={{
          padding: '10px 14px',
          borderTop: `1px solid ${C.border}`,
          background: isDark ? '#111' : '#fafafa',
        }}
      >
        <div
          className="flex-1 text-sm rounded-full px-4 py-2"
          style={{
            background: C.card2,
            color: C.muted,
            border: `1px solid ${C.border}`,
            opacity: 0.6,
          }}
        >
          {t('chat.inputPlaceholder')}
        </div>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: PRIM,
            opacity: 0.4,
            fontSize: 12,
            color: '#fff',
            textAlign: 'center',
            lineHeight: '32px',
          }}
        >
          →
        </div>
      </Flex>
    </motion.div>
  )
}
