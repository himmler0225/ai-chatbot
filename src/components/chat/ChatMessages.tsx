'use client'
import { useEffect, useRef } from 'react'
import { useChatStore } from '@/src/store/chatStore'
import { useSpeech } from '@/src/hooks/useSpeech'
import MessageBubble from '@/src/components/chat/MessageBubble'
import EmptyState from '@/src/components/chat/EmptyState'
import ToolActivity from '@/src/components/chat/ToolActivity'

export function ChatMessages() {
  const messages    = useChatStore(s => s.messages)
  const isStreaming = useChatStore(s => s.isStreaming)
  const activeTool  = useChatStore(s => s.activeTool)
  const { speak, speakingId, supported: canSpeak } = useSpeech()
  const bottomRef = useRef<HTMLDivElement>(null)
  const lastMsgId = messages.length > 0 ? messages[messages.length - 1].id : null

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming])

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {messages.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex-1 flex flex-col px-10 py-5">
          <div className="max-w-[760px] w-full mx-auto">
            {messages.map(m => (
              <MessageBubble
                key={m.id}
                msg={m}
                isStreaming={isStreaming && m.id === lastMsgId && m.role === 'assistant'}
                canSpeak={canSpeak}
                isSpeaking={speakingId === m.id}
                onSpeak={(id, text) => speak(id, text)}
              />
            ))}
            <ToolActivity tool={activeTool} isStreaming={isStreaming} />
            <div ref={bottomRef} />
          </div>
        </div>
      )}
    </div>
  )
}
