'use client'

import { useEffect, useState, useCallback } from 'react'
import { Sidebar } from './sidebar'
import { ChatArea } from './chat-area'
import type { ChatSession, Message } from '@/lib/types'

export function ChatContainer() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions')
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions) as ChatSession[]
      setSessions(parsedSessions)
      if (parsedSessions.length > 0) {
        const lastSession = parsedSessions[0]
        setActiveSessionId(lastSession.id)
        setMessages(lastSession.messages)
      }
    }
  }, [])

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(sessions))
  }, [sessions])

  const generateSessionTitle = (firstMessage: string) => {
    const maxLength = 50
    return firstMessage.length > maxLength
      ? firstMessage.substring(0, maxLength) + '...'
      : firstMessage
  }

  const handleNewChat = useCallback(() => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'Cuộc trò chuyện mới',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setSessions((prev) => [newSession, ...prev])
    setActiveSessionId(newSession.id)
    setMessages([])
  }, [])

  const handleSelectSession = useCallback((id: string) => {
    const session = sessions.find((s) => s.id === id)
    if (session) {
      setActiveSessionId(id)
      setMessages(session.messages)
    }
  }, [sessions])

  const handleDeleteSession = useCallback((id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id))
    if (activeSessionId === id) {
      const remaining = sessions.filter((s) => s.id !== id)
      if (remaining.length > 0) {
        setActiveSessionId(remaining[0].id)
        setMessages(remaining[0].messages)
      } else {
        handleNewChat()
      }
    }
  }, [activeSessionId, sessions, handleNewChat])

  const handleSendMessage = useCallback(
    async (content: string) => {
      // Get current state values within the callback
      setMessages((currentMessages) => {
        const updatedMessages = [...currentMessages, { id: Date.now().toString(), role: 'user' as const, content, timestamp: new Date() }]
        
        setIsLoading(true)

        ;(async () => {
          try {
            // Call mock API
            const response = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: content }),
            })

            if (!response.ok) throw new Error('Failed to get response')

            const data = await response.json()

            // Add assistant message
            const assistantMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: data.message,
              timestamp: new Date(),
              usedTools: data.usedTools,
            }

            const finalMessages = [...updatedMessages, assistantMessage]
            setMessages(finalMessages)

            // Update session
            setSessions((prev) =>
              prev.map((session) => {
                if (session.id === activeSessionId) {
                  const title =
                    session.messages.length === 0
                      ? generateSessionTitle(content)
                      : session.title
                  return {
                    ...session,
                    messages: finalMessages,
                    title,
                    updatedAt: new Date(),
                  }
                }
                return session
              })
            )
          } catch (error) {
            console.error('[v0] Chat error:', error)
            // Optionally show error message to user
          } finally {
            setIsLoading(false)
          }
        })()

        return updatedMessages
      })
    },
    [activeSessionId]
  )

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
      />
      <ChatArea
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}
