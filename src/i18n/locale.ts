'use client'

import { useTranslation } from 'react-i18next'

export type AppLocale = 'vi' | 'en'

export const LOCALES: AppLocale[] = ['vi', 'en']
export const DEFAULT_LOCALE: AppLocale = 'vi'
export const LOCALE_STORAGE_KEY = 'locale'

export function normalizeLocale(raw?: string | null): AppLocale {
  return raw?.toLowerCase().startsWith('en') ? 'en' : 'vi'
}

export function toIntlLocale(locale: AppLocale): string {
  return locale === 'vi' ? 'vi-VN' : 'en-US'
}

export function readStoredLocale(): AppLocale | null {
  if (typeof window === 'undefined') return null
  const saved = localStorage.getItem(LOCALE_STORAGE_KEY)
  return saved === 'vi' || saved === 'en' ? saved : null
}

export function readLocaleFromUrl(): AppLocale | null {
  if (typeof window === 'undefined') return null
  const lang = new URLSearchParams(window.location.search).get('lang')
  return lang === 'vi' || lang === 'en' ? lang : null
}

export function applyDocumentLocale(locale: AppLocale): void {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale
  }
}

/** Locale hiện tại từ i18next — dùng thay vì tự parse `i18n.language`. */
export function useAppLocale() {
  const { i18n } = useTranslation()
  const locale = normalizeLocale(i18n.language)
  return {
    locale,
    intlLocale: toIntlLocale(locale),
  }
}
