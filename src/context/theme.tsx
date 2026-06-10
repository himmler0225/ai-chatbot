'use client'

import { createContext, useContext, useState } from 'react'
import { ConfigProvider }  from 'antd'
import { buildAntTheme }   from '@/src/constants/theme'
import '@/src/i18n/config'
import i18n, { type Locale } from '@/src/i18n/config'

interface AppContextValue {
  isDark:       boolean
  toggleTheme:  () => void
  locale:       Locale
  toggleLocale: () => void
}

const AppContext = createContext<AppContextValue>({
  isDark:       true,
  toggleTheme:  () => {},
  locale:       'vi',
  toggleLocale: () => {},
})

export function useTheme()    { return useContext(AppContext) }
export function useLocale()   { return useContext(AppContext) }

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark,  setIsDark]  = useState(true)
  const [locale,  setLocale]  = useState<Locale>('vi')

  const toggleLocale = () => {
    const next = locale === 'vi' ? 'en' : 'vi'
    setLocale(next)
    i18n.changeLanguage(next)
  }

  return (
    <AppContext.Provider value={{
      isDark, toggleTheme: () => setIsDark(d => !d),
      locale, toggleLocale,
    }}>
      <ConfigProvider theme={buildAntTheme(isDark)}>
        {children}
      </ConfigProvider>
    </AppContext.Provider>
  )
}
