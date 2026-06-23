'use client'

import { GlobalOutlined, MenuOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons'
import { Avatar, Button, Flex, Layout, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import '@/i18n/config'
import { useLocale, useTheme } from '@/contexts/theme'
import { useAdminNav } from '@/contexts/admin-nav'
import { useAdmin } from '@/hooks/admin/useAdmin'
import { useAdminColors } from '@/constants/admin-theme'
import { PRIM } from '@/constants/brand'

const { Header } = Layout
const { Text, Title } = Typography

type Props = {
  titleKey: string
  subtitleKey: string
}

export function AdminHeader({ titleKey, subtitleKey }: Props) {
  const { t } = useTranslation()
  const { profile } = useAdmin()
  const { isDark, toggleTheme, toggleLocale, locale } = useTheme()
  const { isMobile, openDrawer } = useAdminNav()
  const c = useAdminColors()

  const email = profile?.email ?? 'admin'
  const name = profile?.full_name || email.split('@')[0] || 'Admin'

  return (
    <Header
      className="relative shrink-0 px-4 md:px-8"
      style={{
        height: 'auto',
        lineHeight: 'normal',
        paddingTop: 16,
        paddingBottom: 16,
        background: c.bg,
        borderBottom: `1px solid ${c.border}`,
      }}
    >
      {isMobile && (
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={openDrawer}
          aria-label={t('admin.openMenu')}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10"
          style={{ color: c.textMuted }}
        />
      )}

      <Flex
        justify="center"
        align="center"
        className={`w-full pointer-events-none ${isMobile ? 'px-10' : ''}`}
      >
        <div className="text-center min-w-0">
          <Text className="text-xs block mb-1 truncate" style={{ color: c.textMuted }}>
            {t('admin.breadcrumb')} / {t(subtitleKey)}
          </Text>
          <Title
            level={isMobile ? 4 : 3}
            className="!m-0 truncate"
            style={{ color: c.text, fontWeight: 600 }}
          >
            {t(titleKey)}
          </Title>
        </div>
      </Flex>

      <Flex
        align="center"
        gap={isMobile ? 4 : 12}
        className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 pointer-events-auto"
      >
        {!isMobile && (
          <Button
            type="text"
            icon={<GlobalOutlined />}
            onClick={toggleLocale}
            title={t('admin.langToggle')}
            style={{ color: c.textMuted }}
          >
            {locale.toUpperCase()}
          </Button>
        )}
        <Button
          type="text"
          icon={isDark ? <MoonOutlined /> : <SunOutlined />}
          onClick={toggleTheme}
          title={isDark ? t('theme.light') : t('theme.dark')}
          style={{ color: c.textMuted }}
        />
        <Flex
          align="center"
          gap={isMobile ? 0 : 12}
          className={isMobile ? '' : 'pl-2'}
          style={isMobile ? undefined : { borderLeft: `1px solid ${c.border}` }}
        >
          {!isMobile && (
            <div className="text-right hidden sm:block">
              <Text className="text-sm block leading-tight" style={{ color: c.text }}>
                {name}
              </Text>
              <Text className="text-[11px]" style={{ color: c.textMuted }}>
                {t('admin.roleAdmin')}
              </Text>
            </div>
          )}
          <Avatar
            size={isMobile ? 32 : 36}
            style={{ background: PRIM, color: c.avatarText, fontWeight: 700 }}
          >
            {name.charAt(0).toUpperCase()}
          </Avatar>
        </Flex>
      </Flex>
    </Header>
  )
}
