
export interface Tool {
  name: string
  label?: string
  icon?: string
}

export interface Source {
  label:     string
  url:       string
  type:      'product' | 'search' | 'reviews' | 'video'
  thumbnail?: string
  channel?:  string
  views?:    string
  platform?: 'youtube' | 'tiktok'
}


export interface VideoData {
  video_id: string
  title?: string
  channel?: string
  views?: number
  thumbnail?: string
  source_url?: string
  platform?: 'youtube' | 'tiktok'
  comment_count?: number
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  usedTools?: Tool[]
  reviewSummary?: string | null
  sources?: Source[]
  videos?: VideoData[]
  cancelled?: boolean
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}


export interface HistoryMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ProductContext {
  name: string
  price?: string
  url?: string
  store?: 'tiki' | 'fpt'
}

export interface ChatPayload {
  message: string
  history: HistoryMessage[]
  product?: ProductContext
}

export interface ChatResponse {
  message: string
  reviewSummary: string | null
  sources: Source[]
  usedTools: Tool[]
  products?: unknown[]
}


export interface ShortenRequest {
  url: string
  provider?: 'tinyurl' | 'isgd'
}

export interface ShortenResult {
  original: string
  short: string
  provider: string
}

export interface QRRequest {
  url: string
  size?: number
  theme?: 'default' | 'green' | 'dark'
  rounded?: boolean
}

export interface QRResult {
  url: string
  image: string
  theme: string
  size: number
}


export interface ApiResponse<T> {
  success: boolean
  data: T
  error: string | null
  meta: Record<string, unknown>
}
