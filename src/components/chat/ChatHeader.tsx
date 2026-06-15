'use client'
import { Avatar, Button, Dropdown, Flex, Tooltip, Typography } from 'antd'
import {
  LogoutOutlined,
  MenuOutlined,
  MoonOutlined,
  PlusOutlined,
  SunOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { theme } from 'antd'
import { useTheme } from '@/src/context/theme'
import { useAuth } from '@/src/hooks/useAuth'
import { signOut } from '@/src/lib/supabase'
import { useUIStore } from '@/src/store/uiStore'
import { Logo } from '@/src/components/ui/Logo'
import { LocaleDropdown } from '@/src/components/ui/LocaleDropdown'
import { APP_NAME } from '@/src/constants/brand'

const { Text } = Typography

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
      gap={10}
      style={{
        padding: '10px 16px',
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorBgContainer,
        flexShrink: 0,
        minHeight: 64,
      }}
    >
      {isMobile ? (
        <Button type="text" icon={<MenuOutlined />} onClick={onMenuClick} />
      ) : (
        collapsed && <Button type="text" icon={<PlusOutlined />} onClick={onMenuClick} />
      )}

      <Logo size={40} />
      <Text strong style={{ fontSize: 15 }}>
        {APP_NAME}
      </Text>

      <Flex gap={4} align="center" style={{ marginLeft: 'auto' }}>
        <LocaleDropdown />

        <Tooltip title={isDark ? t('theme.light') : t('theme.dark')}>
          <Button
            type="text"
            size="small"
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleTheme}
          />
        </Tooltip>

        <div
          style={{ width: 1, height: 20, background: token.colorBorderSecondary, margin: '0 4px' }}
        />

        {!authLoading &&
          (user ? (
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
              <Avatar
                src={user.user_metadata?.avatar_url as string | undefined}
                size={32}
                icon={<UserOutlined />}
                style={{ cursor: 'pointer', flexShrink: 0 }}
              />
            </Dropdown>
          ) : (
            <Button
              type="primary"
              size="small"
              style={{ borderRadius: 8 }}
              onClick={() => openAuthModal('login')}
            >
              {t('landing.nav.login')}
            </Button>
          ))}
      </Flex>
    </Flex>
  )
}
