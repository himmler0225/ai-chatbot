'use client'

import type { Source } from '@/src/types/chat'

const ICON: Record<string, string> = {
  video:   '▶',
  search:  '🔍',
  reviews: '💬',
  product: '🛒',
}

interface Props { sources: Source[] }

export default function SourceChips({ sources }: Props) {
  if (!sources?.length) return null

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {sources.map((s, i) => (
        <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-xs no-underline
                     max-w-[220px] overflow-hidden whitespace-nowrap text-ellipsis"
          style={{
            background: 'rgba(16,163,127,0.12)',
            border:     '1px solid rgba(16,163,127,0.25)',
            color:      '#10a37f',
          }}>
          <span>{ICON[s.type] ?? '🔗'}</span>
          <span className="overflow-hidden text-ellipsis">{s.label}</span>
        </a>
      ))}
    </div>
  )
}
