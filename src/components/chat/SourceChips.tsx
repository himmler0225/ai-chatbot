'use client'
import { CommentOutlined, LinkOutlined, SearchOutlined, ShoppingCartOutlined, YoutubeOutlined } from '@ant-design/icons'

import { theme } from 'antd'
import type { Source } from '@/src/types/chat'

const PLATFORM_COLOR: Record<string, string> = {
  youtube: '#ff0000',
  tiktok:  '#010101',
}

const TYPE_ICON: Record<string, React.ReactElement> = {
  search:  <SearchOutlined />,
  reviews: <CommentOutlined />,
  product: <ShoppingCartOutlined />,
}

interface Props {
  sources: Source[]
}

export default function SourceChips({ sources }: Props) {
  const { token } = theme.useToken()
  if (!sources?.length) return null

  const videos = sources.filter(s => s.type === 'video' && s.thumbnail)
  const chips  = sources.filter(s => s.type !== 'video' || !s.thumbnail)

  return (
    <div className="mt-3 flex flex-col gap-2">
      {videos.length > 0 && (
        <div className="relative">
          <div className="video-scroll flex gap-2 overflow-x-auto pb-2">
            {videos.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="video-card flex-shrink-0 rounded-xl overflow-hidden no-underline"
                style={{ background: token.colorBgContainer, border: `1px solid ${token.colorBorderSecondary}` }}
              >
                <div className="relative" style={{ aspectRatio: '16/9', background: token.colorBgElevated }}>
                  <img src={s.thumbnail} alt={s.label} className="w-full h-full object-cover" loading="lazy"
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                  {s.platform && (
                    <span className="absolute bottom-1 right-1 text-white text-[11px] px-1.5 py-0.5 rounded flex items-center gap-0.5"
                      style={{ background: PLATFORM_COLOR[s.platform] ?? '#333', opacity: 0.9 }}>
                      {s.platform === 'youtube' ? <YoutubeOutlined /> : 'TT'}
                    </span>
                  )}
                </div>
                <div className="px-2.5 py-2">
                  <p className="text-[12px] font-medium leading-snug line-clamp-2 mb-1" style={{ color: token.colorText }}>
                    {s.label}
                  </p>
                  {(s.channel || s.views) && (
                    <p className="text-[11px] truncate" style={{ color: token.colorTextSecondary }}>
                      {[s.channel, s.views].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
          {/* Right-fade scroll hint */}
          {videos.length > 2 && (
            <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-8 rounded-r-xl"
              style={{ background: `linear-gradient(to right, transparent, ${token.colorBgElevated}88)` }} />
          )}
        </div>
      )}

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {chips.map((s, i) => (
            <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-xs no-underline max-w-[220px] overflow-hidden whitespace-nowrap text-ellipsis"
              style={{ background: 'rgba(16,163,127,0.1)', border: '1px solid rgba(16,163,127,0.25)', color: '#10a37f' }}>
              <span>{TYPE_ICON[s.type] ?? <LinkOutlined />}</span>
              <span className="overflow-hidden text-ellipsis">{s.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
