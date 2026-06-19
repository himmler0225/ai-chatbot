'use client'
import { useCallback } from 'react'
import type { MutableRefObject } from 'react'
import type { AuthUser } from '@/hooks/common/useAuth'
import { useAgentStream } from '@/hooks/chat/useChat'
import { useChatStore } from '@/stores/chatStore'
import { useUIStore } from '@/stores/uiStore'
import { genId, toTitle } from '@/utils/common'
import { historyApi, messageToRow } from '@/lib/api/history'
import type { ChatSession, HistoryMessage, Message } from '@/types/chat'

const GUEST_LIMIT = 3

export function useSendMessage(userRef: MutableRefObject<AuthUser | null>) {
  const { stream: agentStream, abort } = useAgentStream()
  const openAuthModal = useUIStore(s => s.openAuthModal)

  const stopMessage = useCallback(() => {
    abort()
    useChatStore.setState({ isStreaming: false, activeTool: null })
  }, [abort])

  const sendMessage = useCallback(async (overrideContent?: string) => {
    const { input, isStreaming, activeId, messages, sessions, guestMsgCount } =
      useChatStore.getState()

    const content = (overrideContent ?? input).trim()
    if (!content || isStreaming) return

    if (!userRef.current && guestMsgCount >= GUEST_LIMIT) {
      openAuthModal('login')
      return
    }

    useChatStore.setState({ input: '', isStreaming: true, activeTool: null })
    if (!userRef.current) {
      useChatStore.setState(s => ({ guestMsgCount: s.guestMsgCount + 1 }))
    }

    const now = new Date()
    const isFirstMsg = messages.length === 0
    let sessionId: string

    if (!activeId) {
      sessionId = genId()
      const s: ChatSession = {
        id: sessionId,
        title: toTitle(content),
        messages: [],
        createdAt: now,
        updatedAt: now,
      }
      useChatStore.setState(st => ({ sessions: [s, ...st.sessions], activeId: sessionId }))
      if (userRef.current) historyApi.upsertSession(s).catch(console.error)
    } else {
      sessionId = activeId
      if (isFirstMsg && userRef.current) {
        const existing = sessions.find(s => s.id === activeId)
        historyApi
          .upsertSession(
            existing
              ? { ...existing, title: toTitle(content), updatedAt: now }
              : {
                  id: sessionId,
                  title: toTitle(content),
                  messages: [],
                  createdAt: now,
                  updatedAt: now,
                }
          )
          .catch(console.error)
      }
    }

    const userMsg: Message = { id: genId(), role: 'user', content, timestamp: now }
    const aiMsgId = genId()

    if (userRef.current) {
      historyApi.saveMessages(sessionId, [messageToRow(userMsg, sessionId)]).catch(console.error)
    }

    useChatStore.setState(s => ({
      messages: [
        ...s.messages,
        userMsg,
        { id: aiMsgId, role: 'assistant', content: '', timestamp: now },
      ],
    }))

    const history: HistoryMessage[] = [...messages, userMsg]
      .slice(0, -1)
      .map(m => ({ role: m.role, content: m.content }))

    try {
      await agentStream(
        { message: content, history },
        {
          onTextDelta: delta =>
            useChatStore.setState(s => ({
              messages: s.messages.map(m =>
                m.id === aiMsgId ? { ...m, content: m.content + delta } : m
              ),
            })),

          onToolStart: tool => useChatStore.setState({ activeTool: tool }),
          onToolDone: () => useChatStore.setState({ activeTool: null }),

          onDone: ({ reviewSummary, sources, usedTools, videos }) => {
            useChatStore.setState(s => {
              const finalMsgs = s.messages.map(m =>
                m.id === aiMsgId ? { ...m, reviewSummary, sources, usedTools, videos } : m
              )
              const finalSessions = s.sessions.map(sess =>
                sess.id !== sessionId
                  ? sess
                  : {
                      ...sess,
                      messages: finalMsgs,
                      title: isFirstMsg ? toTitle(content) : sess.title,
                      updatedAt: new Date(),
                    }
              )

              if (userRef.current) {
                const ai = finalMsgs.find(m => m.id === aiMsgId)
                if (ai) {
                  historyApi
                    .saveMessages(sessionId, [messageToRow(ai, sessionId)])
                    .catch(console.error)
                  if (isFirstMsg)
                    historyApi.patchSession(sessionId, toTitle(content)).catch(console.error)
                }
              }

              return { messages: finalMsgs, sessions: finalSessions }
            })
          },

          onError: msg =>
            useChatStore.setState(s => ({
              messages: s.messages.map(m => (m.id === aiMsgId ? { ...m, content: msg } : m)),
            })),
        }
      )
    } finally {
      useChatStore.setState({ isStreaming: false, activeTool: null })
    }
  }, [agentStream, openAuthModal])

  return { sendMessage, stopMessage }
}
