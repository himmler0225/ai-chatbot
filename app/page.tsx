'use client'

import dynamic from 'next/dynamic'
import { ThemeProvider } from '@/lib/theme-provider'

const ChatContainer = dynamic(() => import('@/components/chat').then(mod => ({ default: mod.ChatContainer })), {
  ssr: false,
})

export default function Page() {
  return (
    <ThemeProvider>
      <ChatContainer />
    </ThemeProvider>
  )
}
