import type { Metadata } from 'next'
import { LegalDocumentPage } from '@/components/features/legal/LegalDocumentPage'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'ReviewMine AI terms of service — rules for using the platform.',
  robots: { index: true, follow: true },
}

export default function TermsPage() {
  return <LegalDocumentPage docKey="terms" />
}
