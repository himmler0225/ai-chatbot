'use client'

import dynamic from 'next/dynamic'
import { ChatShell } from '@/components/features/chat/ChatShell'
import { ChatSkeleton } from '@/components/features/chat/ChatSkeleton'

const ChatApp = dynamic(
  () => import('@/components/features/chat/ChatApp'),
  { ssr: false, loading: () => <ChatSkeleton /> },
)

export default function HomePage() {
  return (
    <ChatShell>
      <ChatApp />
    </ChatShell>
  )
}
