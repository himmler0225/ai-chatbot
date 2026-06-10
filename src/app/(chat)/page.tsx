'use client'

import dynamic from 'next/dynamic'

const ChatApp = dynamic(() => import('@/src/components/ChatApp'), { ssr: false })

export default function ChatPage() {
  return <ChatApp />
}
