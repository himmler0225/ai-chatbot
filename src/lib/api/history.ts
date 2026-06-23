'use client'

import axios, { type AxiosInstance } from 'axios'
import { BaseApi, installGuardInterceptor } from '@/lib/api/client'
import { clientGuardHeaders } from '@/lib/guard/client-headers'
import { getSupabase } from '@/lib/supabase'
import type { ChatSession, Message } from '@/types/chat'
import type { SessionRow, MessageRow } from '@/types/history'

export type { SessionRow, MessageRow }

const historyClient: AxiosInstance = axios.create({
  baseURL: '/api/history',
  headers: { 'Content-Type': 'application/json', ...clientGuardHeaders() },
  timeout: 30_000,
})
installGuardInterceptor(historyClient)

async function authHeaders(): Promise<Record<string, string> | null> {
  const { data } = await getSupabase().auth.getSession()
  const token = data.session?.access_token
  if (!token) return null
  return { Authorization: `Bearer ${token}` }
}

class HistoryApi extends BaseApi {
  constructor() {
    super('', historyClient)
  }

  private async req<T>(
    path: string,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    body?: unknown,
  ): Promise<T | null> {
    const headers = await authHeaders()
    if (!headers) return null
    try {
      let raw: { data?: T }
      switch (method) {
        case 'GET':
          raw = await this.get(path, { headers })
          break
        case 'POST':
          raw = await this.post(path, body, { headers })
          break
        case 'PATCH':
          raw = await this.patch(path, body, { headers })
          break
        case 'DELETE':
          raw = await this.delete(path, { headers })
          break
      }
      return raw.data ?? null
    } catch {
      return null
    }
  }

  listSessions() {
    return this.req<SessionRow[]>('/sessions', 'GET')
  }

  upsertSession(s: ChatSession) {
    return this.req('/sessions', 'POST', {
      id: s.id,
      title: s.title,
      created_at: s.createdAt.toISOString(),
      updated_at: s.updatedAt.toISOString(),
    })
  }

  patchSession(id: string, title: string) {
    return this.req(`/sessions/${id}`, 'PATCH', { title })
  }

  deleteSession(id: string) {
    return this.req(`/sessions/${id}`, 'DELETE')
  }

  getMessages(sessionId: string) {
    return this.req<MessageRow[]>(`/sessions/${sessionId}/messages`, 'GET')
  }

  saveMessages(sessionId: string, msgs: MessageRow[]) {
    return this.req(`/sessions/${sessionId}/messages`, 'POST', msgs)
  }
}

export const historyApi = new HistoryApi()

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
    cancelled: m.metadata?.cancelled,
  }
}

export function messageToRow(msg: Message, _sessionId: string): MessageRow {
  return {
    id: msg.id,
    role: msg.role,
    content: msg.content,
    metadata: {
      usedTools: msg.usedTools,
      reviewSummary: msg.reviewSummary ?? undefined,
      sources: msg.sources,
      videos: msg.videos,
      cancelled: msg.cancelled,
    },
    created_at: msg.timestamp.toISOString(),
  }
}
