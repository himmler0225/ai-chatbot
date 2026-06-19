'use client'

import { Analytics } from '@vercel/analytics/next'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ height: '100vh', overflow: 'hidden' }}>
            {children}
            {process.env.NODE_ENV === 'production' && <Analytics />}
        </div>
    )
}
