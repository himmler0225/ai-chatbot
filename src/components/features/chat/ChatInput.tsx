'use client'

import { Button, Flex, Input, Tooltip, Typography } from 'antd'
import { PaperClipOutlined, SendOutlined, StopOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import '@/i18n/config'
import { useAuth } from '@/hooks/common/useAuth'
import { useChatStore } from '@/stores/chatStore'
import { useUIStore } from '@/stores/uiStore'
import { GUEST_MESSAGE_LIMIT } from '@/constants/api'
import { useChatShell } from '@/constants/chat-shell-theme'

const { Text } = Typography
const GUEST_LIMIT = GUEST_MESSAGE_LIMIT

interface Props {
  sendMessage: () => Promise<void>
  stopMessage: () => void
  isMobile: boolean
}

export function ChatInput({ sendMessage, stopMessage, isMobile }: Props) {
  const { t } = useTranslation()
  const c = useChatShell()
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
  const placeholder = isMobile
    ? t('chat.inputPlaceholderShort')
    : t('chat.inputPlaceholder')

  const hPad = isMobile ? 16 : c.sidebarPad

  return (
    <div
      className="shrink-0"
      style={{
        background: c.mainBg,
        padding: isMobile
          ? `12px ${hPad}px max(16px, env(safe-area-inset-bottom))`
          : `16px ${hPad}px 20px`,
        borderTop: `1px solid ${c.border}`,
      }}
    >
      <div style={{ maxWidth: c.contentMax, margin: '0 auto', width: '100%' }}>
        <Flex
          align="center"
          gap={6}
          className="chat-input-shell"
          style={{
            borderRadius: c.radius,
            padding: '8px 8px 8px 16px',
            minHeight: 52,
            border: `1px solid ${c.inputBorder}`,
            background: c.inputBg,
            boxShadow: '0 1px 2px rgba(15,23,42,0.05)',
          }}
        >
          <Input.TextArea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={atLimit ? t('chat.guestLimitReached') : placeholder}
            autoSize={{ minRows: 1, maxRows: isMobile ? 4 : 5 }}
            variant="borderless"
            disabled={isStreaming || atLimit}
            onClick={atLimit ? () => openAuthModal('login') : undefined}
            className="chat-input-textarea"
            style={{
              flex: 1,
              fontSize: isMobile ? 16 : 15,
              lineHeight: '22px',
              padding: '6px 0',
              resize: 'none',
              background: 'transparent',
              color: c.text,
            }}
          />
          <Flex align="center" gap={2} className="shrink-0 self-end pb-0.5">
            <Tooltip title={t('chat.attachSoon')}>
              <Button
                type="text"
                icon={<PaperClipOutlined />}
                disabled
                style={{ color: c.textSubtle, width: 36, height: 36 }}
              />
            </Tooltip>
            {isStreaming ? (
              <Tooltip title={t('chat.stop')}>
                <Button
                  shape="circle"
                  size="middle"
                  danger
                  icon={<StopOutlined />}
                  onClick={stopMessage}
                />
              </Tooltip>
            ) : (
              <Button
                type="primary"
                shape="circle"
                size="middle"
                icon={<SendOutlined />}
                onClick={() => void sendMessage()}
                disabled={!input.trim() || atLimit}
                style={{ background: c.accent, borderColor: c.accent }}
              />
            )}
          </Flex>
        </Flex>

        <Flex justify="center" align="center" gap={6} className="mt-3">
          <InfoCircleOutlined style={{ fontSize: 12, color: c.textSubtle }} />
          <Text style={{ fontSize: 12, color: c.textSubtle, textAlign: 'center' }}>
            {t('app.disclaimer')}
          </Text>
        </Flex>

        {!user && !authLoading && guestMsgCount > 0 && (
          <Text
            className="block text-center mt-2 text-xs"
            style={{ color: atLimit ? '#dc2626' : c.textMuted, cursor: atLimit ? 'pointer' : undefined }}
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
