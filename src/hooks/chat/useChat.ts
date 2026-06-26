import { useCallback, useRef } from 'react'
import type { ChatPayload, Source, Tool, VideoData } from '@/types/chat'
import { chatApi } from '@/lib/api/chat'
import i18n from '@/i18n/config'
import { normalizeLocale } from '@/i18n/locale'

export interface StreamCallbacks {
  onTextDelta: (delta: string) => void
  onToolStart: (tool: string, detail: string) => void
  onToolDone: (tool: string) => void
  onStatus: (detail: string) => void
  onDataPreview: (videos: VideoData[]) => void
  onDone: (meta: {
    sources: Source[]
    usedTools: Tool[]
    videos: VideoData[]
    reviewSummary: string | null
  }) => void
  onError: (message: string) => void
}

type SseEvent =
  | { type: 'text_delta'; delta: string }
  | { type: 'tool_start'; tool: string; detail_vi?: string; detail_en?: string }
  | { type: 'tool_done'; tool: string }
  | { type: 'status'; detail_vi?: string; detail_en?: string }
  | { type: 'data_preview'; videos: VideoData[] }
  | {
      type: 'done'
      data: { review_summary: string | null; sources: Source[]; videos: VideoData[]; products: unknown[] }
      tool_calls: { tool: string }[]
    }
  | { type: 'error'; message: string }

function pickDetail(event: { detail_vi?: string; detail_en?: string }, locale: string): string {
  return (locale === 'en' ? event.detail_en : event.detail_vi) ?? event.detail_vi ?? event.detail_en ?? ''
}

export function useAgentStream() {
  const abortRef = useRef<AbortController | null>(null)

  const stream = useCallback(async (payload: ChatPayload, cb: StreamCallbacks) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    let resp: Response
    try {
      resp = await chatApi.fetchStream(payload, controller.signal)
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

    try {
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
          const locale = normalizeLocale(i18n.language)
          switch (event.type) {
            case 'text_delta':
              cb.onTextDelta(event.delta)
              break
            case 'tool_start': {
              const detail = pickDetail(event, locale)
              cb.onToolStart(event.tool, detail)
              break
            }
            case 'status': {
              const detail = pickDetail(event, locale)
              if (detail) cb.onStatus(detail)
              break
            }
            case 'tool_done':
              cb.onToolDone(event.tool)
              break
            case 'data_preview':
              cb.onDataPreview(event.videos ?? [])
              break
            case 'done':
              cb.onDone({
                sources: event.data?.sources ?? [],
                videos: event.data?.videos ?? [],
                reviewSummary: event.data?.review_summary ?? null,
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
    } catch (err) {
      if ((err as Error).name !== 'AbortError') cb.onError((err as Error).message)
    }
  }, [])

  const abort = useCallback(() => abortRef.current?.abort(), [])

  return { stream, abort }
}
