import { Be_Vietnam_Pro, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const beVietnamPro = Be_Vietnam_Pro({
  variable: '--font-sans',
  subsets:  ['latin', 'vietnamese'],
  weight:   ['300', '400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets:  ['latin'],
})

export const metadata = {
  title:    'SellMate AI',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${beVietnamPro.variable} ${jetbrainsMono.variable} h-full overflow-hidden`}>
        {children}
      </body>
    </html>
  )
}
