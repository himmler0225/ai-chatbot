'use client'

import { GlobalOutlined, TwitterOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/theme'
import { Logo } from '@/components/common/ui/Logo'
import { APP_NAME } from '@/constants/brand'
import { useColors } from '../shared/useColors'
import { Reveal, Stagger, StaggerItem } from '../shared/Motion'
import {
  BrandCol,
  BrandDesc,
  BrandRow,
  BrandTitle,
  ColumnTitle,
  Copyright,
  FooterGrid,
  FooterInner,
  FooterLink,
  FooterRoot,
  LinkList,
  SocialIcon,
  SocialLink,
  SocialRow,
} from './footer.style'

const PRODUCT_KEYS = ['chat', 'product'] as const
const SUPPORT_KEYS = ['privacy', 'terms', 'contact'] as const

export function LandingFooter() {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const C = useColors(isDark)

  return (
    <FooterRoot $C={C} $isDark={isDark}>
      <FooterInner>
        <Stagger staggerMs={120}>
          <FooterGrid>
            <StaggerItem>
              <BrandCol>
                <BrandRow>
                  <Logo size={36} />
                  <BrandTitle $C={C}>{APP_NAME}</BrandTitle>
                </BrandRow>
                <BrandDesc $C={C}>{t('landing.footer.desc')}</BrandDesc>
                <SocialRow>
                  {[TwitterOutlined, GlobalOutlined].map((Icon, i) => (
                    <SocialLink key={i} href="#" $C={C}>
                      <SocialIcon><Icon /></SocialIcon>
                    </SocialLink>
                  ))}
                </SocialRow>
              </BrandCol>
            </StaggerItem>

            <StaggerItem>
              <div>
                <ColumnTitle $C={C}>{t('landing.footer.productTitle')}</ColumnTitle>
                <LinkList>
                  {PRODUCT_KEYS.map(key => (
                    <FooterLink key={key} href="#features" $C={C}>
                      {t(`landing.footer.products.${key}`)}
                    </FooterLink>
                  ))}
                </LinkList>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div>
                <ColumnTitle $C={C}>{t('landing.footer.supportTitle')}</ColumnTitle>
                <LinkList>
                  {SUPPORT_KEYS.map(key => (
                    <FooterLink key={key} href="#" $C={C}>
                      {t(`landing.footer.support.${key}`)}
                    </FooterLink>
                  ))}
                </LinkList>
              </div>
            </StaggerItem>
          </FooterGrid>
        </Stagger>

        <Reveal delay={0.15}>
          <Copyright $C={C}>{t('landing.footer.copyright')}</Copyright>
        </Reveal>
      </FooterInner>
    </FooterRoot>
  )
}
