import { useCallback, useRef } from 'react'
import type { ChatPayload, Source, Tool, VideoData } from '@/src/types/chat'

export interface StreamCallbacks {
  onTextDelta: (delta: string) => void
  onToolStart: (tool: string) => void
  onToolDone: (tool: string) => void
  onDone: (meta: { reviewSummary: string | null; sources: Source[]; usedTools: Tool[]; videos: VideoData[] }) => void
  onError: (message: string) => void
}

type SseEvent =
  | { type: 'text_delta'; delta: string }
  | { type: 'tool_start'; tool: string }
  | { type: 'tool_done'; tool: string }
  | {
      type: 'done'
      data: { review_summary: string | null; sources: Source[]; videos: VideoData[]; products: unknown[] }
      tool_calls: { tool: string }[]
    }
  | { type: 'error'; message: string }

export function useAgentStream() {
  const abortRef = useRef<AbortController | null>(null)

  const stream = useCallback(async (payload: ChatPayload, cb: StreamCallbacks) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    let resp: Response
    try {
      resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
    } catch (err) {
      if ((err as Error).name !== 'AbortError') cb.onError((err as Error).message)
      return
    }

    if (!resp.body) {
      cb.onError('No response body')
      return
    }

    const reader = resp.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        try {
          const event = JSON.parse(line.slice(6)) as SseEvent
          switch (event.type) {
            case 'text_delta':
              cb.onTextDelta(event.delta)
              break
            case 'tool_start':
              cb.onToolStart(event.tool)
              break
            case 'tool_done':
              cb.onToolDone(event.tool)
              break
            case 'done':
              cb.onDone({
                reviewSummary: event.data?.review_summary ?? null,
                sources: event.data?.sources ?? [],
                videos: event.data?.videos ?? [],
                usedTools: (event.tool_calls ?? []).map(t => ({
                  name: t.tool,
                  label: t.tool,
                  icon: '🔧',
                })),
              })
              break
            case 'error':
              cb.onError(event.message)
              break
          }
        } catch {
          /* malformed SSE line — skip */
        }
      }
    }
  }, [])

  const abort = useCallback(() => abortRef.current?.abort(), [])

  return { stream, abort }
}
