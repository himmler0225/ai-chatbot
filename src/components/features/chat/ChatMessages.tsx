'use client'
import { useEffect, useRef } from 'react'
import { useChatStore } from '@/stores/chatStore'
import { useSpeech } from '@/hooks/chat/useSpeech'
import MessageBubble from '@/components/features/chat/MessageBubble'
import EmptyState from '@/components/features/chat/EmptyState'

interface Props {
  onSuggestion: (text: string) => void
  onOpenProductPanel?: () => void
  isMobile?: boolean
}

export function ChatMessages({ onSuggestion, onOpenProductPanel, isMobile = false }: Props) {
  const messages    = useChatStore(s => s.messages)
  const isStreaming = useChatStore(s => s.isStreaming)
  const activeTool  = useChatStore(s => s.activeTool)
  const { speak, speakingId, supported: canSpeak } = useSpeech()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming, activeTool])

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {messages.length === 0 ? (
        <EmptyState onSuggestion={onSuggestion} onOpenProductPanel={onOpenProductPanel} />
      ) : (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: isMobile ? '16px 12px' : '20px 40px',
        }}>
          <div style={{ maxWidth: 760, width: '100%', margin: '0 auto' }}>
            {messages.map((m, i) => {
              const isLastAssistant =
                isStreaming && m.role === 'assistant' && i === messages.length - 1
              return (
                <MessageBubble
                  key={m.id}
                  msg={m}
                  isStreaming={isLastAssistant}
                  activeTool={isLastAssistant ? activeTool : null}
                  canSpeak={canSpeak}
                  isSpeaking={speakingId === m.id}
                  onSpeak={(id, text) => speak(id, text)}
                />
              )
            })}
            <div ref={bottomRef} />
          </div>
        </div>
      )}
    </div>
  )
}
