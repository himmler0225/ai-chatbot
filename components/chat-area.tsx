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
      {/* Header with glassmorphism */}
      <header className="glass glass-border sticky top-0 z-40">
        <div className="h-16 px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FF9F1C] flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-[#FF6B35] to-[#FF9F1C] bg-clip-text text-transparent">
              SellMate AI
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge-pulse px-3 py-1 rounded-full text-xs bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">
              Kết nối trực tiếp
            </span>
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
