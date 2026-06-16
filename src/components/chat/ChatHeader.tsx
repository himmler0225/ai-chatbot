'use client'
import { Avatar, Button, Dropdown, Flex, Tooltip } from 'antd'
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MoonOutlined,
  SunOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { theme } from 'antd'
import { useTheme } from '@/src/context/theme'
import { useAuth } from '@/src/hooks/useAuth'
import { signOut } from '@/src/lib/supabase'
import { useUIStore } from '@/src/store/uiStore'
import { LocaleDropdown } from '@/src/components/ui/LocaleDropdown'

interface Props {
  isMobile: boolean
  collapsed: boolean
  onMenuClick: () => void
}

export function ChatHeader({ isMobile, collapsed, onMenuClick }: Props) {
  const { isDark, toggleTheme } = useTheme()
  const { t } = useTranslation()
  const { token } = theme.useToken()
  const { user, loading: authLoading } = useAuth()
  const openAuthModal = useUIStore(s => s.openAuthModal)

  return (
    <Flex
      align="center"
      justify="space-between"
      style={{
        padding: '0 12px',
        height: 52,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorBgContainer,
        flexShrink: 0,
      }}
    >
      {/* Left — sidebar toggle (mobile hamburger or desktop collapse button) */}
      <div>
        {isMobile ? (
          <Button type="text" size="small" icon={<MenuOutlined />} onClick={onMenuClick} />
        ) : collapsed ? (
          <Button type="text" size="small" icon={<MenuFoldOutlined style={{ transform: 'scaleX(-1)' }} />}
            onClick={onMenuClick} />
        ) : null}
      </div>

      {/* Right — controls */}
      <Flex gap={4} align="center">
        <LocaleDropdown />

        <Tooltip title={isDark ? t('theme.light') : t('theme.dark')}>
          <Button type="text" size="small"
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleTheme}
          />
        </Tooltip>

        <div style={{ width: 1, height: 18, background: token.colorBorderSecondary, margin: '0 4px' }} />

        {!authLoading && (
          user ? (
            <Dropdown trigger={['click']} menu={{
              items: [{
                key: 'logout', label: t('auth.logout'),
                icon: <LogoutOutlined />, danger: true,
                onClick: () => void signOut(),
              }],
            }}>
              <Avatar
                src={user.user_metadata?.avatar_url as string | undefined}
                size={30} icon={<UserOutlined />}
                style={{ cursor: 'pointer', flexShrink: 0 }}
              />
            </Dropdown>
          ) : (
            <Button type="primary" size="small" style={{ borderRadius: 8 }}
              onClick={() => openAuthModal('login')}>
              {t('landing.nav.login')}
            </Button>
          )
        )}
      </Flex>
    </Flex>
  )
}
