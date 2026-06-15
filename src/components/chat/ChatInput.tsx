'use client'
import { Button, Flex, Input, Tooltip, Typography } from 'antd'
import { SendOutlined, StopOutlined } from '@ant-design/icons'
import { theme } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/src/hooks/useAuth'
import { useChatStore } from '@/src/store/chatStore'
import { useUIStore } from '@/src/store/uiStore'

const { Text } = Typography
const GUEST_LIMIT = 3

interface Props {
  sendMessage: () => Promise<void>
  stopMessage: () => void
  isMobile: boolean
}

export function ChatInput({ sendMessage, stopMessage, isMobile }: Props) {
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

  return (
    <div
      className="px-6 pt-4 pb-5 shrink-0"
      style={{
        borderTop: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorBgContainer,
      }}
    >
      <div className="max-w-[760px] mx-auto">
        <Flex
          align="flex-end"
          gap={8}
          style={{
            background: token.colorBgElevated,
            borderRadius: 24,
            padding: '8px 8px 8px 18px',
            border: `1px solid ${token.colorBorderSecondary}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}
        >
          <Input.TextArea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={atLimit ? t('chat.guestLimitReached') : t('chat.inputPlaceholder')}
            autoSize={{ minRows: 1, maxRows: 6 }}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              resize: 'none',
              fontSize: 14,
              lineHeight: 1.6,
              padding: '6px 0',
              boxShadow: 'none',
            }}
            disabled={isStreaming || atLimit}
            onClick={atLimit ? () => openAuthModal('login') : undefined}
          />
          {isStreaming ? (
            <Tooltip title={t('chat.stop')}>
              <Button
                shape="circle"
                size="large"
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
              size="large"
              icon={<SendOutlined />}
              onClick={() => void sendMessage()}
              disabled={!input.trim() || atLimit}
              style={{ flexShrink: 0 }}
            />
          )}
        </Flex>

        <Text
          type="secondary"
          style={{ fontSize: 11, display: 'block', textAlign: 'center', marginTop: 10 }}
        >
          {t('app.disclaimer')}
        </Text>

        {!user && !authLoading && guestMsgCount > 0 && (
          <Text
            style={{
              fontSize: 11,
              display: 'block',
              textAlign: 'center',
              marginTop: 4,
              color: atLimit ? '#ff4d4f' : token.colorTextSecondary,
              cursor: atLimit ? 'pointer' : 'default',
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
