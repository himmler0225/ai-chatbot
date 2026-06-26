import type { Metadata } from 'next'
import { LegalDocumentPage } from '@/components/features/legal/LegalDocumentPage'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'ReviewMine AI privacy policy — how we collect and protect your data.',
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return <LegalDocumentPage docKey="privacy" />
}
