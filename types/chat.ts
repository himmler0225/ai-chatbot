export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  usedTools?: Tool[]
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface ChatRequest {
  message: string
}

export interface ChatResponse {
  message: string
  usedTools: string[]
}
