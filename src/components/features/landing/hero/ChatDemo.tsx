'use client'

import { useEffect, useState } from 'react'
import { CheckOutlined, DollarOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/theme'
import { Logo } from '@/components/common/ui/Logo'
import { YouTubeLogo } from '@/components/common/ui/YouTubeLogo'
import { APP_NAME, EASE } from '@/constants/brand'
import { useColors } from '../shared/useColors'
import {
  AiAvatar,
  AiBubble,
  AiRow,
  AiText,
  ChatBody,
  ChatInput,
  ChatInputBar,
  ChatTitleBar,
  ChatTitleCenter,
  ChatWindow,
  InsightBlock,
  InsightQuote,
  InsightTitle,
  InsightTitleIcon,
  SendButton,
  TrafficDot,
  TrafficLights,
  TypingCursor,
  TypingDot,
  TypingDots,
  UserBubble,
  UserRow,
} from './hero.style'

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
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    setDisplayed('')
    setDone(false)
    const timer = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(timer)
        setDone(true)
        onComplete?.()
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed, onComplete])

  return (
    <>
      {displayed}
      {!done && <TypingCursor>|</TypingCursor>}
    </>
  )
}

const TRAFFIC = ['#ff5f57', '#febc2e', '#28c840'] as const

export function ChatDemo() {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const C = useColors(isDark)
  const [showTyping, setShowTyping] = useState(false)
  const [showAnalyzedEnd, setShowAnalyzedEnd] = useState(false)
  const [showQuality, setShowQuality] = useState(false)
  const [showPrice, setShowPrice] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowTyping(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <ChatWindow
      $C={C}
      $isDark={isDark}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
    >
      <ChatTitleBar $C={C} $isDark={isDark}>
        <TrafficLights>
          {TRAFFIC.map(color => (
            <TrafficDot key={color} $color={color} />
          ))}
        </TrafficLights>
        <ChatTitleCenter $C={C}>
          <Logo size={38} />
          {APP_NAME}
        </ChatTitleCenter>
      </ChatTitleBar>

      <ChatBody>
        <UserRow>
          <UserBubble $isDark={isDark}>{t('landing.hero.demo.question')}</UserBubble>
        </UserRow>

        <AiRow>
          <AiAvatar>
            <Logo size={22} />
          </AiAvatar>
          <AiBubble $C={C}>
            {!showTyping ? (
              <TypingDots>
                {[0, 0.15, 0.3].map((delay, i) => (
                  <TypingDot
                    key={i}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.7, delay }}
                  >
                    ●
                  </TypingDot>
                ))}
              </TypingDots>
            ) : (
              <>
                <AiText $C={C}>
                  <TypingText
                    text={`${t('landing.hero.demo.analyzed1')} ${t('landing.hero.demo.analyzed2')} ${t('landing.hero.demo.analyzed3prefix')} `}
                    speed={15}
                    onComplete={() => setShowAnalyzedEnd(true)}
                  />
                  {showAnalyzedEnd && (
                    <>
                      <YouTubeLogo size={18} style={{ marginInline: 3 }} />
                      <TypingText
                        text={` ${t('landing.hero.demo.analyzed3suffix')}`}
                        speed={15}
                        onComplete={() => {
                          setTimeout(() => setShowQuality(true), 300)
                          setTimeout(() => setShowPrice(true), 900)
                        }}
                      />
                    </>
                  )}
                </AiText>
                {showQuality && (
                  <InsightBlock initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <InsightTitle $C={C}>
                      <InsightTitleIcon><CheckOutlined /></InsightTitleIcon>
                      {t('landing.hero.demo.quality')}
                    </InsightTitle>
                    <InsightQuote $C={C}>&ldquo;{t('landing.hero.demo.qualityQuote')}&rdquo;</InsightQuote>
                  </InsightBlock>
                )}
                {showPrice && (
                  <InsightBlock initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <InsightTitle $C={C}>
                      <InsightTitleIcon><DollarOutlined /></InsightTitleIcon>
                      {t('landing.hero.demo.price')}
                    </InsightTitle>
                    <InsightQuote $C={C}>&ldquo;{t('landing.hero.demo.priceQuote')}&rdquo;</InsightQuote>
                  </InsightBlock>
                )}
              </>
            )}
          </AiBubble>
        </AiRow>
      </ChatBody>

      <ChatInputBar $C={C} $isDark={isDark}>
        <ChatInput $C={C}>{t('landing.hero.demo.inputPlaceholder')}</ChatInput>
        <SendButton>→</SendButton>
      </ChatInputBar>
    </ChatWindow>
  )
}
