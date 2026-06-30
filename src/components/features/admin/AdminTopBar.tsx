'use client'

import { BellOutlined, MenuOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons'
import { Avatar, Badge, Button, Flex, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/theme'
import { LocaleDropdown } from '@/components/common/ui/LocaleDropdown'
import { useAdminNav } from '@/contexts/admin-nav'
import { useAdmin } from '@/hooks/admin/useAdmin'
import { useAdminColors } from '@/constants/admin-theme'
import { APP_NAME } from '@/constants/brand'

const { Text } = Typography

export function AdminTopBar() {
  const { t } = useTranslation()
  const { profile } = useAdmin()
  const { isDark, toggleTheme } = useTheme()
  const { isMobile, openDrawer } = useAdminNav()
  const c = useAdminColors()

  const email = profile?.email ?? 'admin'
  const name = profile?.full_name || email.split('@')[0] || 'Admin'

  return (
    <header
      className="admin-topbar shrink-0 flex w-full items-center"
      style={{
        height: 60,
        background: c.topBarBg,
        borderBottom: `1px solid ${c.border}`,
        padding: '0 20px',
      }}
    >
      {isMobile ? (
        <Flex align="center" gap={12} className="min-w-0 flex-1">
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={openDrawer}
            aria-label={t('admin.openMenu')}
            style={{ color: c.textMuted }}
          />
          <Text strong style={{ fontSize: 16, color: c.text }}>
            {APP_NAME}
          </Text>
        </Flex>
      ) : (
        <div className="flex-1 min-w-0" aria-hidden />
      )}

      <Flex align="center" gap={4} className="shrink-0">
        {!isMobile && <LocaleDropdown buttonStyle={{ color: c.textMuted }} />}
        <Button
          type="text"
          size="small"
          icon={isDark ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
          title={isDark ? t('theme.light') : t('theme.dark')}
          style={{ color: c.textMuted }}
        />
        <Badge dot color={c.accent} offset={[-2, 2]}>
          <Button type="text" size="small" icon={<BellOutlined />} style={{ color: c.textMuted }} />
        </Badge>
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
                {t('admin.roleAdmin')}
              </Text>
            </div>
          )}
          <Avatar
            size={38}
            style={{ background: c.accent, color: c.avatarText, fontWeight: 700, flexShrink: 0 }}
          >
            {name.charAt(0).toUpperCase()}
          </Avatar>
        </Flex>
      </Flex>
    </header>
  )
}
