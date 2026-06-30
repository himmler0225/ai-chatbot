'use client'

import Link from 'next/link'
import { Avatar, Button, Flex, Grid, Typography } from 'antd'
import { MenuOutlined, MoonOutlined, SettingOutlined, SunOutlined, UserOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/theme'
import { LocaleDropdown } from '@/components/common/ui/LocaleDropdown'
import { useAuth } from '@/hooks/common/useAuth'
import { useAdminAccess } from '@/hooks/admin/useAdminAccess'
import { APP_NAME } from '@/constants/brand'
import { useChatShell } from '@/constants/chat-shell-theme'

const { Text } = Typography
const { useBreakpoint } = Grid

interface Props {
  onOpenMenu?: () => void
}

export function ChatHeader({ onOpenMenu }: Props) {
  const { isDark, toggleTheme } = useTheme()
  const { t } = useTranslation()
  const { user } = useAuth()
  const { isAdmin } = useAdminAccess()
  const screens = useBreakpoint()
  const isMobile = !screens.md
  const c = useChatShell()

  const meta = user?.user_metadata as { full_name?: string; name?: string; avatar_url?: string; picture?: string } | undefined
  const name = meta?.full_name ?? meta?.name ?? user?.email?.split('@')[0] ?? ''
  const avatarUrl = meta?.avatar_url ?? meta?.picture

  return (
    <header
      className="shrink-0 flex items-center justify-between"
      style={{
        height: 60,
        background: c.mainBg,
        borderBottom: `1px solid ${c.border}`,
        padding: `0 ${c.sidebarPad}px`,
      }}
    >
      <Flex align="center" gap={12} className="min-w-0">
        {isMobile && onOpenMenu && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={onOpenMenu}
            aria-label={t('chat.showSidebar')}
            style={{ color: c.textMuted }}
          />
        )}
        <Text strong style={{ fontSize: 18, color: c.text, letterSpacing: '-0.02em', lineHeight: 1 }}>
          {APP_NAME}
        </Text>
      </Flex>

      <Flex align="center" gap={2} className="shrink-0">
        {isAdmin && !isMobile && (
          <Link href="/admin">
            <Button type="text" size="small" icon={<SettingOutlined />} style={{ color: c.textMuted }}>
              {t('chat.shell.adminLink')}
            </Button>
          </Link>
        )}
        <LocaleDropdown buttonStyle={{ color: c.textMuted }} />
        <Button
          type="text"
          size="small"
          icon={isDark ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
          title={isDark ? t('theme.light') : t('theme.dark')}
          style={{ color: c.textMuted }}
        />
        {user && (
          <Flex
            align="center"
            gap={12}
            className="ml-2 pl-4"
            style={{ borderLeft: `1px solid ${c.border}`, minHeight: 40 }}
          >
            {!isMobile && (
              <div className="text-right hidden sm:block" style={{ lineHeight: 1.25 }}>
                <Text className="text-sm font-medium block" style={{ color: c.text }}>
                  {name}
                </Text>
                <Text className="text-[10px] font-semibold tracking-wide block mt-0.5" style={{ color: c.textSubtle }}>
                  {t('chat.shell.memberRole').toUpperCase()}
                </Text>
              </div>
            )}
            <Avatar
              size={38}
              src={avatarUrl}
              icon={!avatarUrl ? <UserOutlined /> : undefined}
              style={{ background: c.accent, color: '#fff', fontWeight: 700, flexShrink: 0 }}
            >
              {name.charAt(0).toUpperCase()}
            </Avatar>
          </Flex>
        )}
      </Flex>
    </header>
  )
}
