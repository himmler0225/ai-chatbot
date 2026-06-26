import type { AppLocale } from '@/i18n/locale'
import type { LegalDocKey, LegalDocument } from './types'
import { privacyEn } from './privacy.en'
import { privacyVi } from './privacy.vi'
import { termsEn } from './terms.en'
import { termsVi } from './terms.vi'

const DOCS: Record<LegalDocKey, Record<AppLocale, LegalDocument>> = {
  privacy: { vi: privacyVi, en: privacyEn },
  terms: { vi: termsVi, en: termsEn },
}

export function getLegalDocument(key: LegalDocKey, locale: AppLocale): LegalDocument {
  return DOCS[key][locale]
}

export type { LegalDocKey, LegalDocument, LegalSection } from './types'
