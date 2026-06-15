'use client'
import { supabase } from '@/src/lib/supabase'
import type { ChatSession, Message } from '@/src/types/chat'
import type { SessionRow, MessageRow } from '@/src/types/history'

export type { SessionRow, MessageRow }

const BASE = process.env.NEXT_PUBLIC_AI_LAYER_URL ?? 'http://localhost:8001'
const KEY = process.env.NEXT_PUBLIC_AI_LAYER_KEY ?? ''

async function headers(): Promise<HeadersInit | null> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) return null
  return { 'Content-Type': 'application/json', 'X-API-Key': KEY, Authorization: `Bearer ${token}` }
}

async function req<T>(path: string, init?: RequestInit): Promise<T | null> {
  const h = await headers()
  if (!h) return null
  try {
    const r = await fetch(`${BASE}/ai${path}`, { ...init, headers: h })
    if (!r.ok) return null
    const json = await r.json()
    return (json.data ?? null) as T
  } catch {
    return null
  }
}

export const historyApi = {
  listSessions: () => req<SessionRow[]>('/history/sessions'),

  upsertSession: (s: ChatSession) =>
    req('/history/sessions', {
      method: 'POST',
      body: JSON.stringify({
        id: s.id,
        title: s.title,
        created_at: s.createdAt.toISOString(),
        updated_at: s.updatedAt.toISOString(),
      }),
    }),

  patchSession: (id: string, title: string) =>
    req(`/history/sessions/${id}`, { method: 'PATCH', body: JSON.stringify({ title }) }),

  deleteSession: (id: string) => req(`/history/sessions/${id}`, { method: 'DELETE' }),

  getMessages: (sessionId: string) => req<MessageRow[]>(`/history/sessions/${sessionId}/messages`),

  saveMessages: (sessionId: string, msgs: MessageRow[]) =>
    req(`/history/sessions/${sessionId}/messages`, { method: 'POST', body: JSON.stringify(msgs) }),
}

export function rowToMessage(m: MessageRow): Message {
  return {
    id: m.id,
    role: m.role,
    content: m.content,
    timestamp: new Date(m.created_at),
    usedTools: m.metadata?.usedTools,
    reviewSummary: m.metadata?.reviewSummary,
    sources: m.metadata?.sources,
    videos: m.metadata?.videos,
  }
}

export function messageToRow(msg: Message, _sessionId: string): MessageRow {
  return {
    id: msg.id,
    role: msg.role,
    content: msg.content,
    metadata: {
      usedTools:     msg.usedTools,
      reviewSummary: msg.reviewSummary ?? undefined,
      sources:       msg.sources,
      videos:        msg.videos,
    },
    created_at: msg.timestamp.toISOString(),
  }
}
