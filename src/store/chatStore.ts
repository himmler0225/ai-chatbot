import { create } from 'zustand'
import type { ChatSession, Message } from '@/src/types/chat'

interface ChatState {
  sessions: ChatSession[]
  activeId: string | null
  messages: Message[]
  isStreaming: boolean
  activeTool: string | null
  input: string
  guestMsgCount: number
}

interface ChatActions {
  set: (patch: Partial<ChatState>) => void
  addSession: (s: ChatSession) => void
  removeSession: (id: string) => void
  updateSession: (id: string, patch: Partial<Omit<ChatSession, 'id'>>) => void
  appendToMessage: (id: string, delta: string) => void
  patchMessage: (id: string, patch: Partial<Message>) => void
  reset: () => void
}

const INIT: ChatState = {
  sessions: [],
  activeId: null,
  messages: [],
  isStreaming: false,
  activeTool: null,
  input: '',
  guestMsgCount: 0,
}

export const useChatStore = create<ChatState & ChatActions>(set => ({
  ...INIT,

  set: patch => set(patch),

  addSession: s => set(st => ({ sessions: [s, ...st.sessions] })),

  removeSession: id => set(st => ({ sessions: st.sessions.filter(s => s.id !== id) })),

  updateSession: (id, patch) =>
    set(st => ({
      sessions: st.sessions.map(s => (s.id === id ? { ...s, ...patch } : s)),
    })),

  appendToMessage: (id, delta) =>
    set(st => ({
      messages: st.messages.map(m => (m.id === id ? { ...m, content: m.content + delta } : m)),
    })),

  patchMessage: (id, patch) =>
    set(st => ({
      messages: st.messages.map(m => (m.id === id ? { ...m, ...patch } : m)),
    })),

  reset: () => set(INIT),
}))
