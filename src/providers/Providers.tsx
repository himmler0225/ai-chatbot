'use client'

import { ConfigProvider } from 'antd'
import { ThemeProvider, useTheme } from '@/contexts/theme'
import { getAntdTheme } from '@/lib/theme'
import type { SupabasePublicConfig } from '@/lib/env'
import { SupabaseProvider } from '@/providers/SupabaseProvider'
import QueryProvider from './QueryProvider'

function AntdProvider({ children }: { children: React.ReactNode }) {
    const { isDark } = useTheme()
    return <ConfigProvider theme={getAntdTheme(isDark)}>{children}</ConfigProvider>
}

export default function Providers({
    children,
    supabaseConfig,
}: {
    children: React.ReactNode
    supabaseConfig: SupabasePublicConfig
}) {
    return (
        <div className="h-full" suppressHydrationWarning>
            <SupabaseProvider config={supabaseConfig}>
                <ThemeProvider>
                    <QueryProvider>
                        <AntdProvider>{children}</AntdProvider>
                    </QueryProvider>
                </ThemeProvider>
            </SupabaseProvider>
        </div>
    )
}
