'use client'

import { ConfigProvider } from 'antd'
import { ThemeProvider, useTheme } from '@/contexts/theme'
import { getAntdTheme } from '@/lib/theme'
import QueryProvider from './QueryProvider'

function AntdProvider({ children }: { children: React.ReactNode }) {
    const { isDark } = useTheme()
    return <ConfigProvider theme={getAntdTheme(isDark)}>{children}</ConfigProvider>
}

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full" suppressHydrationWarning>
            <ThemeProvider>
                <QueryProvider>
                    <AntdProvider>{children}</AntdProvider>
                </QueryProvider>
            </ThemeProvider>
        </div>
    )
}
