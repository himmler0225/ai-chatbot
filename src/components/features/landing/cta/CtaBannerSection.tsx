'use client'

import { RocketOutlined, MailOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { LEGAL_CONTACT_EMAIL } from '@/constants/legal'
import { Reveal } from '../shared/Motion'
import {
  CtaActions,
  CtaCard,
  CtaDesc,
  CtaPrimaryButton,
  CtaSecondaryButton,
  CtaSection,
  CtaTitle,
} from './cta.style'

interface Props {
  onPrimary: () => void
}

export function CtaBannerSection({ onPrimary }: Props) {
  const { t } = useTranslation()
  const contactHref = `mailto:${LEGAL_CONTACT_EMAIL || 'contact@reviewmine.ai'}`

  return (
    <CtaSection as="section">
      <Reveal>
        <CtaCard>
          <CtaTitle>{t('landing.ctaBanner.title')}</CtaTitle>
          <CtaDesc>{t('landing.ctaBanner.desc')}</CtaDesc>
          <CtaActions>
            <CtaPrimaryButton type="primary" size="large" icon={<RocketOutlined />} onClick={onPrimary}>
              {t('landing.ctaBanner.primary')}
            </CtaPrimaryButton>
            <a href={contactHref}>
              <CtaSecondaryButton size="large" icon={<MailOutlined />}>
                {t('landing.ctaBanner.secondary')}
              </CtaSecondaryButton>
            </a>
          </CtaActions>
        </CtaCard>
      </Reveal>
    </CtaSection>
  )
}
