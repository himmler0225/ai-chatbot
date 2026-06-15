'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import '@/src/i18n/config'
import { useTheme } from '@/src/context/theme'
import { useAuth } from '@/src/hooks/useAuth'
import { useColors } from '@/src/components/landing/useColors'
import { LandingNav } from '@/src/components/landing/LandingNav'
import { HeroSection } from '@/src/components/landing/HeroSection'
import { StatsSection } from '@/src/components/landing/StatsSection'
import { HowSection } from '@/src/components/landing/HowSection'
import { FeaturesSection } from '@/src/components/landing/FeaturesSection'
import { ExamplesSection } from '@/src/components/landing/ExamplesSection'
import { WhySection } from '@/src/components/landing/WhySection'
import { CtaSection } from '@/src/components/landing/CtaSection'
import { LandingFooter } from '@/src/components/landing/LandingFooter'
import AuthModal from '@/src/components/AuthModal'

export default function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  const { isDark } = useTheme()
  const C = useColors(isDark)
  const { user } = useAuth()
  const router = useRouter()

  const openLogin = () => {
    setAuthMode('login')
    setAuthOpen(true)
  }
  const openRegister = () => {
    setAuthMode('register')
    setAuthOpen(true)
  }
  const ctaAction = () => router.push('/app')

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: C.bg, color: C.fg }}>
      <AuthModal open={authOpen} defaultMode={authMode} onClose={() => setAuthOpen(false)} />
      <LandingNav C={C} onLogin={openLogin} onRegister={openRegister} />
      <HeroSection ctaAction={ctaAction} />
      <StatsSection />
      <HowSection />
      <FeaturesSection />
      <ExamplesSection />
      <WhySection />
      <CtaSection ctaAction={ctaAction} />
      <LandingFooter />
    </div>
  )
}
