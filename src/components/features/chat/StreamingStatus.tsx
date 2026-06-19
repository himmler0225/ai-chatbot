'use client'

import { Flex, theme } from 'antd'
import { useTranslation } from 'react-i18next'
import { TOOL_LABELS } from '@/constants/chat'
import '@/i18n/config'

interface Props {
  tool?: string | null
  compact?: boolean
}

export default function StreamingStatus({ tool, compact = false }: Props) {
  const { token } = theme.useToken()
  const { t, i18n } = useTranslation()
  const locale = i18n.language === 'en' ? 'en' : 'vi'

  const info = tool ? TOOL_LABELS[tool] : null
  const icon = info?.icon ?? '✨'
  const label = info?.[locale] ?? t('chat.thinking')

  return (
    <Flex
      align="center"
      gap={8}
      style={{
        padding: compact ? '4px 0 8px' : 0,
        minHeight: compact ? undefined : 24,
      }}
    >
      <span style={{ fontSize: compact ? 13 : 15, flexShrink: 0 }}>{icon}</span>
      <span
        className="stream-status-text"
        style={{
          fontSize: compact ? 12 : 13,
          color: token.colorTextSecondary,
        }}
      >
        {label}
      </span>
      {!compact && (
        <Flex gap={3} align="center">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="stream-status-dot"
              style={{
                background: token.colorPrimary,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </Flex>
      )}
    </Flex>
  )
}
