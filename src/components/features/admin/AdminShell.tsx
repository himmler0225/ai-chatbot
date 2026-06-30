'use client'

import { Grid } from 'antd'
import { AdminMobileDrawer, AdminSidebar } from './AdminSidebar'
import { AdminShellSkeleton } from './AdminSkeletons'
import { useAdmin } from '@/hooks/admin/useAdmin'
import { useAdminColors } from '@/constants/admin-theme'
import { AdminNavContext } from '@/contexts/admin-nav'
import { useMemo, useState } from 'react'

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
      <div className="admin-console flex h-screen min-h-0 w-full overflow-hidden">
        {!isMobile && <AdminSidebar />}

        <AdminMobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

        <div
          className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden"
          style={{ background: c.topBarBg }}
        >
          {children}
        </div>
      </div>
    </AdminNavContext.Provider>
  )
}
