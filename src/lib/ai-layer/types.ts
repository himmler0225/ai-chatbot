import type { Source } from '@/src/types/chat'

export interface AgentResult {
  result: string
  data: { review_summary: string | null; sources: Source[]; products: unknown[] }
  tool_calls: { tool: string }[]
  iterations: number
}
