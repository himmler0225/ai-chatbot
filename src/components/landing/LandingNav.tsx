'use client'
import { Avatar, Button, Dropdown, Flex, Tooltip, Typography } from 'antd'
import {
  LoginOutlined,
  LogoutOutlined,
  MoonOutlined,
  RocketOutlined,
  SunOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/src/context/theme'
import { useAuth } from '@/src/hooks/useAuth'
import { signOut } from '@/src/lib/supabase'
import { Logo } from '@/src/components/ui/Logo'
import { LocaleDropdown } from '@/src/components/ui/LocaleDropdown'
import { PRIM, APP_NAME } from '@/src/constants/brand'
import type { LandingColors } from '@/src/components/landing/useColors'

const { Text } = Typography

interface Props {
  C: LandingColors
  onLogin: () => void
  onRegister: () => void
}

export function LandingNav({ C, onLogin, onRegister }: Props) {
  const { t } = useTranslation()
  const { isDark, toggleTheme } = useTheme()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8"
      style={{
        height: 64,
        background: C.nav,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${C.border}`,
      }}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <Flex align="center" gap={10} style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>
        <Logo size={40} />
        <Text
          strong
          className="hidden sm:block"
          style={{ fontSize: 15, color: C.fg, letterSpacing: '-0.2px' }}
        >
          {APP_NAME}
        </Text>
      </Flex>

      <Flex align="center" gap={2}>
        <Tooltip title={isDark ? t('theme.light') : t('theme.dark')}>
          <Button
            type="text"
            size="small"
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleTheme}
            style={{ color: C.muted }}
          />
        </Tooltip>

        <LocaleDropdown buttonStyle={{ color: C.muted }} />

        <div style={{ width: 1, height: 18, background: C.border, margin: '0 6px' }} />

        {!authLoading &&
          (user ? (
            <Flex align="center" gap={6}>
              <Button
                size="small"
                type="primary"
                onClick={() => router.push('/app')}
                icon={<RocketOutlined />}
                style={{ background: PRIM, borderColor: PRIM, borderRadius: 8 }}
              >
                <span className="hidden sm:inline">{t('landing.nav.goToApp')}</span>
              </Button>
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
            </Flex>
          ) : (
            <Flex align="center" gap={6}>
              <Button
                size="small"
                icon={<LoginOutlined />}
                onClick={onLogin}
                style={{
                  background: 'transparent',
                  borderColor: C.border,
                  color: C.fg,
                  borderRadius: 8,
                }}
              >
                <span className="hidden sm:inline">{t('landing.nav.login')}</span>
              </Button>
              <Button
                type="primary"
                size="small"
                icon={<UserAddOutlined />}
                onClick={onRegister}
                style={{ background: PRIM, borderColor: PRIM, borderRadius: 8 }}
              >
                <span className="hidden sm:inline">{t('landing.nav.register')}</span>
              </Button>
            </Flex>
          ))}
      </Flex>
    </motion.nav>
  )
}
