'use client'

import { Analytics }        from '@vercel/analytics/next'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient }       from '@/src/lib/query-client'
import { ThemeProvider }     from '@/src/context/theme'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
      {process.env.NODE_ENV === 'production' && <Analytics />}
    </QueryClientProvider>
  )
}
