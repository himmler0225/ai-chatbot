'use client'

import { useEffect, useState } from 'react'
import { Avatar, Button, Drawer, Dropdown, Flex, Grid } from 'antd'
import {
  LoginOutlined,
  LogoutOutlined,
  MenuOutlined,
  MoonOutlined,
  RocketOutlined,
  SunOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/common/ui/Logo'
import { LocaleDropdown } from '@/components/common/ui/LocaleDropdown'
import { useTheme } from '@/contexts/theme'
import { useAuth } from '@/hooks/common/useAuth'
import { signOut } from '@/lib/supabase'
import { APP_NAME } from '@/constants/brand'
import type { LandingColors } from '../shared/useColors'
import {
  Brand,
  BrandName,
  CtaFull,
  CtaShort,
  DesktopLinks,
  DrawerActions,
  DrawerDivider,
  DrawerLink,
  NavActions,
  NavBar,
  NavDivider,
  NavInner,
  NavLink,
  NavLoginButton,
  NavMenuButton,
  NavPrimaryButton,
  DrawerPrimaryButton,
} from './landingNav.style'
import { useActiveSection } from './useActiveSection'

const { useBreakpoint } = Grid

// Giai đoạn đầu miễn phí — bật lại khi có bảng giá
const NAV_LINK_KEYS = ['how', 'features', 'examples' /* , 'pricing' */] as const

interface Props {
  C: LandingColors
  onLogin: () => void
  onCta: () => void
}

export function LandingNav({ C, onLogin, onCta }: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const screens = useBreakpoint()
  const [menuOpen, setMenuOpen] = useState(false)
  const drawerWidth = screens.lg ? 320 : '100%'

  const links = NAV_LINK_KEYS.map(key => ({
    key,
    label: t(`landing.nav.links.${key}.label`),
    href: t(`landing.nav.links.${key}.href`),
  }))

  const sectionIds = links.map(l => l.href)
  const scrollActive = useActiveSection(sectionIds)
  const [activeHref, setActiveHref] = useState<string | null>(null)

  useEffect(() => {
    if (scrollActive) setActiveHref(scrollActive)
  }, [scrollActive])

  const closeMenu = () => setMenuOpen(false)

  const userAvatar = user ? (
    (user.user_metadata as { avatar_url?: string; picture?: string } | undefined)?.avatar_url
    ?? (user.user_metadata as { picture?: string } | undefined)?.picture
  ) : undefined

  const accountMenu = user ? (
    <Dropdown
      trigger={['click']}
      menu={{
        items: [
          {
            key: 'app',
            label: t('landing.nav.goToApp'),
            icon: <RocketOutlined />,
            onClick: onCta,
          },
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
        src={userAvatar}
        size={30}
        icon={<UserOutlined />}
        style={{ cursor: 'pointer', flexShrink: 0 }}
      />
    </Dropdown>
  ) : null

  const handleNavClick = (href: string) => {
    setActiveHref(href)
    closeMenu()
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <NavBar
        $C={C}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <NavInner>
          <Brand onClick={() => router.push('/')}>
            <Logo size={screens.sm ? 50 : 40} />
            <BrandName $C={C}>{APP_NAME}</BrandName>
          </Brand>

          <DesktopLinks>
            {links.map(({ key, label, href }) => (
              <NavLink
                key={key}
                href={href}
                $C={C}
                $active={activeHref === href}
                onClick={e => {
                  e.preventDefault()
                  handleNavClick(href)
                }}
              >
                {label}
              </NavLink>
            ))}
          </DesktopLinks>

          <NavActions>
            <LocaleDropdown buttonStyle={{ color: C.muted }} />
            <Button
              type="text"
              size="small"
              icon={isDark ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleTheme}
              title={isDark ? t('theme.light') : t('theme.dark')}
              aria-label={isDark ? t('theme.light') : t('theme.dark')}
              style={{ color: C.muted }}
            />
            <NavDivider $C={C} />

            {!authLoading && (
              user ? accountMenu : (
                <NavLoginButton
                  type="text"
                  size="small"
                  icon={<LoginOutlined />}
                  onClick={onLogin}
                  $C={C}
                >
                  {t('landing.nav.login')}
                </NavLoginButton>
              )
            )}

            <NavPrimaryButton type="primary" size="small" onClick={onCta}>
              <CtaShort>{user ? t('landing.nav.goToApp') : t('landing.nav.getStartedShort')}</CtaShort>
              <CtaFull>{user ? t('landing.nav.goToApp') : t('landing.nav.getStarted')}</CtaFull>
            </NavPrimaryButton>

            <NavMenuButton
              type="text"
              size="small"
              icon={<MenuOutlined />}
              onClick={() => setMenuOpen(true)}
              $C={C}
              aria-label="Menu"
            />
          </NavActions>
        </NavInner>
      </NavBar>

      <Drawer
        title={APP_NAME}
        placement="right"
        open={menuOpen}
        onClose={closeMenu}
        size={drawerWidth}
        styles={{
          header: { background: C.card, borderBottom: `1px solid ${C.border}` },
          body: { background: C.card, padding: '16px 0' },
        }}
      >
        {links.map(({ key, label, href }) => (
          <DrawerLink
            key={key}
            href={href}
            $C={C}
            $active={activeHref === href}
            onClick={e => {
              e.preventDefault()
              handleNavClick(href)
            }}
          >
            {label}
          </DrawerLink>
        ))}

        <DrawerDivider $C={C} />

        <DrawerActions>
          <Button
            block
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleTheme}
            style={{ marginBottom: 8 }}
          >
            {isDark ? t('theme.light') : t('theme.dark')}
          </Button>
          {!authLoading && (
            user ? (
              <Flex vertical gap={8} style={{ width: '100%' }}>
                <Button block icon={<RocketOutlined />} onClick={() => { closeMenu(); onCta() }}>
                  {t('landing.nav.goToApp')}
                </Button>
                <Button
                  block
                  danger
                  icon={<LogoutOutlined />}
                  onClick={() => { closeMenu(); void signOut() }}
                >
                  {t('auth.logout')}
                </Button>
              </Flex>
            ) : (
              <Button block icon={<LoginOutlined />} onClick={() => { closeMenu(); onLogin() }}>
                {t('landing.nav.login')}
              </Button>
            )
          )}
          <DrawerPrimaryButton
            block
            type="primary"
            icon={<RocketOutlined />}
            onClick={() => { closeMenu(); onCta() }}
          >
            {user ? t('landing.nav.goToApp') : t('landing.nav.getStarted')}
          </DrawerPrimaryButton>
        </DrawerActions>
      </Drawer>
    </>
  )
}
