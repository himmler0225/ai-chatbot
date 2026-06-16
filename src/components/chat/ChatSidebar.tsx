'use client'
import { Button, Flex, Menu, Tooltip, Typography } from 'antd'
import {
  DeleteOutlined,
  MessageOutlined,
  PlusOutlined,
  ShoppingOutlined,
  ToolOutlined,
} from '@ant-design/icons'
import { theme } from 'antd'
import { useTranslation } from 'react-i18next'
import { useChatStore } from '@/src/store/chatStore'
import { useUIStore } from '@/src/store/uiStore'
import type { UtilityTab } from '@/src/store/uiStore'
import { Logo } from '@/src/components/ui/Logo'
import { APP_NAME } from '@/src/constants/brand'

const { Text } = Typography

interface Props {
  onNewChat: () => void
  onSelectSession: (id: string) => void
  onDeleteSession: (id: string) => void
  onClose?: () => void
}

export function ChatSidebar({ onNewChat, onSelectSession, onDeleteSession, onClose }: Props) {
  const { t } = useTranslation()
  const { token } = theme.useToken()
  const sessions  = useChatStore(s => s.sessions)
  const activeId  = useChatStore(s => s.activeId)
  const { view, utilityTab, set: setUI } = useUIStore()

  const handleNew = () => { onNewChat(); onClose?.() }

  const menuItems = sessions.map(s => ({
    key: s.id,
    label: (
      <Flex align="center" gap={4}>
        <MessageOutlined className="text-xs opacity-40 shrink-0" />
        <span className="flex-1 truncate text-[13px]">{s.title}</span>
        <DeleteOutlined
          className="delete-icon text-xs opacity-0 shrink-0"
          onClick={e => { e.stopPropagation(); onDeleteSession(s.id) }}
        />
      </Flex>
    ),
  }))

  return (
    <Flex vertical style={{ height: '100%' }}>
      {/* ── Brand + New Chat ─────────────────────────────── */}
      <Flex align="center" justify="space-between"
        style={{ padding: '14px 14px 10px', borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
        <Flex align="center" gap={9}>
          <Logo size={30} />
          <Text strong style={{ fontSize: 14, letterSpacing: '-0.2px' }}>{APP_NAME}</Text>
        </Flex>
        <Tooltip title={t('chat.newChat')} placement="right">
          <Button
            type="text"
            size="small"
            icon={<PlusOutlined />}
            onClick={handleNew}
            style={{ borderRadius: 8 }}
          />
        </Tooltip>
      </Flex>

      {/* ── Utilities toggle ─────────────────────────────── */}
      <div className="px-2 pt-2">
        <Button
          type={view === 'utilities' ? 'primary' : 'text'}
          block
          icon={<ToolOutlined />}
          onClick={() => { setUI({ view: view === 'utilities' ? 'chat' : 'utilities' }); onClose?.() }}
          className="!text-left !justify-start"
        >
          {t('chat.tabUtilities')}
        </Button>
      </div>

      {/* ── Session list / utility sub-tabs ──────────────── */}
      <div className="flex-1 overflow-y-auto py-2">
        {view === 'utilities' ? (
          <Menu
            mode="inline"
            selectedKeys={[utilityTab]}
            onClick={({ key }) => { setUI({ utilityTab: key as UtilityTab }); onClose?.() }}
            className="!bg-transparent !border-none"
            items={[
              { key: 'product', icon: <ShoppingOutlined />, label: t('utilities.product.tabLabel') },
            ]}
          />
        ) : sessions.length === 0 ? (
          <Text type="secondary" className="block text-center mt-4 text-xs px-3">
            {t('chat.noChats')}
          </Text>
        ) : (
          <Menu
            mode="inline"
            selectedKeys={activeId ? [activeId] : []}
            items={menuItems}
            onClick={({ key }) => { onSelectSession(key); setUI({ view: 'chat' }); onClose?.() }}
            className="!bg-transparent !border-none"
          />
        )}
      </div>
    </Flex>
  )
}
