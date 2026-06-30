'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import vi from './locales/vi.json'
import en from './locales/en.json'
import {
  applyDocumentLocale,
  DEFAULT_LOCALE,
  normalizeLocale,
  readLocaleFromUrl,
  type AppLocale,
} from './locale'

function resolveInitialLocale(): AppLocale {
  // SSR and first client paint must match — stored locale applied in ThemeProvider useEffect.
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  return readLocaleFromUrl() ?? DEFAULT_LOCALE
}

const initialLocale = resolveInitialLocale()

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: { vi: { translation: vi }, en: { translation: en } },
    lng: initialLocale,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: ['vi', 'en'],
    nonExplicitSupportedLngs: false,
    interpolation: { escapeValue: false },
  })
  applyDocumentLocale(initialLocale)
}

export function changeAppLanguage(locale: AppLocale): void {
  const next = normalizeLocale(locale)
  if (normalizeLocale(i18n.language) === next) {
    applyDocumentLocale(next)
    return
  }
  void i18n.changeLanguage(next).then(() => {
    applyDocumentLocale(next)
  })
}

export default i18n
export type { AppLocale }
