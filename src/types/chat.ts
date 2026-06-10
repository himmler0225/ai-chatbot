// ── Shared ────────────────────────────────────────────────────────────────────

export interface Tool {
  name:   string
  label?: string
  icon?:  string
}

export interface Source {
  label: string
  url:   string
  type:  'product' | 'search' | 'reviews' | 'video'
}

// ── Session / Message ─────────────────────────────────────────────────────────

export interface Message {
  id:            string
  role:          'user' | 'assistant'
  content:       string
  timestamp:     Date
  usedTools?:    Tool[]
  reviewSummary?: string | null
  sources?:      Source[]
}

export interface ChatSession {
  id:        string
  title:     string
  messages:  Message[]
  createdAt: Date
  updatedAt: Date
}

// ── Chat API ──────────────────────────────────────────────────────────────────

export interface HistoryMessage {
  role:    'user' | 'assistant'
  content: string
}

export interface ChatPayload {
  message: string
  history: HistoryMessage[]
}

export interface ChatResponse {
  message:       string
  reviewSummary: string | null
  sources:       Source[]
  usedTools:     Tool[]
  products?:     unknown[]
}

// ── Utilities API ─────────────────────────────────────────────────────────────

export interface ShortenRequest {
  url:       string
  provider?: 'tinyurl' | 'isgd'
}

export interface ShortenResult {
  original: string
  short:    string
  provider: string
}

export interface QRRequest {
  url:      string
  size?:    number
  theme?:   'default' | 'green' | 'dark'
  rounded?: boolean
}

export interface QRResult {
  url:   string
  image: string
  theme: string
  size:  number
}

// ── ApiResponse wrapper (from backend) ────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  data:    T
  error:   string | null
  meta:    Record<string, unknown>
}
