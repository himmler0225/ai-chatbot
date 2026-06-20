'use client'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { AuthUser } from '@/hooks/common/useAuth'
import { useAuth } from '@/hooks/common/useAuth'
import { useChatStore } from '@/stores/chatStore'
import { historyApi, rowToMessage } from '@/lib/api/history'
import { genId } from '@/utils/common'
import type { ChatSession } from '@/types/chat'

export function useChatHistory() {
  const { user, loading: authLoading } = useAuth()
  const { t } = useTranslation()

  const userRef = useRef<AuthUser | null>(null)
  const loadedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    userRef.current = user ?? null
  }, [user])

  const initialLoadDone = useRef(false)

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      if (useChatStore.getState().isStreaming) return
      initialLoadDone.current = false
      useChatStore.getState().reset()
      loadedRef.current.clear()
      return
    }

    if (initialLoadDone.current) return
    initialLoadDone.current = true

    historyApi
      .listSessions()
      .then(async rows => {
        if (!rows?.length) {
          useChatStore.setState({ sessions: [], activeId: null, messages: [] })
          return
        }

        const first = rows[0]
        const msgRows = await historyApi.getMessages(first.id)
        const firstMsgs = (msgRows ?? []).map(rowToMessage)
        loadedRef.current.add(first.id)

        const chatSessions: ChatSession[] = rows.map(r => ({
          id: r.id,
          title: r.title,
          messages: r.id === first.id ? firstMsgs : [],
          createdAt: new Date(r.created_at),
          updatedAt: new Date(r.updated_at),
        }))

        useChatStore.setState({ sessions: chatSessions, activeId: first.id, messages: firstMsgs })
      })
      .catch(console.error)
  }, [user, authLoading])

  const newChat = () => {
    const s: ChatSession = {
      id: genId(),
      title: t('chat.newChat'),
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    useChatStore.getState().addSession(s)
    useChatStore.setState({ activeId: s.id, messages: [] })
  }

  const selectSession = async (id: string) => {
    const { sessions } = useChatStore.getState()
    const session = sessions.find(s => s.id === id)
    if (!session) return

    useChatStore.setState({ activeId: id })

    if (session.messages.length > 0 || loadedRef.current.has(id)) {
      useChatStore.setState({ messages: session.messages })
      return
    }

    if (userRef.current) {
      const rows = await historyApi.getMessages(id)
      const msgs = (rows ?? []).map(rowToMessage)
      loadedRef.current.add(id)
      useChatStore.setState({ messages: msgs })
      useChatStore.getState().updateSession(id, { messages: msgs })
    }
  }

  const deleteSession = (id: string) => {
    const { sessions, activeId } = useChatStore.getState()
    useChatStore.getState().removeSession(id)
    if (userRef.current) historyApi.deleteSession(id).catch(console.error)

    if (activeId === id) {
      const rest = sessions.filter(s => s.id !== id)
      if (rest.length) {
        useChatStore.setState({ activeId: rest[0].id, messages: rest[0].messages })
      } else {
        useChatStore.setState({ activeId: null, messages: [] })
      }
    }
  }

  return { user, authLoading, userRef, loadedRef, newChat, selectSession, deleteSession }
}
