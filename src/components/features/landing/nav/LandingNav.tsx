'use client'

import { useState } from 'react'
import { Button, Drawer } from 'antd'
import { LoginOutlined, MenuOutlined, RocketOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/common/ui/Logo'
import { LocaleDropdown } from '@/components/common/ui/LocaleDropdown'
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
  const [menuOpen, setMenuOpen] = useState(false)

  const links = NAV_LINK_KEYS.map(key => ({
    key,
    label: t(`landing.nav.links.${key}.label`),
    href: t(`landing.nav.links.${key}.href`),
  }))

  const closeMenu = () => setMenuOpen(false)

  const handleNavClick = (href: string) => {
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
            <Logo size={50} />
            <BrandName $C={C}>{APP_NAME}</BrandName>
          </Brand>

          <DesktopLinks>
            {links.map(({ key, label, href }) => (
              <NavLink key={key} href={href} $C={C}>
                {label}
              </NavLink>
            ))}
          </DesktopLinks>

          <NavActions>
            <LocaleDropdown buttonStyle={{ color: C.muted }} />
            <NavDivider $C={C} />

            <NavLoginButton
              type="text"
              size="small"
              icon={<LoginOutlined />}
              onClick={onLogin}
              $C={C}
            >
              {t('landing.nav.login')}
            </NavLoginButton>

            <NavPrimaryButton
              type="primary"
              size="small"
              icon={<RocketOutlined />}
              onClick={onCta}
            >
              <CtaFull>{t('landing.nav.getStarted')}</CtaFull>
              <CtaShort>{t('landing.nav.getStartedShort')}</CtaShort>
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
        size={280}
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
          <Button block icon={<LoginOutlined />} onClick={() => { closeMenu(); onLogin() }}>
            {t('landing.nav.login')}
          </Button>
          <DrawerPrimaryButton
            block
            type="primary"
            icon={<RocketOutlined />}
            onClick={() => { closeMenu(); onCta() }}
          >
            {t('landing.nav.getStarted')}
          </DrawerPrimaryButton>
        </DrawerActions>
      </Drawer>
    </>
  )
}
