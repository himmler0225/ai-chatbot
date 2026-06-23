import type { Metadata } from 'next'
import { AdminShell } from '@/components/features/admin/AdminShell'
import { adminMetadata } from '@/lib/metadata'

export const metadata: Metadata = adminMetadata

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
