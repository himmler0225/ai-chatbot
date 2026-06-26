'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/theme'
import { useColors } from '../shared/useColors'
import {
  PhoneAnalyzing,
  PhoneBackdrop,
  PhoneBubbleAi,
  PhoneBubbleUser,
  PhoneFrame,
  PhoneNotch,
  PhonePulse,
  PhoneScreen,
  PhoneStage,
  phoneEnter,
} from './features.style'

export function PhoneMockup() {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const C = useColors(isDark)
  const [dots, setDots] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : `${prev}.`))
    }, 450)
    return () => clearInterval(timer)
  }, [])

  return (
    <PhoneStage>
      <PhoneBackdrop>
        <PhoneFrame $C={C} {...phoneEnter}>
          <PhoneNotch $C={C} />
          <PhoneScreen $C={C}>
            <PhoneBubbleUser>{t('landing.hero.demo.question')}</PhoneBubbleUser>
            <PhoneBubbleAi $C={C}>
              {t('landing.hero.demo.analyzed1')} {t('landing.hero.demo.analyzed2')}…
            </PhoneBubbleAi>
          </PhoneScreen>
        </PhoneFrame>
        <PhoneAnalyzing
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <PhonePulse />
          {t('landing.core.analyzing')}
          {dots}
        </PhoneAnalyzing>
      </PhoneBackdrop>
    </PhoneStage>
  )
}
