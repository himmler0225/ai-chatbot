'use client'

import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { Logo } from '@/components/common/ui/Logo'
import { LocaleDropdown } from '@/components/common/ui/LocaleDropdown'
import { APP_NAME } from '@/constants/brand'
import { LEGAL_CONTACT_EMAIL } from '@/constants/legal'
import { useTheme } from '@/contexts/theme'
import { useColors } from '../shared/useColors'
import {
  FooterBottom,
  FooterBrand,
  FooterBrandRow,
  FooterCopyright,
  FooterInner,
  FooterLink,
  FooterLinks,
  FooterRoot,
  FooterTop,
  FooterUtilities,
} from './footer.style'

const LINK_KEYS = ['privacy', 'terms', 'contact', 'docs'] as const

const LINK_HREFS: Record<(typeof LINK_KEYS)[number], string> = {
  privacy: '/privacy',
  terms: '/terms',
  contact: `mailto:${LEGAL_CONTACT_EMAIL || 'contact@reviewmine.ai'}`,
  docs: '#how-it-works',
}

export function LandingFooter() {
  const { t } = useTranslation()
  const { isDark, toggleTheme } = useTheme()
  const C = useColors(isDark)

  return (
    <FooterRoot $C={C} $isDark={isDark}>
      <FooterInner>
        <FooterTop>
          <FooterBrandRow>
            <Logo size={32} />
            <FooterBrand $C={C}>{APP_NAME}</FooterBrand>
          </FooterBrandRow>
          <FooterUtilities>
            <LocaleDropdown />
            <Button
              type="text"
              size="small"
              icon={isDark ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleTheme}
              title={isDark ? t('theme.light') : t('theme.dark')}
            />
          </FooterUtilities>
        </FooterTop>

        <FooterBottom>
          <FooterCopyright $C={C}>{t('landing.footer.copyright')}</FooterCopyright>
          <FooterLinks>
            {LINK_KEYS.map(key => (
              <FooterLink key={key} href={LINK_HREFS[key]} $C={C}>
                {t(`landing.footer.support.${key}`)}
              </FooterLink>
            ))}
          </FooterLinks>
        </FooterBottom>
      </FooterInner>
    </FooterRoot>
  )
}
