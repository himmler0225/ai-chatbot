'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  DeleteOutlined,
  LoginOutlined,
  LogoutOutlined,
  MessageOutlined,
  PlusOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Drawer, Dropdown, Flex, Skeleton, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useChatStore } from '@/stores/chatStore'
import { Logo } from '@/components/common/ui/Logo'
import { useAuth } from '@/hooks/common/useAuth'
import { useAdminAccess } from '@/hooks/admin/useAdminAccess'
import { signOut } from '@/lib/supabase'
import { useUIStore } from '@/stores/uiStore'
import { APP_NAME } from '@/constants/brand'
import { CHAT_SHELL, useChatShell } from '@/constants/chat-shell-theme'

const { Text } = Typography

type Props = {
  onNewChat: () => void
  onSelectSession: (id: string) => void
  onDeleteSession: (id: string) => void
  onClose?: () => void
}

const pad = CHAT_SHELL.sidebarPad

function SidebarUserFooter({ onClose }: { onClose?: () => void }) {
  const { t } = useTranslation()
  const { user, loading } = useAuth()
  const { isAdmin } = useAdminAccess()
  const openAuthModal = useUIStore(s => s.openAuthModal)
  const c = useChatShell()

  const displayName =
    (user?.user_metadata as { full_name?: string; name?: string } | undefined)?.full_name ??
    (user?.user_metadata as { name?: string } | undefined)?.name ??
    user?.email ??
    'User'

  if (loading) {
    return <Skeleton.Button active block style={{ height: 40, borderRadius: c.radius }} />
  }

  if (!user) {
    return (
      <Button
        type="primary"
        block
        icon={<LoginOutlined />}
        onClick={() => {
          openAuthModal('login')
          onClose?.()
        }}
        style={{
          height: 42,
          background: c.accent,
          borderColor: c.accent,
          fontWeight: 600,
          borderRadius: c.radius,
          boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
        }}
      >
        {t('auth.login.submit')}
      </Button>
    )
  }

  return (
    <Flex vertical gap={4}>
      {isAdmin && (
        <Link
          href="/admin"
          onClick={() => onClose?.()}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm no-underline"
          style={{ color: c.sidebarText }}
        >
          <SettingOutlined style={{ fontSize: 14 }} />
          {t('chat.shell.adminLink')}
        </Link>
      )}
      <Dropdown
        trigger={['click']}
        menu={{
          items: [
            {
              key: 'logout',
              label: t('auth.logout'),
              icon: <LogoutOutlined />,
              danger: true,
              onClick: () => void signOut(),
            },
          ],
        }}
      >
        <button
          type="button"
          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <Avatar
            size={32}
            src={
              (user.user_metadata as { avatar_url?: string; picture?: string } | undefined)?.avatar_url ??
              (user.user_metadata as { picture?: string } | undefined)?.picture
            }
            icon={<UserOutlined />}
          />
          <span
            className="flex-1 truncate text-left text-sm font-medium"
            style={{ color: c.sidebarTextActive }}
          >
            {displayName}
          </span>
        </button>
      </Dropdown>
    </Flex>
  )
}

function SidebarInner({ onNewChat, onSelectSession, onDeleteSession, onClose }: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const c = useChatShell()
  const sessions = useChatStore(s => s.sessions)
  const activeId = useChatStore(s => s.activeId)

  const handleNewChat = () => {
    onNewChat()
    onClose?.()
    router.push('/')
  }

  return (
    <Flex vertical className="h-full min-h-0" style={{ background: c.sidebarBg }}>
      <Flex align="center" gap={12} className="shrink-0" style={{ padding: `${pad}px ${pad}px 14px`, borderBottom: `1px solid ${c.sidebarBorder}` }}>
        <Logo size={36} />
        <div className="min-w-0">
          <Text strong className="text-sm block leading-tight truncate" style={{ color: c.sidebarTextActive }}>
            {APP_NAME}
          </Text>
          <Text className="text-[10px] block truncate" style={{ color: c.sidebarText }}>
            {t('app.tagline')}
          </Text>
        </div>
      </Flex>

      <div className="shrink-0" style={{ padding: `${12}px ${pad}px` }}>
        <Button
          type="primary"
          block
          icon={<PlusOutlined />}
          onClick={handleNewChat}
          style={{
            height: 40,
            background: c.accent,
            borderColor: c.accent,
            fontWeight: 600,
            borderRadius: c.radius,
          }}
        >
          {t('chat.newChat')}
        </Button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col" style={{ padding: `0 ${pad}px` }}>
        <Text
          className="text-[10px] font-semibold uppercase tracking-wider block shrink-0"
          style={{ color: c.sidebarText, padding: '8px 4px 10px' }}
        >
          {t('chat.recents')}
        </Text>
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <Text className="text-xs block text-center px-3 py-6" style={{ color: c.sidebarText }}>
              {t('chat.noChats')}
            </Text>
          ) : (
            sessions.map(s => {
              const active = activeId === s.id
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    onSelectSession(s.id)
                    onClose?.()
                    router.push('/')
                  }}
                  className="w-full flex items-center gap-2 rounded-lg text-left text-sm group mb-1"
                  style={{
                    color: active ? c.sidebarTextActive : c.sidebarText,
                    background: active ? c.sidebarActive : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '9px 10px',
                  }}
                >
                  <MessageOutlined style={{ fontSize: 12, opacity: 0.5, flexShrink: 0 }} />
                  <span className="flex-1 truncate">{s.title}</span>
                  <DeleteOutlined
                    className="opacity-0 group-hover:opacity-60 shrink-0"
                    style={{ fontSize: 11 }}
                    onClick={e => {
                      e.stopPropagation()
                      onDeleteSession(s.id)
                    }}
                  />
                </button>
              )
            })
          )}
        </div>
      </div>

      <div className="shrink-0 mt-auto" style={{ padding: `${pad}px`, borderTop: `1px solid ${c.sidebarBorder}` }}>
        <SidebarUserFooter onClose={onClose} />
      </div>
    </Flex>
  )
}

export function ChatSidebar(props: Props) {
  return (
    <aside
      className="hidden md:flex flex-col h-full shrink-0"
      style={{ width: CHAT_SHELL.sidebarWidth, height: '100%', background: CHAT_SHELL.sidebarBg }}
    >
      <SidebarInner {...props} />
    </aside>
  )
}

export function ChatMobileDrawer({
  open,
  onClose,
  ...props
}: Props & { open: boolean; onClose: () => void }) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="left"
      size={280}
      styles={{ body: { padding: 0 }, header: { display: 'none' } }}
    >
      <SidebarInner {...props} onClose={onClose} />
    </Drawer>
  )
}
