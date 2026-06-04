'use client'

import { MessageList } from './message-list'
import { InputArea } from './input-area'
import { ThemeToggle } from './theme-toggle'
import { UserMenu } from './user-menu'
import type { Message } from '@/lib/types'

interface ChatAreaProps {
  messages: Message[]
  isLoading: boolean
  onSendMessage: (content: string) => void
}

export function ChatArea({ messages, isLoading, onSendMessage }: ChatAreaProps) {
  return (
    <div className="flex-1 flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="h-16 px-4 md:px-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">SellMate AI</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Messages area */}
      <MessageList messages={messages} isLoading={isLoading} />

      {/* Input area */}
      <InputArea onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  )
}
