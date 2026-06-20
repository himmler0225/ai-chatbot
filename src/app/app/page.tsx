'use client'

import dynamic from 'next/dynamic'
import { ChatSkeleton } from '@/components/features/chat/ChatSkeleton'

const ChatApp = dynamic(
  () => import('@/components/features/chat/ChatApp'),
  { ssr: false, loading: () => <ChatSkeleton /> }
)

export default function ChatPage() {
  return <ChatApp />
}
