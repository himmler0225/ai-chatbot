'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import '@/src/i18n/config'
import i18n, { type Locale } from '@/src/i18n/config'

interface AppContextValue {
  isDark: boolean
  toggleTheme: () => void
  locale: Locale
  toggleLocale: () => void
}

const AppContext = createContext<AppContextValue>({
  isDark: true,
  toggleTheme: () => {},
  locale: 'vi',
  toggleLocale: () => {},
})

export function useTheme() { return useContext(AppContext) }
export function useLocale() { return useContext(AppContext) }

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true)
  const [locale, setLocale] = useState<Locale>('vi')

  useEffect(() => {
    const savedTheme  = localStorage.getItem('theme')
    const savedLocale = localStorage.getItem('locale') as Locale | null
    if (savedTheme === 'light') setIsDark(false)
    if (savedLocale) { setLocale(savedLocale); i18n.changeLanguage(savedLocale) }
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  const toggleLocale = () => {
    const next = locale === 'vi' ? 'en' : 'vi'
    setLocale(next); i18n.changeLanguage(next)
    localStorage.setItem('locale', next)
  }

  return (
    <AppContext.Provider value={{ isDark, toggleTheme, locale, toggleLocale }}>
      {children}
    </AppContext.Provider>
  )
}
