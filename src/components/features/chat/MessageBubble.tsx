'use client'

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

const { useBreakpoint } = Grid

interface Props {
  msg: Message
  isStreaming?: boolean
  activeTool?: string | null
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

export default function MessageBubble({ msg, isStreaming, activeTool, onSpeak, isSpeaking, canSpeak, onRetry }: Props) {
  const { t } = useTranslation()
  const { token } = theme.useToken()
  const screens = useBreakpoint()
  const isMobile = !screens.md
  const isUser = msg.role === 'user'

  if (!isUser && !msg.content && !isStreaming && !msg.cancelled) return null

  const showStreamingStatus = isStreaming && (!msg.content || activeTool)

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
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
            background: isUser ? token.colorPrimary : token.colorBgElevated,
            color: isUser ? '#fff' : token.colorPrimary,
            border: isUser ? 'none' : `1px solid ${token.colorPrimary}`,
          }}
        />

        <div className="min-w-0" style={{ maxWidth: isMobile ? 'min(88%, 600px)' : 'min(80%, 600px)' }}>
          {isUser ? (
            <div
              className="text-sm leading-relaxed break-words whitespace-pre-wrap text-white"
              style={{ background: token.colorPrimary, boxShadow: '0 1px 2px rgba(0,0,0,0.12)', padding: '10px 16px', borderRadius: '18px 18px 18px 18px' }}
            >
              {msg.content}
              <span className="float-right ml-3 mt-1 text-[10px] text-white/65 select-none">
                {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ) : (
            <div
              className="text-sm leading-relaxed break-words"
              style={{ background: token.colorBgElevated, color: token.colorText, padding: '12px 16px', borderRadius: '18px 18px 18px 18px', minHeight: isStreaming ? 44 : undefined }}
            >
              <div className="message-content">
                {showStreamingStatus && (
                  <StreamingStatus tool={activeTool} compact={!!msg.content} />
                )}

                {msg.content ? (
                  <>
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
                    {isStreaming && <span className="streaming-cursor" />}
                  </>
                ) : null}
              </div>

              {!!msg.videos?.length && <VideoChart videos={msg.videos} />}
              {!isStreaming && msg.reviewSummary && <ReviewSummary markdown={msg.reviewSummary} />}
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
                        onClick={() => onSpeak?.(msg.id, msg.content)}
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
