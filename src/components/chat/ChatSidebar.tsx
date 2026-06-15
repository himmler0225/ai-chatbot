'use client'
import { Button, Flex, Menu, Typography } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
  PlusOutlined,
  QrcodeOutlined,
  ToolOutlined,
} from '@ant-design/icons'
import { theme } from 'antd'
import { useTranslation } from 'react-i18next'
import { useChatStore } from '@/src/store/chatStore'
import { useUIStore } from '@/src/store/uiStore'
import type { UtilityTab } from '@/src/store/uiStore'

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
  const sessions = useChatStore(s => s.sessions)
  const activeId = useChatStore(s => s.activeId)
  const { view, utilityTab, set: setUI } = useUIStore()

  const menuItems = sessions.map(s => ({
    key: s.id,
    label: (
      <Flex align="center" gap={4}>
        <EditOutlined className="text-xs opacity-50 shrink-0" />
        <span className="flex-1 truncate text-[13px]">{s.title}</span>
        <DeleteOutlined
          className="delete-icon text-xs opacity-0 shrink-0"
          onClick={e => {
            e.stopPropagation()
            onDeleteSession(s.id)
          }}
        />
      </Flex>
    ),
  }))

  return (
    <Flex vertical style={{ height: '100%' }}>
      <div className="p-3" style={{ borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
        <Button
          type="default"
          icon={<PlusOutlined />}
          block
          onClick={() => {
            onNewChat()
            onClose?.()
          }}
          className="!text-left !justify-start !bg-transparent"
        >
          {t('chat.newChat')}
        </Button>
      </div>

      <div className="px-2 pt-2">
        <Button
          type={view === 'utilities' ? 'primary' : 'text'}
          block
          icon={<ToolOutlined />}
          onClick={() => {
            setUI({ view: view === 'utilities' ? 'chat' : 'utilities' })
            onClose?.()
          }}
          className="!text-left !justify-start"
        >
          {t('chat.tabUtilities')}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {view === 'utilities' ? (
          <Menu
            mode="inline"
            selectedKeys={[utilityTab]}
            onClick={({ key }) => {
              setUI({ utilityTab: key as UtilityTab })
              onClose?.()
            }}
            className="!bg-transparent !border-none"
            items={[
              { key: 'shorten', icon: <LinkOutlined />, label: t('utilities.shortener.tabLabel') },
              { key: 'qr', icon: <QrcodeOutlined />, label: t('utilities.qr.tabLabel') },
            ]}
          />
        ) : sessions.length === 0 ? (
          <Text type="secondary" className="block text-center mt-3 text-xs px-3">
            {t('chat.noChats')}
          </Text>
        ) : (
          <Menu
            mode="inline"
            selectedKeys={activeId ? [activeId] : []}
            items={menuItems}
            onClick={({ key }) => {
              onSelectSession(key)
              setUI({ view: 'chat' })
              onClose?.()
            }}
            className="!bg-transparent !border-none"
          />
        )}
      </div>
    </Flex>
  )
}
