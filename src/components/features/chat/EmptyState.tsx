'use client'

import { Avatar, Flex, Grid, Typography, theme } from 'antd'
import { RobotOutlined, ShopOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import '@/i18n/config'
import { useChatStore } from '@/stores/chatStore'
import { PRIM } from '@/constants/brand'

const { Title } = Typography
const { useBreakpoint } = Grid

const FALLBACK_SUGGESTIONS = [
  'Người dùng nói gì về iPhone 16 Pro Max?',
  'Review Samsung Galaxy S24 trên YouTube có đáng mua không?',
  'So sánh MacBook Air M3 vs Dell XPS trên TikTok',
]

interface Props {
  onSuggestion: (text: string) => void
  onOpenProductPanel?: (store?: 'tiki' | 'fpt') => void
}

export default function EmptyState({ onSuggestion, onOpenProductPanel }: Props) {
  const { token } = theme.useToken()
  const { t } = useTranslation()
  const isStreaming = useChatStore(s => s.isStreaming)
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const raw = t('chat.suggestions', { returnObjects: true })
  const suggestions = Array.isArray(raw) ? raw : FALLBACK_SUGGESTIONS

  const storeChipStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '9px 16px',
    borderRadius: 999,
    border: `1px solid ${token.colorBorderSecondary}`,
    background: token.colorBgContainer,
    color: token.colorText,
    fontSize: 13,
    fontWeight: 500,
    lineHeight: 1.4,
    cursor: isStreaming ? 'not-allowed' : 'pointer',
    opacity: isStreaming ? 0.55 : 1,
    transition: 'background 0.15s, border-color 0.15s, color 0.15s',
  }

  return (
    <Flex
      vertical
      align="center"
      justify="center"
      style={{
        flex: 1,
        width: '100%',
        padding: isMobile ? '24px 0' : '32px 24px',
        paddingBottom: isMobile ? 48 : '12vh',
      }}
    >
      {!isMobile && (
        <Avatar
          size={52}
          icon={<RobotOutlined />}
          style={{ background: token.colorPrimary, marginBottom: 20 }}
        />
      )}

      <Title
        level={3}
        style={{
          margin: 0,
          fontWeight: 600,
          textAlign: 'center',
          fontSize: isMobile ? 'clamp(20px, 5.5vw, 26px)' : 28,
        }}
      >
        {t('chat.greeting')}
      </Title>

      <div
        style={{
          marginTop: 20,
          paddingLeft: 16,
          paddingRight: 16,
          width: '100%',
          maxWidth: 640,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {suggestions.map(text => (
          <button
            key={text}
            type="button"
            disabled={isStreaming}
            onClick={() => onSuggestion(text)}
            onMouseEnter={e => {
              if (!isStreaming) e.currentTarget.style.background = token.colorFillSecondary
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = token.colorBgContainer
            }}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 16,
              border: `1px solid ${token.colorBorderSecondary}`,
              background: token.colorBgContainer,
              color: token.colorText,
              fontSize: 14,
              lineHeight: 1.5,
              textAlign: 'left',
              cursor: isStreaming ? 'not-allowed' : 'pointer',
              opacity: isStreaming ? 0.6 : 1,
              transition: 'background 0.15s',
            }}
          >
            {text}
          </button>
        ))}
      </div>

      {onOpenProductPanel && (
        <Flex gap={10} wrap="wrap" justify="center" style={{ marginTop: 20, maxWidth: 640, padding: '0 16px' }}>
          <button
            type="button"
            disabled={isStreaming}
            onClick={() => onOpenProductPanel('tiki')}
            onMouseEnter={e => {
              if (!isStreaming) {
                e.currentTarget.style.background = token.colorPrimaryBg
                e.currentTarget.style.borderColor = token.colorPrimaryBorder
                e.currentTarget.style.color = PRIM
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = token.colorBgContainer
              e.currentTarget.style.borderColor = token.colorBorderSecondary
              e.currentTarget.style.color = token.colorText
            }}
            style={storeChipStyle}
          >
            <ShopOutlined style={{ fontSize: 14, opacity: 0.75 }} />
            {t('chat.findOnTiki')}
          </button>
          <button
            type="button"
            disabled={isStreaming}
            onClick={() => onOpenProductPanel('fpt')}
            onMouseEnter={e => {
              if (!isStreaming) {
                e.currentTarget.style.background = token.colorPrimaryBg
                e.currentTarget.style.borderColor = token.colorPrimaryBorder
                e.currentTarget.style.color = PRIM
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = token.colorBgContainer
              e.currentTarget.style.borderColor = token.colorBorderSecondary
              e.currentTarget.style.color = token.colorText
            }}
            style={storeChipStyle}
          >
            <ShopOutlined style={{ fontSize: 14, opacity: 0.75 }} />
            {t('chat.findOnFpt')}
          </button>
        </Flex>
      )}
    </Flex>
  )
}
