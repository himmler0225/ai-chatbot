'use client'

import { useEffect, useRef } from 'react'
import { Message } from './message'
import { TypingIndicator } from './typing-indicator'
import type { Message as MessageType } from '@/lib/types'

interface MessageListProps {
  messages: MessageType[]
  isLoading: boolean
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-foreground">
              Chào mừng đến SellMate AI
            </h2>
            <p className="text-muted-foreground max-w-sm">
              Tôi là trợ lý thông minh cho thương mại điện tử Việt Nam. Hỏi tôi bất kỳ điều gì về sản phẩm, thanh toán hoặc đơn hàng của bạn.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="message-enter">
              <Message message={message} />
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start message-enter">
              <TypingIndicator />
            </div>
          )}
          <div ref={endRef} />
        </div>
      )}
    </div>
  )
}
