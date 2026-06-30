'use client'
import { useEffect, useRef } from 'react'
import { useChatStore } from '@/stores/chatStore'
import { useSpeech } from '@/hooks/chat/useSpeech'
import MessageBubble from '@/components/features/chat/MessageBubble'
import EmptyState from '@/components/features/chat/EmptyState'
import { useChatShell } from '@/constants/chat-shell-theme'

interface Props {
  onSuggestion: (text: string) => void
  onRetry: (text: string) => void
  isMobile?: boolean
}

export function ChatMessages({ onSuggestion, onRetry, isMobile = false }: Props) {
  const c = useChatShell()
  const messages = useChatStore(s => s.messages)
  const isStreaming = useChatStore(s => s.isStreaming)
  const activeTool = useChatStore(s => s.activeTool)
  const activeToolDetail = useChatStore(s => s.activeToolDetail)
  const { speak, speakingId, supported: canSpeak } = useSpeech()
  const containerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollRaf = useRef<number | null>(null)

  const lastAssistant = messages.at(-1)
  const streamContentLen = isStreaming && lastAssistant?.role === 'assistant'
    ? lastAssistant.content.length
    : 0

  useEffect(() => {
    if (scrollRaf.current != null) cancelAnimationFrame(scrollRaf.current)
    scrollRaf.current = requestAnimationFrame(() => {
      scrollRaf.current = null
      const el = containerRef.current
      if (!el) return
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight
      if (distance < 120 || isStreaming) {
        bottomRef.current?.scrollIntoView({ behavior: isStreaming ? 'auto' : 'smooth', block: 'end' })
      }
    })
    return () => {
      if (scrollRaf.current != null) cancelAnimationFrame(scrollRaf.current)
    }
  }, [messages.length, streamContentLen, isStreaming, activeTool, activeToolDetail])

  return (
    <div
      ref={containerRef}
      className="chat-messages-scroll flex-1 min-h-0"
      style={{
        overflowY: 'auto',
        background: c.mainMuted,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {messages.length === 0 ? (
        <EmptyState onSuggestion={onSuggestion} />
      ) : (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: isMobile ? '16px 16px' : '24px 32px',
          }}
        >
          <div style={{ maxWidth: 760, width: '100%', margin: '0 auto' }}>
            {messages.map((m, i) => {
              const isLastAssistant =
                isStreaming && m.role === 'assistant' && i === messages.length - 1
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
