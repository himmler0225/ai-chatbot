'use client'

import { Analytics } from '@vercel/analytics/next'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/src/lib/query-client'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ height: '100vh', overflow: 'hidden' }}>{children}</div>
      {process.env.NODE_ENV === 'production' && <Analytics />}
    </QueryClientProvider>
  )
}
