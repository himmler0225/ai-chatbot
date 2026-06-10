'use client'

import { Analytics } from '@vercel/analytics/next'
import { QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider, theme as antdTheme } from 'antd'
import { Be_Vietnam_Pro, JetBrains_Mono } from 'next/font/google'
import { createContext, useContext, useState } from 'react'
import { queryClient } from '@/src/lib/query-client'
import './globals.css'

const beVietnamPro = Be_Vietnam_Pro({
  variable: '--font-sans',
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export const ThemeContext = createContext<{
  isDark: boolean
  toggleTheme: () => void
}>({ isDark: true, toggleTheme: () => {} })

export function useTheme() {
  return useContext(ThemeContext)
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true)

  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <title>SellMate AI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${beVietnamPro.variable} ${jetbrainsMono.variable} h-full overflow-hidden`}
        style={{ margin: 0, fontFamily: 'var(--font-sans), sans-serif' }}
      >
        <QueryClientProvider client={queryClient}>
        <ThemeContext.Provider value={{ isDark, toggleTheme: () => setIsDark(d => !d) }}>
          <ConfigProvider
            theme={{
              algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
              token: {
                colorPrimary:    '#10a37f',
                borderRadius:    8,
                fontFamily:      'var(--font-sans), sans-serif',
                colorBgContainer: isDark ? '#212121' : '#ffffff',
                colorBgElevated:  isDark ? '#2f2f2f' : '#f9f9f9',
                colorBgLayout:    isDark ? '#171717' : '#f0f0f0',
              },
              components: {
                Layout: {
                  siderBg:   isDark ? '#171717' : '#f9f9f9',
                  bodyBg:    isDark ? '#212121' : '#ffffff',
                  headerBg:  isDark ? '#171717' : '#f9f9f9',
                },
                Menu: {
                  itemBg:          'transparent',
                  itemHoverBg:     isDark ? '#2a2a2a' : '#f0f0f0',
                  itemSelectedBg:  isDark ? '#2a2a2a' : '#e6f4f1',
                  itemColor:       isDark ? '#ececec' : '#333333',
                  itemSelectedColor: isDark ? '#ffffff' : '#10a37f',
                },
              },
            }}
          >
            {children}
          </ConfigProvider>
        </ThemeContext.Provider>
        </QueryClientProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
