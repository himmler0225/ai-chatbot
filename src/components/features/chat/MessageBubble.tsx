'use client'

import { memo } from 'react'
import { Avatar, Button, Flex, Grid, Tooltip, theme } from 'antd'
import { RobotOutlined, UserOutlined, SoundOutlined, PauseOutlined, ReloadOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useTranslation } from 'react-i18next'
import '@/i18n/config'
import type { Message } from '@/types/chat'
import SourceChips from './SourceChips'
import ReviewSummary from './ReviewSummary'
import { VideoChart } from './VideoChart'
import StreamingStatus from './StreamingStatus'
import { useChatShell, assistantBubbleRadius, userBubbleRadius } from '@/constants/chat-shell-theme'

const { useBreakpoint } = Grid

interface Props {
  msg: Message
  isStreaming?: boolean
  activeTool?: string | null
  activeToolDetail?: string | null
  onSpeak?: (id: string, text: string) => void
  isSpeaking?: boolean
  canSpeak?: boolean
  onRetry?: () => void
}

function Timestamp({ ts, light }: { ts: Date; light?: boolean }) {
  const time = new Date(ts).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  return (
    <span style={{ fontSize: 10, opacity: light ? 0.65 : 0.45, color: light ? '#fff' : 'inherit', whiteSpace: 'nowrap', marginLeft: 8, alignSelf: 'flex-end', flexShrink: 0 }}>
      {time}
    </span>
  )
}

function MessageBubbleInner({ msg, isStreaming, activeTool, activeToolDetail, onSpeak, isSpeaking, canSpeak, onRetry }: Props) {
  const { t } = useTranslation()
  const { token } = theme.useToken()
  const c = useChatShell()
  const screens = useBreakpoint()
  const isMobile = !screens.md
  const isUser = msg.role === 'user'

  if (!isUser && !msg.content && !msg.reviewSummary && !msg.videos?.length && !isStreaming && !msg.cancelled) return null

  const showStreamingStatus = isStreaming && (!msg.content || activeTool || activeToolDetail)

  return (
    <motion.div
      initial={isStreaming ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <Flex
        gap={12}
        align="flex-start"
        style={{ flexDirection: isUser ? 'row-reverse' : 'row', margin: isMobile ? '12px 0' : '16px 0' }}
      >
        <Avatar
          size={34}
          icon={isUser ? <UserOutlined /> : <RobotOutlined />}
          className="shrink-0"
          style={{
            background: isUser ? c.accent : c.assistantBubbleBg,
            color: isUser ? '#fff' : c.accent,
            border: isUser ? 'none' : `1px solid ${c.border}`,
          }}
        />

        <div className="min-w-0" style={{ maxWidth: isMobile ? 'min(88%, 600px)' : 'min(80%, 600px)' }}>
          {isUser ? (
            <div
              className="text-sm leading-relaxed break-words whitespace-pre-wrap text-white"
              style={{ background: c.accent, boxShadow: '0 1px 2px rgba(37,99,235,0.2)', padding: '10px 16px', borderRadius: userBubbleRadius }}
            >
              {msg.content}
              <span className="float-right ml-3 mt-1 text-[10px] text-white/65 select-none">
                {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ) : (
            <div
              className="assistant-bubble"
              style={{ background: c.assistantBubbleBg, color: c.text, padding: '12px 16px', borderRadius: assistantBubbleRadius, border: `1px solid ${c.border}`, minHeight: isStreaming ? 44 : undefined }}
            >
              <div className="message-content">
                {showStreamingStatus && (
                  <StreamingStatus tool={activeTool} detail={activeToolDetail} compact={!!msg.content} />
                )}

                {msg.content ? (
                  <>
                    {isStreaming ? (
                      <div className="streaming-text text-sm leading-relaxed">
                        {msg.content}
                        <span className="streaming-cursor" aria-hidden />
                      </div>
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          table: ({ children }) => (
                            <div className="md-table-wrap"><table>{children}</table></div>
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </>
                ) : null}
              </div>

              {!isStreaming && !!msg.reviewSummary && (
                <ReviewSummary markdown={msg.reviewSummary} />
              )}

              {!!msg.videos?.length && <VideoChart videos={msg.videos} />}
              {!isStreaming && !!msg.sources?.length && <SourceChips sources={msg.sources} />}
              {msg.cancelled && (
                <Flex align="center" gap={8} style={{ marginTop: msg.content ? 8 : 0, opacity: 0.6 }}>
                  <span style={{ fontSize: 12 }}>{t('chat.cancelled')}</span>
                  {onRetry && (
                    <Tooltip title={t('chat.retryTooltip')}>
                      <Button
                        type="text"
                        size="small"
                        icon={<ReloadOutlined />}
                        onClick={onRetry}
                        style={{ color: token.colorPrimary, padding: '0 4px', height: 22 }}
                      />
                    </Tooltip>
                  )}
                </Flex>
              )}
              {!isStreaming && (
                <Flex align="center" justify="space-between" style={{ marginTop: 6 }}>
                  {canSpeak ? (
                    <Tooltip title={isSpeaking ? 'Dừng đọc' : 'Đọc nội dung'}>
                      <Button type="text" size="small"
                        icon={isSpeaking ? <PauseOutlined /> : <SoundOutlined />}
                        onClick={() => onSpeak?.(msg.id, [msg.content, msg.reviewSummary].filter(Boolean).join('\n\n'))}
                        style={{ color: token.colorTextSecondary, width: 24, height: 24, minWidth: 24 }}
                      />
                    </Tooltip>
                  ) : <span />}
                  <Timestamp ts={msg.timestamp} />
                </Flex>
              )}
            </div>
          )}
        </div>
      </Flex>
    </motion.div>
  )
}

function bubblePropsEqual(prev: Props, next: Props): boolean {
  return (
    prev.msg.id === next.msg.id
    && prev.msg.content === next.msg.content
    && prev.msg.reviewSummary === next.msg.reviewSummary
    && prev.msg.cancelled === next.msg.cancelled
    && prev.msg.videos === next.msg.videos
    && prev.msg.sources === next.msg.sources
    && prev.isStreaming === next.isStreaming
    && prev.activeTool === next.activeTool
    && prev.activeToolDetail === next.activeToolDetail
    && prev.isSpeaking === next.isSpeaking
    && prev.canSpeak === next.canSpeak
  )
}

export default memo(MessageBubbleInner, bubblePropsEqual)
