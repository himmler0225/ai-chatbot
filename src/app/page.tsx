'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import '@/i18n/config'
import { useTheme } from '@/contexts/theme'
import AuthModal from '@/components/common/AuthModal'
import {
  HeroSection,
  LandingNav,
  LandingPage,
  useColors,
} from '@/components/features/landing'

const HowSection      = dynamic(() => import('@/components/features/landing').then(m => ({ default: m.HowSection })),      { ssr: false })
const FeaturesSection = dynamic(() => import('@/components/features/landing').then(m => ({ default: m.FeaturesSection })), { ssr: false })
const LandingFooter   = dynamic(() => import('@/components/features/landing').then(m => ({ default: m.LandingFooter })),   { ssr: false })

export default function LandingPageView() {
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  const { isDark } = useTheme()
  const C = useColors(isDark)
  const router = useRouter()

  useEffect(() => {
    router.prefetch('/app')
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
