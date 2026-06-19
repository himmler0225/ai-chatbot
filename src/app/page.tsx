'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import '@/i18n/config'
import { useTheme } from '@/contexts/theme'
import AuthModal from '@/components/common/AuthModal'
import {
  FeaturesSection,
  HeroSection,
  HowSection,
  LandingFooter,
  LandingNav,
  LandingPage,
  useColors,
} from '@/components/features/landing'

export default function LandingPageView() {
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  const { isDark } = useTheme()
  const C = useColors(isDark)
  const router = useRouter()

  useEffect(() => {
    router.prefetch('/app')
    void import('@/components/features/chat/ChatApp')
  }, [router])

  const openLogin = () => {
    setAuthMode('login')
    setAuthOpen(true)
  }
  const ctaAction = () => router.push('/app')

  return (
    <LandingPage $C={C}>
      <AuthModal open={authOpen} defaultMode={authMode} onClose={() => setAuthOpen(false)} />
      <LandingNav C={C} onLogin={openLogin} onCta={ctaAction} />
      <HeroSection ctaAction={ctaAction} />
      <HowSection />
      <FeaturesSection />
      <LandingFooter />
    </LandingPage>
  )
}
