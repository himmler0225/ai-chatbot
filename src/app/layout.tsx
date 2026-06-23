import type { Metadata } from 'next'
import { Be_Vietnam_Pro, JetBrains_Mono } from 'next/font/google'
import Providers from '@/providers/Providers'
import { getSupabasePublicConfig } from '@/lib/env'
import { rootMetadata } from '@/lib/metadata'
import '@/styles/globals.css'

const beVietnamPro = Be_Vietnam_Pro({
  variable: '--font-sans',
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = rootMetadata

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const supabaseConfig = getSupabasePublicConfig()

  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${beVietnamPro.variable} ${jetbrainsMono.variable} h-full`}
        suppressHydrationWarning
      >
        <Providers supabaseConfig={supabaseConfig}>{children}</Providers>
      </body>
    </html>
  )
}
