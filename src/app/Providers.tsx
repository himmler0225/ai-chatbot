'use client'
import { ConfigProvider } from 'antd'
import { ThemeProvider, useTheme } from '@/src/context/theme'
import { getAntdTheme } from '@/src/theme/antd'

function AntdProvider({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme()
  return <ConfigProvider theme={getAntdTheme(isDark)}>{children}</ConfigProvider>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AntdProvider>{children}</AntdProvider>
    </ThemeProvider>
  )
}
