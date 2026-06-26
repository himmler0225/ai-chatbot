'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { Logo } from '@/components/common/ui/Logo'
import { LocaleDropdown } from '@/components/common/ui/LocaleDropdown'
import { APP_NAME } from '@/constants/brand'
import { useTheme } from '@/contexts/theme'
import { useColors } from '@/components/features/landing/shared/useColors'
import {
  LegalBrand,
  LegalHeader,
  LegalHeaderActions,
  LegalHeaderInner,
  LegalPageRoot,
} from './legal.style'

export function LegalPageShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()
  const { isDark, toggleTheme } = useTheme()
  const C = useColors(isDark)

  return (
    <LegalPageRoot $C={C}>
      <LegalHeader $C={C}>
        <LegalHeaderInner>
          <LegalBrand href="/" $C={C}>
            <Logo size={32} />
            <span>{APP_NAME}</span>
          </LegalBrand>
          <LegalHeaderActions>
            <LocaleDropdown />
            <Button
              type="text"
              size="small"
              icon={isDark ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleTheme}
              title={isDark ? t('theme.light') : t('theme.dark')}
            />
            <Link href="/app" style={{ fontSize: 13, fontWeight: 500, color: C.fg }}>
              {t('legal.openApp')}
            </Link>
          </LegalHeaderActions>
        </LegalHeaderInner>
      </LegalHeader>
      {children}
    </LegalPageRoot>
  )
}
