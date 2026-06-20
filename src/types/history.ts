import type { Message } from '@/types/chat'

export interface SessionRow {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export interface MessageRow {
  id: string
  role: 'user' | 'assistant'
  content: string
  metadata: {
    usedTools?: Message['usedTools']
    reviewSummary?: Message['reviewSummary']
    sources?: Message['sources']
    videos?: Message['videos']
    cancelled?: Message['cancelled']
  } | null
  created_at: string
}
