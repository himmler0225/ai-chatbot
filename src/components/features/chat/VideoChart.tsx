'use client'

import { Flex, theme, Typography } from 'antd'
import { YoutubeOutlined } from '@ant-design/icons'
import type { VideoData } from '@/types/chat'

const { Text } = Typography

function fmtViews(n?: number): string {
  if (!n) return ''
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${Math.round(n / 1_000)}K`
  return String(n)
}

interface Props {
  videos: VideoData[]
}

export function VideoChart({ videos }: Props) {
  const { token } = theme.useToken()
  if (!videos.length) return null

  const maxViews = Math.max(...videos.map(v => v.views ?? 0), 1)

  return (
    <div className="mt-3 rounded-xl overflow-hidden"
      style={{ border: `1px solid ${token.colorBorderSecondary}` }}>
      {/* Header */}
      <Flex align="center" gap={6} className="px-3 py-2"
        style={{ background: token.colorBgElevated, borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
        <YoutubeOutlined style={{ color: '#ff0000', fontSize: 14 }} />
        <Text style={{ fontSize: 11, fontWeight: 600, color: token.colorTextSecondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {videos.length} video phân tích
        </Text>
      </Flex>

      {/* Rows */}
      {videos.map((v, i) => {
        const pct = maxViews > 0 ? Math.round(((v.views ?? 0) / maxViews) * 100) : 0
        const isLast = i === videos.length - 1

        return (
          <a key={v.video_id ?? i}
            href={v.source_url ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 items-center no-underline group"
            style={{
              padding: '10px 12px',
              background: 'transparent',
              borderBottom: isLast ? 'none' : `1px solid ${token.colorBorderSecondary}`,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = token.colorBgElevated)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            {/* Thumbnail */}
            <div className="shrink-0 rounded-lg overflow-hidden"
              style={{ width: 80, height: 45, background: token.colorBgElevated }}>
              {v.thumbnail
                ? <img src={v.thumbnail} alt="" className="w-full h-full object-cover"
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                : <div className="w-full h-full flex items-center justify-center">
                    <YoutubeOutlined style={{ color: '#ff0000', fontSize: 18 }} />
                  </div>
              }
            </div>

            {/* Info + bar */}
            <div className="flex-1 min-w-0">
              <Text className="block text-[12px] font-medium truncate" style={{ color: token.colorText }}>
                {v.title ?? v.video_id}
              </Text>
              {v.channel && (
                <Text className="block text-[11px] truncate mb-1.5" style={{ color: token.colorTextSecondary }}>
                  {v.channel}
                </Text>
              )}
              {/* Bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-full overflow-hidden" style={{ height: 6, background: token.colorBgElevated }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: `linear-gradient(90deg, #ff4444, #ff0000)` }} />
                </div>
                {v.views ? (
                  <Text style={{ fontSize: 11, color: token.colorTextSecondary, minWidth: 36, textAlign: 'right' }}>
                    {fmtViews(v.views)}
                  </Text>
                ) : null}
              </div>
            </div>
          </a>
        )
      })}
    </div>
  )
}
