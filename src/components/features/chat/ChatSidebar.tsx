'use client'

import { Avatar, Button, Dropdown, Flex, Grid, Menu, Skeleton, Tooltip, Typography } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MessageOutlined,
  MobileOutlined,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { theme } from 'antd'
import { useTranslation } from 'react-i18next'
import { useChatStore } from '@/stores/chatStore'
import { Logo } from '@/components/common/ui/Logo'
import { useAuth } from '@/hooks/common/useAuth'
import { signOut } from '@/lib/supabase'
import { useUIStore } from '@/stores/uiStore'
import { useTheme } from '@/contexts/theme'
import { CHAT_DARK } from '@/lib/theme'

const { Text } = Typography
const { useBreakpoint } = Grid

interface Props {
  productPanelOpen: boolean
  activeStore?: 'tiki' | 'fpt' | null
  sidebarOpen?: boolean
  onToggleSidebar?: () => void
  onNewChat: () => void
  onSelectSession: (id: string) => void
  onDeleteSession: (id: string) => void
  onOpenProductStore: (store: 'tiki' | 'fpt') => void
  onClose?: () => void
}

function navItemStyle(
  active: boolean,
  isDark: boolean,
  token: ReturnType<typeof theme.useToken>['token'],
): React.CSSProperties {
  return {
    justifyContent: 'flex-start',
    textAlign: 'left',
    height: 36,
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 13,
    fontWeight: active ? 500 : 400,
    border: 'none',
    background: active ? (isDark ? CHAT_DARK.input : token.colorFillSecondary) : 'transparent',
    color: active ? token.colorText : token.colorTextSecondary,
  }
}

function SidebarUserFooter({ onClose }: { onClose?: () => void }) {
  const { t } = useTranslation()
  const { token } = theme.useToken()
  const { isDark } = useTheme()
  const { user, loading } = useAuth()
  const openAuthModal = useUIStore(s => s.openAuthModal)

  const handleLogin = () => {
    openAuthModal('login')
    onClose?.()
  }

  const handleLogout = () => {
    void signOut()
    onClose?.()
  }

  const displayName =
    (user?.user_metadata as { full_name?: string; name?: string } | undefined)?.full_name ??
    (user?.user_metadata as { name?: string } | undefined)?.name ??
    user?.email ??
    'User'

  return (
    <div
      style={{
        flexShrink: 0,
        marginTop: 8,
        paddingTop: 12,
        borderTop: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      {loading ? (
        <Skeleton.Button active block style={{ height: 40, borderRadius: 10 }} />
      ) : user ? (
        <Dropdown
          trigger={['click']}
          menu={{
            items: [{
              key: 'logout',
              label: t('auth.logout'),
              icon: <LogoutOutlined />,
              danger: true,
              onClick: handleLogout,
            }],
          }}
        >
          <Button
            type="text"
            block
            style={{
              height: 44,
              borderRadius: 10,
              justifyContent: 'flex-start',
              padding: '0 10px',
              ...(isDark ? { background: 'transparent' } : {}),
            }}
          >
            <Flex align="center" gap={10} style={{ width: '100%', minWidth: 0 }}>
              <Avatar
                src={
                  (user.user_metadata as { avatar_url?: string; picture?: string } | undefined)
                    ?.avatar_url ??
                  (user.user_metadata as { picture?: string } | undefined)?.picture
                }
                size={32}
                icon={<UserOutlined />}
                style={{ flexShrink: 0 }}
              />
              <span
                style={{
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: 13,
                  fontWeight: 500,
                  textAlign: 'left',
                }}
              >
                {displayName}
              </span>
            </Flex>
          </Button>
        </Dropdown>
      ) : (
        <button
          type="button"
          onClick={handleLogin}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            height: 44,
            padding: '0 12px',
            borderRadius: 10,
            border: 'none',
            background: isDark ? 'transparent' : token.colorBgContainer,
            color: token.colorText,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = isDark ? CHAT_DARK.input : token.colorFillSecondary
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = isDark ? 'transparent' : token.colorBgContainer
          }}
        >
          <LoginOutlined style={{ fontSize: 16, color: token.colorTextSecondary }} />
          <span>{t('landing.nav.login')}</span>
        </button>
      )}
    </div>
  )
}

export function ChatSidebar({
  productPanelOpen,
  activeStore = null,
  sidebarOpen = true,
  onToggleSidebar,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onOpenProductStore,
  onClose,
}: Props) {
  const { t } = useTranslation()
  const { token } = theme.useToken()
  const { isDark } = useTheme()
  const sessions = useChatStore(s => s.sessions)
  const activeId = useChatStore(s => s.activeId)
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const handleNew = () => { onNewChat(); onClose?.() }

  const handleToggle = () => {
    onToggleSidebar?.()
    if (isMobile) onClose?.()
  }

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

  const storeBtnStyle = (store: 'tiki' | 'fpt') =>
    navItemStyle(productPanelOpen && activeStore === store, isDark, token)

  return (
    <Flex
      vertical
      style={{
        height: '100%',
        padding: isMobile ? '16px 12px 12px' : '12px 10px 10px',
      }}
    >
      <Flex
        align="center"
        justify="space-between"
        style={{
          height: 48,
          marginBottom: 16,
          paddingLeft: 2,
          paddingRight: 2,
          flexShrink: 0,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', lineHeight: 0 }}>
          <Logo size={isMobile ? 44 : 48} />
        </span>
        {onToggleSidebar && (
          <Tooltip destroyOnHidden title={t('chat.hideSidebar')}>
            <Button
              type="text"
              size="small"
              icon={<MenuFoldOutlined />}
              onClick={handleToggle}
              aria-label={t('chat.hideSidebar')}
              style={{ color: token.colorTextSecondary }}
            />
          </Tooltip>
        )}
      </Flex>

      <Button
        block
        icon={<EditOutlined />}
        onClick={handleNew}
        style={{
          marginBottom: 14,
          borderRadius: 10,
          height: 40,
          justifyContent: 'flex-start',
          paddingLeft: 14,
          flexShrink: 0,
          fontWeight: 500,
          ...(isDark
            ? {
                background: 'transparent',
                borderColor: CHAT_DARK.borderSubtle,
                color: CHAT_DARK.text,
              }
            : {}),
        }}
      >
        {t('chat.newChat')}
      </Button>

      <div style={{ marginBottom: 12, flexShrink: 0 }}>
        <Text
          type="secondary"
          style={{
            display: 'block',
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            paddingLeft: 10,
            paddingBottom: 6,
          }}
        >
          {t('chat.prepareSection')}
        </Text>

        <Button
          type="text"
          block
          onClick={() => { onOpenProductStore('tiki'); onClose?.() }}
          style={{ ...storeBtnStyle('tiki'), marginBottom: 2 }}
        >
          <Flex align="center" gap={10}>
            <ShoppingOutlined style={{ fontSize: 14, opacity: 0.75 }} />
            <span>{t('utilities.product.tabLabel')}</span>
          </Flex>
        </Button>

        <Button
          type="text"
          block
          onClick={() => { onOpenProductStore('fpt'); onClose?.() }}
          style={storeBtnStyle('fpt')}
        >
          <Flex align="center" gap={10}>
            <MobileOutlined style={{ fontSize: 14, opacity: 0.75 }} />
            <span>{t('utilities.fpt.tabLabel')}</span>
          </Flex>
        </Button>
      </div>

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
          flexShrink: 0,
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

      <SidebarUserFooter onClose={onClose} />
    </Flex>
  )
}
