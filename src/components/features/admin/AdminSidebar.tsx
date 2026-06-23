'use client'

import { useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  DashboardOutlined,
  SettingOutlined,
  TeamOutlined,
  CloudServerOutlined,
  LogoutOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import { Button, Drawer, Flex, Layout, Menu, Typography } from 'antd'
import type { MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'
import '@/i18n/config'
import { Logo } from '@/components/common/ui/Logo'
import { APP_NAME, PRIM } from '@/constants/brand'
import { useAdminColors } from '@/constants/admin-theme'
import { useTheme } from '@/contexts/theme'
import { signOut } from '@/lib/supabase'

const { Sider } = Layout
const { Text } = Typography

const NAV_KEYS = [
  { href: '/admin', key: 'overview', icon: DashboardOutlined },
  { href: '/admin/config', key: 'config', icon: SettingOutlined },
  { href: '/admin/users', key: 'users', icon: TeamOutlined },
  { href: '/admin/system', key: 'system', icon: CloudServerOutlined },
] as const

type NavProps = {
  onNavigate?: () => void
}

function AdminSidebarNav({ onNavigate }: NavProps) {
  const { t } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()
  const { isDark } = useTheme()
  const c = useAdminColors()

  const selectedKey = useMemo(() => {
    const match = [...NAV_KEYS]
      .reverse()
      .find(item => pathname === item.href || pathname.startsWith(`${item.href}/`))
    return match?.href ?? '/admin'
  }, [pathname])

  const menuItems: MenuProps['items'] = NAV_KEYS.map(({ href, key, icon: Icon }) => ({
    key: href,
    icon: <Icon />,
    label: t(`admin.nav.${key}`),
  }))

  return (
    <Flex vertical className="h-full min-h-0">
      <Flex align="center" gap={12} className="px-5 py-5" style={{ borderBottom: `1px solid ${c.border}` }}>
        <Logo size={36} />
        <div className="min-w-0">
          <Text strong className="text-sm block leading-tight truncate" style={{ color: c.text }}>
            {APP_NAME}
          </Text>
          <Text className="text-[10px] tracking-widest uppercase block" style={{ color: PRIM }}>
            {t('admin.console')}
          </Text>
        </div>
      </Flex>

      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={({ key }) => {
          router.push(String(key))
          onNavigate?.()
        }}
        theme={isDark ? 'dark' : 'light'}
        style={{
          background: 'transparent',
          border: 'none',
          marginTop: 8,
          flex: 1,
          ...(isDark ? {} : { color: c.text }),
        }}
      />

      <Flex vertical gap={4} className="p-3 mt-auto" style={{ borderTop: `1px solid ${c.border}` }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => {
            router.push('/app')
            onNavigate?.()
          }}
          style={{ color: c.textMuted }}
        >
          {t('admin.backToChat')}
        </Button>
        <Button
          type="text"
          danger
          icon={<LogoutOutlined />}
          onClick={() => signOut().then(() => { window.location.href = '/' })}
          className="justify-start"
          style={{ color: c.textMuted }}
        >
          {t('admin.logout')}
        </Button>
      </Flex>
    </Flex>
  )
}

export function AdminSidebar({ onNavigate }: NavProps) {
  const c = useAdminColors()

  return (
    <Sider
      width={240}
      className="!hidden md:!block"
      style={{
        background: c.sidebarBg,
        borderRight: `1px solid ${c.border}`,
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      <AdminSidebarNav onNavigate={onNavigate} />
    </Sider>
  )
}

export function AdminMobileDrawer({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const c = useAdminColors()

  return (
    <Drawer
      title={null}
      placement="left"
      open={open}
      onClose={onClose}
      size={280}
      styles={{
        body: { padding: 0, background: c.sidebarBg },
        header: { display: 'none' },
      }}
    >
      <AdminSidebarNav onNavigate={onClose} />
    </Drawer>
  )
}
