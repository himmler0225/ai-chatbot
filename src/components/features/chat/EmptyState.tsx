'use client'

import { Flex, Grid, theme } from 'antd'
import { useTranslation } from 'react-i18next'
import { useChatStore } from '@/stores/chatStore'
import { useTheme } from '@/contexts/theme'
import { CHAT_DARK } from '@/lib/theme'

const { useBreakpoint } = Grid

interface Props {
  onSuggestion?: (text: string) => void
  onOpenProductPanel?: (store?: 'tiki' | 'fpt') => void
}

export default function EmptyState({ onSuggestion }: Props) {
  const { token } = theme.useToken()
  const { isDark } = useTheme()
  const { t } = useTranslation()
  const isStreaming = useChatStore(s => s.isStreaming)
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const raw = t('chat.suggestions', { returnObjects: true })
  const suggestions = Array.isArray(raw) ? (raw as string[]) : []

  const chipBorder = isDark ? CHAT_DARK.borderSubtle : token.colorBorderSecondary
  const chipBg = isDark ? CHAT_DARK.elevated : token.colorBgContainer
  const chipHover = isDark ? CHAT_DARK.input : token.colorFillSecondary

  if (suggestions.length === 0) return null

  return (
    <Flex
      vertical
      align="center"
      justify="center"
      style={{
        flex: 1,
        width: '100%',
        minHeight: isMobile ? '36vh' : '44vh',
        padding: isMobile ? '24px 20px' : '32px 24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 520,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {suggestions.map(text => (
          <button
            key={text}
            type="button"
            disabled={isStreaming || !onSuggestion}
            onClick={() => onSuggestion?.(text)}
            onMouseEnter={e => {
              if (!isStreaming) e.currentTarget.style.background = chipHover
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = chipBg
            }}
            style={{
              width: '100%',
              padding: '11px 16px',
              borderRadius: 12,
              border: `1px solid ${chipBorder}`,
              background: chipBg,
              color: token.colorTextSecondary,
              fontSize: isMobile ? 16 : 14,
              lineHeight: 1.5,
              textAlign: 'left',
              cursor: isStreaming ? 'not-allowed' : 'pointer',
              opacity: isStreaming ? 0.55 : 1,
              transition: 'background 0.15s',
            }}
          >
            {text}
          </button>
        ))}
      </div>
    </Flex>
  )
}
