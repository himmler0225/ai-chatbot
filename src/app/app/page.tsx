'use client'

import dynamic from 'next/dynamic'

const ChatApp = dynamic(() => import('@/components/features/chat/ChatApp'), { ssr: false })

export default function ChatPage() {
  return <ChatApp />
}
