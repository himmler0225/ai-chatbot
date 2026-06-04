'use client'

import { ToolCall } from './tool-call'
import type { Message as MessageType } from '@/lib/types'

interface MessageProps {
  message: MessageType
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-2xl space-y-3 ${
          isUser ? 'bg-accent text-accent-foreground' : 'bg-card border border-border text-card-foreground'
        } rounded-lg px-4 py-3`}
      >
        {/* Main message content */}
        <p className="text-sm leading-relaxed text-balance">{message.content}</p>

        {/* Tools used */}
        {message.usedTools && message.usedTools.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-current/10">
            <p className={`text-xs font-semibold ${isUser ? 'opacity-80' : 'text-muted-foreground'}`}>
              Công cụ được sử dụng:
            </p>
            <div className="flex flex-wrap gap-2">
              {message.usedTools.map((tool) => (
                <ToolCall key={tool.name} tool={tool} isUser={isUser} />
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <p
          className={`text-xs ${
            isUser ? 'opacity-70' : 'text-muted-foreground'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  )
}
