'use client'

import { useLayoutEffect } from 'react'
import { Analytics } from '@vercel/analytics/next'
import { useChatShell } from '@/constants/chat-shell-theme'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const c = useChatShell()

  useLayoutEffect(() => {
    document.documentElement.style.opacity = '1'
    document.documentElement.style.transition = ''
  }, [])

  return (
    <div
      style={{
        height: '100vh',
        overflow: 'hidden',
        background: c.mainBg,
      }}
    >
      {children}
      {process.env.NODE_ENV === 'production' && <Analytics />}
    </div>
  )
}
