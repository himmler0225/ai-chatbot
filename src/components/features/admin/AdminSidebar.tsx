'use client'

import { useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  AppstoreOutlined,
  CloudServerOutlined,
  FormOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Button, Drawer, Flex, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import '@/i18n/config'
import { APP_NAME } from '@/constants/brand'
import { useAdminColors } from '@/constants/admin-theme'
import { CHAT_SHELL } from '@/constants/chat-shell-theme'
import { signOut } from '@/lib/supabase'

const { Text } = Typography
const pad = CHAT_SHELL.sidebarPad

const NAV_KEYS = [
  { href: '/admin', key: 'overview', icon: AppstoreOutlined },
  { href: '/admin/prompts', key: 'prompts', icon: FormOutlined },
  { href: '/admin/config', key: 'config', icon: SettingOutlined },
  { href: '/admin/users', key: 'users', icon: TeamOutlined },
  { href: '/admin/system', key: 'system', icon: CloudServerOutlined },
] as const

type NavProps = {
  onNavigate?: () => void
}

function NavItem({
  active,
  icon: Icon,
  label,
  onClick,
  c,
}: {
  active: boolean
  icon: typeof AppstoreOutlined
  label: string
  onClick: () => void
  c: ReturnType<typeof useAdminColors>
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 text-sm font-medium transition-colors text-left"
      style={{
        color: active ? c.sidebarTextActive : c.sidebarText,
        background: active ? c.sidebarActive : 'transparent',
        borderLeft: active ? `3px solid ${c.accent}` : '3px solid transparent',
        padding: '10px 16px 10px 13px',
      }}
      onMouseEnter={e => {
        if (!active) e.currentTarget.style.background = c.sidebarHover
      }}
      onMouseLeave={e => {
        if (!active) e.currentTarget.style.background = 'transparent'
      }}
    >
      <Icon style={{ fontSize: 16, color: active ? c.accent : c.sidebarText }} />
      {label}
    </button>
  )
}

function AdminSidebarNav({ onNavigate }: NavProps) {
  const { t } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()
  const c = useAdminColors()

  const selectedKey = useMemo(() => {
    const match = [...NAV_KEYS]
      .reverse()
      .find(item => pathname === item.href || pathname.startsWith(`${item.href}/`))
    return match?.href ?? '/admin'
  }, [pathname])

  const go = (href: string) => {
    router.push(href)
    onNavigate?.()
  }

  return (
    <Flex vertical className="h-full min-h-0" style={{ background: c.sidebarBg }}>
      <Flex
        align="center"
        gap={12}
        className="shrink-0"
        style={{ padding: `${pad}px ${pad}px 14px`, borderBottom: `1px solid ${c.sidebarBorder}` }}
      >
        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 36, height: 36, background: c.accent }}
        >
          <AppstoreOutlined style={{ color: '#fff', fontSize: 18 }} />
        </div>
        <div className="min-w-0">
          <Text className="text-[10px] tracking-[0.12em] font-bold block leading-tight truncate" style={{ color: c.sidebarTextActive }}>
            {APP_NAME.toUpperCase()}
          </Text>
          <Text className="text-[10px] tracking-widest uppercase block" style={{ color: c.sidebarText }}>
            {t('admin.consoleShort')}
          </Text>
        </div>
      </Flex>

      <nav className="flex-1 py-2 flex flex-col gap-0.5">
        {NAV_KEYS.map(({ href, key, icon }) => (
          <NavItem
            key={href}
            active={selectedKey === href}
            icon={icon}
            label={t(`admin.nav.${key}`)}
            onClick={() => go(href)}
            c={c}
          />
        ))}
      </nav>

      <Flex vertical gap={2} className="mt-auto shrink-0" style={{ padding: pad, borderTop: `1px solid ${c.sidebarBorder}` }}>
        <Button type="text" icon={<QuestionCircleOutlined />} className="justify-start !px-3" style={{ color: c.sidebarText }}>
          {t('admin.support')}
        </Button>
        <Button
          type="text"
          icon={<LogoutOutlined />}
          className="justify-start !px-3"
          style={{ color: c.sidebarText }}
          onClick={() => {
            signOut().then(() => { window.location.href = '/' })
          }}
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
    <aside
      className="hidden md:flex flex-col shrink-0 h-full"
      style={{ width: CHAT_SHELL.sidebarWidth, height: '100%', background: c.sidebarBg }}
    >
      <AdminSidebarNav onNavigate={onNavigate} />
    </aside>
  )
}

export function AdminMobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const c = useAdminColors()
  return (
    <Drawer
      title={null}
      placement="left"
      open={open}
      onClose={onClose}
      size={CHAT_SHELL.sidebarWidth + 20}
      styles={{ body: { padding: 0, background: c.sidebarBg }, header: { display: 'none' } }}
    >
      <AdminSidebarNav onNavigate={onClose} />
    </Drawer>
  )
}
