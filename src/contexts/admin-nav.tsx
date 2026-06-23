'use client'

import { createContext, useContext } from 'react'

type AdminNavContextValue = {
  isMobile: boolean
  openDrawer: () => void
  closeDrawer: () => void
}

export const AdminNavContext = createContext<AdminNavContextValue>({
  isMobile: false,
  openDrawer: () => {},
  closeDrawer: () => {},
})

export function useAdminNav() {
  return useContext(AdminNavContext)
}
