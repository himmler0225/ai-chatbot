'use client'
import { useEffect, useRef } from 'react'
import { useChatStore } from '@/stores/chatStore'
import { useSpeech } from '@/hooks/chat/useSpeech'
import MessageBubble from '@/components/features/chat/MessageBubble'
import EmptyState from '@/components/features/chat/EmptyState'

interface Props {
  onSuggestion: (text: string) => void
  onRetry: (text: string) => void
  onOpenProductPanel?: (store?: 'tiki' | 'fpt') => void
  isMobile?: boolean
}

export function ChatMessages({ onSuggestion, onRetry, onOpenProductPanel, isMobile = false }: Props) {
  const messages    = useChatStore(s => s.messages)
  const isStreaming = useChatStore(s => s.isStreaming)
  const activeTool  = useChatStore(s => s.activeTool)
  const activeToolDetail = useChatStore(s => s.activeToolDetail)
  const { speak, speakingId, supported: canSpeak } = useSpeech()
  const bottomRef = useRef<HTMLDivElement>(null)

  const lastContent = messages.at(-1)?.content ?? ''
  const scrollKey = `${messages.length}:${lastContent.length}:${isStreaming}:${activeTool ?? ''}:${activeToolDetail ?? ''}`

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [scrollKey])

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
              // Find the user message preceding this assistant message for retry
              const prevUserMsg = m.role === 'assistant'
                ? messages.slice(0, i).findLast(x => x.role === 'user')
                : undefined
              return (
                <MessageBubble
                  key={m.id}
                  msg={m}
                  isStreaming={isLastAssistant}
                  activeTool={isLastAssistant ? activeTool : null}
                  activeToolDetail={isLastAssistant ? activeToolDetail : null}
                  canSpeak={canSpeak}
                  isSpeaking={speakingId === m.id}
                  onSpeak={(id, text) => speak(id, text)}
                  onRetry={prevUserMsg ? () => onRetry(prevUserMsg.content) : undefined}
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
