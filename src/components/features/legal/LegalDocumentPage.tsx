'use client'

import Link from 'next/link'
import { getLegalDocument, type LegalDocKey } from '@/content/legal'
import { LEGAL_CONTACT_EMAIL, LEGAL_OPERATOR } from '@/constants/legal'
import { useAppLocale } from '@/i18n/locale'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/theme'
import { useColors } from '@/components/features/landing/shared/useColors'
import { LegalPageShell } from './LegalPageShell'
import {
  LegalDocTitle,
  LegalFooterLinks,
  LegalIntro,
  LegalList,
  LegalMain,
  LegalParagraph,
  LegalSection,
  LegalSectionTitle,
  LegalUpdated,
} from './legal.style'

function interpolate(text: string): string {
  const email = LEGAL_CONTACT_EMAIL || 'contact@reviewmine.ai'
  return text
    .replaceAll('{{operator}}', LEGAL_OPERATOR)
    .replaceAll('{{email}}', email)
}

function renderText(text: string, C: ReturnType<typeof useColors>) {
  const value = interpolate(text)
  const email = LEGAL_CONTACT_EMAIL || 'contact@reviewmine.ai'
  if (value.includes(email)) {
    const [before, after] = value.split(email)
    return (
      <LegalParagraph $C={C}>
        {before}
        <a href={`mailto:${email}`}>{email}</a>
        {after}
      </LegalParagraph>
    )
  }
  return <LegalParagraph $C={C}>{value}</LegalParagraph>
}

interface Props {
  docKey: LegalDocKey
}

export function LegalDocumentPage({ docKey }: Props) {
  const { t } = useTranslation()
  const { locale } = useAppLocale()
  const { isDark } = useTheme()
  const C = useColors(isDark)
  const doc = getLegalDocument(docKey, locale)
  const otherKey = docKey === 'privacy' ? 'terms' : 'privacy'

  return (
    <LegalPageShell>
      <LegalMain>
        <LegalDocTitle $C={C}>{doc.title}</LegalDocTitle>
        <LegalUpdated $C={C}>
          {t('legal.lastUpdated')}: {doc.lastUpdated}
        </LegalUpdated>
        <LegalIntro $C={C}>{interpolate(doc.intro)}</LegalIntro>

        {doc.sections.map(section => (
          <LegalSection key={section.id} id={section.id}>
            <LegalSectionTitle $C={C}>{section.title}</LegalSectionTitle>
            {section.paragraphs?.map((p, i) => (
              <span key={`${section.id}-p-${i}`}>{renderText(p, C)}</span>
            ))}
            {section.bullets && (
              <LegalList $C={C}>
                {section.bullets.map(item => (
                  <li key={item}>{interpolate(item)}</li>
                ))}
              </LegalList>
            )}
          </LegalSection>
        ))}

        <LegalFooterLinks $C={C}>
          <Link href="/">{t('legal.backHome')}</Link>
          <Link href={otherKey === 'privacy' ? '/privacy' : '/terms'}>
            {t(`legal.link.${otherKey}`)}
          </Link>
          {LEGAL_CONTACT_EMAIL && (
            <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{t('legal.contact')}</a>
          )}
        </LegalFooterLinks>
      </LegalMain>
    </LegalPageShell>
  )
}
