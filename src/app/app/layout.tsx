'use client'

import { useLayoutEffect } from 'react'
import { Analytics } from '@vercel/analytics/next'
import { useTheme } from '@/contexts/theme'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme()

  useLayoutEffect(() => {
    document.documentElement.style.opacity = '1'
    document.documentElement.style.transition = ''
  }, [])

  return (
    <div
      style={{
        height: '100vh',
        overflow: 'hidden',
        background: isDark ? '#0d0d0d' : '#f5f5f5',
      }}
    >
      {children}
      {process.env.NODE_ENV === 'production' && <Analytics />}
    </div>
  )
}
