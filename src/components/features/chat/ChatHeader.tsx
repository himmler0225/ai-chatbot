'use client'

import { Avatar, Button, Dropdown, Flex, Grid, Tooltip, Typography } from 'antd'
import {
  LoginOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SunOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { theme } from 'antd'
import '@/i18n/config'
import { useTheme } from '@/contexts/theme'
import { useAuth } from '@/hooks/common/useAuth'
import { signOut } from '@/lib/supabase'
import { useUIStore } from '@/stores/uiStore'
import { LocaleDropdown } from '@/components/common/ui/LocaleDropdown'
import { Logo } from '@/components/common/ui/Logo'
import { APP_NAME } from '@/constants/brand'

const { Text } = Typography
const { useBreakpoint } = Grid

interface Props {
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

export function ChatHeader({ sidebarOpen, onToggleSidebar }: Props) {
  const { isDark, toggleTheme } = useTheme()
  const { t } = useTranslation()
  const { token } = theme.useToken()
  const { user, loading: authLoading } = useAuth()
  const openAuthModal = useUIStore(s => s.openAuthModal)
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const sidebarBtn = (
    <Button
      type="text"
      size="small"
      icon={sidebarOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
      onClick={onToggleSidebar}
      aria-label={sidebarOpen ? t('chat.hideSidebar') : t('chat.showSidebar')}
    />
  )

  return (
    <Flex
      align="center"
      justify="space-between"
      style={{
        height: 52,
        flexShrink: 0,
        padding: '0 16px',
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorBgContainer,
      }}
    >
      <Flex align="center" gap={8} style={{ minWidth: 0, flex: 1 }}>
        {isMobile ? sidebarBtn : (
          <Tooltip destroyOnHidden title={sidebarOpen ? t('chat.hideSidebar') : t('chat.showSidebar')}>
            {sidebarBtn}
          </Tooltip>
        )}
        {!isMobile && (
          <>
            <Logo size={50} />
            <Text strong style={{ fontSize: 15, letterSpacing: '-0.01em' }} className="truncate">
              {APP_NAME}
            </Text>
          </>
        )}
      </Flex>

      <Flex gap={8} align="center" justify="flex-end" style={{ flexShrink: 0 }}>
        <LocaleDropdown />

        <Tooltip title={isDark ? t('theme.light') : t('theme.dark')}>
          <Button
            type="text"
            size="small"
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleTheme}
          />
        </Tooltip>

        {!authLoading && (
          user ? (
            <Dropdown
              trigger={['click']}
              menu={{
                items: [{
                  key: 'logout',
                  label: t('auth.logout'),
                  icon: <LogoutOutlined />,
                  danger: true,
                  onClick: () => void signOut(),
                }],
              }}
            >
              <Avatar
                src={
                  (user.user_metadata as { avatar_url?: string; picture?: string } | undefined)
                    ?.avatar_url ??
                  (user.user_metadata as { picture?: string } | undefined)?.picture
                }
                size={30}
                icon={<UserOutlined />}
                style={{ cursor: 'pointer', flexShrink: 0 }}
              />
            </Dropdown>
          ) : (
            <Button
              type="primary"
              size="small"
              icon={<LoginOutlined />}
              onClick={() => openAuthModal('login')}
              style={{ borderRadius: 8, fontSize: 13 }}
            >
              {t('landing.nav.login')}
            </Button>
          )
        )}
      </Flex>
    </Flex>
  )
}
