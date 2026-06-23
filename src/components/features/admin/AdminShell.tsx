'use client'

import { Grid, Layout } from 'antd'
import { AdminMobileDrawer, AdminSidebar } from './AdminSidebar'
import { AdminShellSkeleton } from './AdminSkeletons'
import { useAdmin } from '@/hooks/admin/useAdmin'
import { useAdminColors } from '@/constants/admin-theme'
import { AdminNavContext } from '@/contexts/admin-nav'
import { useMemo, useState } from 'react'

const { Content } = Layout
const { useBreakpoint } = Grid

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { loading, denied } = useAdmin()
  const c = useAdminColors()
  const screens = useBreakpoint()
  const isMobile = !screens.md
  const [drawerOpen, setDrawerOpen] = useState(false)

  const nav = useMemo(
    () => ({
      isMobile,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    }),
    [isMobile],
  )

  if (loading || denied) {
    return <AdminShellSkeleton />
  }

  return (
    <AdminNavContext.Provider value={nav}>
      <Layout className="admin-console" style={{ minHeight: '100vh', background: c.bg }}>
        <AdminSidebar />
        <AdminMobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        <Layout style={{ background: c.bg }}>
          <Content className="flex flex-col min-w-0 overflow-hidden">{children}</Content>
        </Layout>
      </Layout>
    </AdminNavContext.Provider>
  )
}
