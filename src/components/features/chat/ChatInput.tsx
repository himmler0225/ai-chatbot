'use client'

import { Button, Flex, Input, Tooltip, Typography } from 'antd'
import { SendOutlined, ShopOutlined, StopOutlined } from '@ant-design/icons'
import { theme } from 'antd'
import { useTranslation } from 'react-i18next'
import '@/i18n/config'
import { useAuth } from '@/hooks/common/useAuth'
import { useChatStore } from '@/stores/chatStore'
import { useUIStore } from '@/stores/uiStore'
import { GUEST_MESSAGE_LIMIT } from '@/constants/api'

const { Text } = Typography
const GUEST_LIMIT = GUEST_MESSAGE_LIMIT

interface Props {
  sendMessage: () => Promise<void>
  stopMessage: () => void
  isMobile: boolean
  onSearchOnTiki?: (query: string) => void
  onSearchOnFpt?: (query: string) => void
}

export function ChatInput({ sendMessage, stopMessage, isMobile, onSearchOnTiki, onSearchOnFpt }: Props) {
  const { t } = useTranslation()
  const { token } = theme.useToken()
  const { user, loading: authLoading } = useAuth()
  const input = useChatStore(s => s.input)
  const isStreaming = useChatStore(s => s.isStreaming)
  const guestMsgCount = useChatStore(s => s.guestMsgCount)
  const setInput = (v: string) => useChatStore.setState({ input: v })
  const openAuthModal = useUIStore(s => s.openAuthModal)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void sendMessage()
    }
  }

  const atLimit = !user && !authLoading && guestMsgCount >= GUEST_LIMIT

  const inputPlaceholder = isMobile
    ? t('chat.inputPlaceholderShort', { defaultValue: 'Nhập câu hỏi...' })
    : t('chat.inputPlaceholder')

  return (
    <div
      style={{
        flexShrink: 0,
        borderTop: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorBgContainer,
        padding: isMobile ? '12px 16px max(16px, env(safe-area-inset-bottom))' : '16px 24px 20px',
      }}
    >
      <div style={{ maxWidth: 760, margin: '0 auto', width: '100%' }}>
        <Flex
          align="flex-end"
          gap={8}
          style={{
            borderRadius: 24,
            padding: '8px 8px 8px 16px',
            border: `1px solid ${token.colorBorderSecondary}`,
            background: token.colorBgElevated,
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}
        >
          <Input.TextArea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={atLimit ? t('chat.guestLimitReached') : inputPlaceholder}
            autoSize={{ minRows: 1, maxRows: isMobile ? 4 : 6 }}
            variant="borderless"
            disabled={isStreaming || atLimit}
            onClick={atLimit ? () => openAuthModal('login') : undefined}
            style={{
              flex: 1,
              fontSize: 15,
              lineHeight: 1.6,
              padding: '6px 0',
              resize: 'none',
              boxShadow: 'none',
            }}
          />
          {isStreaming ? (
            <Tooltip title={t('chat.stop')}>
              <Button
                shape="circle"
                size={isMobile ? 'middle' : 'large'}
                danger
                icon={<StopOutlined />}
                onClick={stopMessage}
                style={{ flexShrink: 0 }}
              />
            </Tooltip>
          ) : (
            <Button
              type="primary"
              shape="circle"
              size={isMobile ? 'middle' : 'large'}
              icon={<SendOutlined />}
              onClick={() => void sendMessage()}
              disabled={!input.trim() || atLimit}
              style={{ flexShrink: 0 }}
            />
          )}
        </Flex>

        {(onSearchOnTiki || onSearchOnFpt) && input.trim() && !isStreaming && (
          <Flex justify="center" gap={12} wrap="wrap" style={{ marginTop: 8 }}>
            {onSearchOnTiki && (
              <Button
                type="link"
                size="small"
                icon={<ShopOutlined />}
                onClick={() => onSearchOnTiki(input.trim())}
                style={{ fontSize: 12, height: 'auto', padding: '2px 8px' }}
              >
                {t('chat.searchOnTiki')}
              </Button>
            )}
            {onSearchOnFpt && (
              <Button
                type="link"
                size="small"
                icon={<ShopOutlined />}
                onClick={() => onSearchOnFpt(input.trim())}
                style={{ fontSize: 12, height: 'auto', padding: '2px 8px' }}
              >
                {t('chat.searchOnFpt')}
              </Button>
            )}
          </Flex>
        )}

        <Text
          type="secondary"
          style={{
            display: 'block',
            textAlign: 'center',
            fontSize: 11,
            lineHeight: 1.6,
            marginTop: 10,
            padding: '0 8px',
            wordBreak: 'break-word',
          }}
        >
          {t('app.disclaimer')}
        </Text>

        {!user && !authLoading && guestMsgCount > 0 && (
          <Text
            style={{
              display: 'block',
              textAlign: 'center',
              fontSize: 11,
              lineHeight: 1.6,
              marginTop: 6,
              padding: '0 8px',
              color: atLimit ? '#ff4d4f' : token.colorTextSecondary,
              cursor: atLimit ? 'pointer' : undefined,
            }}
            onClick={atLimit ? () => openAuthModal('login') : undefined}
          >
            {atLimit
              ? t('chat.guestLimitReached')
              : t('chat.guestLimitHint', { remaining: GUEST_LIMIT - guestMsgCount })}
          </Text>
        )}
      </div>
    </div>
  )
}
