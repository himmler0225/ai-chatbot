'use client'

import { Button, Flex, Grid, Menu, Typography } from 'antd'
import { DeleteOutlined, EditOutlined, MessageOutlined } from '@ant-design/icons'
import { TikiLogo } from '@/components/common/ui/TikiLogo'
import { theme } from 'antd'
import { useTranslation } from 'react-i18next'
import { useChatStore } from '@/stores/chatStore'
import { Logo } from '@/components/common/ui/Logo'
import { APP_NAME } from '@/constants/brand'

const { Text } = Typography
const { useBreakpoint } = Grid

interface Props {
  productPanelOpen: boolean
  onNewChat: () => void
  onSelectSession: (id: string) => void
  onDeleteSession: (id: string) => void
  onToggleProductPanel: () => void
  onClose?: () => void
}

export function ChatSidebar({
  productPanelOpen,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onToggleProductPanel,
  onClose,
}: Props) {
  const { t } = useTranslation()
  const { token } = theme.useToken()
  const sessions = useChatStore(s => s.sessions)
  const activeId = useChatStore(s => s.activeId)
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const handleNew = () => { onNewChat(); onClose?.() }

  const menuItems = sessions.map(s => ({
    key: s.id,
    label: (
      <Flex align="center" gap={6}>
        <MessageOutlined style={{ fontSize: 12, opacity: 0.4, flexShrink: 0 }} />
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13 }}>
          {s.title}
        </span>
        <DeleteOutlined
          className="delete-icon"
          style={{ fontSize: 12, opacity: 0, flexShrink: 0 }}
          onClick={e => { e.stopPropagation(); onDeleteSession(s.id) }}
        />
      </Flex>
    ),
  }))

  return (
    <Flex
      vertical
      style={{
        height: '100%',
        padding: isMobile ? '20px 16px 24px' : '16px 12px 20px',
      }}
    >
      {isMobile && (
        <Flex align="center" gap={10} style={{ marginBottom: 16, paddingLeft: 4 }}>
          <Logo size={36} />
          <Text strong style={{ fontSize: 15, letterSpacing: '-0.01em' }}>{APP_NAME}</Text>
        </Flex>
      )}

      <Button
        block
        icon={<EditOutlined />}
        onClick={handleNew}
        style={{
          marginBottom: 16,
          borderRadius: 10,
          height: 42,
          justifyContent: 'flex-start',
          paddingLeft: 14,
        }}
      >
        {t('chat.newChat')}
      </Button>

      <Text
        type="secondary"
        style={{
          display: 'block',
          fontSize: 11,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          paddingLeft: 8,
          paddingBottom: 8,
        }}
      >
        {t('chat.prepareSection')}
      </Text>

      <Button
        type="text"
        block
        icon={<TikiLogo size={40} />}
        onClick={() => { onToggleProductPanel(); onClose?.() }}
        style={{
          justifyContent: 'flex-start',
          textAlign: 'left',
          height: 38,
          borderRadius: 10,
          paddingLeft: 12,
          marginBottom: 16,
          fontWeight: productPanelOpen ? 500 : 400,
          background: productPanelOpen ? token.colorFillTertiary : 'transparent',
        }}
      >
        {t('utilities.product.tabLabel')}
      </Button>

      <Text
        type="secondary"
        style={{
          display: 'block',
          fontSize: 11,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          paddingLeft: 8,
          paddingBottom: 8,
        }}
      >
        {t('chat.recents')}
      </Text>

      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, paddingTop: 4 }}>
        {sessions.length === 0 ? (
          <Text
            type="secondary"
            style={{
              display: 'block',
              textAlign: 'center',
              marginTop: 20,
              fontSize: 12,
              lineHeight: 1.6,
              padding: '0 12px',
            }}
          >
            {t('chat.noChats')}
          </Text>
        ) : (
          <Menu
            mode="inline"
            selectedKeys={activeId ? [activeId] : []}
            items={menuItems}
            onClick={({ key }) => { onSelectSession(key); onClose?.() }}
            style={{ background: 'transparent', border: 'none', padding: 0 }}
          />
        )}
      </div>
    </Flex>
  )
}
