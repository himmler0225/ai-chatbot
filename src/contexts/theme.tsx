'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import i18n, { changeAppLanguage } from '@/i18n/config'
import {
  applyDocumentLocale,
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  normalizeLocale,
  readLocaleFromUrl,
  readStoredLocale,
  type AppLocale,
} from '@/i18n/locale'

interface AppContextValue {
  isDark: boolean
  toggleTheme: () => void
  locale: AppLocale
  setLocale: (locale: AppLocale) => void
  toggleLocale: () => void
}

const AppContext = createContext<AppContextValue>({
  isDark: true,
  toggleTheme: () => {},
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  toggleLocale: () => {},
})

export function useTheme() { return useContext(AppContext) }
export function useLocale() { return useContext(AppContext) }

function readInitialLocale(): AppLocale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  return readLocaleFromUrl() ?? readStoredLocale() ?? DEFAULT_LOCALE
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true)
  const [locale, setLocaleState] = useState<AppLocale>(() =>
    normalizeLocale(i18n.language || readInitialLocale()),
  )

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light') setIsDark(false)

    const initial = readInitialLocale()
    if (normalizeLocale(i18n.language) !== initial) {
      changeAppLanguage(initial)
    }
    setLocaleState(initial)
    applyDocumentLocale(initial)
  }, [])

  useEffect(() => {
    const onLanguageChanged = (lng: string) => {
      setLocaleState(normalizeLocale(lng))
    }
    i18n.on('languageChanged', onLanguageChanged)
    return () => i18n.off('languageChanged', onLanguageChanged)
  }, [])

  useEffect(() => {
    const theme = isDark ? 'dark' : 'light'
    document.documentElement.dataset.theme = theme
    document.documentElement.style.background = isDark ? '#0d0d0d' : '#f5f5f5'
  }, [isDark])

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const next = !prev
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }, [])

  const setLocale = useCallback((next: AppLocale) => {
    const normalized = normalizeLocale(next)
    if (normalizeLocale(i18n.language) === normalized) return
    changeAppLanguage(normalized)
    localStorage.setItem(LOCALE_STORAGE_KEY, normalized)
  }, [])

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'vi' ? 'en' : 'vi')
  }, [locale, setLocale])

  return (
    <AppContext.Provider value={{ isDark, toggleTheme, locale, setLocale, toggleLocale }}>
      {children}
    </AppContext.Provider>
  )
}
